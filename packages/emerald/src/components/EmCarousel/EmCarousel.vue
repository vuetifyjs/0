<script lang="ts">
  // Framework
  import { Atom, CarouselRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmCarouselOrientation = 'horizontal' | 'vertical'

  export interface EmCarouselProps extends AtomProps {
    label?: string
    disabled?: boolean
    circular?: boolean
    orientation?: EmCarouselOrientation
    perView?: number
    autoplay?: number
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmCarousel' })

  const model = defineModel<T>()

  const {
    label,
    disabled = false,
    circular = false,
    orientation = 'horizontal',
    perView = 1,
    autoplay = 0,
    as = 'div',
    renderless = false,
  } = defineProps<EmCarouselProps>()
</script>

<template>
  <Atom
    :as
    class="emerald-carousel"
    :data-disabled="disabled || undefined"
    :data-orientation="orientation"
    :renderless
  >
    <CarouselRoot
      v-model="model"
      :autoplay
      :circular
      :disabled
      :label
      :orientation
      :per-view
      renderless
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </CarouselRoot>
  </Atom>
</template>

<style>
.emerald-carousel {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 14px 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: #000000;
}

.emerald-carousel[data-orientation="vertical"] {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto;
}

.emerald-carousel[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
