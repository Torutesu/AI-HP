/**
 * Cloudflare Access (Zero Trust) JWT verification for admin Functions.
 *
 * Cloudflare Access sits in front of the protected routes and only forwards
 * already-authenticated requests, adding a signed `Cf-Access-Jwt-Assertion`
 * header. We verify that JWT here as defense-in-depth: signature (against the
 * team's public JWKS), issuer, audience (AUD), and expiry. No valid Access JWT
 * → 403, so the admin API is inert unless it's genuinely behind Access.
 *
 * Config (Pages env):
 *   ACCESS_TEAM_DOMAIN  e.g. "yourteam.cloudflareaccess.com"
 *   ACCESS_AUD          the Access application's Audience (AUD) tag
 */

export interface AccessEnv {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
}

export interface AccessResult {
  ok: boolean;
  email?: string;
  reason?: string;
}

interface Jwk extends JsonWebKey {
  kid: string;
}

// Cache the JWKS per isolate for an hour (keys rotate infrequently).
let jwksCache: { domain: string; keys: Jwk[]; fetchedAt: number } | null = null;

async function getJwks(domain: string): Promise<Jwk[]> {
  const now = Date.now();
  if (jwksCache && jwksCache.domain === domain && now - jwksCache.fetchedAt < 3_600_000) {
    return jwksCache.keys;
  }
  const res = await fetch(`https://${domain}/cdn-cgi/access/certs`);
  const json = (await res.json()) as { keys?: Jwk[] };
  jwksCache = { domain, keys: json.keys ?? [], fetchedAt: now };
  return jwksCache.keys;
}

function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = atob(t);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function decodeJsonSegment(seg: string): Record<string, unknown> {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(seg)));
}

export async function verifyAccessJwt(request: Request, env: AccessEnv): Promise<AccessResult> {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
    return { ok: false, reason: "missing Access token — is this route protected by Cloudflare Access?" };
  }
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return { ok: false, reason: "ACCESS_TEAM_DOMAIN / ACCESS_AUD not configured" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed token" };

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = decodeJsonSegment(parts[0]);
    payload = decodeJsonSegment(parts[1]);
  } catch {
    return { ok: false, reason: "undecodable token" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && payload.exp < now) return { ok: false, reason: "expired" };
  if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return { ok: false, reason: "issuer mismatch" };
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(env.ACCESS_AUD)) return { ok: false, reason: "aud mismatch" };

  const keys = await getJwks(env.ACCESS_TEAM_DOMAIN);
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return { ok: false, reason: "signing key not found" };

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!valid) return { ok: false, reason: "bad signature" };

  const email = typeof payload.email === "string" ? payload.email : undefined;
  return { ok: true, email };
}
