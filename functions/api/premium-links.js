// Tells the client which premium buttons to show (OF / MYM / both) for a
// model, without ever exposing the real destination URL -- the client only
// gets booleans now, since clicking navigates to the same-origin /go/<platform>/<slug>
// redirect (see functions/go/[platform]/[slug].js) instead of the raw link.
// 2026-10-19 (Edgar): previously returned the real URLs directly post-age-gate;
// moved to same-origin redirect links so OF/MYM clicks become real, countable
// server hits (Cloudflare per-path analytics) instead of an unreliable
// client-side-only history trick, as a side effect this is also strictly more
// private -- the real URL now never reaches the client at all, not even after
// the age gate.
//
// 2026-10-27 (Edgar, bot-mitigation parity with veyrastehl.net): also issues a
// short-lived signed token the client must pass back to /go/<platform>/<slug>,
// and requires a same-origin Referer + rejects known-bot UAs before even
// returning the booleans. Naive automated reviewers that fetch this endpoint
// directly (no real page load / no real click) get nothing.
import { PREMIUM_LINKS } from '../_lib/premiumLinks.js'
import { issuePremiumToken, isKnownBot, sameOriginReferer } from '../_lib/premiumToken.js'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })

export async function onRequestGet({ request }) {
  if (!sameOriginReferer(request) || isKnownBot(request)) {
    return json({ error: 'Forbidden.' }, 403)
  }
  const slug = new URL(request.url).searchParams.get('slug') || ''
  const links = PREMIUM_LINKS[slug]
  if (!links) return json({ error: 'Unknown model.' }, 404)
  const token = await issuePremiumToken(slug)
  return json({ premium: Boolean(links.premium), mym: Boolean(links.mym), token })
}

export async function onRequest() {
  return json({ error: 'Method not allowed.' }, 405)
}
