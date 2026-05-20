<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmProgressCircularProps extends AtomProps {
    value?: number
    min?: number
    max?: number
    size?: number
    strokeWidth?: number
    indeterminate?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmProgressCircular' })

  const {
    value = 0,
    min = 0,
    max = 100,
    size = 40,
    strokeWidth = 4,
    indeterminate = false,
    ...paperProps
  } = defineProps<EmProgressCircularProps>()

  const percent = toRef(() => {
    const span = max - min
    if (span <= 0) return 0
    return Math.min(100, Math.max(0, ((value - min) / span) * 100))
  })

  const radius = toRef(() => (size - strokeWidth) / 2)
  const circumference = toRef(() => 2 * Math.PI * radius.value)
  const offset = toRef(() => circumference.value - (percent.value / 100) * circumference.value)
  const center = toRef(() => size / 2)
</script>

<template>
  <Atom
    v-bind="paperProps"
    :aria-valuemax="max"
    :aria-valuemin="min"
    :aria-valuenow="indeterminate ? undefined : value"
    as="div"
    class="emerald-progress-circular"
    :data-indeterminate="indeterminate || undefined"
    role="progressbar"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      class="emerald-progress-circular__svg"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
    >
      <circle
        class="emerald-progress-circular__track"
        :cx="center"
        :cy="center"
        fill="none"
        :r="radius"
        :stroke-width
      />

      <circle
        class="emerald-progress-circular__fill"
        :cx="center"
        :cy="center"
        fill="none"
        :r="radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="indeterminate ? circumference * 0.75 : offset"
        stroke-linecap="round"
        :stroke-width
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>

    <span v-if="$slots.default" class="emerald-progress-circular__label">
      <slot :percent :value />
    </span>
  </Atom>
</template>

<style>
.emerald-progress-circular {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
}

.emerald-progress-circular__svg {
  display: block;
  overflow: visible;
}

.emerald-progress-circular__track {
  stroke: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.12);
}

.emerald-progress-circular__fill {
  stroke: var(--emerald-primary-500, #7c5cf6);
  transition: stroke-dashoffset 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.emerald-progress-circular[data-indeterminate] .emerald-progress-circular__svg {
  animation: emerald-progress-circular-rotate 1s linear infinite;
}

.emerald-progress-circular[data-indeterminate] .emerald-progress-circular__fill {
  transition: none;
}

.emerald-progress-circular__label {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--emerald-primary-950, #221065);
}

@keyframes emerald-progress-circular-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
