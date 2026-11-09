<script setup>
// A heading with an optional icon in front of it (see Icon.vue for what `icon` can be).
//   <Heading icon="ttv:hamdance">Steps</Heading>
//   <Heading tag="p" icon="🕺" :size="20" class="text-sm font-semibold">Notes</Heading>
import Icon from './Icon.vue'

defineProps({
  tag: { type: String, default: 'h3' }, // the element to render: h1..h6, p, ...
  icon: { type: String, default: '' }, // picture URL, "fa:<name>", "ttv:<name>", or text/emoji
  size: { type: Number, default: 24 }, // icon height in px
  alt: { type: String, default: '' },
})
</script>

<template>
  <component :is="tag" class="flex items-center gap-2">
    <Icon :icon="icon" :size="size" :alt="alt" />
    <span class="min-w-0"><slot /></span>
  </component>
</template>
