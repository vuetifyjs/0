<script lang="ts">
  // Framework
  import { CarouselNext } from '@vuetify/v0'

  export interface EmCarouselNextProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselNext' })
</script>

<template>
  <CarouselNext class="emerald-carousel__next">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CarouselNext>
</template>

<style>
.emerald-carousel__next {
  grid-column: 3;
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

.emerald-carousel__next:hover:not([aria-disabled="true"]) {
  background: rgb(var(--emerald-neutral-channels) / 0.06);
}

.emerald-carousel__next:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-carousel__next[aria-disabled="true"] {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
