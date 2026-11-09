// BetterTTV emotes by name. Headings choose an emote by its name here, so each emote's id is written down once and shared
// by every app. To add one: open it on https://betterttv.com/emotes/popular, copy the id from its address
// (betterttv.com/emotes/<id>, 24 hex characters) and add it below under a name you'll remember.
// Images come from BetterTTV's public CDN, so there is nothing to host or sign up for.
export const emotes = {
  // breakdance: '<id from betterttv.com/emotes/<id>>',
}

// Add or override names at runtime, e.g. from an app's main.js: registerEmotes({ breakdance: '...' }).
export function registerEmotes(more) {
  Object.assign(emotes, more)
}

const warned = new Set()

// Image URL for an emote *name* (a raw 24-character id also works). scale 1, 2 or 3 gives a 28, 56 or 112 px image.
// Returns '' for an unknown name, so a heading just shows without a picture; the console says which name was not found.
export function bttvEmote(nameOrId, scale = 2) {
  if (!nameOrId) return ''
  const id = emotes[nameOrId] ?? nameOrId
  if (!/^[0-9a-f]{24}$/i.test(id)) {
    if (!warned.has(nameOrId)) {
      warned.add(nameOrId)
      console.warn(`jacky-ui: no emote called "${nameOrId}". Add it to emotes in jacky-ui/src/emotes.js (or call registerEmotes).`)
    }
    return ''
  }
  return `https://cdn.betterttv.net/emote/${id.toLowerCase()}/${[1, 2, 3].includes(scale) ? scale : 2}x.webp`
}
