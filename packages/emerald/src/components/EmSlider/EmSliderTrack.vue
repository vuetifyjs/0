<script lang="ts">
  // Framework
  import { SliderTrack } from '@vuetify/v0'

  export interface EmSliderTrackProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSliderTrack' })
</script>

<template>
  <SliderTrack class="emerald-slider__track">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SliderTrack>
</template>

<style>
.emerald-slider__track {
  position: relative;
  flex: 1 1 auto;
  height: 6px;
  width: 100%;
  overflow: visible;
  border-radius: 999px;
  background: var(--emerald-secondary-100, #ecf0f3);
  cursor: pointer;
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__track {
  width: 6px;
  height: 100%;
}

.emerald-slider__track[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
