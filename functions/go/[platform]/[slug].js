// Same-origin redirect to the real OnlyFans/MYM URL -- see functions/_lib/premiumLinks.js
// for why. Every real click is now a genuine HTTP request Cloudflare's
// per-path zone analytics can count (platform + slug both in the path), which
// the previous client-side-only history.pushState trick never was.
import { PREMIUM_LINKS } from '../../_lib/premiumLinks.js'

const PLATFORM_KEY = { of: 'premium', mym: 'mym' }

export async function onRequestGet({ params }) {
  const key = PLATFORM_KEY[params.platform]
  const links = PREMIUM_LINKS[params.slug]
  const target = key && links ? links[key] : null
  if (!target) return new Response('Not found', { status: 404 })
  return Response.redirect(target, 302)
}

export async function onRequest() {
  return new Response('Method not allowed', { status: 405 })
}
