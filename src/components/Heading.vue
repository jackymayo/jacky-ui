<script setup>
// A heading with an optional picture in front of it: a BetterTTV emote (chosen by name from the emotes dictionary) or any image URL. With no picture it is
// just the heading, and a picture that fails to load simply disappears, so it can never leave a broken-image icon.
//   <Heading emote="breakdance">Steps</Heading>
//   <Heading tag="p" image="/logo.png" :size="20" class="text-sm font-semibold">Notes</Heading>
import { computed, ref } from 'vue'
import { bttvEmote } from '../emotes.js'

const props = defineProps({
  tag: { type: String, default: 'h3' }, // the element to render: h1..h6, p, ...
  emote: { type: String, default: '' }, // a name from the emotes dictionary (src/emotes.js); used when there is no `image`
  image: { type: String, default: '' }, // any image URL
  size: { type: Number, default: 24 }, // picture height in px (width follows its shape)
  alt: { type: String, default: '' }, // empty = decorative
})
const failed = ref(false)
const src = computed(() => (failed.value ? '' : props.image || bttvEmote(props.emote, props.size > 28 ? 3 : 2)))
</script>

<template>
  <component :is="tag" class="flex items-center gap-2">
    <img v-if="src" :src="src" :alt="alt" :style="{ height: size + 'px' }" class="w-auto shrink-0 object-contain" loading="lazy" referrerpolicy="no-referrer" @error="failed = true" />
    <span class="min-w-0"><slot /></span>
  </component>
</template>
