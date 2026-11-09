<script setup>
// A two-part chip: the tag ("baking") and, when there is one, what kind of it ("sourdough").
// Shared component: used wherever a person's interests are shown.
defineProps({
  tag: { type: Object, required: true }, // { tag, detail }
  removable: Boolean,
})
defineEmits(['remove'])
</script>

<template>
  <span class="inline-flex items-stretch overflow-hidden rounded-full border border-indigo-200 text-xs font-medium">
    <span class="bg-indigo-600 px-2.5 py-1 text-white">{{ tag.tag }}</span>
    <span v-if="tag.detail" class="bg-indigo-50 px-2.5 py-1 text-indigo-800">{{ tag.detail }}</span>
    <button v-if="removable" type="button" class="bg-indigo-50 px-2 text-indigo-700 hover:bg-red-100 hover:text-red-700"
      :aria-label="`Remove ${tag.tag}${tag.detail ? ' ' + tag.detail : ''}`" @click="$emit('remove')">×</button>
  </span>
</template>
