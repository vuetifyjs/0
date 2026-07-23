<script lang="ts">
  // Framework
  import { CarouselIndicator } from '@vuetify/v0'

  export interface EmCarouselIndicatorProps {
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselIndicator' })

  const { label } = defineProps<EmCarouselIndicatorProps>()
</script>

<template>
  <CarouselIndicator
    class="emerald-carousel__indicators"
    :label
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CarouselIndicator>
</template>

<style>
.emerald-carousel__indicators {
  grid-column: 1 / -1;
  grid-row: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  margin: 0 auto;
}

.emerald-carousel__indicator {
  display: inline-block;
  height: 7px;
  width: 34px;
  padding: 0;
  border: 0;
  border-radius: var(--emerald-radius-full);
  background: var(--emerald-neutral-300);
  cursor: pointer;
  transition: background 180ms ease;
}

.emerald-carousel__indicator[data-selected] {
  background: var(--emerald-neutral-600);
}

.emerald-carousel__indicator:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-carousel__indicator[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
