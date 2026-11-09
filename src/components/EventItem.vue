<script setup>
import { computed } from 'vue'
import { colors, DEFAULT_TYPE } from '../eventTypes'

const props = defineProps({
  event: { type: Object, required: true }, // { id, title, start, end } (Date)
  hourHeight: { type: Number, default: 48 },
  startHour: { type: Number, default: 0 },
  column: { type: Number, default: 0 }, // which overlap column this event sits in
  columns: { type: Number, default: 1 }, // how many columns its overlap group has
  selected: { type: Boolean, default: false },
  dragging: { type: Boolean, default: false }, // being dragged: dim the original
})
const emit = defineEmits(['select', 'dragstart'])

const minutes = (d) => d.getHours() * 60 + d.getMinutes()

const style = computed(() => {
  const top = ((minutes(props.event.start) - props.startHour * 60) / 60) * props.hourHeight
  const height = ((minutes(props.event.end) - minutes(props.event.start)) / 60) * props.hourHeight
  // two overlapping events: 80% wide, one pinned left and the other right
  // three or more: split the width evenly
  const width = props.columns === 2 ? 90 : 100 / props.columns
  const left = props.columns === 2 ? props.column * 20 : props.column * width
  return {
    top: `${top}px`,
    height: `${Math.max(height, 20)}px`,
    left: `${left}%`,
    width: `${width}%`,
  }
})

const color = computed(() => colors[props.event.type] ?? colors[DEFAULT_TYPE])

const timeRange = computed(() => {
  const fmt = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return `${fmt(props.event.start)} – ${fmt(props.event.end)}`
})
</script>

<template>
  <button
    class="absolute cursor-grab touch-none select-none overflow-hidden rounded border-l-4 px-2 py-1 text-left text-sm shadow-sm hover:z-20"
    :class="[
      selected ? color.selected : color.unselected,
      dragging && 'opacity-40',
    ]"
    :style="style"
    @pointerdown="emit('dragstart', { event, pointer: $event, rect: $event.currentTarget.getBoundingClientRect() })"
    @click="emit('select', event)"
  >
    <span class="block truncate font-medium">{{ event.title }}</span>
    <span class="block truncate text-xs text-gray-600">{{ timeRange }}</span>
    <span v-if="event.description" class="block truncate text-xs text-gray-500">{{ event.description }}</span>
  </button>
</template>
