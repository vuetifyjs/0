/**
 * @module ScrollAreaScrollbar
 *
 * @see https://0.vuetifyjs.com/components/semantic/scroll-area
 *
 * @remarks
 * The track of a custom scrollbar for one axis. Mounting it enables scrolling
 * on that axis. Clicking the track jumps to that position, and wheel input
 * over the track scrolls the viewport. Hidden from assistive technology —
 * the viewport stays natively scrollable by keyboard and screen readers.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useScrollAreaRoot } from './ScrollAreaRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { usePresence } from '#v0/composables/usePresence'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { clamp } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ScrollAreaOrientation } from './ScrollAreaRoot.vue'
  import type { Ref } from 'vue'

  export type ScrollAreaScrollbarState = 'visible' | 'hidden'

  export interface ScrollAreaScrollbarContext {
    orientation: Readonly<Ref<ScrollAreaOrientation>>
    /** Inner length of the track, in px */
    track: Readonly<Ref<number>>
    /** Length of the thumb, in px */
    size: Readonly<Ref<number>>
    /** Distance of the thumb from the track's start edge, in px */
    position: Readonly<Ref<number>>
    /** Scroll distance that one px of thumb travel represents */
    ratio: Readonly<Ref<number>>
  }

  export interface ScrollAreaScrollbarProps extends AtomProps {
    /** Namespace for connecting to parent ScrollArea.Root */
    namespace?: string
    /**
     * Axis this scrollbar controls.
     *
     * @default 'vertical'
     */
    orientation?: ScrollAreaOrientation
  }

  export interface ScrollAreaScrollbarSlotProps {
    /** Whether the scrollbar is shown */
    isVisible: boolean
    /** Axis this scrollbar controls */
    orientation: ScrollAreaOrientation
    attrs: {
      'aria-hidden': 'true'
      'data-orientation': ScrollAreaOrientation
      'data-state': ScrollAreaScrollbarState
      'style': Record<string, string | number>
      'onPointerdown': (e: PointerEvent) => void
      'onWheel': (e: WheelEvent) => void
    }
  }

  export const [useScrollAreaScrollbar, provideScrollAreaScrollbar] = /* @__PURE__ */ createContext<ScrollAreaScrollbarContext>()

  const MIN_THUMB = 18
  const LINE_HEIGHT = 16
</script>

<script setup lang="ts">
  defineOptions({ name: 'ScrollAreaScrollbar', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ScrollAreaScrollbarSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:scroll-area',
    orientation = 'vertical',
  } = defineProps<ScrollAreaScrollbarProps>()

  const root = useScrollAreaRoot(namespace)

  const scrollbarRef = useTemplateRef<AtomExpose>('scrollbar')
  const el = toRef(() => toElement(scrollbarRef.value?.element) ?? null)

  const ticket = root.parts.register({ type: 'scrollbar', orientation, el })
  onBeforeUnmount(() => {
    ticket.unregister()
    root.measure(orientation, 0)
  })

  const isVertical = orientation === 'vertical'
  const track = shallowRef(0)

  useResizeObserver(el, ([entry]) => {
    /* v8 ignore next -- defensive: the observer always reports the observed element */
    if (!entry) return
    const content = entry.contentRect
    track.value = isVertical ? content.height : content.width
    const border = entry.borderBoxSize[0]
    /* v8 ignore next -- defensive: borderBoxSize is filled by the observer or its measuring fallback */
    if (!border) return
    root.measure(orientation, isVertical ? border.inlineSize : border.blockSize)
  }, { immediate: true, box: 'border-box' })

  const axis = toRef(() => root.metrics.value[orientation])

  const size = toRef(() => {
    const { viewport, content } = axis.value
    if (!content || !track.value) return 0
    return clamp(Math.round((viewport / content) * track.value), Math.min(MIN_THUMB, track.value), track.value)
  })

  const ratio = toRef(() => {
    const room = track.value - size.value
    return room > 0 ? Math.max(0, axis.value.content - axis.value.viewport) / room : 0
  })

  const position = toRef(() => ratio.value > 0 ? axis.value.offset / ratio.value : 0)

  provideScrollAreaScrollbar(`${namespace}:scrollbar`, {
    orientation: toRef(() => orientation),
    track,
    size,
    position,
    ratio,
  })

  const presence = usePresence({
    present: () => root.isVisible(orientation),
    immediate: false,
  })

  let leave = 0

  // Let CSS exit transitions on [data-state="hidden"] finish before hiding the track
  watch(presence.isLeaving, async leaving => {
    if (!leaving) return
    const token = ++leave
    const element = el.value
    const animations = element?.getAnimations?.() ?? []
    await Promise.allSettled(animations.map(a => a.finished))
    if (token === leave) presence.done()
  }, { flush: 'post' })

  function start (element: Element) {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()

    if (isVertical) {
      return { begin: rect.top + Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.paddingTop), end: 0 }
    }

    return {
      begin: rect.left + Number.parseFloat(style.borderLeftWidth) + Number.parseFloat(style.paddingLeft),
      end: rect.right - Number.parseFloat(style.borderRightWidth) - Number.parseFloat(style.paddingRight),
    }
  }

  function onPointerdown (e: PointerEvent) {
    if (e.button !== 0 || e.target !== e.currentTarget) return

    const { begin, end } = start(e.currentTarget as Element)
    const pointer = isVertical
      ? e.clientY - begin
      : (root.isRtl.value ? end - e.clientX : e.clientX - begin)

    e.preventDefault()
    root.scrollTo(orientation, (pointer - size.value / 2) * ratio.value)
  }

  function onWheel (e: WheelEvent) {
    const scale = e.deltaMode === 1
      ? LINE_HEIGHT
      : (e.deltaMode === 2 ? axis.value.viewport : 1)
    const delta = (isVertical ? e.deltaY || e.deltaX : e.deltaX || e.deltaY) * scale
    const { offset, content, viewport } = axis.value

    if (delta === 0) return
    if (delta < 0 ? offset <= 0 : offset >= content - viewport) return

    e.preventDefault()
    root.scrollTo(orientation, offset + delta)
  }

  defineExpose<AtomExpose>({
    get element () {
      return (scrollbarRef.value?.element ?? null) as AtomExpose['element']
    },
  })

  const slotProps = toRef((): ScrollAreaScrollbarSlotProps => ({
    isVisible: presence.isPresent.value,
    orientation,
    attrs: {
      'aria-hidden': 'true',
      'data-orientation': orientation,
      'data-state': presence.isPresent.value ? 'visible' : 'hidden',
      'style': isVertical
        ? {
          position: 'absolute',
          top: 0,
          bottom: 'var(--v0-scroll-area-corner-height, 0px)',
          insetInlineEnd: 0,
          display: 'flex',
          flexDirection: 'column',
          touchAction: 'none',
          userSelect: 'none',
        }
        : {
          position: 'absolute',
          bottom: 0,
          insetInlineStart: 0,
          insetInlineEnd: 'var(--v0-scroll-area-corner-width, 0px)',
          display: 'flex',
          flexDirection: 'row',
          touchAction: 'none',
          userSelect: 'none',
        },
      'onPointerdown': onPointerdown,
      'onWheel': onWheel,
    },
  }))
</script>

<template>
  <Atom
    v-show="presence.isMounted.value"
    ref="scrollbar"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
