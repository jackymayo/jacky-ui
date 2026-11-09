<script setup>
import { computed, ref } from 'vue'
import { colors, DEFAULT_TYPE } from '../eventTypes'
import { formatRange, formatDuration, sameDay } from '../dateRange'
import EventModal from './EventModal.vue'

const props = defineProps({
  events: { type: Array, default: () => [] }, // { id, title, description, type, start, end } (Date)
})
const emit = defineEmits(['open', 'create'])

const showModal = ref(false)
const now = ref(new Date())

// Not finished yet (including in progress), soonest first; and finished ones, most recent first.
const upcoming = computed(() => props.events.filter((e) => e.end >= now.value).sort((a, b) => a.start - b.start))
const past = computed(() => props.events.filter((e) => e.end < now.value).sort((a, b) => b.start - a.start))

// Group a sorted list under day headings by the day each event starts.
function groupByDay(list) {
  const groups = []
  for (const e of list) {
    const last = groups[groups.length - 1]
    if (last && sameDay(last.day, e.start)) last.events.push(e)
    else groups.push({ day: e.start, events: [e] })
  }
  return groups
}
const upcomingGroups = computed(() => groupByDay(upcoming.value))
const pastGroups = computed(() => groupByDay(past.value))

function heading(d) {
  const today = new Date()
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  if (sameDay(d, today)) return 'Today'
  if (sameDay(d, tomorrow)) return 'Tomorrow'
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' })
}

const dot = (e) => (colors[e.type] ?? colors[DEFAULT_TYPE]).dot

function create(event) {
  emit('create', event)
  showModal.value = false
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-lg font-semibold">Planned events</h2>
      <div class="flex gap-2">
        <button class="rounded border px-3 py-1.5 text-sm hover:bg-gray-100" @click="emit('open', new Date())">Calendar</button>
        <button class="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700" @click="showModal = true">+ New event</button>
      </div>
    </div>

    <p v-if="!events.length" class="mt-4 text-gray-500">Nothing planned yet. Create an event to get started.</p>
    <p v-else-if="!upcoming.length" class="mt-4 text-gray-500">Nothing upcoming.</p>

    <div v-for="g in upcomingGroups" :key="g.day.toDateString()" class="mt-5">
      <h3 class="mb-1 text-sm font-semibold text-gray-600">{{ heading(g.day) }}</h3>
      <ul class="divide-y rounded border">
        <li v-for="e in g.events" :key="e.id">
          <button class="flex w-full items-start gap-3 p-3 text-left hover:bg-gray-50" @click="emit('open', e.start, e.id)">
            <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" :class="dot(e)" :title="e.type"></span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-medium">{{ e.title }}</span>
              <span class="block text-sm text-gray-600">{{ formatRange(e.start, e.end) }}</span>
              <span v-if="e.description" class="block truncate text-xs text-gray-500">{{ e.description }}</span>
            </span>
            <span class="shrink-0 text-xs text-gray-500">{{ formatDuration(e.start, e.end) }}</span>
          </button>
        </li>
      </ul>
    </div>

    <details v-if="past.length" class="mt-6">
      <summary class="cursor-pointer text-sm font-semibold text-gray-600">Past events ({{ past.length }})</summary>
      <div v-for="g in pastGroups" :key="g.day.toDateString()" class="mt-3">
        <h3 class="mb-1 text-sm text-gray-500">{{ heading(g.day) }}</h3>
        <ul class="divide-y rounded border opacity-75">
          <li v-for="e in g.events" :key="e.id">
            <button class="flex w-full items-start gap-3 p-3 text-left hover:bg-gray-50" @click="emit('open', e.start, e.id)">
              <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" :class="dot(e)"></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate font-medium">{{ e.title }}</span>
                <span class="block text-sm text-gray-600">{{ formatRange(e.start, e.end) }}</span>
              </span>
              <span class="shrink-0 text-xs text-gray-500">{{ formatDuration(e.start, e.end) }}</span>
            </button>
          </li>
        </ul>
      </div>
    </details>

    <EventModal v-if="showModal" :day="new Date()" @create="create" @close="showModal = false" />
  </section>
</template>
