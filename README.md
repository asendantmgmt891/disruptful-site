# Disruptful Website

Local first website for `disruptful.com`.

## Local development

```bash
npm install
npm run dev
```

Dev server is pinned to `127.0.0.1:5174` with `strictPort` so it will not silently collide with existing services.

## Build

```bash
npm run build
```

## Cloudflare Pages

Recommended setup:
- GitHub repo: `disruptful-site`
- Cloudflare Pages framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Domain: `disruptful.com`

`public/_redirects` is included so direct links like `/apply`, `/eddie`, `/sky`, and `/models` work on Cloudflare Pages.

## Notes

The application form is frontend-only for the local prototype. For production, connect it to Cloudflare Pages Functions, Workers, or a privacy-safe form provider before publishing.

## Web Analytics (page views + premium-link clicks)

Model page views (`/models/<slug>`) are real HTTP requests whenever someone
lands cold (e.g. the Instagram bio link) and show up directly in Cloudflare's
zone-level GraphQL Analytics API (`httpRequestsAdaptiveGroups`, grouped by
`clientRequestPath` + `date`) -- this only needs Zone > Analytics > Read on the
existing domain-automation API token, not the separate Account-level Web
Analytics beacon product or its own manual dashboard setup.

2026-10-19 (Edgar): OnlyFans/MYM click tracking previously relied on the
Cloudflare Web Analytics beacon plus a client-side `history.pushState` trick
to fake a synthetic page view for each click -- that beacon was never actually
wired up (needs its own manual "Add a site" + `VITE_CF_BEACON_TOKEN` dashboard
setup, separate from the zone-level analytics above), and the trick itself
never produced a real HTTP request even when it is. Replaced with same-origin
redirect links: the OF/MYM buttons on `/premium/<slug>` now link to
`/go/of/<slug>` / `/go/mym/<slug>` (`functions/go/[platform]/[slug].js`),
which 302-redirects to the real URL (`functions/_lib/premiumLinks.js`, shared
with `functions/api/premium-links.js`). Every real click is now a genuine,
per-path, per-model HTTP request the same zone-level Analytics API above can
count -- no beacon, no dashboard setup, and the real URL never reaches the
client at all (stricter than the previous post-age-gate fetch, which did).
