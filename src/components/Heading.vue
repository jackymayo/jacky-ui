<script setup>
// A heading with an optional icon in front of it. `icon` is one string: a picture URL, "fa:<name>" for a registered
// Font Awesome icon, or plain text such as an emoji (see icons.js). No icon, an unknown icon, or a picture that fails to
// load just leaves the heading on its own; it never shows a broken-image mark.
//   <Heading icon="https://example.com/pic.webp">Steps</Heading>
//   <Heading tag="p" icon="🕺" :size="20" class="text-sm font-semibold">Notes</Heading>
import { computed, ref } from 'vue'
import { resolveIcon } from '../icons.js'

const props = defineProps({
  tag: { type: String, default: 'h3' }, // the element to render: h1..h6, p, ...
  icon: { type: String, default: '' }, // picture URL, "fa:<name>", or text/emoji
  size: { type: Number, default: 24 }, // icon height in px
  alt: { type: String, default: '' }, // for a picture; empty = decorative
})
const failed = ref(false)
const resolved = computed(() => (failed.value ? null : resolveIcon(props.icon)))
</script>

<template>
  <component :is="tag" class="flex items-center gap-2">
    <img v-if="resolved?.kind === 'image'" :src="resolved.src" :alt="alt" :style="{ height: size + 'px' }" class="w-auto shrink-0 object-contain" loading="lazy"
      referrerpolicy="no-referrer" @error="failed = true" />
    <svg v-else-if="resolved?.kind === 'svg'" :viewBox="resolved.viewBox" :height="size" :width="size * resolved.ratio" fill="currentColor" aria-hidden="true" class="shrink-0">
      <path :d="resolved.path" />
    </svg>
    <span v-else-if="resolved?.kind === 'text'" class="shrink-0 leading-none" :style="{ fontSize: size * 0.9 + 'px' }" aria-hidden="true">{{ resolved.text }}</span>
    <span class="min-w-0"><slot /></span>
  </component>
</template>
