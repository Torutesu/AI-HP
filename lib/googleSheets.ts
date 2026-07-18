/**
 * Minimal Google Sheets append client for the Cloudflare Workers runtime.
 *
 * Auth: a Google **service account** (JWT → OAuth access token). The target
 * spreadsheet is shared with the service account's email as Editor and stays
 * otherwise private — so nothing is exposed via a public URL, and the key never
 * reaches the browser (server-side only, stored as a Pages secret).
 *
 * Signing uses Web Crypto (crypto.subtle) — Node's `crypto` isn't available in
 * Workers. RS256 = RSASSA-PKCS1-v1_5 + SHA-256.
 */

export interface SheetsEnv {
  GOOGLE_SERVICE_ACCOUNT_KEY?: string; // service-account JSON (as a string)
  SHEETS_SPREADSHEET_ID?: string; // the spreadsheet ID (from its URL)
  SHEETS_TAB?: string; // tab/sheet name to append to (default "Leads")
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

/** base64url-encode raw bytes. */
function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** PEM (PKCS#8) → DER ArrayBuffer. */
function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function signJwt(sa: ServiceAccount): Promise<string> {
  const enc = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${b64url(enc.encode(JSON.stringify(header)))}.${b64url(
    enc.encode(JSON.stringify(claim))
  )}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    enc.encode(signingInput)
  );
  return `${signingInput}.${b64url(new Uint8Array(sig))}`;
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: await signJwt(sa),
    }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error(`Google token request failed: ${res.status}`);
  }
  return json.access_token;
}

/**
 * Append one row to the configured spreadsheet. Returns false (without throwing)
 * when Sheets isn't configured, so callers can treat it as best-effort.
 */
export async function appendRow(env: SheetsEnv, values: (string | number)[]): Promise<boolean> {
  if (!env.GOOGLE_SERVICE_ACCOUNT_KEY || !env.SHEETS_SPREADSHEET_ID) return false;
  const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY) as ServiceAccount;
  const token = await getAccessToken(sa);
  const tab = env.SHEETS_TAB || "Leads";
  const range = encodeURIComponent(tab);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_SPREADSHEET_ID}` +
    `/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) {
    throw new Error(`Sheets append failed: ${res.status} ${await res.text()}`);
  }
  return true;
}
