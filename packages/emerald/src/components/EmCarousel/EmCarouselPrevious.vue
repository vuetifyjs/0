<script lang="ts">
  // Framework
  import { CarouselPrevious } from '@vuetify/v0'

  export interface EmCarouselPreviousProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselPrevious' })
</script>

<template>
  <CarouselPrevious class="emerald-carousel__previous">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CarouselPrevious>
</template>

<style>
.emerald-carousel__previous {
  grid-column: 1;
  grid-row: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--emerald-neutral-800);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, opacity 120ms ease;
}

.emerald-carousel__previous:hover:not([aria-disabled="true"]) {
  background: rgb(var(--emerald-neutral-channels) / 0.06);
}

.emerald-carousel__previous:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-carousel__previous[aria-disabled="true"] {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
