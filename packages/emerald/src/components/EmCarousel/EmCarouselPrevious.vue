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
      <slot v-bind="slotProps">
        <svg
          class="emerald-carousel__caret"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m18 17-5-5 5-5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />

          <path
            d="m11 17-5-5 5-5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </slot>
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
  width: 40px;
  height: 40px;
  padding: var(--emerald-spacing-xs);
  background: transparent;
  border: 0;
  border-radius: var(--emerald-radius-s);
  color: var(--emerald-neutral-800);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, opacity 120ms ease;
}

.emerald-carousel__caret {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.emerald-carousel__previous:hover:not([data-disabled]) {
  background: rgb(var(--emerald-neutral-channels) / 0.06);
}

.emerald-carousel__previous:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-carousel__previous[data-disabled] {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
