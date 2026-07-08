const MODEL_DOMAIN_REDIRECTS = {
  "emyravesce.com": "https://disruptful.com/models/emyra-vesce",
  "www.emyravesce.com": "https://disruptful.com/models/emyra-vesce",
  "siyennaluyxe.com": "https://disruptful.com/models/siyenna-luyxe",
  "www.siyennaluyxe.com": "https://disruptful.com/models/siyenna-luyxe",
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = MODEL_DOMAIN_REDIRECTS[url.hostname.toLowerCase()];

  if (target) {
    return Response.redirect(target, 301);
  }

  return context.next();
}
