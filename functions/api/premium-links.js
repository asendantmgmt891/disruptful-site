// Real OnlyFans/MYM destination URLs, served only on request -- never
// present in the static site bundle. The client (PremiumSitesPage in
// src/main.jsx) only calls this after the visitor passes the "I am over
// 18" gate, so a crawler/scanner fetching the page source or JS bundle
// alone never sees these URLs the way it previously did when they were
// inlined in the client-side `models` array.
const PREMIUM_LINKS = {
  'veyra-stehl': { premium: 'https://onlyfans.com/veyrastehl', mym: 'https://mym.fans/Veyrastehl' },
  'emyra-vesce': { premium: 'https://onlyfans.com/emyravesce', mym: 'https://mym.fans/Emyravesce' },
  'siyenna-luyxe': { premium: 'https://onlyfans.com/siyennaluyxe', mym: 'https://mym.fans/Siyennaluyxe' },
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })

export async function onRequestGet({ request }) {
  const slug = new URL(request.url).searchParams.get('slug') || ''
  const links = PREMIUM_LINKS[slug]
  if (!links) return json({ error: 'Unknown model.' }, 404)
  return json(links)
}

export async function onRequest() {
  return json({ error: 'Method not allowed.' }, 405)
}
