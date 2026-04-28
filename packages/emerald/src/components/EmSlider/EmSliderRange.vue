<script lang="ts">
  // Framework
  import { SliderRange } from '@vuetify/v0'

  export interface EmSliderRangeProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSliderRange' })
</script>

<template>
  <SliderRange class="emerald-slider__range">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SliderRange>
</template>

<style>
.emerald-slider__range {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: var(--emerald-primary-500, #7c5cf6);
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__range {
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
}

.emerald-slider__range[data-disabled] {
  opacity: 0.6;
}
</style>
