/**
 * @module CarouselViewport
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Scroll-snap container for carousel slides. Handles native scroll-based
 * drag/swipe and synchronizes scroll position with the step selection state.
 * Provides structural inline styles for scroll-snap behavior and exposes
 * data attributes for styling.
 */

<script lang="ts">
  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Components
  import { Atom } from '#v0/components/Atom'
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Composables
  import { useEventListener } from '#v0/composables/useEventListener'
  import { useElementSize } from '#v0/composables/useResizeObserver'

  // Utilities
  import { isUndefined } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface CarouselViewportProps extends AtomProps {
    /** Namespace for connecting to parent Carousel.Root */
    namespace?: string
  }

  export interface CarouselViewportSlotProps {
    /** Whether the user is currently dragging/scrolling */
    isDragging: boolean
    /** Attributes to bind to the viewport element */
    attrs: {
      'id': string
      'aria-live': 'polite'
      'data-orientation': 'horizontal' | 'vertical'
      'data-dragging': true | undefined
      'style': Record<string, string | number>
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { mergeProps, onScopeDispose, shallowRef, toRef, useAttrs, useTemplateRef, watch, watchEffect } from 'vue'

  defineOptions({ name: 'CarouselViewport', inheritAttrs: false })

  const attrs = useAttrs()
  const viewportRef = useTemplateRef<AtomExpose>('viewport')

  defineSlots<{
    default: (props: CarouselViewportSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:carousel',
  } = defineProps<CarouselViewportProps>()

  const carousel = useCarouselRoot(namespace)

  const isDragging = shallowRef(false)
  const syncing = shallowRef(false)
  const snapDisabled = shallowRef(false)

  const viewportId = `${carousel.rootId}-viewport`

  // Vue auto-unwraps exposed refs when accessed via template ref,
  // but TypeScript doesn't reflect this - cast corrects the type
  const el = toRef(() => (viewportRef.value?.element as HTMLElement | null | undefined) ?? null)

  // Register viewport element with root context
  watchEffect(() => {
    carousel.viewportEl.value = el.value
  })

  const { width } = useElementSize(el)

  // Compute the width of a single slide step (slide width + gap)
  const slideStep = toRef(() => {
    if (width.value === 0) return 0
    const pv = carousel.perView.value
    const g = carousel.gap.value
    const p = carousel.peek.value
    const slideWidth = (width.value - (pv - 1) * g - 2 * p) / pv
    return slideWidth + g
  })

  // Scroll → Selection sync: when user scrolls (drag/swipe), update step selection
  if (IN_BROWSER) {
    useEventListener(el, 'scrollend', () => {
      if (syncing.value || snapDisabled.value) {
        syncing.value = false
        return
      }

      const viewport = el.value
      if (!viewport || slideStep.value === 0) return

      isDragging.value = false

      const isVertical = carousel.orientation.value === 'vertical'
      const scrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft
      const snapIndex = Math.round(scrollPos / slideStep.value)
      const id = carousel.lookup(snapIndex)

      if (!isUndefined(id) && id !== carousel.selectedItem.value?.id) {
        carousel.select(id)
      }
    })

    // Track dragging state
    useEventListener(el, 'scroll', () => {
      if (!syncing.value) {
        isDragging.value = true
      }
    })

    // Mouse drag support
    let dragStart = 0
    let scrollStart = 0

    function onMouseMove (e: MouseEvent) {
      const viewport = el.value
      if (!viewport) return
      e.preventDefault()

      const isVertical = carousel.orientation.value === 'vertical'
      const pos = isVertical ? e.clientY : e.clientX
      const delta = pos - dragStart

      if (isVertical) {
        viewport.scrollTop = scrollStart - delta
      } else {
        viewport.scrollLeft = scrollStart - delta
      }
    }

    function onMouseUp () {
      const viewport = el.value
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      carousel.resume()

      if (!viewport || slideStep.value === 0) {
        snapDisabled.value = false
        isDragging.value = false
        return
      }

      const isVertical = carousel.orientation.value === 'vertical'
      const scrollPos = isVertical ? viewport.scrollTop : viewport.scrollLeft
      const snapIndex = Math.round(scrollPos / slideStep.value)
      const position = snapIndex * slideStep.value

      syncing.value = true
      viewport.scrollTo({
        [isVertical ? 'top' : 'left']: position,
        behavior: 'smooth',
      })

      const id = carousel.lookup(snapIndex)
      if (!isUndefined(id) && id !== carousel.selectedItem.value?.id) {
        carousel.select(id)
      }

      snapDisabled.value = false
      isDragging.value = false
    }

    useEventListener(el, 'mousedown', (e: MouseEvent) => {
      if (e.button !== 0) return
      const viewport = el.value
      if (!viewport) return

      carousel.pause()
      const isVertical = carousel.orientation.value === 'vertical'
      dragStart = isVertical ? e.clientY : e.clientX
      scrollStart = isVertical ? viewport.scrollTop : viewport.scrollLeft
      snapDisabled.value = true

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })

    onScopeDispose(() => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })

    // Pause autoplay during touch interaction
    useEventListener(el, 'touchstart', () => carousel.pause(), { passive: true })
    useEventListener(el, 'touchend', () => carousel.resume(), { passive: true })
  }

  // Selection → Scroll sync: when step changes programmatically, scroll to slide
  watch(() => carousel.selectedIndex.value, index => {
    const viewport = el.value
    if (!viewport || slideStep.value === 0) return

    syncing.value = true

    const isVertical = carousel.orientation.value === 'vertical'
    const position = index * slideStep.value

    viewport.scrollTo({
      [isVertical ? 'top' : 'left']: position,
      behavior: 'smooth',
    })
  })

  const viewportStyle = toRef(() => {
    const isVertical = carousel.orientation.value === 'vertical'
    const g = carousel.gap.value
    const p = carousel.peek.value

    return {
      'display': 'flex',
      'flex-direction': isVertical ? 'column' : 'row',
      [isVertical ? 'overflow-y' : 'overflow-x']: 'auto',
      [isVertical ? 'overflow-x' : 'overflow-y']: 'hidden',
      'scroll-snap-type': snapDisabled.value ? 'none' : `${isVertical ? 'y' : 'x'} mandatory`,
      'scrollbar-width': 'none',
      'cursor': snapDisabled.value ? 'grabbing' : 'grab',
      ...(snapDisabled.value ? { 'user-select': 'none' } : {}),
      ...(g > 0 ? { gap: `${g}px` } : {}),
      ...(p > 0 ? { [isVertical ? 'padding-block' : 'padding-inline']: `${p}px` } : {}),
    } as Record<string, string | number>
  })

  const slotProps = toRef((): CarouselViewportSlotProps => ({
    isDragging: isDragging.value,
    attrs: {
      'id': viewportId,
      'aria-live': 'polite',
      'data-orientation': carousel.orientation.value,
      'data-dragging': isDragging.value || undefined,
      'style': viewportStyle.value,
    },
  }))
</script>

<template>
  <Atom
    ref="viewport"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
