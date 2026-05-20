<script lang="ts">
  // Framework
  import { SliderThumb } from '@vuetify/v0'

  export interface EmSliderThumbProps {
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSliderThumb' })

  const { ariaLabel } = defineProps<EmSliderThumbProps>()
</script>

<template>
  <SliderThumb :aria-label class="emerald-slider__thumb">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SliderThumb>
</template>

<style>
.emerald-slider__thumb {
  --v0-slider-thumb-size: 8px;
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow:
    0 1px 3px 0 rgba(5, 0, 18, 0.12),
    0 1px 5px 0 rgba(5, 0, 18, 0.2);
  cursor: grab;
  transform: translate(-50%, -50%);
  z-index: 1;
  transition: width 120ms ease, height 120ms ease, background-color 120ms ease, border 120ms ease;
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__thumb {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.emerald-slider__thumb:hover {
  background: var(--emerald-secondary-50, #f4f7f9);
}

.emerald-slider__thumb:focus-visible {
  outline: 2px solid var(--emerald-primary-500, #7C5CF6);
  outline-offset: 2px;
}

.emerald-slider__thumb[data-state="dragging"],
.emerald-slider__thumb:active {
  --v0-slider-thumb-size: 10px;
  cursor: grabbing;
  width: 10px;
  height: 10px;
  background: var(--emerald-secondary-200, #dce4e9);
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  box-shadow: none;
}

.emerald-slider__thumb[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
