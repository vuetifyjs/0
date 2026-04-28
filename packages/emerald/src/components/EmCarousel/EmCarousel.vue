<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { CarouselRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmCarouselProps extends V0PaperProps {
    label?: string
    disabled?: boolean
    circular?: boolean
    autoplay?: number
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmCarousel' })

  const {
    label,
    disabled = false,
    circular = false,
    autoplay = 0,
    ...paperProps
  } = defineProps<EmCarouselProps>()

  const model = defineModel<T>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-carousel"
    :data-disabled="disabled || undefined"
  >
    <CarouselRoot
      v-model="model"
      :autoplay
      :circular
      :disabled
      :label
      renderless
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </CarouselRoot>
  </V0Paper>
</template>

<style>
.emerald-carousel {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: minmax(280px, auto) auto;
  justify-items: center;
  align-items: center;
  gap: 14px 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: #000000;
}

.emerald-carousel[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
