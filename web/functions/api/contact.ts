/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Receives the お問い合わせ (contact) form, validates it, and emails the
 * inquiry via the Resend REST API. Runs on the Cloudflare Workers runtime
 * (no Node server) — deployed automatically by Cloudflare Pages from this
 * functions/ directory, separate from the static Next.js export.
 *
 * Secrets (Pages → Settings → Environment variables, and .dev.vars locally):
 *   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

type Ctx = { request: Request; env: Env };

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

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
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

  const body =
    REQUIRED.map((k) => `${LABELS[k]}: ${String(data[k]).trim()}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: String(data.email).trim(),
      subject: `【お問い合わせ】${data.company}／${data.last}${data.first} 様`,
      text: `お問い合わせを受け付けました。\n\n${body}\n`,
    }),
  });

  if (!res.ok) {
    return json({ ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。" }, 502);
  }
  return json({ ok: true });
};
