/**
 * Cloudflare Pages Function — POST /api/download
 *
 * 1. Notifies the team of a material-download request via a Slack OR Discord
 *    incoming webhook (auto-detected), including which asset was requested.
 * 2. Sends the requested material (auto-reply with the download link) to the
 *    requester via the Resend REST API.
 *
 * Secrets (Pages → Settings → Environment variables; .dev.vars locally):
 *   NOTIFY_WEBHOOK_URL   Slack or Discord incoming webhook URL (required)
 *   RESEND_API_KEY       Resend API key            (optional — auto-reply)
 *   AUTOREPLY_FROM_EMAIL verified Resend sender     (optional — auto-reply)
 *   ASSETS_BASE_URL      base URL for relative asset paths (e.g. R2 public URL)
 *   DOC_DOWNLOAD_URL     legacy fallback link for the "service-guide" asset
 */

import { getAsset, DEFAULT_ASSET_ID, type DownloadAsset } from "../../lib/assets";

interface Env {
  NOTIFY_WEBHOOK_URL: string;
  RESEND_API_KEY?: string;
  AUTOREPLY_FROM_EMAIL?: string;
  ASSETS_BASE_URL?: string;
  DOC_DOWNLOAD_URL?: string;
}

type Ctx = { request: Request; env: Env };

const REQUIRED = ["company", "name", "email", "size"];
const LABELS: Record<string, string> = {
  company: "会社名", name: "お名前", email: "メールアドレス", size: "従業員規模",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Resolve an asset's final download URL from env (see lib/assets.ts). */
function assetUrl(env: Env, asset: DownloadAsset): string {
  if (/^https?:\/\//i.test(asset.path)) return asset.path;
  const base = (env.ASSETS_BASE_URL || "").replace(/\/$/, "");
  if (base) return `${base}/${asset.path.replace(/^\//, "")}`;
  if (asset.id === DEFAULT_ASSET_ID && env.DOC_DOWNLOAD_URL) return env.DOC_DOWNLOAD_URL;
  return "";
}

async function notify(webhookUrl: string, text: string): Promise<boolean> {
  const isDiscord = /discord(app)?\.com/.test(webhookUrl);
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isDiscord ? { content: text } : { text }),
  });
  return res.ok;
}

async function sendMaterial(env: Env, to: string, name: string, asset: DownloadAsset): Promise<void> {
  if (!env.RESEND_API_KEY || !env.AUTOREPLY_FROM_EMAIL) return;
  const url = assetUrl(env, asset);
  const link = url ? `▼ ${asset.label}のダウンロードはこちら\n${url}\n\n` : "";
  const text =
    `${name} 様\n\n` +
    `この度はAI総合戦略研究所の「${asset.label}」をご請求いただき、誠にありがとうございます。\n` +
    `以下より資料をご覧いただけます。\n\n${link}` +
    "ご不明な点やご相談がございましたら、お気軽にお問い合わせください。\n\n" +
    "※本メールは送信専用アドレスから自動送信しています。\n\n" +
    "──────────────\nAI総合戦略研究所 / AI Strategy Institute\n";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.AUTOREPLY_FROM_EMAIL,
        to: [to],
        subject: `【AI総合戦略研究所】${asset.label}をお送りします`,
        text,
      }),
    });
  } catch {
    /* best-effort */
  }
}

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "不正なリクエストです。" }, 400);
  }

  const missing = REQUIRED.filter((k) => !data?.[k] || String(data[k]).trim() === "");
  if (missing.length) {
    return json({ ok: false, error: "必須項目（*）をすべてご入力ください。" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    return json({ ok: false, error: "メールアドレスの形式をご確認ください。" }, 400);
  }

  // Which asset is being requested (defaults to the service guide).
  const assetId = String(data.asset || DEFAULT_ASSET_ID).trim();
  const asset = getAsset(assetId);
  if (!asset) {
    return json({ ok: false, error: "不明な資料が指定されました。" }, 400);
  }

  const fields = REQUIRED.map((k) => `• ${LABELS[k]}: ${String(data[k]).trim()}`).join("\n");
  const themes = Array.isArray(data.themes) ? data.themes.filter(Boolean) : [];
  const themeLine = `\n• 関心テーマ: ${themes.length ? themes.join("、") : "—"}`;
  const assetLine = `\n• 請求資料: ${asset.label}（${asset.id}）`;
  const message = `:page_facing_up: *資料リクエスト*\n${fields}${assetLine}${themeLine}`;

  const ok = await notify(env.NOTIFY_WEBHOOK_URL, message);
  if (!ok) {
    return json({ ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。" }, 502);
  }

  await sendMaterial(env, String(data.email).trim(), String(data.name).trim(), asset);
  return json({ ok: true });
};
