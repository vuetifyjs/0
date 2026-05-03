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

  // Context
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, onBeforeUnmount, toRef, useAttrs, useTemplateRef } from 'vue'

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
    /** Attributes to bind to each indicator element */
    attrs: {
      'role': 'tab'
      'tabindex': 0 | -1
      'aria-selected': boolean
      'aria-controls': string
      'aria-label': string
      'data-selected': true | undefined
      'data-active': true | undefined
      'onClick': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }

  export interface CarouselIndicatorSlotProps {
    /** Total number of slides */
    size: number
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

  function selectIndex (index: number) {
    const id = carousel.lookup(index)
    if (!isUndefined(id)) carousel.select(id)
  }

  function focusSelected () {
    nextTick(() => {
      const container = toElement(rootEl.value?.element) as HTMLElement | null
      container?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
    })
  }

  function onKeydown (index: number, e: KeyboardEvent) {
    const horizontal = carousel.orientation.value === 'horizontal'
    const size = carousel.size

    if (
      (horizontal && e.key === 'ArrowRight')
      || (!horizontal && e.key === 'ArrowDown')
    ) {
      e.preventDefault()
      const next = index + 1 < size ? index + 1 : (carousel.circular.value ? 0 : index)
      selectIndex(next)
      focusSelected()
      return
    }

    if (
      (horizontal && e.key === 'ArrowLeft')
      || (!horizontal && e.key === 'ArrowUp')
    ) {
      e.preventDefault()
      const prev = index - 1 >= 0 ? index - 1 : (carousel.circular.value ? size - 1 : index)
      selectIndex(prev)
      focusSelected()
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      carousel.first()
      focusSelected()
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      carousel.last()
      focusSelected()
      return
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectIndex(index)
    }
  }

  const slotProps = toRef((): CarouselIndicatorSlotProps => {
    const selected = carousel.selectedIndex.value
    const size = carousel.size
    const perView = carousel.perView.value

    const items: CarouselIndicatorItem[] = Array.from({ length: size }, (_, i) => {
      const isSelected = i === selected
      const isActive = i >= selected && i < selected + perView

      return {
        index: i,
        isSelected,
        isActive,
        attrs: {
          'role': 'tab',
          'tabindex': isSelected ? 0 : -1,
          'aria-selected': isSelected,
          'aria-controls': `${carousel.rootId}-slide-${i}`,
          'aria-label': locale.t('Carousel.indicator', { current: i + 1, size }),
          'data-selected': isSelected || undefined,
          'data-active': isActive || undefined,
          'onClick' () {
            selectIndex(i)
          },
          'onKeydown': (e: KeyboardEvent) => onKeydown(i, e),
        },
      }
    })

    return {
      size,
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
