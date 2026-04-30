<script lang="ts">
  // Framework
  import { CarouselItem } from '@vuetify/v0'

  export interface EmCarouselItemProps {
    id?: string
    value?: unknown
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselItem' })

  const { id, value, disabled = false } = defineProps<EmCarouselItemProps>()
</script>

<template>
  <CarouselItem
    :id
    class="emerald-carousel__item"
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
  padding: 0 8px;
  min-width: 0;
  scroll-snap-align: center;
  background: #ffffff;
  border: 1px solid rgb(var(--emerald-neutral-channels) / 0.1);
  border-radius: 8px;
  overflow: hidden;
  filter: blur(1px);
  transition:
    filter 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    box-shadow 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    transform 220ms cubic-bezier(0.4, 0.0, 0.2, 1);
  transform: scale(0.94);
  box-shadow: none;
}

.emerald-carousel__item[data-selected] {
  filter: none;
  transform: scale(1);
  box-shadow:
    0 1px 3px 0 rgb(5 0 18 / 0.12),
    0 1px 5px 0 rgb(5 0 18 / 0.20);
  z-index: 1;
}

.emerald-carousel__item[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
