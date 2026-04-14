/**
 * @module CarouselIndicator
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Dot indicator navigation for carousel slides. Renders one indicator
 * per registered slide with role="tablist" container semantics. Click
 * navigates to the slide, keyboard arrow keys navigate between dots.
 * Uses roving tabindex for keyboard navigation.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, useTemplateRef } from 'vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface CarouselIndicatorProps extends AtomProps {
    /** Accessible label for the indicator group */
    label?: string
    /** Namespace for connecting to parent Carousel.Root */
    namespace?: string
  }

  export interface CarouselIndicatorItem {
    /** Slide index (0-based) */
    index: number
    /** Whether this indicator's slide is selected */
    isSelected: boolean
    /** Whether this indicator's slide is in the visible window */
    isActive: boolean
    /** Navigate to this slide */
    select: () => void
    /** Attributes to bind to each indicator element */
    attrs: {
      'role': 'tab'
      'tabindex': 0 | -1
      'aria-selected': boolean
      'aria-label': string
      'data-selected': true | undefined
      'data-active': true | undefined
      'onClick': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }

  export interface CarouselIndicatorSlotProps {
    /** Total number of slides */
    total: number
    /** Currently selected slide index */
    selectedIndex: number
    /** Array of indicator items with per-dot state and attrs */
    items: CarouselIndicatorItem[]
    /** Attributes to bind to the indicator container */
    attrs: {
      'role': 'tablist'
      'aria-label': string
      'aria-orientation': 'horizontal' | 'vertical'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CarouselIndicator', inheritAttrs: false })

  const attrs = useAttrs()
  const rootEl = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: CarouselIndicatorSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    label,
    namespace = 'v0:carousel',
  } = defineProps<CarouselIndicatorProps>()

  const locale = useLocale()
  const carousel = useCarouselRoot(namespace)

  const el = toRef(() => toElement(rootEl.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.parts.register({ type: 'indicator', el })
  onBeforeUnmount(() => ticket.unregister())

  function onKeydown (index: number, e: KeyboardEvent) {
    const horizontal = carousel.orientation.value === 'horizontal'
    const total = carousel.size

    if (
      (horizontal && e.key === 'ArrowRight')
      || (!horizontal && e.key === 'ArrowDown')
    ) {
      e.preventDefault()
      const next = index + 1 < total ? index + 1 : (carousel.circular.value ? 0 : index)
      const id = carousel.lookup(next)
      if (!isUndefined(id)) carousel.select(id)
      return
    }

    if (
      (horizontal && e.key === 'ArrowLeft')
      || (!horizontal && e.key === 'ArrowUp')
    ) {
      e.preventDefault()
      const prev = index - 1 >= 0 ? index - 1 : (carousel.circular.value ? total - 1 : index)
      const id = carousel.lookup(prev)
      if (!isUndefined(id)) carousel.select(id)
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      carousel.first()
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      carousel.last()
    }
  }

  const slotProps = toRef((): CarouselIndicatorSlotProps => {
    const selected = carousel.selectedIndex.value
    const total = carousel.size
    const perView = carousel.perView.value

    const items: CarouselIndicatorItem[] = Array.from({ length: total }, (_, i) => {
      const isSelected = i === selected
      const isActive = i >= selected && i < selected + perView
      const id = carousel.lookup(i)

      return {
        index: i,
        isSelected,
        isActive,
        select () {
          if (!isUndefined(id)) carousel.select(id)
        },
        attrs: {
          'role': 'tab',
          'tabindex': isSelected ? 0 : -1,
          'aria-selected': isSelected,
          'aria-label': locale.t('Carousel.indicator', { current: i + 1, total }),
          'data-selected': isSelected || undefined,
          'data-active': isActive || undefined,
          'onClick' () {
            if (!isUndefined(id)) carousel.select(id)
          },
          'onKeydown': (e: KeyboardEvent) => onKeydown(i, e),
        },
      }
    })

    return {
      total,
      selectedIndex: selected,
      items,
      attrs: {
        'role': 'tablist',
        'aria-label': label ?? locale.t('Carousel.indicators'),
        'aria-orientation': carousel.orientation.value,
      },
    }
  })
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
