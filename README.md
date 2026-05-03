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
