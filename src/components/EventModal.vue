<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import IncrementDecrement from './IncrementDecrement.vue'
import { toYmd, fromYmd } from '../dateRange'

const props = defineProps({
  day: { type: Date, required: true }, // day the new event is created on
})
const emit = defineEmits(['create', 'close'])

const MIN_DURATION = 15

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const atMinutes = (d, mins) => {
  const out = new Date(d)
  out.setHours(0, mins, 0, 0)
  return out
}
const fmt = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

// template defaults: a 30 minute event starting at 9:00
const draft = ref({ title: '', description: '', date: toYmd(props.day), start: '09:00' })
const duration = ref(30)

const startMin = computed(() => toMinutes(draft.value.start || '00:00'))
// the event can't run past midnight
const maxDuration = computed(() => 24 * 60 - startMin.value)


const chosenDay = computed(() => (draft.value.date ? fromYmd(draft.value.date) : props.day))
const startDate = computed(() => atMinutes(chosenDay.value, startMin.value))
const endDate = computed(() => new Date(startDate.value.getTime() + duration.value * 60000))
const durationLabel = computed(() => {
  const h = Math.floor(duration.value / 60)
  const m = duration.value % 60
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(' ')
})

const dayLabel = computed(() =>
  chosenDay.value.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }),
)
const invalid = computed(() => !draft.value.title.trim() || !draft.value.date || !draft.value.start || maxDuration.value < MIN_DURATION)

function submit() {
  if (invalid.value) return
  emit('create', {
    title: draft.value.title.trim(),
    description: draft.value.description,
    start: startDate.value,
    end: endDate.value,
  })
}

const onKey = (e) => e.key === 'Escape' && emit('close')
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click.self="emit('close')"
  >
    <form
      class="w-full max-w-md rounded bg-white p-5 shadow-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-event-title"
      @submit.prevent="submit"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 id="new-event-title" class="font-semibold">New event</h3>
          <p class="text-xs text-gray-500">{{ dayLabel }}</p>
            <span class="text-xs text-gray-500">{{ fmt(startDate) }} – {{ fmt(endDate) }} · {{ durationLabel }}</span>
        </div>
        <button type="button" class="text-gray-500 hover:text-gray-800" aria-label="Close" @click="emit('close')">✕</button>
      </div>

      <div class="mt-4 flex flex-col gap-3 text-sm">
        <label class="flex flex-col gap-1">
          Title
          <input v-model="draft.title" required autofocus class="rounded border px-2 py-1" />
        </label>
        <label class="flex flex-col gap-1">
          Date
          <input v-model="draft.date" type="date" required class="rounded border px-2 py-1" />
        </label>
        <label class="flex flex-col gap-1">
          Start
          <input v-model="draft.start" type="time" required class="rounded border px-2 py-1" />
        </label>
        <IncrementDecrement v-model="duration" :start-min="startMin" />
        <label class="flex flex-col gap-1">
          Description
          <textarea v-model="draft.description" rows="4" class="rounded border px-2 py-1"></textarea>
        </label>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <button type="button" class="rounded border px-4 py-2 hover:bg-gray-100" @click="emit('close')">Cancel</button>
        <button
          :disabled="invalid"
          class="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</template>
