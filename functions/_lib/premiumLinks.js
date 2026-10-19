// Single source of truth for real OnlyFans/MYM destination URLs, server-side
// only. Shared by /api/premium-links (tells the client which buttons to show,
// never the real URL) and /go/[platform]/[slug] (the actual redirect).
export const PREMIUM_LINKS = {
  'veyra-stehl': { premium: 'https://onlyfans.com/veyrastehl', mym: 'https://mym.fans/Veyrastehl' },
  'emyra-vesce': { premium: 'https://onlyfans.com/emyravesce', mym: 'https://mym.fans/Emyravesce' },
  'siyenna-luyxe': { premium: 'https://onlyfans.com/siyennaluyxe', mym: 'https://mym.fans/Siyennaluyxe' },
}
