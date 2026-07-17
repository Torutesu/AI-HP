/**
 * Branded transactional-email renderer (shared by the contact / download
 * Cloudflare Functions). Returns both an HTML and a plain-text version.
 *
 * Email-client constraints this is built around:
 *  - No external/`<style>` CSS is reliable → everything is inline.
 *  - Table-based layout (Outlook/Gmail) rather than fl/grid.
 *  - Images are blocked by default in many clients → the brand is a TEXT
 *    wordmark, and the CTA is a bulletproof table button (never image-only).
 *  - A hidden preheader controls the inbox preview line.
 */

export type EmailButton = { label: string; url: string };

export interface EmailOptions {
  /** Absolute site origin (from the request), e.g. https://example.com */
  origin: string;
  /** Inbox preview line (hidden in the body). */
  preheader: string;
  /** Main heading shown at the top of the card body. */
  heading: string;
  /** Recipient name for the「◯◯ 様」greeting. */
  greetingName: string;
  /** Body paragraphs (plain text; rendered as <p>). */
  paragraphs: string[];
  /** Optional primary call-to-action button. */
  button?: EmailButton;
}

const BRAND = "AI総合戦略研究所";
const BRAND_EN = "AI STRATEGY INSTITUTE";
const ADDRESS = "東京都渋谷区恵比寿西1-16-11";
const NAVY = "#0b1b3a";
const BLUE = "#1e63e6";
const INK = "#0c1524";
const MUTED = "#6b7688";

/** Escape a string for safe interpolation into HTML text/attributes. */
function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderEmail(opts: EmailOptions): { html: string; text: string } {
  const { origin, preheader, heading, greetingName, paragraphs, button } = opts;
  const site = String(origin || "").replace(/\/$/, "");

  const paraHtml = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333a48;">${esc(
          p
        )}</p>`
    )
    .join("");

  const buttonHtml = button
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
        <tr>
          <td align="center" bgcolor="${BLUE}" style="border-radius:999px;">
            <a href="${esc(button.url)}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;">
              ${esc(button.label)} &rarr;
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:12px;line-height:1.7;color:${MUTED};">
        ボタンが開けない場合は、以下のURLをブラウザに貼り付けてください：<br />
        <a href="${esc(button.url)}" target="_blank" rel="noopener noreferrer" style="color:${BLUE};word-break:break-all;">${esc(
        button.url
      )}</a>
      </p>`
    : "";

  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f6fb;">${esc(
    preheader
  )}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fb;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e9f0;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;">
          <!-- header -->
          <tr>
            <td style="background:${NAVY};padding:26px 32px;">
              <div style="font-size:19px;font-weight:700;color:#ffffff;letter-spacing:.01em;">${esc(
                BRAND
              )}</div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.24em;color:rgba(255,255,255,.62);margin-top:4px;">${esc(
                BRAND_EN
              )}</div>
            </td>
          </tr>
          <!-- body -->
          <tr>
            <td style="padding:34px 32px 8px;">
              <h1 style="margin:0 0 20px;font-size:20px;line-height:1.5;font-weight:700;color:${INK};">${esc(
                heading
              )}</h1>
              <p style="margin:0 0 18px;font-size:15px;font-weight:700;color:${INK};">${esc(
                greetingName
              )} 様</p>
              ${paraHtml}
              ${buttonHtml}
            </td>
          </tr>
          <!-- divider -->
          <tr><td style="padding:24px 32px 0;"><div style="height:1px;background:#eceff4;"></div></td></tr>
          <!-- footer -->
          <tr>
            <td style="padding:20px 32px 30px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${INK};">${esc(
                BRAND
              )} <span style="font-weight:500;color:${MUTED};">/ ${esc(BRAND_EN)}</span></p>
              <p style="margin:0 0 10px;font-size:12px;line-height:1.7;color:${MUTED};">運営：株式会社Select（${esc(
                ADDRESS
              )}）</p>
              <p style="margin:0;font-size:12px;line-height:1.7;color:${MUTED};">
                <a href="${site}/" target="_blank" rel="noopener noreferrer" style="color:${BLUE};text-decoration:none;">ウェブサイト</a>
                &nbsp;・&nbsp;
                <a href="${site}/contact/" target="_blank" rel="noopener noreferrer" style="color:${BLUE};text-decoration:none;">お問い合わせ</a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;line-height:1.6;color:#9aa3b2;">
                ※本メールは送信専用アドレスから自動送信しています。お心当たりのない場合は破棄してください。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Plain-text fallback (deliverability + non-HTML clients).
  const textLines = [
    `${greetingName} 様`,
    "",
    ...paragraphs,
  ];
  if (button) {
    textLines.push("", `▼ ${button.label}`, button.url);
  }
  textLines.push(
    "",
    "──────────────",
    `${BRAND} / ${BRAND_EN}`,
    `運営：株式会社Select（${ADDRESS}）`,
    `${site}/`,
    "",
    "※本メールは送信専用アドレスから自動送信しています。"
  );

  return { html, text: textLines.join("\n") };
}
