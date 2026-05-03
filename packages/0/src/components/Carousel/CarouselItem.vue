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
      'id': string
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
  defineOptions({ name: 'CarouselItem', inheritAttrs: false })

  const attrs = useAttrs()
  const rootEl = useTemplateRef<AtomExpose>('root')

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

  const locale = useLocale()
  const carousel = useCarouselRoot(namespace)
  const el = toRef(() => toElement(rootEl.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.register({ id, value, disabled, el })

  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(carousel.disabled))

  onBeforeUnmount(() => {
    ticket.unregister()
  })

  const isActive = toRef(() => {
    const selected = carousel.selectedIndex.value
    const perView = carousel.perView.value
    const index = ticket.index
    return index >= selected && index < selected + perView
  })

  const slideStyle = {
    'scroll-snap-align': 'start' as const,
  }

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
      'id': `${carousel.rootId}-slide-${ticket.index}`,
      'role': 'group',
      'aria-roledescription': 'slide',
      'aria-label': locale.t('Carousel.slide', { current: ticket.index + 1, size: carousel.size }),
      'aria-hidden': isActive.value ? undefined : true,
      'data-selected': toValue(ticket.isSelected) || undefined,
      'data-active': isActive.value || undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-index': ticket.index,
      'style': slideStyle,
    },
  }))
</script>

<template>
  <Atom
    ref="root"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
