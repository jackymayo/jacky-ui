<script setup>
import { ref, computed, onUnmounted } from 'vue'
import EventItem from './EventItem.vue'
import BasicEventPanel from './BasicEventPanel.vue'
import EventModal from './EventModal.vue'
import { sameDay } from '../dateRange'

const props = defineProps({
  events: { type: Array, default: () => [] }, // { id, title, start, end } (Date)
  startHour: { type: Number, default: 0 },
  endHour: { type: Number, default: 24 },
  initialDay: { type: Date, default: null }, // day to open on (default: today)
  initialSelected: { type: String, default: null }, // id of an event to open the panel for
})

const emit = defineEmits(['update', 'create', 'delete', 'day-change'])

const HOUR_HEIGHT = 48
const SNAP_MINUTES = 15
const DRAG_THRESHOLD = 4 // px the pointer must move before a press counts as a drag
const day = ref(props.initialDay ?? new Date())
const showModal = ref(false)
const selectedId = ref(props.initialSelected)
const selected = computed(() => props.events.find((e) => e.id === selectedId.value) ?? null)

// --- drag to reschedule ---
const gridRef = ref(null)
const drag = ref(null) // { event, offsetX, offsetY, width, height, startX, startY, x, y, active }
let suppressClick = false

function startDrag({ event, pointer, rect }) {
  if (pointer.button !== 0) return
  drag.value = {
    event,
    offsetX: pointer.clientX - rect.left,
    offsetY: pointer.clientY - rect.top,
    width: rect.width,
    height: rect.height,
    startX: pointer.clientX,
    startY: pointer.clientY,
    x: pointer.clientX,
    y: pointer.clientY,
    active: false,
  }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd)
  window.addEventListener('pointercancel', stopDrag)
  window.addEventListener('keydown', onDragKey)
}

function onDragMove(e) {
  const d = drag.value
  d.x = e.clientX
  d.y = e.clientY
  if (!d.active && Math.hypot(d.x - d.startX, d.y - d.startY) > DRAG_THRESHOLD) {
    d.active = true
    document.body.style.cursor = 'grabbing'
  }
}

// Snapped start time under the cursor, or null when the cursor is outside the day grid.
function slotFor(d) {
  const rect = gridRef.value?.getBoundingClientRect()
  if (!rect || d.x < rect.left || d.x > rect.right || d.y < rect.top || d.y > rect.bottom) return null
  const duration = (d.event.end - d.event.start) / 60000
  const raw = ((d.y - d.offsetY - rect.top) / HOUR_HEIGHT) * 60 + props.startHour * 60
  const snapped = Math.round(raw / SNAP_MINUTES) * SNAP_MINUTES
  const mins = Math.max(props.startHour * 60, Math.min(snapped, props.endHour * 60 - duration))
  const start = new Date(d.event.start)
  start.setHours(0, mins, 0, 0)
  return start
}

const dropStart = computed(() => (drag.value?.active ? slotFor(drag.value) : null))

function onDragEnd() {
  const d = drag.value
  const start = d?.active ? slotFor(d) : null
  if (d?.active) {
    suppressClick = true // the click that follows a drag shouldn't open the panel
    setTimeout(() => (suppressClick = false), 0)
  }
  stopDrag()
  if (start && start.getTime() !== d.event.start.getTime()) {
    const duration = d.event.end - d.event.start
    emit('update', { ...d.event, start, end: new Date(start.getTime() + duration) })
  }
}

const onDragKey = (e) => e.key === 'Escape' && stopDrag()

function stopDrag() {
  drag.value = null
  document.body.style.cursor = ''
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  window.removeEventListener('pointercancel', stopDrag)
  window.removeEventListener('keydown', onDragKey)
}
onUnmounted(stopDrag)

function select(event) {
  if (!suppressClick) selectedId.value = event.id
}

const timeFmt = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const ghostRange = computed(() => {
  const d = drag.value
  const start = dropStart.value ?? d.event.start
  const end = new Date(start.getTime() + (d.event.end - d.event.start))
  return `${timeFmt(start)} – ${timeFmt(end)}`
})
const dropStyle = computed(() => {
  const d = drag.value
  const minutes = dropStart.value.getHours() * 60 + dropStart.value.getMinutes()
  return {
    top: `${((minutes - props.startHour * 60) / 60) * HOUR_HEIGHT}px`,
    height: `${Math.max(((d.event.end - d.event.start) / 3600000) * HOUR_HEIGHT, 20)}px`,
  }
})

function remove(event) {
  emit('delete', event.id)
  selectedId.value = null
}

const hours = computed(() =>
  Array.from({ length: props.endHour - props.startHour }, (_, i) => props.startHour + i),
)

