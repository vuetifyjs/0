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

  // Context
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

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
      'aria-label': string
      'aria-controls': string
      'aria-disabled': boolean
      'disabled': boolean | undefined
      'data-disabled': true | undefined
      'data-edge': true | undefined
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CarouselPrevious', inheritAttrs: false })

  const attrs = useAttrs()
  const rootEl = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: CarouselPreviousSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:carousel',
  } = defineProps<CarouselPreviousProps>()

  const locale = useLocale()
  const carousel = useCarouselRoot(namespace)

  const el = toRef(() => toElement(rootEl.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.parts.register({ type: 'previous', el })
  onBeforeUnmount(() => ticket.unregister())

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
      'aria-label': locale.t('Carousel.prev'),
      'aria-controls': viewportId,
      'aria-disabled': isDisabled.value,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-edge': isAtEdge.value || undefined,
      'onClick': onClick,
    },
  }))
</script>

<template>
  <Atom
    ref="root"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
