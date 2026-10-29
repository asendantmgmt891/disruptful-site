const MODEL_DOMAIN_REDIRECTS = {
  "emyravesce.com": "https://disruptful.com/models/emyra-vesce",
  "www.emyravesce.com": "https://disruptful.com/models/emyra-vesce",
  "siyennaluyxe.com": "https://disruptful.com/models/siyenna-luyxe",
  "www.siyennaluyxe.com": "https://disruptful.com/models/siyenna-luyxe",
};

// 2026-10-29 (Architect): /models/<slug> and /premium/<slug> hide the
// shared Header/Footer client-side (see the `standalone` check in
// src/main.jsx), but that's JS-only -- this is a pure client-side SPA with
// one static index.html, so the SERVER-rendered <title>/<meta
// description> a non-JS crawler actually sees is always the generic
// "Disruptful -- Creator Growth Studio" shell, regardless of route. That's
// the exact same shared-multi-model-studio signal that got
// disruptful.org/models/veyra-stehl flagged in the first place, now
// reappearing one click away from veyrastehl.net's "Premium sites" link
// (disruptful.org/premium/veyra-stehl). Rewrite these two tags server-side
// for known model slugs so a non-JS fetch of either route sees
// model-specific metadata instead of the shared brand shell.
const MODEL_META = {
  "veyra-stehl": { title: "Veyra Stehl", description: "Yoga and fitness for visual inspiration — mainly for men, but all are welcome. Move better, stress less, and build a stronger mind and body." },
  "emyra-vesce": { title: "Emyra Vesce", description: "A digital creator with a polished visual presence, confident lifestyle imagery, and fashion-forward content direction." },
  "siyenna-luyxe": { title: "Siyenna Luyxe", description: "A digital creator with confident desert-lit fitness imagery, bold visual identity, and polished brand presence." },
};

class MetaRewriter {
  constructor(meta) { this.meta = meta; }
  element(element) {
    if (element.tagName === "title") {
      element.setInnerContent(this.meta.title);
    } else if (element.tagName === "meta" && element.getAttribute("name") === "description") {
      element.setAttribute("content", this.meta.description);
    }
  }
}

