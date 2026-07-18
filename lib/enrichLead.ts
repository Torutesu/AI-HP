/**
 * AI enrichment for a lead (Phase 3) — runs on Cloudflare Workers AI, so the
 * data never leaves Cloudflare (no external LLM, PII-safe).
 *
 * The point isn't to auto-write emails (a human writes those better). It's to
 * TRIAGE: score each lead by budget potential (company size) × decision power
 * (title) × urgency (intent), then route by score —
 *   high (priority ≥ 4) → a human handles it, armed with talking points;
 *   low  (priority ≤ 3) → an auto reply draft is good enough.
 *
 * Produces: summary, intent, a 1–5 priority score + its reason, a recommended
 * next action, a human/auto handling flag, sales talking points, and a reply
 * draft. Best-effort: returns null when AI is unbound; throws on model failure
 * so the caller can record the reason.
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
  priorityReason: string; // why this score (size=budget / title=authority / urgency)
  nextAction: string; // recommended first move for the rep
  handling: "human" | "auto"; // routing: high score → human, low score → auto
  talkingPoints: string; // sales angles for the human ("・"-separated)
  reply: string; // reply draft (mainly for low-score / auto handling)
}

// @cf/meta/llama-3.1-8b-instruct was deprecated 2026-05-30. Current model:
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

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
    "あなたはBtoBのAIコンサルティング会社の営業アシスタントです。受信したリードを分析し、営業の初動を最適化するための情報を日本語で簡潔に作成します。出力は指定のJSONのみで、余計な文章・コードブロック・前置きは一切付けません。";
  const user =
    `以下のリードを分析してください。\n\n${profile}\n\n` +
    `【優先度(priority 1〜5)の採点基準】\n` +
    `1) 予算ポテンシャル＝従業員数が多いほど高い: 1,000名以上 > 300〜1,000名 > 100〜300名 > 50〜100名 > 11〜49名 > 1〜10名\n` +
    `2) 決裁権＝役職が上位ほど高い: 経営者・役員 > 部長クラス > 課長・マネージャー > 担当者\n` +
    `3) 緊度＝意図が具体的なほど高い: 費用・見積り/無料AI経営診断の希望＝今すぐ客で最高、サービスについて＝中、情報収集/採用＝低\n` +
    `4) 本文に予算・時期・具体的な課題があれば加点。\n` +
    `5=大型かつ上位決裁者かつ具体案件の最優先、3=標準、1=小規模・情報収集・採用など低。\n\n` +
    `次のJSON形式のみで出力してください:\n` +
    `{"summary":"一文要約(60字以内)",` +
    `"intent":"意図を短く1つ(例: 費用問い合わせ / 導入検討 / 情報収集 / 採用 / 協業 / その他)",` +
    `"priority":整数1〜5,` +
    `"priority_reason":"スコアの根拠を企業規模(予算)・役職(決裁権)・緊度の観点で(40字以内)",` +
    `"next_action":"担当者が取るべき次の一手を1つ(例: 24時間以内に電話 / 個別返信で商談打診 / 資料送付のみ / ナーチャリング)",` +
    `"talking_points":"この企業規模・役職・意図に効く商談の切り口を2〜3点、各30字以内、・区切り",` +
    `"reply_draft":"返信メールの下書き(200字以内・丁寧語・宛名はご担当者様)"}`;

  // Errors propagate to the caller (enrichAndUpdate), which records the reason
  // in ai_status so failures are diagnosable from the D1 console during setup.
  const res = (await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 768,
    temperature: 0.2,
  })) as unknown;

  // The model output lives in `response` (or `res` itself for string models).
  // Depending on the model, `response` is either a JSON string OR an
  // already-parsed object — handle both.
  const payload =
    res && typeof res === "object" && "response" in res
      ? (res as { response: unknown }).response
      : res;

  let json: Record<string, unknown> | null;
  if (payload && typeof payload === "object") {
    json = payload as Record<string, unknown>;
  } else if (typeof payload === "string") {
    json = extractJson(payload);
  } else {
    json = null;
  }
  if (!json) {
    throw new Error(`model returned no JSON (${typeof payload}): ${String(payload).slice(0, 160)}`);
  }

  const priority = clampPriority(json.priority);
  return {
    summary: String(json.summary ?? "").slice(0, 200),
    intent: String(json.intent ?? "").slice(0, 40),
    priority,
    priorityReason: String(json.priority_reason ?? "").slice(0, 200),
    nextAction: String(json.next_action ?? "").slice(0, 120),
    // Deterministic routing: high score → a human handles it, low → auto is fine.
    handling: priority >= 4 ? "human" : "auto",
    talkingPoints: String(json.talking_points ?? "").slice(0, 400),
    reply: String(json.reply_draft ?? json.reply ?? "").slice(0, 1000),
  };
}
