<script lang="ts">
  // Framework
  import { range, useSliderRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface EmSliderPointsProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSliderPoints' })

  const slider = useSliderRoot('v0:slider:root')

  const points = toRef(() => {
    if (slider.step <= 0) return []

    const count = Math.floor((slider.max - slider.min) / slider.step) + 1

    if (!Number.isFinite(count) || count < 2) return []

    return range(count).map(index => slider.min + index * slider.step)
  })

  function filled (point: number): boolean {
    const values = slider.values.value

    if (values.length === 0) return false

    const upper = Math.max(...values)
    const lower = values.length > 1 ? Math.min(...values) : slider.min

    return point >= lower && point <= upper
  }
</script>

<template>
  <div aria-hidden="true" class="emerald-slider__points">
    <span
      v-for="point in points"
      :key="point"
      class="emerald-slider__point"
      :data-filled="filled(point) || undefined"
    />
  </div>
</template>

<style>
.emerald-slider__points {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--emerald-spacing-xs, 8px);
  pointer-events: none;
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__points {
  flex-direction: column-reverse;
  padding-inline: 0;
  padding-block: var(--emerald-spacing-xs, 8px);
}

.emerald-slider__point {
  width: 4px;
  height: 4px;
  border-radius: var(--emerald-radius-full, 999px);
  background: var(--emerald-neutral-100, #fefefe);
  border: 0.5px solid var(--emerald-divider, #ccd6e7);
}

.emerald-slider__point[data-filled] {
  background: var(--emerald-secondary, #00809d);
  border-color: var(--emerald-secondary-800, #006982);
}
</style>
