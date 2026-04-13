/**
 * @module CarouselItem
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Individual slide that registers with the parent CarouselRoot.
 * Provides selection state, visibility, and ARIA attributes via
 * scoped slot. Automatically sizes based on perView, gap, and peek.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter } from 'vue'

  export interface CarouselItemProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Value associated with this slide */
    value?: V
    /** Disables this specific slide */
    disabled?: MaybeRefOrGetter<boolean>
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface CarouselItemSlotProps {
    /** Unique identifier */
    id: string
    /** Whether this slide is the selected (anchor) slide */
    isSelected: boolean
    /** Whether this slide is in the visible window */
    isActive: boolean
    /** Whether this slide is disabled */
    isDisabled: boolean
    /** Slide index in the carousel */
    index: number
    /** Select this slide */
    select: () => void
    /** Unselect this slide */
    unselect: () => void
    /** Toggle this slide's selection state */
    toggle: () => void
    /** Attributes to bind to the slide element */
    attrs: {
      'role': 'group'
      'aria-roledescription': 'slide'
      'aria-label': string
      'aria-hidden': true | undefined
      'data-selected': true | undefined
      'data-active': true | undefined
      'data-disabled': true | undefined
      'data-index': number
      'style': Record<string, string>
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  // Utilities
  import { mergeProps, onUnmounted, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'CarouselItem', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: CarouselItemSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:carousel',
  } = defineProps<CarouselItemProps<V>>()

  const carousel = useCarouselRoot(namespace)
  const ticket = carousel.register({ id, value, disabled })

  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(carousel.disabled))

  onUnmounted(() => {
    carousel.unregister(ticket.id)
  })

  const isActive = toRef(() => {
    const selectedIdx = carousel.selectedIndex.value
    const pv = carousel.perView.value
    const idx = ticket.index
    return idx >= selectedIdx && idx < selectedIdx + pv
  })

  const slideStyle = toRef(() => {
    const pv = carousel.perView.value
    const g = carousel.gap.value
    const p = carousel.peek.value
    // Each slide width accounts for gaps between visible slides and peek on both sides
    const gapTotal = (pv - 1) * g
    const peekTotal = 2 * p
    return {
      'scroll-snap-align': 'start',
      'flex': `0 0 calc((100% - ${gapTotal}px - ${peekTotal}px) / ${pv})`,
    }
  })

  const slotProps = toRef((): CarouselItemSlotProps => ({
    id: String(ticket.id),
    isSelected: toValue(ticket.isSelected),
    isActive: isActive.value,
    isDisabled: isDisabled.value,
    index: ticket.index,
    select: ticket.select,
    unselect: ticket.unselect,
    toggle: ticket.toggle,
    attrs: {
      'role': 'group',
      'aria-roledescription': 'slide',
      'aria-label': `${ticket.index + 1} of ${carousel.size}`,
      'aria-hidden': isActive.value ? undefined : true,
      'data-selected': toValue(ticket.isSelected) || undefined,
      'data-active': isActive.value || undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-index': ticket.index,
      'style': slideStyle.value,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
