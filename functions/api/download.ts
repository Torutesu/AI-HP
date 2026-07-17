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
import { isFreeEmail, FREE_EMAIL_MESSAGE } from "../../lib/freeEmail";
import { renderEmail } from "../../lib/emailTemplate";

interface Env {
  NOTIFY_WEBHOOK_URL: string;
  RESEND_API_KEY?: string;
  AUTOREPLY_FROM_EMAIL?: string;
  ASSETS_BASE_URL?: string;
  DOC_DOWNLOAD_URL?: string;
}

type Ctx = { request: Request; env: Env };

// Aligned with the contact form so both capture equivalent lead information.
const REQUIRED = [
  "company", "pref", "size", "role", "title",
  "last", "first", "email", "phone",
];
const LABELS: Record<string, string> = {
  company: "会社名", pref: "所在地", size: "従業員数", role: "お役回り",
  title: "役職名", last: "姓", first: "名", email: "メールアドレス", phone: "電話番号",
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

async function sendMaterial(env: Env, origin: string, to: string, name: string, asset: DownloadAsset): Promise<void> {
  if (!env.RESEND_API_KEY || !env.AUTOREPLY_FROM_EMAIL) return;
  const url = assetUrl(env, asset);
  const { html, text } = renderEmail({
    origin,
    logoUrl: `${origin}/logo-mark-white.png`,
    preheader: `${asset.label}をお送りします。ダウンロードはこちらから。`,
    heading: `${asset.label}をお送りします`,
    greetingName: name,
    paragraphs: [
      `この度はAI総合戦略研究所の「${asset.label}」をご請求いただき、誠にありがとうございます。`,
      url
        ? "下のボタンから資料をご覧いただけます。"
        : "資料の準備が整い次第、担当者より改めてご案内いたします。",
      "ご不明な点やご相談がございましたら、お気軽にお問い合わせください。",
    ],
    button: url ? { label: `${asset.label}をダウンロード`, url } : undefined,
    secondaryButton: { label: "無料でAI経営診断を受ける", url: `${origin}/contact/` },
    nurture: {
      title: "あわせてご覧ください",
      items: [
        { label: "導入事例", url: `${origin}/cases/`, desc: "業種別の活用シナリオとROIシミュレーション" },
        { label: "AI経営基盤（AI OS）", url: `${origin}/ai-os/`, desc: "コスト削減×売上向上を内製で実装する仕組み" },
        { label: "マガジン", url: `${origin}/magazine/`, desc: "経営とAI実装の実務知" },
      ],
    },
  });
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
        html,
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
  if (isFreeEmail(String(data.email))) {
    return json({ ok: false, error: FREE_EMAIL_MESSAGE }, 400);
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

  const requesterName = `${String(data.last).trim()}${String(data.first).trim()}`;
  await sendMaterial(env, new URL(request.url).origin, String(data.email).trim(), requesterName, asset);
  return json({ ok: true });
};
