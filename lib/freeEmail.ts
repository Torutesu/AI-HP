/**
 * Free / consumer webmail + carrier domains that are rejected on the
 * "business email"（業務用メールアドレス）fields.
 *
 * Shared by the client forms (ContactForm / DownloadForm) and the Cloudflare
 * Functions (contact / download) so the same rule is enforced on both sides.
 * Not exhaustive — covers the common consumer/carrier domains in Japan and
 * globally. Add more here in one place.
 */
export const FREE_EMAIL_DOMAINS = new Set<string>([
  // Google
  "gmail.com", "googlemail.com",
  // Microsoft
  "outlook.com", "outlook.jp", "hotmail.com", "hotmail.co.jp", "live.com",
  "live.jp", "msn.com",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // Yahoo
  "yahoo.com", "yahoo.co.jp", "ymail.com", "ybb.ne.jp",
  // Other global webmail
  "aol.com", "gmx.com", "gmx.net", "mail.com", "proton.me", "protonmail.com",
  "zoho.com", "yandex.com", "tutanota.com",
  // Japanese ISPs / webmail
  "nifty.com", "so-net.ne.jp", "ocn.ne.jp", "biglobe.ne.jp", "excite.co.jp",
  "goo.ne.jp", "infoseek.jp", "auone.jp",
  // Mobile carriers (Japan)
  "docomo.ne.jp", "ezweb.ne.jp", "au.com", "softbank.ne.jp", "i.softbank.jp",
  "ido.ne.jp", "vodafone.ne.jp", "disney.ne.jp", "ymobile.ne.jp",
]);

/** Extract the lower-cased domain part of an email address, or "" if malformed. */
export function emailDomain(email: string): string {
  const at = String(email).lastIndexOf("@");
  if (at < 0) return "";
  return String(email).slice(at + 1).trim().toLowerCase();
}

/** True if the address uses a known free/consumer/carrier domain. */
export function isFreeEmail(email: string): boolean {
  return FREE_EMAIL_DOMAINS.has(emailDomain(email));
}

/** User-facing message shown when a free address is entered. */
export const FREE_EMAIL_MESSAGE =
  "フリーメールアドレスはご登録いただけません。お手数ですが、貴社で利用されている会社のメールアドレスをご入力ください。";
