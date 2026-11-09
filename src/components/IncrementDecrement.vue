<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true }, // duration in minutes
  startMin: { type: Number, required: true }, // start of the event, minutes since midnight
})
const emit = defineEmits(['update:modelValue'])

const MIN_DURATION = 15
const NEG_STEPS = [-15, -30, -60] // minutes
const POS_STEPS = [15,30,60]

const stepLabel = (m) => `${m < 0 ? '−' : '+'}${Math.abs(m) === 60 ? '1h' : `${Math.abs(m)}m`}`
const fmt = (mins) => {
  const d = new Date()
  d.setHours(0, mins, 0, 0)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

// the event can't run past midnight
const maxDuration = computed(() => 24 * 60 - props.startMin)

function adjust(delta) {
  emit('update:modelValue', Math.min(Math.max(props.modelValue + delta, MIN_DURATION), maxDuration.value))
}
watch(maxDuration, (max) => {
  if (props.modelValue > max) emit('update:modelValue', max)
})

const durationLabel = computed(() => {
  const h = Math.floor(props.modelValue / 60)
  const m = props.modelValue % 60
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(' ')
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-baseline justify-between">
      <span>Duration</span>
      <span class="text-xs text-gray-500">
        {{ fmt(startMin) }} – {{ fmt(startMin + modelValue) }} · {{ durationLabel }}
      </span>
    </div>
    <div class="flex gap-1">
      <button
        v-for="step in NEG_STEPS"
        :key="step"
        type="button"
        class="flex-1 rounded border px-2 py-1 disabled:opacity-40 bg-red-300 hover:bg-red-400"
        :disabled="modelValue + step < MIN_DURATION"
        @click="adjust(step)"
      >
        {{ stepLabel(step) }}
      </button>
    </div>
    <div class="flex gap-1">
      <button
        v-for="step in POS_STEPS"
        :key="step"
        type="button"
        class="flex-1 rounded border px-2 py-1 disabled:opacity-40 bg-green-300 hover:bg-green-400"
        :disabled="modelValue + step > maxDuration"
        @click="adjust(step)"
      >
        {{ stepLabel(step) }}
      </button>
    </div>
  </div>
</template>
