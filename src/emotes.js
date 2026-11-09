// BetterTTV emotes (https://betterttv.com/emotes/popular). Each emote page is betterttv.com/emotes/<id>; the id is the
// 24-character hex string at the end of that address. Images are served from BetterTTV's public CDN, no key needed.
// scale 1, 2 or 3 gives a 28, 56 or 112 px image. Returns '' for anything that is not a plausible id.
export function bttvEmote(id, scale = 2) {
  if (!/^[0-9a-f]{24}$/i.test(id || '')) return ''
  return `https://cdn.betterttv.net/emote/${id.toLowerCase()}/${[1, 2, 3].includes(scale) ? scale : 2}x.webp`
}
