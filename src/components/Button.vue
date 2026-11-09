<script setup>
// A button (or a link, when `href` is given) with text and an optional icon (see Icon.vue for what `icon` can be). It brings no
// colours of its own, only the layout: style it with `class`, as in the Navbar.
//   <Button icon="ttv:donowall" class="rounded px-3 text-indigo-700" @click="logout">Log out</Button>
//   <Button href="/login" icon="fa:right-to-bracket">Log in</Button>
import Icon from './Icon.vue'

defineProps({
  icon: { type: String, default: '' },
  iconAfter: Boolean, // put the icon after the text instead of before it
  size: { type: Number, default: 20 }, // icon height in px
  href: { type: String, default: '' }, // set it and this renders an <a> instead of a <button>
  type: { type: String, default: 'button' }, // for a <button>; "button" so it never submits a form by accident
  alt: { type: String, default: '' },
})
</script>

<template>
  <component :is="href ? 'a' : 'button'" :href="href || undefined" :type="href ? undefined : type" class="inline-flex items-center justify-center gap-2">
    <Icon v-if="icon && !iconAfter" :icon="icon" :size="size" :alt="alt" />
    <span v-if="$slots.default"><slot /></span>
    <Icon v-if="icon && iconAfter" :icon="icon" :size="size" :alt="alt" />
  </component>
</template>
