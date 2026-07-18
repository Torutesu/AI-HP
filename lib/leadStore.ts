/**
 * Lead persistence (Phase 1): write every form submission to Cloudflare D1
 * (source of truth) and append a row to Google Sheets (working view).
 *
 * Both writes are best-effort: failures are logged but never surfaced to the
 * visitor — the realtime Slack/Discord notification remains the critical path.
 */
import { appendRow, type SheetsEnv } from "./googleSheets";
import { enrichLead, type EnrichEnv } from "./enrichLead";

/** Minimal structural type for a D1 database binding (avoids workers-types dep). */
export interface D1Stmt {
  bind(...values: unknown[]): D1Stmt;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
export interface D1Like {
  prepare(query: string): D1Stmt;
}

export interface LeadStoreEnv extends SheetsEnv, EnrichEnv {
  DB?: D1Like;
  /** Slack/Discord webhook — used to post a triage alert for hot leads. */
  NOTIFY_WEBHOOK_URL?: string;
}

export interface LeadRecord {
  createdAt: string; // ISO 8601
  type: "contact" | "download";
  company?: string;
  pref?: string;
  size?: string;
  role?: string;
  title?: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  kind?: string; // contact
  message?: string; // contact
  asset?: string; // download
  themes?: string; // download (joined)
  roi?: string; // contact (simulator)
  country?: string;
  raw?: string; // full JSON payload
}

/** Column order shared by D1 and the Sheets row (and the sheet's header row). */
export const SHEET_HEADER = [
  "受信日時", "種別", "会社名", "所在地", "従業員数", "お役回り", "役職",
  "姓", "名", "メール", "電話", "種別詳細", "本文", "請求資料", "関心テーマ",
  "ROI試算", "国",
];

function toRow(r: LeadRecord): string[] {
  return [
    r.createdAt,
    r.type,
    r.company ?? "",
    r.pref ?? "",
    r.size ?? "",
    r.role ?? "",
    r.title ?? "",
    r.lastName ?? "",
    r.firstName ?? "",
    r.email ?? "",
    r.phone ?? "",
    r.kind ?? "",
    r.message ?? "",
    r.asset ?? "",
    r.themes ?? "",
    r.roi ?? "",
    r.country ?? "",
  ];
}

async function insertD1(db: D1Like, r: LeadRecord): Promise<number | null> {
  const row = await db
    .prepare(
      `INSERT INTO leads
        (created_at, type, company, pref, size, role, title, last_name, first_name,
         email, phone, kind, message, asset, themes, roi, country, raw)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       RETURNING id`
    )
    .bind(
      r.createdAt, r.type, r.company ?? null, r.pref ?? null, r.size ?? null,
      r.role ?? null, r.title ?? null, r.lastName ?? null, r.firstName ?? null,
      r.email ?? null, r.phone ?? null, r.kind ?? null, r.message ?? null,
      r.asset ?? null, r.themes ?? null, r.roi ?? null, r.country ?? null,
      r.raw ?? null
    )
    .first<{ id: number }>();
  return row?.id ?? null;
}

/**
 * Post a plain-text message to a Slack/Discord webhook (best-effort, no throw).
 * URL is trimmed because pasted secrets often carry a trailing newline.
 */
async function postWebhook(webhookUrl: string, text: string): Promise<void> {
  const url = (webhookUrl || "").trim();
  if (!url) return;
  const isDiscord = /discord(app)?\.com/.test(url);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isDiscord ? { content: text } : { text }),
    });
  } catch (err) {
    console.error("triage webhook failed:", err);
  }
}

/** Enrich a stored lead with Workers AI and write the results back to its row. */
async function enrichAndUpdate(env: LeadStoreEnv, id: number, record: LeadRecord): Promise<void> {
  if (!env.DB || !env.AI) return;
  try {
    const e = await enrichLead(env, record);
    if (!e) {
      await env.DB.prepare(`UPDATE leads SET ai_status='error' WHERE id=?`).bind(id).run();
      return;
    }
    await env.DB
      .prepare(
        `UPDATE leads
           SET ai_summary=?, ai_intent=?, ai_priority=?, ai_priority_reason=?,
               ai_next_action=?, ai_handling=?, ai_talking_points=?, ai_reply=?,
               ai_status='done'
         WHERE id=?`
      )
      .bind(
        e.summary, e.intent, e.priority, e.priorityReason,
        e.nextAction, e.handling, e.talkingPoints, e.reply,
        id
      )
      .run();

    // Score-based routing: only HOT leads (human handling) ping the team, so
    // the channel stays signal. Low-score leads just sit in the dashboard.
    if (e.handling === "human" && env.NOTIFY_WEBHOOK_URL) {
      const who = [record.company, record.size && `${record.size}名`, record.title]
        .filter(Boolean)
        .join(" / ");
      const alert =
        `🔥 *要対応リード｜優先度 ${e.priority}/5*\n` +
        `${who}\n` +
        `意図: ${e.intent}\n` +
        `根拠: ${e.priorityReason}\n` +
        `次の一手: ${e.nextAction}\n` +
        `切り口: ${e.talkingPoints}`;
      await postWebhook(env.NOTIFY_WEBHOOK_URL, alert);
    }
  } catch (err) {
    // Record the reason in ai_status so it's visible in the D1 console.
    console.error("AI enrich/update failed:", err);
    const reason = String(err instanceof Error ? err.message : err).slice(0, 300);
    try {
      await env.DB
        .prepare(`UPDATE leads SET ai_status=? WHERE id=?`)
        .bind(`error: ${reason}`, id)
        .run();
    } catch {
      /* ignore secondary failure */
    }
  }
}

/**
 * Persist a lead to D1 + Google Sheets. Each sink is independent and
 * best-effort; a failure in one never blocks the other or the request.
 * Intended to run via `ctx.waitUntil(...)` so it doesn't delay the response.
 */
export async function persistLead(env: LeadStoreEnv, record: LeadRecord): Promise<void> {
  await Promise.allSettled([
    // D1 (source of truth) → then AI enrichment writes back to the same row.
    (async () => {
      if (!env.DB) return;
      let id: number | null = null;
      try {
        id = await insertD1(env.DB, record);
      } catch (err) {
        console.error("D1 insert failed:", err);
        return;
      }
      if (id != null) await enrichAndUpdate(env, id, record);
    })(),
    // Google Sheets (raw working log) — independent of D1/AI.
    (async () => {
      try {
        await appendRow(env, toRow(record));
      } catch (err) {
        console.error("Sheets append failed:", err);
      }
    })(),
  ]);
}
