// Same-origin redirect to the real OnlyFans/MYM URL -- see functions/_lib/premiumLinks.js
// for why. Every real click is now a genuine HTTP request Cloudflare's
// per-path zone analytics can count (platform + slug both in the path), which
// the previous client-side-only history.pushState trick never was.
//
// 2026-10-27 (Edgar, bot-mitigation parity with veyrastehl.net): also requires
// the short-lived signed token minted by /api/premium-links (query param `t`),
// a same-origin Referer, and rejects known-bot UAs. A reviewer that reaches
// this URL cold (guessed/scraped, no real age-gate click first) bounces back
// to the model's profile page instead of reaching OnlyFans/MYM.
import { PREMIUM_LINKS } from '../../_lib/premiumLinks.js'
import { verifyPremiumToken, isKnownBot, sameOriginReferer } from '../../_lib/premiumToken.js'

const PLATFORM_KEY = { of: 'premium', mym: 'mym' }

export async function onRequestGet({ request, params }) {
  const url = new URL(request.url)
  const key = PLATFORM_KEY[params.platform]
  const links = PREMIUM_LINKS[params.slug]
  const target = key && links ? links[key] : null
  if (!target) return new Response('Not found', { status: 404 })

  const token = url.searchParams.get('t')
  const tokenOk = await verifyPremiumToken(params.slug, token)
  if (!tokenOk || !sameOriginReferer(request) || isKnownBot(request)) {
    return Response.redirect(`${url.origin}/models/${params.slug}`, 302)
  }

  return Response.redirect(target, 302)
}

export async function onRequest() {
  return new Response('Method not allowed', { status: 405 })
}
