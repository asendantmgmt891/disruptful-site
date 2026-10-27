// Same-origin redirect to the real OnlyFans/MYM URL -- see functions/_lib/premiumLinks.js
// for why. Every real click is now a genuine HTTP request Cloudflare's
// per-path zone analytics can count (platform + slug both in the path), which
// the previous client-side-only history.pushState trick never was.
//
// 2026-10-27 (Edgar, bot-mitigation parity with veyrastehl.net): also requires
// the short-lived signed token minted by /api/premium-links (query param `t`)
// and rejects known-bot UAs. A reviewer that reaches this URL cold
// (guessed/scraped, no real age-gate click first) bounces back to the
// model's profile page instead of reaching OnlyFans/MYM.
//
// No same-origin-Referer check here (unlike /api/premium-links): the OF/MYM
// links on the premium page already carry rel="noreferrer" intentionally (so
// disruptful.com never appears in OnlyFans'/MYM's own referrer logs), which
// means a real click NEVER sends a Referer -- an earlier version of this file
// required one anyway and broke every real click for every model, caught live
// by Edgar clicking Siyenna's OF/MYM buttons and landing back on her profile
// instead. The signed token already proves the click came from a real
// age-gate pass; Referer would be redundant on top of it even if available.
import { PREMIUM_LINKS } from '../../_lib/premiumLinks.js'
import { verifyPremiumToken, isKnownBot } from '../../_lib/premiumToken.js'

const PLATFORM_KEY = { of: 'premium', mym: 'mym' }

export async function onRequestGet({ request, params }) {
  const url = new URL(request.url)
  const key = PLATFORM_KEY[params.platform]
  const links = PREMIUM_LINKS[params.slug]
  const target = key && links ? links[key] : null
  if (!target) return new Response('Not found', { status: 404 })

  const token = url.searchParams.get('t')
  const tokenOk = await verifyPremiumToken(params.slug, token)
  if (!tokenOk || isKnownBot(request)) {
    return Response.redirect(`${url.origin}/models/${params.slug}`, 302)
  }

  return Response.redirect(target, 302)
}

export async function onRequest() {
  return new Response('Method not allowed', { status: 405 })
}