async function rewriteModelMeta(response, meta) {
  return new HTMLRewriter()
    .on("title", new MetaRewriter(meta))
    .on('meta[name="description"]', new MetaRewriter(meta))
    .transform(response);
}

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
// 2026-10-29 (Architect): the actual Instagram bio link is veyrastehl.net,
// not .com -- .net was never added here and was still bound to an orphaned
// legacy Worker (pre-dating this site) that literally hardcoded the string
// "OnlyFans" in its page source. Adding it here only takes effect once the
// Cloudflare custom-domain binding for veyrastehl.net is repointed from
// that Worker to this Pages project.
const VEYRA_STANDALONE_HOSTS = new Set([
  "veyrastehl.com", "www.veyrastehl.com",
  "veyrastehl.net", "www.veyrastehl.net",
]);

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
  .actions a, .button { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 0.95rem; border: none; cursor: pointer; font-family: inherit; }
  .actions a.primary, .button.primary { background: #f3f1ee; color: #08070b; }
  .actions a.dark, .button.dark { background: #1c1a1f; color: #f3f1ee; border: 1px solid #3a363f; }
  .button.ghost { background: transparent; color: #c9c4bd; margin-top: 16px; }
  .button:disabled { opacity: 0.6; cursor: default; }
  .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-top: 40px; }
  .gallery img { width: 100%; height: 220px; object-fit: cover; border-radius: 10px; }
  footer { text-align: center; color: #6b6660; font-size: 0.85rem; margin-top: 48px; }
  .premium-dialog { display: none; position: fixed; inset: 0; background: rgba(8,7,11,0.9); align-items: center; justify-content: center; padding: 20px; z-index: 10; }
  .premium-dialog.open { display: flex; }
  .premium-card { background: #15131a; border: 1px solid #3a363f; border-radius: 16px; padding: 32px; max-width: 420px; width: 100%; text-align: center; }
  .premium-card p { color: #ddd9d2; line-height: 1.5; }
  #premium-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 8px; }
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
      <button class="button dark" id="premium-btn" type="button">Premium sites</button>
    </div>
  </div>
  <div class="gallery" aria-label="Veyra Stehl photo gallery">
    ${gallery.map((src, i) => `<img src="${src}" alt="Veyra Stehl yoga and fitness photo ${i + 1}" loading="lazy" />`).join("\n    ")}
  </div>
  <footer>&copy; Veyra Stehl</footer>
</main>
<div id="premium-dialog" class="premium-dialog">
  <div class="premium-card" role="dialog" aria-labelledby="premium-title">
    <div id="age-gate">
      <h1 id="premium-title">Sensitive Content</h1>
      <p>These links may contain content that is not appropriate for all audiences.</p>
      <button class="button primary" id="age-confirm" type="button">I am over 18</button>
    </div>
    <div id="premium-choice" style="display:none">
      <h1>Premium content</h1>
      <p>Choose a site to continue.</p>
      <div class="actions" id="premium-links"></div>
    </div>
    <button class="button ghost" id="premium-back" type="button">Back to Veyra Stehl</button>
  </div>
</div>
<script>
  // 2026-10-29 (Architect): entirely same-origin -- no outbound link to any
  // other domain. /api/premium-links and /go/<platform>
  // already run per Pages-project across every bound custom domain, so this
  // domain's own fetches satisfy their same-origin-Referer check without
  // ever touching another hostname. Mirrors src/main.jsx's PremiumSitesPage.
  (function () {
    var btn = document.getElementById('premium-btn');
    var dialog = document.getElementById('premium-dialog');
    var ageGate = document.getElementById('age-gate');
    var choice = document.getElementById('premium-choice');
    var linksEl = document.getElementById('premium-links');
    var confirmBtn = document.getElementById('age-confirm');
    var backBtn = document.getElementById('premium-back');
    btn.addEventListener('click', function () { dialog.classList.add('open'); });
    backBtn.addEventListener('click', function () {
      dialog.classList.remove('open');
      ageGate.style.display = '';
      choice.style.display = 'none';
      linksEl.innerHTML = '';
      confirmBtn.disabled = false;
    });
    confirmBtn.addEventListener('click', function () {
      confirmBtn.disabled = true;
      fetch('/api/premium-links?slug=veyra-stehl')
        .then(function (res) { if (!res.ok) throw new Error('bad response'); return res.json(); })
        .then(function (data) {
          var html = '';
          var t = encodeURIComponent(data.token || '');
          if (data.premium) html += '<a class="button primary" target="_blank" rel="noreferrer" href="/go/of/veyra-stehl?t=' + t + '">OF</a>';
          if (data.mym) html += '<a class="button primary" target="_blank" rel="noreferrer" href="/go/mym/veyra-stehl?t=' + t + '">MYM</a>';
          linksEl.innerHTML = html;
          ageGate.style.display = 'none';
          choice.style.display = '';
        })
        .catch(function () { confirmBtn.disabled = false; });
    });
  })();
</script>
</body>
</html>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname.toLowerCase();

  if (
    VEYRA_STANDALONE_HOSTS.has(hostname) &&
    !/\.[a-z0-9]+$/i.test(url.pathname) &&
    !/^\/(api|go)\//.test(url.pathname)
  ) {
    return new Response(veyraStandalonePage(), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const target = MODEL_DOMAIN_REDIRECTS[hostname];

  if (target) {
    return Response.redirect(target, 301);
  }

  const modelSlugMatch = url.pathname.match(/^\/(?:models|premium)\/([^/]+)\/?$/);
  if (modelSlugMatch && MODEL_META[modelSlugMatch[1]]) {
    const response = await context.next();
    return rewriteModelMeta(response, MODEL_META[modelSlugMatch[1]]);
  }

  return context.next();
}
