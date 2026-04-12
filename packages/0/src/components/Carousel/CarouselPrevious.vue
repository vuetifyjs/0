/**
 * @module CarouselPrevious
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Navigation button that moves to the previous slide. Automatically
 * disables at the first slide in non-circular mode. Exposes data
 * attributes for styling disabled and boundary states.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface CarouselPreviousProps extends AtomProps {
    /** Namespace for connecting to parent Carousel.Root */
    namespace?: string
  }

  export interface CarouselPreviousSlotProps {
    /** Whether the button is disabled */
    isDisabled: boolean
    /** Whether the carousel is at the first slide (non-circular) */
    isAtEdge: boolean
    /** Attributes to bind to the button element */
    attrs: {
      'type': 'button' | undefined
      'aria-label': 'Previous slide'
      'aria-controls': string
      'disabled': boolean | undefined
      'data-disabled': true | undefined
      'data-edge': true | undefined
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'CarouselPrevious', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: CarouselPreviousSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:carousel',
  } = defineProps<CarouselPreviousProps>()

  const carousel = useCarouselRoot(namespace)

  const viewportId = `${carousel.rootId}-viewport`

  const isAtEdge = toRef(() => !carousel.circular.value && carousel.selectedIndex.value === 0)
  const isDisabled = toRef(() => toValue(carousel.disabled) || isAtEdge.value)

  function onClick () {
    if (!isDisabled.value) {
      carousel.prev()
    }
  }

  const slotProps = toRef((): CarouselPreviousSlotProps => ({
    isDisabled: isDisabled.value,
    isAtEdge: isAtEdge.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': 'Previous slide',
      'aria-controls': viewportId,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-edge': isAtEdge.value || undefined,
      'onClick': onClick,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
