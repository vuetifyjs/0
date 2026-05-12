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
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  padding: 8px 20%;
  gap: 12px;
}

.emerald-carousel__viewport[data-orientation="vertical"] {
  grid-column: 1;
  grid-row: 2;
  padding: 20% 8px;
}

.emerald-carousel__viewport[data-dragging] {
  cursor: grabbing;
}
</style>
