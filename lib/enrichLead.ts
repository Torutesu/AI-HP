/**
 * AI enrichment for a lead (Phase 3) — runs on Cloudflare Workers AI, so the
 * data never leaves Cloudflare (no external LLM, PII-safe).
 *
 * Produces: one-line summary, intent classification, a 1–5 priority score, and
 * a ready-to-edit reply draft. Best-effort: returns null on any failure.
 */
import type { LeadRecord } from "./leadStore";

export interface WorkersAI {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

export interface EnrichEnv {
  AI?: WorkersAI;
}

export interface Enrichment {
  summary: string;
  intent: string;
  priority: number; // 1..5
  reply: string;
}

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

function clampPriority(v: unknown): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, n));
}

/** Pull the first {...} JSON object out of a model response. */
function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function enrichLead(env: EnrichEnv, r: LeadRecord): Promise<Enrichment | null> {
  if (!env.AI) return null;

  const profile = [
    `種別: ${r.type === "contact" ? "お問い合わせ" : "資料ダウンロード"}`,
    r.company && `会社名: ${r.company}`,
    r.size && `従業員数: ${r.size}`,
    r.role && `役回り: ${r.role}`,
    r.title && `役職: ${r.title}`,
    r.pref && `所在地: ${r.pref}`,
    r.kind && `種別詳細: ${r.kind}`,
    r.message && `本文: ${r.message}`,
    r.asset && `請求資料: ${r.asset}`,
    r.themes && `関心テーマ: ${r.themes}`,
    r.roi && `ROI試算: ${r.roi}`,
  ]
    .filter(Boolean)
    .join("\n");

  const system =
    "あなたはBtoBのAIコンサルティング会社の営業アシスタントです。受信したリード情報を分析し、日本語で簡潔に、指定のJSONだけを出力します。余計な文章・コードブロックは付けません。";
  const user =
    `以下のリードを分析してください。\n\n${profile}\n\n` +
    `次のJSON形式のみで出力してください:\n` +
    `{"summary":"一文要約(60字以内)","intent":"意図を短く1つ(例: 料金問い合わせ / 導入検討 / 情報収集 / 採用 / 協業 / その他)","priority":整数1〜5(5=最優先の商談見込み。役職が上位・従業員数が多い・具体的な検討や見積り依頼ほど高い),"reply":"担当者がそのまま使える返信の下書き(200字以内・丁寧語)"}`;

  // Errors propagate to the caller (enrichAndUpdate), which records the reason
  // in ai_status so failures are diagnosable from the D1 console during setup.
  const res = (await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 512,
    temperature: 0.2,
  })) as { response?: string } | string;

  const text = typeof res === "string" ? res : res.response ?? "";
  const json = extractJson(text);
  if (!json) throw new Error(`model returned no JSON: ${text.slice(0, 160)}`);

  return {
    summary: String(json.summary ?? "").slice(0, 200),
    intent: String(json.intent ?? "").slice(0, 40),
    priority: clampPriority(json.priority),
    reply: String(json.reply ?? "").slice(0, 1000),
  };
}
