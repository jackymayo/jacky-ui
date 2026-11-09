<script setup>
// One small icon, drawn from a single string: a picture URL, "fa:<name>" (a registered Font Awesome icon), "ttv:<name>" (a Twitch
// emote from the shared dictionary) or plain text such as an emoji (see icons.js). No icon, an unknown name, or a picture that fails
// to load renders nothing, so it can never leave a broken-image mark. Heading and Button are built on this.
import { computed, ref } from 'vue'
import { resolveIcon } from '../icons.js'

const props = defineProps({
  icon: { type: String, default: '' },
  size: { type: Number, default: 24 }, // height in px
  alt: { type: String, default: '' }, // for a picture; empty = decorative
})
const failed = ref(false)
const resolved = computed(() => (failed.value ? null : resolveIcon(props.icon)))
</script>

<template>
  <img v-if="resolved?.kind === 'image'" :src="resolved.src" :alt="alt" :style="{ height: size + 'px' }" class="w-auto shrink-0 object-contain" loading="lazy"
    referrerpolicy="no-referrer" @error="failed = true" />
  <svg v-else-if="resolved?.kind === 'svg'" :viewBox="resolved.viewBox" :height="size" :width="size * resolved.ratio" fill="currentColor" aria-hidden="true" class="shrink-0">
    <path :d="resolved.path" />
  </svg>
  <span v-else-if="resolved?.kind === 'text'" class="shrink-0 leading-none" :style="{ fontSize: size * 0.9 + 'px' }" aria-hidden="true">{{ resolved.text }}</span>
</template>
