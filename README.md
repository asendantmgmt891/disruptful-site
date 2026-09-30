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

The site loads the Cloudflare Web Analytics beacon (page views on every route,
including `/models/<slug>` and `/premium/<slug>`) only if `VITE_CF_BEACON_TOKEN`
is set at build time. Manual one-time setup (requires full Cloudflare dashboard
access -- the domain-automation API token only has zone/DNS/Pages-read scope,
not Account Analytics, so this can't be done via API):

1. Cloudflare dashboard -> Account Home -> Analytics & Logs -> Web Analytics ->
   Add a site -> `disruptful.com`.
2. Copy the generated token (from the `data-cf-beacon` snippet Cloudflare shows).
3. Pages project `disruptful-site` -> Settings -> Environment variables -> add
   `VITE_CF_BEACON_TOKEN` (Production and Preview) with that token.
4. Redeploy (push to `main`, or retrigger the latest deployment) -- the beacon
   activates automatically, no code changes needed.

OnlyFans/MYM click tracking on the premium page has no supported custom-events
API in Cloudflare Web Analytics (only automatic page views + web vitals are
public). Instead, each click briefly pushes a synthetic path
(`/events/premium-click/<onlyfans|mym>/<model-slug>`) via `history.pushState`,
which the beacon's SPA soft-navigation tracking records as a page view, then
immediately restores the real URL via `replaceState` (address bar and back
button unaffected). Once the beacon is enabled per above, those event paths
show up as page views in the Web Analytics dashboard, filterable by path.
