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
  position: absolute;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow:
    0 1px 3px 0 rgba(5, 0, 18, 0.12),
    0 1px 5px 0 rgba(5, 0, 18, 0.2);
  cursor: grab;
  transform: translate(-50%, -50%);
  top: 50%;
  z-index: 1;
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__thumb {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.emerald-slider__thumb:focus-visible {
  outline: 2px solid var(--emerald-primary-500, #3b82f6);
  outline-offset: 2px;
}

.emerald-slider__thumb[data-state="dragging"] {
  cursor: grabbing;
}

.emerald-slider__thumb[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
