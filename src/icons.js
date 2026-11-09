// Icons for headings and other small labels. An icon is one string; what it means is decided by how it looks:
//   "https://…", "/path/pic.png", "data:image/…"   a picture
//   "fa:phone"                                      a Font Awesome icon, if the app registered it (registerIcons)
//   anything else                                   plain text, such as an emoji or a short symbol
// jacky-ui bundles no Font Awesome itself: an app that wants `fa:` icons hands over the definitions it already has,
// e.g. registerIcons({ phone: faPhone }) with icons from @fortawesome/free-solid-svg-icons.
const registry = {}

export function registerIcons(defs) {
  Object.assign(registry, defs)
}

const warned = new Set()

// -> { kind: 'image', src } | { kind: 'svg', viewBox, path, ratio } | { kind: 'text', text } | null
export function resolveIcon(icon) {
  if (!icon || typeof icon !== 'string') return null
  if (/^(https?:\/\/|\/|data:image\/)/.test(icon)) return { kind: 'image', src: icon }
  if (icon.startsWith('fa:')) {
    const def = registry[icon.slice(3)]
    if (!def) {
      if (!warned.has(icon)) {
        warned.add(icon)
        console.warn(`jacky-ui: icon "${icon}" is not registered (see registerIcons).`)
      }
      return null
    }
    const [w, h, , , path] = def.icon
    return { kind: 'svg', viewBox: `0 0 ${w} ${h}`, path, ratio: w / h }
  }
  return { kind: 'text', text: icon }
}
