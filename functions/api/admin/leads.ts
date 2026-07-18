/**
 * Cloudflare Pages Function — GET /api/admin/leads
 *
 * Reads the D1 lead store for the admin dashboard. Protected by Cloudflare
 * Access (verified here as defense-in-depth). Supports search, type filter,
 * pagination (JSON) and full export (CSV).
 *
 * Query params:
 *   q       free-text search (company / email / name / message)
 *   type    'contact' | 'download' (omit for all)
 *   format  'json' (default) | 'csv'
 *   limit   JSON page size (default 100, max 1000)
 *   offset  JSON page offset
 */
import { verifyAccessJwt, type AccessEnv } from "../../../lib/accessAuth";
import { type D1Like } from "../../../lib/leadStore";

interface Env extends AccessEnv {
  DB?: D1Like;
}
type Ctx = { request: Request; env: Env };

const COLUMNS = [
  "id", "created_at", "type", "company", "pref", "size", "role", "title",
  "last_name", "first_name", "email", "phone", "kind", "message", "asset",
  "themes", "roi", "country",
];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const onRequestGet = async ({ request, env }: Ctx): Promise<Response> => {
  const auth = await verifyAccessJwt(request, env);
  if (!auth.ok) return json({ ok: false, error: "unauthorized", reason: auth.reason }, 403);
  if (!env.DB) return json({ ok: false, error: "D1 (DB binding) not configured" }, 503);

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const type = url.searchParams.get("type") || "";
  const format = url.searchParams.get("format") || "json";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || "100"), 1), 1000);
  const offset = Math.max(Number(url.searchParams.get("offset") || "0"), 0);

  const where: string[] = [];
  const binds: unknown[] = [];
  if (type === "contact" || type === "download") {
    where.push("type = ?");
    binds.push(type);
  }
  if (q) {
    where.push("(company LIKE ? OR email LIKE ? OR last_name LIKE ? OR first_name LIKE ? OR message LIKE ?)");
    const like = `%${q}%`;
    binds.push(like, like, like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const cols = COLUMNS.join(", ");

  try {
    if (format === "csv") {
      const { results } = await env.DB
        .prepare(`SELECT ${cols} FROM leads ${whereSql} ORDER BY created_at DESC`)
        .bind(...binds)
        .all<Record<string, unknown>>();
      const lines = [COLUMNS.join(",")];
      for (const r of results) lines.push(COLUMNS.map((c) => csvCell(r[c])).join(","));
      // UTF-8 BOM so Excel opens Japanese without mojibake.
      const csv = "﻿" + lines.join("\r\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="leads.csv"',
          "Cache-Control": "no-store",
        },
      });
    }

    const { results } = await env.DB
      .prepare(`SELECT ${cols} FROM leads ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...binds, limit, offset)
      .all<Record<string, unknown>>();
    const countRow = await env.DB
      .prepare(`SELECT COUNT(*) AS n FROM leads ${whereSql}`)
      .bind(...binds)
      .first<{ n: number }>();

    return json({
      ok: true,
      total: countRow?.n ?? results.length,
      limit,
      offset,
      items: results,
      viewer: auth.email ?? null,
    });
  } catch (err) {
    return json({ ok: false, error: "query failed", detail: String(err) }, 500);
  }
};
