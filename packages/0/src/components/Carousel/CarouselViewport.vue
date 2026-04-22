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
  import { useCarouselRoot, type CarouselTicket } from './CarouselRoot.vue'

  // Composables
  import { useDocumentEventListener, useEventListener } from '#v0/composables/useEventListener'
  import { useElementSize } from '#v0/composables/useResizeObserver'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, onScopeDispose, shallowRef, toRef, toValue, useAttrs, useTemplateRef, watch } from 'vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

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
      'data-orientation': 'horizontal' | 'vertical'
      'data-dragging': true | undefined
      'style': Record<string, string | number>
    }
  }
</script>

<script setup lang="ts">
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
  const isVertical = toRef(() => carousel.orientation.value === 'vertical')

  const isDragging = shallowRef(false)
  const syncing = shallowRef(false)
  const snapDisabled = shallowRef(false)

  const viewportId = `${carousel.rootId}-viewport`

  const el = toRef(() => toElement(viewportRef.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.parts.register({ type: 'viewport', el })
  onBeforeUnmount(() => ticket.unregister())

  const { width, height } = useElementSize(el)

  const slideStep = toRef(() => {
    if (!el.value) return 0
    if ((isVertical.value ? height.value : width.value) === 0) return 0

    const first = toValue((carousel.seek('first') as CarouselTicket | undefined)?.el) as HTMLElement | undefined
    const second = toValue((carousel.seek('first', 1) as CarouselTicket | undefined)?.el) as HTMLElement | undefined

    if (!first) return 0
    if (!second) return isVertical.value ? first.offsetHeight : first.offsetWidth
    return isVertical.value ? second.offsetTop - first.offsetTop : second.offsetLeft - first.offsetLeft
  })

  if (IN_BROWSER) {
    useEventListener(el, 'scrollend', () => {
      if (syncing.value || snapDisabled.value) {
        syncing.value = false
        return
      }

      const viewport = el.value
      if (!viewport || slideStep.value === 0) return

      isDragging.value = false

      const scrollPos = isVertical.value ? viewport.scrollTop : viewport.scrollLeft
      const snapIndex = Math.round(scrollPos / slideStep.value)
      const id = carousel.lookup(snapIndex)

      if (!isUndefined(id) && id !== carousel.selectedItem.value?.id) {
        carousel.select(id)
      }
    })

    useEventListener(el, 'scroll', () => {
      if (!syncing.value) {
        isDragging.value = true
      }
    })

    let lastWheel = 0

    useEventListener(el, 'wheel', (e: WheelEvent) => {
      if (e.shiftKey === isVertical.value) return
      const delta = e.deltaY || e.deltaX
      if (delta === 0) return

      e.preventDefault()

      const now = performance.now()
      if (now - lastWheel < 300) return
      lastWheel = now

      if (delta > 0) carousel.next()
      else carousel.prev()
    }, { passive: false })

    let dragStart = 0
    let scrollStart = 0

    useEventListener(el, 'mousedown', (e: MouseEvent) => {
      if (e.button !== 0) return
      const viewport = el.value
      if (!viewport) return

      carousel.pause()
      dragStart = isVertical.value ? e.clientY : e.clientX
      scrollStart = isVertical.value ? viewport.scrollTop : viewport.scrollLeft
      snapDisabled.value = true
    })

    useToggleScope(() => snapDisabled.value, () => {
      useDocumentEventListener('mousemove', (e: MouseEvent) => {
        const viewport = el.value
        if (!viewport) return
        e.preventDefault()

        const pos = isVertical.value ? e.clientY : e.clientX
        const delta = pos - dragStart

        if (isVertical.value) {
          viewport.scrollTop = scrollStart - delta
        } else {
          viewport.scrollLeft = scrollStart - delta
        }
      })

      useDocumentEventListener('mouseup', () => {
        const viewport = el.value
        carousel.resume()

        if (!viewport || slideStep.value === 0) {
          snapDisabled.value = false
          isDragging.value = false
          return
        }

        const scrollPos = isVertical.value ? viewport.scrollTop : viewport.scrollLeft
        const snapIndex = Math.round(scrollPos / slideStep.value)
        const position = snapIndex * slideStep.value

        syncing.value = true
        viewport.scrollTo({
          [isVertical.value ? 'top' : 'left']: position,
          behavior: carousel.behavior.value,
        })

        const id = carousel.lookup(snapIndex)
        if (!isUndefined(id) && id !== carousel.selectedItem.value?.id) {
          carousel.select(id)
        }

        snapDisabled.value = false
        isDragging.value = false
      })

      onScopeDispose(() => {
        carousel.resume()
        snapDisabled.value = false
        isDragging.value = false
      })
    })

    useEventListener(el, 'touchstart', () => carousel.pause(), { passive: true })
    useEventListener(el, 'touchend', () => carousel.resume(), { passive: true })
  }

  watch(() => carousel.selectedIndex.value, index => {
    const viewport = el.value
    if (!viewport || slideStep.value === 0) return

    syncing.value = true

    const position = index * slideStep.value

    viewport.scrollTo({
      [isVertical.value ? 'top' : 'left']: position,
      behavior: carousel.behavior.value,
    })
  })

  const viewportStyle = toRef(() => {
    const padding = carousel.padding.value

    return {
      'display': 'flex',
      'flex-direction': isVertical.value ? 'column' : 'row',
      [isVertical.value ? 'overflow-y' : 'overflow-x']: 'auto',
      [isVertical.value ? 'overflow-x' : 'overflow-y']: 'hidden',
      'scroll-snap-type': snapDisabled.value ? 'none' : `${isVertical.value ? 'y' : 'x'} mandatory`,
      'scrollbar-width': 'none',
      ...(padding
        ? {
          [isVertical.value ? 'padding-block' : 'padding-inline']: padding,
          [isVertical.value ? 'scroll-padding-block' : 'scroll-padding-inline']: padding,
        }
        : {}),
      ...(snapDisabled.value ? { 'user-select': 'none' } : {}),
    } as Record<string, string | number>
  })

  const slotProps = toRef((): CarouselViewportSlotProps => ({
    isDragging: isDragging.value,
    attrs: {
      'id': viewportId,
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
