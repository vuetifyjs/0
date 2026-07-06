<script lang="ts">
  // Framework
  import { CarouselItem } from '@vuetify/v0'

  export type EmCarouselItemSize = 'l' | 'm' | 's'

  export interface EmCarouselItemProps {
    id?: string
    value?: unknown
    disabled?: boolean
    size?: EmCarouselItemSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselItem' })

  const { id, value, disabled = false, size } = defineProps<EmCarouselItemProps>()
</script>

<template>
  <CarouselItem
    :id
    class="emerald-carousel__item"
    :data-size="size"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CarouselItem>
</template>

<style>
.emerald-carousel__item {
  flex: 0 0 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--emerald-spacing-m);
  min-width: 0;
  scroll-snap-align: center;
  background: var(--emerald-neutral-100);
  border: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-radius: var(--emerald-radius-m);
  overflow: hidden;
  transition:
    box-shadow 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    transform 220ms cubic-bezier(0.4, 0.0, 0.2, 1);
  transform: scale(0.94);
  box-shadow: var(--emerald-shadow-m);
}

.emerald-carousel__item[data-selected] {
  transform: scale(1);
  z-index: 1;
}

.emerald-carousel__item[data-size] {
  transform: none;
}

.emerald-carousel__item[data-size="l"] {
  flex: 0 0 262px;
  height: 300px;
}

.emerald-carousel__item[data-size="m"] {
  flex: 0 0 245px;
  height: 280px;
}

.emerald-carousel__item[data-size="s"] {
  flex: 0 0 218px;
  height: 250px;
}

.emerald-carousel__item[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