const dayEvents = computed(() => props.events.filter((e) => sameDay(e.start, day.value)))

// Group events that overlap in time, then give each a column inside its group.
const laidOut = computed(() => {
  const sorted = [...dayEvents.value].sort((a, b) => a.start - b.start || a.end - b.end)
  const result = []
  let group = []
  let groupEnd = null

  const flush = () => {
    const colEnds = [] // end time of the last event in each column
    const placed = group.map((e) => {
      let col = colEnds.findIndex((end) => end <= e.start)
      if (col === -1) col = colEnds.length
      colEnds[col] = e.end
      return { event: e, column: col }
    })
    placed.forEach((p) => result.push({ ...p, columns: colEnds.length }))
    group = []
    groupEnd = null
  }

  for (const e of sorted) {
    if (group.length && e.start >= groupEnd) flush()
    group.push(e)
    groupEnd = groupEnd === null || e.end > groupEnd ? e.end : groupEnd
  }
  if (group.length) flush()
  return result
})

const title = computed(() =>
  day.value.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }),
)

function create(event) {
  emit('create', event)
  showModal.value = false
}

function shift(days) {
  const d = new Date(day.value)
  d.setDate(d.getDate() + days)
  day.value = d
  selectedId.value = null
  emit('day-change', d)
}

function goToday() {
  day.value = new Date()
  selectedId.value = null
  emit('day-change', day.value)
}

const label = (h) => new Date(2000, 0, 1, h).toLocaleTimeString([], { hour: 'numeric' })
</script>

<template>
  <section class="rounded border">
    <header class="flex items-center justify-between border-b p-3">
      <button class="rounded border px-2 py-1 hover:bg-gray-100" @click="shift(-1)">‹</button>
      <div class="text-center">
        <h2 class="font-semibold">{{ title }}</h2>
        <button class="text-xs text-indigo-600 hover:underline" @click="goToday">Today</button>
        <br/>
        <button class="text-md p-2 rounded bg-blue-300" @click="showModal = true">+ Create Event</button>
      </div>
      <button class="rounded border px-2 py-1 hover:bg-gray-100" @click="shift(1)">›</button>
    </header>

    <div class="flex">
    <div ref="gridRef" class="relative flex-1" :style="{ height: `${hours.length * HOUR_HEIGHT}px` }">
      <div
        v-for="h in hours"
        :key="h"
        class="absolute inset-x-0 flex border-t text-xs text-gray-500"
        :style="{ top: `${(h - startHour) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }"
      >
        <span class="w-14 shrink-0 pr-2 text-right">{{ label(h) }}</span>
      </div>

      <div class="absolute inset-y-0 left-14 right-0">
        <div
          v-if="dropStart"
          class="pointer-events-none absolute inset-x-1 rounded border-2 border-dashed border-indigo-400 bg-indigo-50"
          :style="dropStyle"
        ></div>
        <EventItem
          v-for="item in laidOut"
          :key="item.event.id"
          :event="item.event"
          :column="item.column"
          :columns="item.columns"
          :hour-height="HOUR_HEIGHT"
          :start-hour="startHour"
          :selected="item.event.id === selectedId"
          :dragging="drag?.active && drag.event.id === item.event.id"
          @dragstart="startDrag"
          @select="select"
        />
      </div>
    </div>

    <!-- The side panel for the selected event. Replace it with the "panel" slot, e.g. for live collaborative editing. -->
    <slot v-if="selected" name="panel" :event="selected" :update="(e) => emit('update', e)" :remove="() => remove(selected)" :close="() => (selectedId = null)">
      <BasicEventPanel :key="selected.id" :event="selected" @update="emit('update', $event)" @delete="remove(selected)" @close="selectedId = null" />
    </slot>
    </div>

    <p v-if="!dayEvents.length" class="border-t p-3 text-sm text-gray-500">No events.</p>

    <div
      v-if="drag?.active"
      class="pointer-events-none fixed z-50 overflow-hidden rounded border-l-4 border-indigo-600 bg-indigo-200 px-2 py-1 text-sm shadow-lg ring-2 ring-indigo-500"
      :class="!dropStart && 'opacity-60'"
      :style="{ left: `${drag.x - drag.offsetX}px`, top: `${drag.y - drag.offsetY}px`, width: `${drag.width}px`, height: `${drag.height}px` }"
    >
      <span class="block truncate font-medium">{{ drag.event.title }}</span>
      <span class="block truncate text-xs text-gray-600">{{ ghostRange }}</span>
    </div>

    <EventModal v-if="showModal" :day="day" @create="create" @close="showModal = false" />
  </section>
</template>
