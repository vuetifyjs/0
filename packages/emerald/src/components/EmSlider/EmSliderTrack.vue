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
  border-radius: var(--emerald-radius-full, 999px);
  background: var(--emerald-neutral-200, #ebf0f4);
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
