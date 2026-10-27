const MODEL_DOMAIN_REDIRECTS = {
  "emyravesce.com": "https://disruptful.com/models/emyra-vesce",
  "www.emyravesce.com": "https://disruptful.com/models/emyra-vesce",
  "siyennaluyxe.com": "https://disruptful.com/models/siyenna-luyxe",
  "www.siyennaluyxe.com": "https://disruptful.com/models/siyenna-luyxe",
};

// 2026-10-26 (Architect, automated recheck): Instagram's Account Status ->
// Recommendation eligibility -> Links review still flags
// https://disruptful.org/models/veyra-stehl 24h after the disruptful.org
// domain swap, so the domain name was never the issue -- the shared
// multi-model "creator growth studio" site itself is. veyrastehl.com is
// bound to this same Pages project; instead of redirecting it into that
// shared site, serve a genuinely standalone single-page document for it
// here (no nav, no other-model links, no Disruptful branding) and let
// static asset requests (images, etc.) fall through to context.next() so
// they still resolve from this same deployment's /images/models assets.
const VEYRA_STANDALONE_HOSTS = new Set(["veyrastehl.com", "www.veyrastehl.com"]);

function veyraStandalonePage() {
  const gallery = [
    "/images/models/veyra-stehl-yoga-rocks.jpg",
    "/images/models/veyra-stehl-profile-side.jpg",
    "/images/models/veyra-stehl-yoga-lunge.jpg",
    "/images/models/veyra-stehl-blue-studio.jpg",
    "/images/models/veyra-stehl-sunlit-portrait.jpg",
    "/images/models/veyra-stehl-car-duo.jpg",
    "/images/models/veyra-stehl-car-portrait.jpg",
  ];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#08070b" />
<meta name="description" content="Yoga and fitness for visual inspiration — mainly for men, but all are welcome. Move better, stress less, and build a stronger mind and body." />
<title>Veyra Stehl</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #08070b; color: #f3f1ee; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 880px; margin: 0 auto; padding: 48px 20px 64px; }
  .hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
  .hero img.portrait { width: 220px; height: 220px; object-fit: cover; border-radius: 50%; }
  h1 { font-size: 2rem; margin: 0; }
  h2 { font-size: 1.05rem; font-weight: 400; color: #c9c4bd; margin: 0; }
  p.lede { max-width: 540px; color: #ddd9d2; line-height: 1.5; }
  .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 8px; }
  .actions a { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 0.95rem; }
  .actions a.primary { background: #f3f1ee; color: #08070b; }
  .actions a.dark { background: #1c1a1f; color: #f3f1ee; border: 1px solid #3a363f; }
  .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-top: 40px; }
  .gallery img { width: 100%; height: 220px; object-fit: cover; border-radius: 10px; }
  footer { text-align: center; color: #6b6660; font-size: 0.85rem; margin-top: 48px; }
</style>
</head>
<body>
<main>
  <div class="hero">
    <img class="portrait" src="/images/models/veyra-stehl.jpg" alt="Veyra Stehl portrait" />
    <h1>Veyra Stehl</h1>
    <h2>Yoga • Fitness • Visual inspiration</h2>
    <p class="lede">Yoga and fitness for visual inspiration — mainly for men, but all are welcome. Move better, stress less, and build a stronger mind and body.</p>
    <div class="actions">
      <a class="primary" href="https://www.instagram.com/veyrastehl/" target="_blank" rel="noreferrer">Instagram</a>
      <a class="primary" href="https://www.tiktok.com/@veyrastehl" target="_blank" rel="noreferrer">TikTok</a>
      <a class="primary" href="https://x.com/veyrastehl" target="_blank" rel="noreferrer">X</a>
      <a class="dark" href="https://disruptful.org/premium/veyra-stehl" target="_blank" rel="noreferrer">Premium sites</a>
    </div>
  </div>
  <div class="gallery" aria-label="Veyra Stehl photo gallery">
    ${gallery.map((src, i) => `<img src="${src}" alt="Veyra Stehl yoga and fitness photo ${i + 1}" loading="lazy" />`).join("\n    ")}
  </div>
  <footer>&copy; Veyra Stehl</footer>
</main>
</body>
</html>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname.toLowerCase();

  if (VEYRA_STANDALONE_HOSTS.has(hostname) && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    return new Response(veyraStandalonePage(), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const target = MODEL_DOMAIN_REDIRECTS[hostname];

  if (target) {
    return Response.redirect(target, 301);
  }

  return context.next();
}
