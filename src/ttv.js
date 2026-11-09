// Twitch emotes by name. The dictionary (name -> image link) is not in this package: it lives in the accounts service
// (GET /api/emotes, logged-in users only) and is fetched once per page by loadEmotes. The Navbar does that for you.
//   <Heading icon="ttv:hamdance">Steps</Heading>        or        <Heading :icon="ttv('hamdance')">Steps</Heading>
import { reactive } from 'vue'

// One shared state for the page, kept on globalThis: a bundler can load this file twice (Vite's dev server bundles a package's
// entry file apart from its .vue files) and two separate dictionaries would never meet.
const state = (globalThis.__jackyUiTtv ??= reactive({ map: {}, loaded: false }))
const warned = new Set()

// The image link for an emote name, or '' while the dictionary is loading or when the name is unknown.
// It reads reactive state, so a template that calls it updates itself once the dictionary arrives.
export function ttv(name) {
  const url = state.map[name]
  if (url) return url
  if (state.loaded && name && !warned.has(name)) {
    warned.add(name)
    console.warn(`jacky-ui: no emote called "${name}" in the emotes file.`)
  }
  return ''
}

export async function loadEmotes(accountsUrl) {
  try {
    const res = await fetch(accountsUrl.replace(/\/$/, '') + '/api/emotes', { credentials: 'include' })
    if (!res.ok) return // logged out or the service is down: headings just show without pictures
    state.map = await res.json()
    state.loaded = true
  } catch {}
}
