<script setup>
// A round profile picture, or the person's initials on a colour picked from their name when they have none.
// Shared component: it only needs { name, avatarUrl }, which is what the accounts API's profiles look like.
import { computed } from 'vue'

const props = defineProps({
  profile: { type: Object, required: true }, // { name, avatarUrl }
  size: { type: Number, default: 40 },
})

const initials = computed(() =>
  (props.profile.name || '?').trim().split(/\s+/).slice(0, 2).map((w) => [...w][0]).join('').toUpperCase(),
)
const hue = computed(() => [...(props.profile.name || '')].reduce((h, c) => (h * 31 + c.codePointAt(0)) % 360, 0))
</script>

<template>
  <img v-if="profile.avatarUrl" :src="profile.avatarUrl" :alt="profile.name" :width="size" :height="size"
    class="shrink-0 rounded-full bg-slate-200 object-cover" :style="{ width: size + 'px', height: size + 'px' }" />
  <span v-else role="img" :aria-label="profile.name"
    class="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
    :style="{ width: size + 'px', height: size + 'px', fontSize: size * 0.4 + 'px', background: `hsl(${hue} 45% 40%)` }">{{ initials }}</span>
</template>
