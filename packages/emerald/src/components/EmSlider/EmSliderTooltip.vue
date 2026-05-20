<script lang="ts">
  // Framework
  import { useSliderRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface EmSliderTooltipProps {
    /** Override the displayed value */
    value?: number | string
    /** Thumb index when reading value from the slider context */
    index?: number
    /** Always show the tooltip even when not dragging */
    always?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSliderTooltip' })

  const {
    value,
    index = 0,
    always = false,
  } = defineProps<EmSliderTooltipProps>()

  const root = useSliderRoot('v0:slider:root')

  const display = toRef(() => value ?? root.values.value[index] ?? root.min)
  const isVisible = toRef(() => always || root.dragging.value === index)
</script>

<template>
  <span
    v-show="isVisible"
    class="emerald-slider__tooltip"
    role="tooltip"
  >
    <slot :value="display">{{ display }}</slot>
  </span>
</template>

<style>
.emerald-slider__tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: var(--emerald-neutral-900, #1a1c1e);
  color: var(--emerald-neutral-50, #ffffff);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.emerald-slider__tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--emerald-neutral-900, #1a1c1e);
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__tooltip {
  bottom: 50%;
  left: auto;
  right: calc(100% + 8px);
  transform: translateY(50%);
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__tooltip::after {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-left-color: var(--emerald-neutral-900, #1a1c1e);
  border-top-color: transparent;
}
</style>
