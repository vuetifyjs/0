/**
 * @module ScrollAreaThumb
 *
 * @see https://0.vuetifyjs.com/components/semantic/scroll-area
 *
 * @remarks
 * The draggable thumb inside a ScrollAreaScrollbar. Its length reflects the
 * visible share of the content and its position follows the scroll offset.
 * Dragging it scrolls the viewport.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useScrollAreaRoot } from './ScrollAreaRoot.vue'
  import { useScrollAreaScrollbar } from './ScrollAreaScrollbar.vue'

  // Composables
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useRaf } from '#v0/composables/useRaf'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { mergeProps, onScopeDispose, shallowRef, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ScrollAreaOrientation } from './ScrollAreaRoot.vue'

  export type ScrollAreaThumbState = 'visible' | 'hidden'

  export interface ScrollAreaThumbProps extends AtomProps {
    /** Namespace for connecting to parent ScrollArea.Root and ScrollArea.Scrollbar */
    namespace?: string
  }

  export interface ScrollAreaThumbSlotProps {
    /** Whether the thumb is being dragged */
    isDragging: boolean
    attrs: {
      'data-orientation': ScrollAreaOrientation
      'data-state': ScrollAreaThumbState
      'data-dragging': true | undefined
      'style': Record<string, string | number>
      'onPointerdown': (e: PointerEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ScrollAreaThumb', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ScrollAreaThumbSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:scroll-area',
  } = defineProps<ScrollAreaThumbProps>()

  const root = useScrollAreaRoot(namespace)
  const scrollbar = useScrollAreaScrollbar(`${namespace}:scrollbar`)

  const orientation = scrollbar.orientation.value
  const isVertical = orientation === 'vertical'
  const isDragging = toRef(() => root.dragging.value === orientation)

  const origin = shallowRef({ pointer: 0, offset: 0 })
  let latest = 0

  function coordinate (e: PointerEvent) {
    return isVertical ? e.clientY : e.clientX
  }

  function onPointerdown (e: PointerEvent) {
    if (e.button !== 0) return

    e.preventDefault()
    const target = e.currentTarget as Element
    target.setPointerCapture(e.pointerId)

    latest = coordinate(e)
    origin.value = { pointer: latest, offset: root.metrics.value[orientation].offset }
    root.onStartDrag(orientation)
  }

  function release () {
    /* v8 ignore next 3 -- IN_BROWSER always true in the browser test env */
    if (IN_BROWSER) {
      document.documentElement.style.userSelect = ''
    }
    root.onEndDrag()
  }

  useToggleScope(isDragging, () => {
    /* v8 ignore next 3 -- IN_BROWSER always true in the browser test env */
    if (IN_BROWSER) {
      document.documentElement.style.userSelect = 'none'
    }

    const update = useRaf(() => {
      const moved = latest - origin.value.pointer
      const delta = !isVertical && root.isRtl.value ? -moved : moved
      root.scrollTo(orientation, origin.value.offset + delta * scrollbar.ratio.value)
    })

    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      latest = coordinate(e)
      update()
    })

    useDocumentEventListener('pointerup', () => {
      update.cancel()
      release()
    })

    useDocumentEventListener('pointercancel', () => {
      update.cancel()
      release()
    })

    onScopeDispose(release)
  })

  const slotProps = toRef((): ScrollAreaThumbSlotProps => {
    const position = !isVertical && root.isRtl.value
      ? -scrollbar.position.value
      : scrollbar.position.value

    return {
      isDragging: isDragging.value,
      attrs: {
        'data-orientation': orientation,
        'data-state': root.isOverflowing(orientation) ? 'visible' : 'hidden',
        'data-dragging': isDragging.value || undefined,
        'style': isVertical
          ? {
            flexShrink: 0,
            height: `${scrollbar.size.value}px`,
            transform: `translate3d(0, ${position}px, 0)`,
          }
          : {
            flexShrink: 0,
            width: `${scrollbar.size.value}px`,
            transform: `translate3d(${position}px, 0, 0)`,
          },
        'onPointerdown': onPointerdown,
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
