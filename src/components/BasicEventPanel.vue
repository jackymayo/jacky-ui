<script setup>
// The default side panel for DayView: plain (non-collaborative) editing of an event.
// Fulfill replaces it with its live-editing panel through DayView's `panel` slot.
import { ref, watch, computed } from 'vue'
import IncrementDecrement from './IncrementDecrement.vue'

const props = defineProps({
  event: { type: Object, required: true }, // { id, title, description, start, end } (Date)
})
const emit = defineEmits(['update', 'delete', 'close'])

const pad = (n) => String(n).padStart(2, '0')
const toTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
const toMinutes = (t) => {
  const [h, m] = (t || '00:00').split(':').map(Number)
  return h * 60 + m
}

const draft = ref({})
watch(
  () => props.event,
  (e) => (draft.value = { title: e.title, description: e.description ?? '', start: toTime(e.start), duration: Math.round((e.end - e.start) / 60000) }),
  { immediate: true },
)
const startMin = computed(() => toMinutes(draft.value.start))

// saves as you edit; a blank title, empty start or an event running past midnight is ignored
watch(draft, ({ title, description, start, duration }) => {
  if (!title.trim() || !start || toMinutes(start) + duration > 24 * 60) return
  const from = new Date(props.event.start)
  from.setHours(...start.split(':').map(Number), 0, 0)
  const to = new Date(from.getTime() + duration * 60000)
  const e = props.event
  if (title === e.title && description === (e.description ?? '') && from.getTime() === e.start.getTime() && to.getTime() === e.end.getTime()) return
  emit('update', { ...e, title, description, start: from, end: to })
}, { deep: true })
</script>

<template>
  <aside class="flex w-72 shrink-0 flex-col border-l p-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Edit event</h3>
      <button class="text-gray-500 hover:text-gray-800" aria-label="Close" @click="emit('close')">✕</button>
    </div>
    <div class="mt-4 flex flex-1 flex-col gap-3 text-sm">
      <label class="flex flex-col gap-1">Title <input v-model="draft.title" class="rounded border px-2 py-1" /></label>
      <label class="flex flex-col gap-1">Start <input v-model="draft.start" type="time" required class="rounded border px-2 py-1" /></label>
      <IncrementDecrement v-model="draft.duration" :start-min="startMin" />
      <label class="flex flex-col gap-1">Description <textarea v-model="draft.description" rows="5" class="rounded border px-2 py-1"></textarea></label>
      <button type="button" class="mt-auto rounded border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50" @click="emit('delete')">Delete event</button>
    </div>
  </aside>
</template>
