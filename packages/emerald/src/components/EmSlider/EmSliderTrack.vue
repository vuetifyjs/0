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
  height: 12px;
  width: 100%;
  overflow: hidden;
  border-radius: 999px;
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: var(--emerald-secondary-50, #f4f7f9);
  cursor: pointer;
}

.emerald-slider[data-orientation="vertical"] .emerald-slider__track {
  width: 12px;
  height: 100%;
}

.emerald-slider__track[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
