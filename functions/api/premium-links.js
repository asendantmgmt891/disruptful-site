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
import { PREMIUM_LINKS } from '../_lib/premiumLinks.js'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })

export async function onRequestGet({ request }) {
  const slug = new URL(request.url).searchParams.get('slug') || ''
  const links = PREMIUM_LINKS[slug]
  if (!links) return json({ error: 'Unknown model.' }, 404)
  return json({ premium: Boolean(links.premium), mym: Boolean(links.mym) })
}

export async function onRequest() {
  return json({ error: 'Method not allowed.' }, 405)
}
