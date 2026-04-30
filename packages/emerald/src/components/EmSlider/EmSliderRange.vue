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
  top: -0.5px;
  bottom: -0.5px;
  border-radius: 999px;
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: var(--emerald-secondary-200, #dce4e9);
  box-shadow: 0 1px 2px 0 rgba(5, 0, 18, 0.05);
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__range {
  top: auto;
  bottom: 0;
  left: -0.5px;
  right: -0.5px;
  height: auto;
}

.emerald-slider__range[data-disabled] {
  opacity: 0.6;
}
</style>
