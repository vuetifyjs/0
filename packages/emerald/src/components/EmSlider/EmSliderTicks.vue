<script lang="ts">
  // Framework
  import { useSliderRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface EmSliderTicksProps {
    /** Number of ticks to render (overrides step-derived count) */
    count?: number
    /** Step size when count is not provided (defaults to slider step) */
    step?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSliderTicks' })

  const { count, step } = defineProps<EmSliderTicksProps>()

  const root = useSliderRoot('v0:slider:root')

  const positions = toRef(() => {
    const min = root.min
    const max = root.max
    const range = max - min
    if (range <= 0) return []

    if (count != null) {
      if (count < 2) return [0]
      const stride = 100 / (count - 1)
      return Array.from({ length: count }, (_, index) => index * stride)
    }

    const usedStep = step ?? 1
    if (usedStep <= 0) return []
    const result: number[] = []
    for (let value = min; value <= max; value += usedStep) {
      result.push(((value - min) / range) * 100)
    }
    return result
  })
</script>

<template>
  <div
    aria-hidden="true"
    class="emerald-slider__ticks"
  >
    <span
      v-for="(percent, index) in positions"
      :key="index"
      class="emerald-slider__tick"
      :style="{ '--em-slider-tick': `${percent}%` }"
    />
  </div>
</template>

<style>
.emerald-slider__ticks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.emerald-slider__tick {
  position: absolute;
  top: 50%;
  left: var(--em-slider-tick);
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #ffffff;
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  transform: translate(-50%, -50%);
}

.emerald-slider__tick:first-child,
.emerald-slider__tick:last-child {
  display: none;
}

/* Ticks under the active range fill (TicksFill variant) tint to secondary-400 */
.emerald-slider__range ~ .emerald-slider__ticks .emerald-slider__tick[data-filled] {
  background: var(--emerald-secondary-400, #aebccb);
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__tick {
  top: var(--em-slider-tick);
  left: 50%;
}
</style>
