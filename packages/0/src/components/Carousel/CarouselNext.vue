/**
 * @module CarouselNext
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Navigation button that moves to the next slide. Automatically
 * disables at the last visible boundary in non-circular mode.
 * Exposes data attributes for styling disabled and boundary states.
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

  export interface CarouselNextProps extends AtomProps {
    /** Namespace for connecting to parent Carousel.Root */
    namespace?: string
  }

  export interface CarouselNextSlotProps {
    /** Whether the button is disabled */
    isDisabled: boolean
    /** Whether the carousel is at the last slide (non-circular) */
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
  defineOptions({ name: 'CarouselNext', inheritAttrs: false })

  const attrs = useAttrs()
  const rootEl = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: CarouselNextSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:carousel',
  } = defineProps<CarouselNextProps>()

  const locale = useLocale()
  const carousel = useCarouselRoot(namespace)

  const el = toRef(() => toElement(rootEl.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.parts.register({ type: 'next', el })
  onBeforeUnmount(() => ticket.unregister())

  const viewportId = `${carousel.rootId}-viewport`

  const isAtEdge = toRef(() => {
    if (carousel.circular.value) return false
    return carousel.selectedIndex.value >= carousel.size - carousel.perView.value
  })

  const isDisabled = toRef(() => toValue(carousel.disabled) || isAtEdge.value)

  function onClick () {
    if (!isDisabled.value) {
      carousel.next()
    }
  }

  const slotProps = toRef((): CarouselNextSlotProps => ({
    isDisabled: isDisabled.value,
    isAtEdge: isAtEdge.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': locale.t('Carousel.next'),
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
