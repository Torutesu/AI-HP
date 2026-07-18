/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * 1. Notifies the team via a Slack OR Discord incoming webhook (auto-detected).
 * 2. Sends an auto-reply (自動返信) to the submitter via the Resend REST API.
 *
 * Runs on the Cloudflare Workers runtime (no Node server) — deployed from this
 * functions/ directory by Cloudflare Pages, alongside the static Next.js export.
 *
 * Secrets (Pages → Settings → Environment variables; .dev.vars locally):
 *   NOTIFY_WEBHOOK_URL   Slack or Discord incoming webhook URL (required)
 *   RESEND_API_KEY       Resend API key            (optional — auto-reply)
 *   AUTOREPLY_FROM_EMAIL verified Resend sender     (optional — auto-reply)
 */

import { isFreeEmail, FREE_EMAIL_MESSAGE } from "../../lib/freeEmail";
import { renderEmail } from "../../lib/emailTemplate";
import { persistLead, type LeadStoreEnv, type LeadRecord } from "../../lib/leadStore";

interface Env extends LeadStoreEnv {
  NOTIFY_WEBHOOK_URL: string;
  RESEND_API_KEY?: string;
  AUTOREPLY_FROM_EMAIL?: string;
}

type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

const REQUIRED = [
  "company", "pref", "size", "role", "title",
  "last", "first", "email", "phone", "kind", "message",
];

const LABELS: Record<string, string> = {
  company: "会社名", pref: "所在地", size: "従業員数", role: "お役回り",
  title: "役職名", last: "姓", first: "名", email: "メールアドレス",
  phone: "電話番号", kind: "お問い合わせ種別", message: "お問い合わせ内容",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Post a plain-text message to a Slack or Discord incoming webhook. */
async function notify(webhookUrl: string, text: string): Promise<boolean> {
  const isDiscord = /discord(app)?\.com/.test(webhookUrl);
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isDiscord ? { content: text } : { text }),
  });
  return res.ok;
}

/** Best-effort auto-reply to the submitter via Resend (branded HTML + text). */
async function autoReply(env: Env, origin: string, to: string, name: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.AUTOREPLY_FROM_EMAIL) return;
  const { html, text } = renderEmail({
    origin,
    logoUrl: `${origin}/logo-mark-white.png`,
    preheader: "お問い合わせを受け付けました。担当者より1〜2営業日以内にご連絡します。",
    heading: "お問い合わせを受け付けました",
    greetingName: name,
    paragraphs: [
      "この度はAI総合戦略研究所へお問い合わせいただき、誠にありがとうございます。",
      "内容を確認のうえ、担当者より1〜2営業日以内にご返信いたします。今しばらくお待ちくださいませ。",
    ],
    secondaryButton: { label: "サービス資料をダウンロード", url: `${origin}/download/` },
    nurture: {
      title: "ご返信をお待ちいただく間に",
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
        subject: "【AI総合戦略研究所】お問い合わせを受け付けました",
        html,
        text,
      }),
    });
  } catch {
    /* auto-reply is best-effort; never fail the request on it */
  }
}

export const onRequestPost = async ({ request, env, waitUntil }: Ctx): Promise<Response> => {
  let data: Record<string, string>;
  try {
    data = (await request.json()) as Record<string, string>;
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

  const fields = REQUIRED.map((k) => `• ${LABELS[k]}: ${String(data[k]).trim()}`).join("\n");
  // ROI estimate carried over from the simulator (internal tracking only).
  const roiLine = data.roi && String(data.roi).trim()
    ? `\n\n:bar_chart: *ROI試算あり*: ${String(data.roi).trim()}`
    : "";
  const message = `:mailbox_with_mail: *新しいお問い合わせ*\n${fields}${roiLine}`;

  const ok = await notify(env.NOTIFY_WEBHOOK_URL, message);
  if (!ok) {
    return json({ ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。" }, 502);
  }

  // Persist to D1 + Google Sheets (best-effort, non-blocking).
  const record: LeadRecord = {
    createdAt: new Date().toISOString(),
    type: "contact",
    company: data.company, pref: data.pref, size: data.size, role: data.role,
    title: data.title, lastName: data.last, firstName: data.first,
    email: data.email, phone: data.phone, kind: data.kind, message: data.message,
    roi: data.roi || undefined,
    country: request.headers.get("CF-IPCountry") || undefined,
    raw: JSON.stringify(data),
  };
  waitUntil(persistLead(env, record));

  await autoReply(env, new URL(request.url).origin, String(data.email).trim(), `${data.last}${data.first}`);
  return json({ ok: true });
};
