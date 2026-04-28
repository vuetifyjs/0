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
  position: absolute;
  top: 0;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 100%;
  background: #ffffff;
  border: 1px solid rgb(var(--emerald-neutral-channels) / 0.1);
  border-radius: 8px;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-50%) scale(0.92) translateY(8px);
  transition:
    opacity 280ms cubic-bezier(0.4, 0.0, 0.2, 1),
    transform 280ms cubic-bezier(0.4, 0.0, 0.2, 1),
    box-shadow 280ms ease;
  pointer-events: none;
}

.emerald-carousel__item[data-selected] {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
  box-shadow:
    0 4px 10px 0 rgb(5 0 18 / 0.12),
    0 8px 24px 0 rgb(5 0 18 / 0.16);
  z-index: 1;
  pointer-events: auto;
}

.emerald-carousel__item[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
