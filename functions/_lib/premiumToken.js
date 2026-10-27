// Short-lived HMAC-signed token gating the premium-links reveal and the
// /go/<platform>/<slug> redirect -- same design as veyrastehl.net's Worker
// (2026-10-27, Edgar: apply the same bot-mitigation to the other models'
// existing disruptful.com pages). Minted by /api/premium-links the moment a
// real visitor clicks "I am over 18", consumed once by /go/<platform>/<slug>.
//
// Gates a public marketing/age-gate flow against naive crawlers, not an auth
// secret -- safe to keep as a plain source constant rather than a Pages
// environment-variable binding (avoids an extra manual dashboard step).
const PREMIUM_TOKEN_SECRET = "f3a0f0f7f6b2b6c4a1d9e2c7b5a8d4f1e6c3b9a7d2f8e5c1b4a9d6f3e0c7b2a5";
const TOKEN_TTL_SECONDS = 60;

function base64url(buf) {
  const str = typeof buf === "string" ? buf : String.fromCharCode(...new Uint8Array(buf));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"],
  );
}

export async function signPremiumToken(slug, exp) {
  const key = await getHmacKey(PREMIUM_TOKEN_SECRET);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${slug}.${exp}`));
  return `${exp}.${base64url(sig)}`;
}

export async function issuePremiumToken(slug) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  return signPremiumToken(slug, exp);
}

export async function verifyPremiumToken(slug, token) {
  if (!token || !token.includes(".")) return false;
  const [expStr] = token.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() / 1000 > exp) return false; // expired
  const expected = await signPremiumToken(slug, exp);
  return expected === token;
}

export function isKnownBot(request) {
  const cf = request.cf || {};
  // Free-tier Cloudflare still tags well-known crawlers (Googlebot, etc.) via
  // botManagement.verifiedBot even without paid Bot Management scoring.
  if (cf.botManagement && cf.botManagement.verifiedBot) return true;
  const ua = (request.headers.get("User-Agent") || "").toLowerCase();
  return /bot|spider|crawl|facebookexternalhit|instagram|whatsapp|slackbot|discordbot|telegrambot|preview/i.test(ua);
}

export function sameOriginReferer(request) {
  const ref = request.headers.get("Referer");
  if (!ref) return false;
  try {
    return new URL(ref).hostname === new URL(request.url).hostname;
  } catch {
    return false;
  }
}
