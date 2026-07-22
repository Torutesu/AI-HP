/**
 * Cloudflare Pages Function — POST /api/recruiting
 *
 * Accepts multipart/form-data from the recruiting application form, notifies
 * the team, stores the lead, and optionally sends a review email with the
 * uploaded attachment.
 *
 * Secrets (Pages → Settings → Environment variables; .dev.vars locally):
 *   NOTIFY_WEBHOOK_URL   Slack or Discord incoming webhook URL (required)
 *   RESEND_API_KEY       Resend API key            (optional — auto-reply / review email)
 *   AUTOREPLY_FROM_EMAIL verified Resend sender     (optional — auto-reply / review email)
 *   RECRUIT_REVIEW_EMAIL internal review inbox      (optional — attachment email)
 */

import { renderEmail } from "../../lib/emailTemplate";
import { persistLead, type LeadRecord, type LeadStoreEnv } from "../../lib/leadStore";

interface Env extends LeadStoreEnv {
  NOTIFY_WEBHOOK_URL: string;
  RESEND_API_KEY?: string;
  AUTOREPLY_FROM_EMAIL?: string;
  RECRUIT_REVIEW_EMAIL?: string;
}

type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

const MAX_BYTES = 10 * 1024 * 1024;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function humanSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

async function notify(webhookUrl: string, text: string): Promise<{ ok: boolean; detail?: string }> {
  const url = (webhookUrl || "").trim();
  if (!url) return { ok: false, detail: "NOTIFY_WEBHOOK_URL is empty" };
  const isDiscord = /discord(app)?\.com/.test(url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isDiscord ? { content: text } : { text }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, detail: `webhook ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, detail: `fetch threw: ${String(err)}` };
  }
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

async function sendRecruitEmail(
  env: Env,
  to: string,
  subject: string,
  html: string,
  text: string,
  attachments?: { filename: string; content: string }[]
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.AUTOREPLY_FROM_EMAIL) return;
  try {
    const payload: Record<string, unknown> = {
      from: env.AUTOREPLY_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
    };
    if (attachments?.length) payload.attachments = attachments;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    /* best-effort */
  }
}

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  try {
    return await handleRecruiting(ctx);
  } catch (err) {
    console.error("recruiting handler error:", err);
    return json({ ok: false, error: "サーバーエラーが発生しました。", detail: String(err) }, 500);
  }
};

const handleRecruiting = async ({ request, env, waitUntil }: Ctx): Promise<Response> => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: "不正なリクエストです。" }, 400);
  }

  const last = String(data.get("last") || "").trim();
  const first = String(data.get("first") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const position = String(data.get("position") || "").trim();
  const message = String(data.get("message") || "").trim();
  const kind = String(data.get("kind") || "採用応募").trim() || "採用応募";
  const file = data.get("resume");

  const missing = [last, first, email, phone, position].some((v) => !v);
  if (missing) {
    return json({ ok: false, error: "必須項目（*）をすべてご入力ください。" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "メールアドレスの形式をご確認ください。" }, 400);
  }
  if (!(file instanceof File)) {
    return json({ ok: false, error: "履歴書か職務経歴書を添付してください。" }, 400);
  }
  if (file.size <= 0) {
    return json({ ok: false, error: "添付ファイルを確認してください。" }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json({ ok: false, error: "ファイルは10MB以内でアップロードしてください。" }, 400);
  }

  const country = request.headers.get("CF-IPCountry") || undefined;
  const fullName = `${last}${first}`;
  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const attachmentName = file.name || "resume";
  const attachmentType = file.type || "application/octet-stream";
  const attachmentSize = humanSize(file.size);
  const attachmentBase64 = toBase64(fileBytes);

  const messageLines = [
    `• 氏名: ${fullName}`,
    `• メール: ${email}`,
    `• 電話: ${phone}`,
    `• 応募職種: ${position}`,
    `• 添付: ${attachmentName} (${attachmentSize})`,
  ];
  if (message) messageLines.push(`• 補足: ${message}`);
  const webhookMessage = `:briefcase: *新しい採用応募*\n${messageLines.join("\n")}`;

  const result = await notify(env.NOTIFY_WEBHOOK_URL, webhookMessage);
  if (!result.ok) {
    return json(
      { ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。", detail: result.detail },
      502
    );
  }

  const record: LeadRecord = {
    createdAt: new Date().toISOString(),
    type: "recruiting",
    lastName: last,
    firstName: first,
    email,
    phone,
    kind,
    message: message || undefined,
    position,
    attachmentName,
    attachmentType,
    attachmentSize,
    country,
    raw: JSON.stringify({
      last,
      first,
      email,
      phone,
      position,
      message,
      kind,
      attachmentName,
      attachmentType,
      attachmentSize,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  };
  waitUntil(persistLead(env, record));

  const origin = new URL(request.url).origin;
  const applicant = renderEmail({
    origin,
    logoUrl: `${origin}/logo-mark-white.png`,
    preheader: "ご応募を受け付けました。担当者よりご連絡します。",
    heading: "ご応募を受け付けました",
    greetingName: fullName,
    paragraphs: [
      "この度はAI総合戦略研究所へご応募いただき、誠にありがとうございます。",
      `応募職種: ${position}`,
      `添付ファイル: ${attachmentName} (${attachmentSize})`,
      "内容を確認のうえ、担当者よりご連絡いたします。少々お待ちください。",
    ],
    secondaryButton: { label: "採用情報を見る", url: `${origin}/recruiting/` },
    nurture: {
      title: "参考までに",
      items: [
        { label: "会社概要", url: `${origin}/company/`, desc: "どんな仲間と働くかを確認できます" },
        { label: "サービス", url: `${origin}/service/`, desc: "事業の全体像が分かります" },
        { label: "マガジン", url: `${origin}/magazine/`, desc: "考え方や発信のトーンが分かります" },
      ],
    },
  });

  const review = renderEmail({
    origin,
    logoUrl: `${origin}/logo-mark-white.png`,
    preheader: `採用応募: ${fullName} / ${position}`,
    heading: "新しい採用応募が届きました",
    greetingName: "採用担当者様",
    paragraphs: [
      `氏名: ${fullName}`,
      `メール: ${email}`,
      `電話: ${phone}`,
      `応募職種: ${position}`,
      `添付ファイル: ${attachmentName} (${attachmentSize})`,
      message ? `補足: ${message}` : "補足: —",
      country ? `国: ${country}` : "国: —",
    ],
    secondaryButton: { label: "採用ページを開く", url: `${origin}/recruiting/` },
  });

  waitUntil(
    Promise.allSettled([
      sendRecruitEmail(
        env,
        email,
        "【AI総合戦略研究所】ご応募を受け付けました",
        applicant.html,
        applicant.text
      ),
      env.RECRUIT_REVIEW_EMAIL
        ? sendRecruitEmail(
            env,
            env.RECRUIT_REVIEW_EMAIL,
            `【採用応募】${fullName} / ${position}`,
            review.html,
            review.text,
            [
              {
                filename: attachmentName,
                content: attachmentBase64,
              },
            ]
          )
        : Promise.resolve(),
    ])
  );

  return json({ ok: true });
};
