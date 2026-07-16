/**
 * Cloudflare Pages Function — POST /api/download
 *
 * 1. Notifies the team of a material-download request via a Slack OR Discord
 *    incoming webhook (auto-detected).
 * 2. Sends the material (auto-reply with the PDF link) to the requester via
 *    the Resend REST API.
 *
 * Secrets (Pages → Settings → Environment variables; .dev.vars locally):
 *   NOTIFY_WEBHOOK_URL   Slack or Discord incoming webhook URL (required)
 *   RESEND_API_KEY       Resend API key            (optional — auto-reply)
 *   AUTOREPLY_FROM_EMAIL verified Resend sender     (optional — auto-reply)
 *   DOC_DOWNLOAD_URL     link to the service-guide PDF included in the reply
 */

interface Env {
  NOTIFY_WEBHOOK_URL: string;
  RESEND_API_KEY?: string;
  AUTOREPLY_FROM_EMAIL?: string;
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

async function notify(webhookUrl: string, text: string): Promise<boolean> {
  const isDiscord = /discord(app)?\.com/.test(webhookUrl);
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isDiscord ? { content: text } : { text }),
  });
  return res.ok;
}

async function sendMaterial(env: Env, to: string, name: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.AUTOREPLY_FROM_EMAIL) return;
  const link = env.DOC_DOWNLOAD_URL
    ? `▼ 資料のダウンロードはこちら\n${env.DOC_DOWNLOAD_URL}\n\n`
    : "";
  const text =
    `${name} 様\n\n` +
    "この度はAI総合戦略研究所の資料をご請求いただき、誠にありがとうございます。\n" +
    `以下より資料（PDF）をご覧いただけます。\n\n${link}` +
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
        subject: "【AI総合戦略研究所】サービス資料をお送りします",
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

  const fields = REQUIRED.map((k) => `• ${LABELS[k]}: ${String(data[k]).trim()}`).join("\n");
  const themes = Array.isArray(data.themes) ? data.themes.filter(Boolean) : [];
  const themeLine = `\n• 関心テーマ: ${themes.length ? themes.join("、") : "—"}`;
  const message = `:page_facing_up: *資料リクエスト*\n${fields}${themeLine}`;

  const ok = await notify(env.NOTIFY_WEBHOOK_URL, message);
  if (!ok) {
    return json({ ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。" }, 502);
  }

  await sendMaterial(env, String(data.email).trim(), String(data.name).trim());
  return json({ ok: true });
};
