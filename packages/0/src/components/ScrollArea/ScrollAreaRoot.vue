/**
 * @module ScrollAreaRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/scroll-area
 *
 * @remarks
 * Root of a custom-scrollbar region. Keeps native scrolling, measures the
 * viewport and its content, and decides when each ScrollAreaScrollbar is
 * visible based on the `visibility` mode, hover, scroll activity and overflow.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { useTimer } from '#v0/composables/useTimer'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { clamp, isNull } from '#v0/utilities'
  import { mergeProps, shallowRef, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistryContext, RegistryTicketInput } from '#v0/composables/createRegistry'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  export type ScrollAreaVisibility = 'auto' | 'always' | 'scroll' | 'hover'

  export type ScrollAreaOrientation = 'horizontal' | 'vertical'

  export interface ScrollAreaAxis {
    /** Visible length of the viewport along the axis, in px. */
    viewport: number
    /** Full scrollable length of the content along the axis, in px. */
    content: number
    /** Distance scrolled from the start edge, in px. Always positive, also in RTL. */
    offset: number
  }

  export type ScrollAreaMetrics = Record<ScrollAreaOrientation, ScrollAreaAxis>

  export interface ScrollAreaPartTicket extends RegistryTicketInput {
    type: 'viewport' | 'scrollbar'
    orientation?: ScrollAreaOrientation
    el: MaybeRefOrGetter<Element | null>
  }

  export interface ScrollAreaContext {
    visibility: Readonly<Ref<ScrollAreaVisibility>>
    parts: RegistryContext<ScrollAreaPartTicket>
    viewportEl: Readonly<Ref<Element | null>>
    metrics: Readonly<Ref<ScrollAreaMetrics>>
    thickness: Readonly<Ref<Record<ScrollAreaOrientation, number>>>
    isRtl: Readonly<Ref<boolean>>
    isHovering: Readonly<Ref<boolean>>
    isScrolling: Readonly<Ref<boolean>>
    dragging: Readonly<Ref<ScrollAreaOrientation | null>>
    hasScrollbar: (orientation: ScrollAreaOrientation) => boolean
    isOverflowing: (orientation: ScrollAreaOrientation) => boolean
    isVisible: (orientation: ScrollAreaOrientation) => boolean
    update: () => void
    onScroll: () => void
    measure: (orientation: ScrollAreaOrientation, size: number) => void
    scrollTo: (orientation: ScrollAreaOrientation, offset: number) => void
    onStartDrag: (orientation: ScrollAreaOrientation) => void
    onEndDrag: () => void
  }

  export interface ScrollAreaRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /**
     * When the scrollbars are shown:
     * - `hover` — while the pointer is over the area or it is scrolling
     * - `scroll` — only while scrolling
     * - `auto` — whenever the content overflows
     * - `always` — always, even without overflow
     *
     * @default 'hover'
     */
    visibility?: ScrollAreaVisibility
    /**
     * Milliseconds to wait before hiding the scrollbars in `hover` and `scroll` modes.
     *
     * @default 600
     */
    delay?: number
  }

  export interface ScrollAreaRootExpose {
    scrollTo: (orientation: ScrollAreaOrientation, offset: number) => void
    isScrolling: Readonly<Ref<boolean>>
  }

  export interface ScrollAreaRootSlotProps {
    /** Whether the pointer is over the area (stays true for `delay` ms after leaving). */
    isHovering: boolean
    /** Whether the viewport is being scrolled (stays true for `delay` ms after the last scroll). */
    isScrolling: boolean
    /** Whether the content overflows horizontally. */
    isOverflowX: boolean
    /** Whether the content overflows vertically. */
    isOverflowY: boolean
    /** Scrolls the viewport to an offset from the start edge along an axis. */
    scrollTo: (orientation: ScrollAreaOrientation, offset: number) => void
    attrs: {
      'data-visibility': ScrollAreaVisibility
      'data-hovering': true | undefined
      'data-scrolling': true | undefined
      'style': Record<string, string>
      'onPointerenter': () => void
      'onPointerleave': () => void
    }
  }

  export const [useScrollAreaRoot, provideScrollAreaRoot] = /* @__PURE__ */ createContext<ScrollAreaContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'ScrollAreaRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ScrollAreaRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:scroll-area',
    visibility = 'hover',
    delay = 600,
  } = defineProps<ScrollAreaRootProps>()

  const parts = createRegistry<ScrollAreaPartTicket>({ reactive: true })

  const metrics = shallowRef<ScrollAreaMetrics>({
    horizontal: { viewport: 0, content: 0, offset: 0 },
    vertical: { viewport: 0, content: 0, offset: 0 },
  })
  const thickness = shallowRef<Record<ScrollAreaOrientation, number>>({ horizontal: 0, vertical: 0 })
  const isRtl = shallowRef(false)
  const isHovering = shallowRef(false)
  const isScrolling = shallowRef(false)
  const dragging = shallowRef<ScrollAreaOrientation | null>(null)

  const hoverTimer = useTimer(() => {
    isHovering.value = false
  }, { duration: () => delay })

  const scrollTimer = useTimer(() => {
    isScrolling.value = false
  }, { duration: () => delay })

  const viewportEl = toRef(() => {
    for (const part of parts.values()) {
      if (part.type !== 'viewport') continue
      const el = toElement(part.el)
      if (el) return el
    }
    return null
  })

  function hasScrollbar (orientation: ScrollAreaOrientation) {
    for (const part of parts.values()) {
      if (part.type === 'scrollbar' && part.orientation === orientation) return true
    }
    return false
  }

  function isOverflowing (orientation: ScrollAreaOrientation) {
    const axis = metrics.value[orientation]
    // Sub-pixel layouts can report a 1px difference without any real overflow
    return axis.content - axis.viewport > 1
  }

  function isVisible (orientation: ScrollAreaOrientation) {
    if (visibility === 'always') return true
    if (!isOverflowing(orientation)) return false
    if (visibility === 'auto') return true
    if (dragging.value === orientation || isScrolling.value) return true
    return visibility === 'hover' && isHovering.value
  }

  function read (el: Element): ScrollAreaMetrics {
    return {
      horizontal: { viewport: el.clientWidth, content: el.scrollWidth, offset: Math.abs(el.scrollLeft) },
      vertical: { viewport: el.clientHeight, content: el.scrollHeight, offset: el.scrollTop },
    }
  }

  function update () {
    const el = viewportEl.value
    if (!el) return

    isRtl.value = getComputedStyle(el).direction === 'rtl'
    metrics.value = read(el)
  }

  function onScroll () {
    const el = viewportEl.value
    /* v8 ignore next -- defensive: scroll only fires on a mounted viewport */
    if (!el) return

    metrics.value = read(el)

    if (visibility === 'auto' || visibility === 'always') return

    isScrolling.value = true
    scrollTimer.stop()
    scrollTimer.start()
  }

  function measure (orientation: ScrollAreaOrientation, size: number) {
    if (thickness.value[orientation] === size) return
    thickness.value = { ...thickness.value, [orientation]: size }
  }

  function scrollTo (orientation: ScrollAreaOrientation, offset: number) {
    const el = viewportEl.value
    if (!el) return

    const axis = metrics.value[orientation]
    const value = clamp(offset, 0, Math.max(0, axis.content - axis.viewport))

    if (orientation === 'vertical') el.scrollTop = value
    else el.scrollLeft = isRtl.value ? -value : value
  }

  function onStartDrag (orientation: ScrollAreaOrientation) {
    dragging.value = orientation
  }

  function onEndDrag () {
    if (isNull(dragging.value)) return
    dragging.value = null

    if (visibility !== 'scroll' && visibility !== 'hover') return
    isScrolling.value = true
    scrollTimer.stop()
    scrollTimer.start()
  }

  function onPointerenter () {
    hoverTimer.stop()
    isHovering.value = true
  }

  function onPointerleave () {
    hoverTimer.stop()
    hoverTimer.start()
  }

  provideScrollAreaRoot(namespace, {
    visibility: toRef(() => visibility),
    parts,
    viewportEl,
    metrics,
    thickness,
    isRtl,
    isHovering,
    isScrolling,
    dragging,
    hasScrollbar,
    isOverflowing,
    isVisible,
    update,
    onScroll,
    measure,
    scrollTo,
    onStartDrag,
    onEndDrag,
  })

  defineExpose<ScrollAreaRootExpose>({ scrollTo, isScrolling })

  const slotProps = toRef((): ScrollAreaRootSlotProps => {
    const corner = isVisible('vertical') && isVisible('horizontal')

    return {
      isHovering: isHovering.value,
      isScrolling: isScrolling.value,
      isOverflowX: isOverflowing('horizontal'),
      isOverflowY: isOverflowing('vertical'),
      scrollTo,
      attrs: {
        'data-visibility': visibility,
        'data-hovering': isHovering.value || undefined,
        'data-scrolling': isScrolling.value || undefined,
        'style': {
          'position': 'relative',
          'overflow': 'hidden',
          '--v0-scroll-area-corner-width': `${corner ? thickness.value.vertical : 0}px`,
          '--v0-scroll-area-corner-height': `${corner ? thickness.value.horizontal : 0}px`,
        },
        'onPointerenter': onPointerenter,
        'onPointerleave': onPointerleave,
      },
    }
  })
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
