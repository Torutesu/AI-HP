/**
 * Branded transactional-email renderer (shared by the contact / download
 * Cloudflare Functions). Returns both an HTML and a plain-text version.
 *
 * Email-client constraints this is built around:
 *  - No external/`<style>` CSS is reliable → everything is inline.
 *  - Table-based layout (Outlook/Gmail) rather than flex/grid.
 *  - Images are blocked by default in many clients → the logo is optional and
 *    always paired with a TEXT wordmark, and the CTA is a bulletproof table
 *    button (never image-only).
 *  - A hidden preheader controls the inbox preview line.
 */

export type EmailButton = { label: string; url: string };

export interface NurtureItem {
  label: string;
  url: string;
  desc?: string;
}

export interface NurtureSection {
  title: string;
  items: NurtureItem[];
}

export interface EmailOptions {
  /** Absolute site origin (from the request), e.g. https://example.com */
  origin: string;
  /** Absolute URL of the (white) logo mark for the header. Optional. */
  logoUrl?: string;
  /** Inbox preview line (hidden in the body). */
  preheader: string;
  /** Main heading shown at the top of the card body. */
  heading: string;
  /** Recipient name for the「◯◯ 様」greeting. */
  greetingName: string;
  /** Body paragraphs (plain text; rendered as <p>). */
  paragraphs: string[];
  /** Primary call-to-action (filled button). */
  button?: EmailButton;
  /** Secondary call-to-action (outline button) — nurture / cross-sell. */
  secondaryButton?: EmailButton;
  /** Optional "recommended / next steps" link block. */
  nurture?: NurtureSection;
}

const BRAND = "AI総合戦略研究所";
const BRAND_EN = "AI STRATEGY INSTITUTE";
const ADDRESS = "東京都渋谷区恵比寿西1-16-11";
const NAVY = "#0b1b3a";
const BLUE = "#1e63e6";
const BLUE_2 = "#2b7cff";
const INK = "#0c1524";
const MUTED = "#6b7688";
// Noto Sans JP first (matches the site). Falls back to each OS's clean gothic
// where Noto isn't installed. A web-font <link> in <head> upgrades clients that
// support it (e.g. Apple Mail); others simply use the fallback.
const SANS =
  "'Noto Sans JP','Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','YuGothic',Meiryo,sans-serif";

/** Escape a string for safe interpolation into HTML text/attributes. */
function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function primaryButton(button: EmailButton): string {
  return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 0;">
        <tr>
          <td align="center" bgcolor="${BLUE}" style="border-radius:999px;">
            <a href="${esc(button.url)}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;font-family:${SANS};">
              ${esc(button.label)} &rarr;
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;line-height:1.7;color:${MUTED};">
        ボタンが開けない場合は、以下のURLをブラウザに貼り付けてください：<br />
        <a href="${esc(button.url)}" target="_blank" rel="noopener noreferrer" style="color:${BLUE};word-break:break-all;">${esc(
          button.url
        )}</a>
      </p>`;
}

function secondaryButtonHtml(button: EmailButton): string {
  return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0;">
        <tr>
          <td align="center" bgcolor="#ffffff" style="border-radius:999px;border:1px solid #c9d4e6;">
            <a href="${esc(button.url)}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:${BLUE};text-decoration:none;border-radius:999px;font-family:${SANS};">
              ${esc(button.label)} &rarr;
            </a>
          </td>
        </tr>
      </table>`;
}

function nurtureHtml(n: NurtureSection): string {
  const rows = n.items
    .map(
      (it, i) => `
        <a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer"
           style="display:block;text-decoration:none;padding:12px 0;${
             i > 0 ? "border-top:1px solid #e7ecf3;" : ""
           }">
          <span style="font-size:14px;font-weight:700;color:${BLUE};">${esc(it.label)} &rarr;</span>
          ${
            it.desc
              ? `<span style="display:block;font-size:12px;line-height:1.6;color:${MUTED};margin-top:3px;">${esc(
                  it.desc
                )}</span>`
              : ""
          }
        </a>`
    )
    .join("");
  return `
      <div style="margin-top:26px;background:#f7f9fc;border:1px solid #eaeef4;border-radius:12px;padding:4px 20px 14px;">
        <p style="margin:16px 0 4px;font-size:12px;font-weight:700;letter-spacing:.04em;color:${INK};">${esc(
          n.title
        )}</p>
        ${rows}
      </div>`;
}

export function renderEmail(opts: EmailOptions): { html: string; text: string } {
  const {
    origin,
    logoUrl,
    preheader,
    heading,
    greetingName,
    paragraphs,
    button,
    secondaryButton,
    nurture,
  } = opts;
  const site = String(origin || "").replace(/\/$/, "");

  const paraHtml = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333a48;">${esc(p)}</p>`
    )
    .join("");

  const logoCell = logoUrl
    ? `<td valign="middle" style="padding-right:12px;">
         <img src="${esc(logoUrl)}" width="30" height="27" alt="${esc(
           BRAND
         )}" style="display:block;border:0;outline:none;text-decoration:none;height:27px;width:auto;" />
       </td>`
    : "";

  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${esc(heading)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
  body, table, td, div, p, h1, a, span { font-family: ${SANS}; }
</style>
</head>
<body style="margin:0;padding:0;background:#eef1f7;font-family:${SANS};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef1f7;">${esc(
    preheader
  )}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef1f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e9f0;box-shadow:0 1px 3px rgba(12,21,36,.06);font-family:${SANS};">
          <!-- header -->
          <tr>
            <td style="background:${NAVY};padding:24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                ${logoCell}
                <td valign="middle">
                  <div style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:.01em;line-height:1.2;">${esc(
                    BRAND
                  )}</div>
                  <div style="font-size:9px;font-weight:600;letter-spacing:.24em;color:rgba(255,255,255,.6);margin-top:3px;">${esc(
                    BRAND_EN
                  )}</div>
                </td>
              </tr></table>
            </td>
          </tr>
          <!-- accent bar -->
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${BLUE};background-image:linear-gradient(90deg,${BLUE},${BLUE_2});">&nbsp;</td></tr>
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
              ${button ? primaryButton(button) : ""}
              ${secondaryButton ? secondaryButtonHtml(secondaryButton) : ""}
              ${nurture ? nurtureHtml(nurture) : ""}
            </td>
          </tr>
          <!-- divider -->
          <tr><td style="padding:26px 32px 0;"><div style="height:1px;background:#eceff4;"></div></td></tr>
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
                <a href="${site}/service/" target="_blank" rel="noopener noreferrer" style="color:${BLUE};text-decoration:none;">サービス</a>
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
  const textLines = [`${greetingName} 様`, "", ...paragraphs];
  if (button) textLines.push("", `▼ ${button.label}`, button.url);
  if (secondaryButton) textLines.push("", `・${secondaryButton.label}`, secondaryButton.url);
  if (nurture) {
    textLines.push("", `【${nurture.title}】`);
    for (const it of nurture.items) {
      textLines.push(`・${it.label}${it.desc ? `（${it.desc}）` : ""}`, `  ${it.url}`);
    }
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
