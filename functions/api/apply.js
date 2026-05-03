const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })

const clean = (value, max = 1200) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)

const escapeHtml = (value) =>
  clean(value, 4000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const field = (label, value) => {
  const normalized = clean(value)
  return normalized ? `<b>${label}:</b> ${escapeHtml(normalized)}` : `<b>${label}:</b> —`
}

const normalizeBotToken = (value) => clean(value, 300).replace(/^`|`$/g, '')

const normalizeChatId = (value) =>
  clean(value, 80)
    .replace(/^`|`$/g, '')
    .replace(/^[−–—]/, '-')

export async function onRequestPost({ request, env }) {
  const botToken = normalizeBotToken(env.TELEGRAM_BOT_TOKEN)
  const chatId = normalizeChatId(env.TELEGRAM_CHAT_ID)

  if (!botToken || !chatId) {
    return json({ ok: false, error: 'Application delivery is not configured yet.' }, 503)
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid application payload.' }, 400)
  }

  // Quietly accept bot-filled honeypot submissions without notifying Telegram.
  if (clean(payload.website)) return json({ ok: true })

  const application = {
    name: clean(payload.name, 160),
    age: clean(payload.age, 20),
    location: clean(payload.location, 160),
    instagram: clean(payload.instagram, 220),
    platforms: clean(payload.platforms, 1200),
    goals: clean(payload.goals, 1600),
    contact: clean(payload.contact, 220),
  }

  const missing = ['name', 'age', 'location', 'instagram', 'goals', 'contact'].filter((key) => !application[key])
  if (missing.length) {
    return json({ ok: false, error: 'Please complete all required fields.' }, 400)
  }

  const message = [
    '<b>New Disruptful application</b>',
    '',
    field('Name / creator', application.name),
    field('Age', application.age),
    field('Location', application.location),
    field('Main social', application.instagram),
    field('Best contact', application.contact),
    '',
    field('Current platforms', application.platforms),
    field('Goals', application.goals),
    '',
    `<i>Submitted from ${escapeHtml(new URL(request.url).origin)}</i>`,
  ].join('\n')

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  if (!telegramResponse.ok) {
    const telegramError = await telegramResponse.json().catch(() => ({}))
    return json(
      {
        ok: false,
        error: 'Application could not be delivered. Please try again.',
        detail: telegramError.description || `Telegram HTTP ${telegramResponse.status}`,
      },
      502,
    )
  }

  return json({ ok: true })
}

export async function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405)
}
