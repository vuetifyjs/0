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
  border-radius: var(--emerald-radius-full, 999px);
  background: var(--emerald-secondary-600, #00b4dc);
  box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
}

/* Stepped variant: the fill bar gains a border (spec: 1px rgba(26,28,30,0.1)) */
.emerald-slider__track:has(.emerald-slider__points) .emerald-slider__range {
  /* TODO(token): spec border rgba(26,28,30,0.1) has no --emerald-* equivalent (closest: neutral alpha-10) */
  border: 1px solid rgba(26, 28, 30, 0.1);
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
