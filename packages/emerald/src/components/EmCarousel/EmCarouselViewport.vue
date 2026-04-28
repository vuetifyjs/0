<script lang="ts">
  // Framework
  import { CarouselViewport } from '@vuetify/v0'

  export interface EmCarouselViewportProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselViewport' })
</script>

<template>
  <CarouselViewport class="emerald-carousel__viewport">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CarouselViewport>
</template>

<style>
.emerald-carousel__viewport {
  position: relative;
  grid-column: 2;
  grid-row: 1;
  justify-self: stretch;
  align-self: stretch;
  width: 100%;
  height: 100%;
  display: block;
  padding: 0;
  gap: 0;
  overflow: visible;
}

.emerald-carousel__viewport[data-orientation="vertical"] {
  grid-column: 1;
  grid-row: 2;
}
</style>
