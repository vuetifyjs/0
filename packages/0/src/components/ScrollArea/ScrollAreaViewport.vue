/**
 * @module ScrollAreaViewport
 *
 * @see https://0.vuetifyjs.com/components/semantic/scroll-area
 *
 * @remarks
 * The natively scrolling element of a ScrollArea. Hides the browser's own
 * scrollbars, enables scrolling only on axes that have a ScrollAreaScrollbar,
 * and reports size and scroll changes to ScrollAreaRoot.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useScrollAreaRoot } from './ScrollAreaRoot.vue'

  // Composables
  import { useEventListener } from '#v0/composables/useEventListener'
  import { useRaf } from '#v0/composables/useRaf'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface ScrollAreaViewportProps extends AtomProps {
    /** Namespace for connecting to parent ScrollArea.Root */
    namespace?: string
  }

  export interface ScrollAreaViewportSlotProps {
    /** Whether the viewport is being scrolled */
    isScrolling: boolean
    attrs: {
      'tabindex': 0 | undefined
      'data-scrolling': true | undefined
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ScrollAreaViewport', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ScrollAreaViewportSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:scroll-area',
  } = defineProps<ScrollAreaViewportProps>()

  const root = useScrollAreaRoot(namespace)

  const viewportRef = useTemplateRef<AtomExpose>('viewport')
  const el = toRef(() => toElement(viewportRef.value?.element) ?? null)
  // The content wrapper grows with its children while the viewport keeps its size
  const contentEl = toRef(() => el.value?.firstElementChild ?? null)

  const ticket = root.parts.register({ type: 'viewport', el })
  onBeforeUnmount(() => ticket.unregister())

  useResizeObserver(el, root.update, { immediate: true })
  useResizeObserver(contentEl, root.update)

  const sync = useRaf(root.onScroll)
  useEventListener(el, 'scroll', () => sync(), { passive: true })

  defineExpose<AtomExpose>({
    get element () {
      return (viewportRef.value?.element ?? null) as AtomExpose['element']
    },
  })

  const slotProps = toRef((): ScrollAreaViewportSlotProps => {
    const x = root.hasScrollbar('horizontal')
    const y = root.hasScrollbar('vertical')
    const scrollable = (x && root.isOverflowing('horizontal')) || (y && root.isOverflowing('vertical'))

    return {
      isScrolling: root.isScrolling.value,
      attrs: {
        // A scrollable region must be reachable by keyboard to scroll it
        'tabindex': scrollable ? 0 : undefined,
        'data-scrolling': root.isScrolling.value || undefined,
        'style': {
          overflowX: x ? 'scroll' : 'hidden',
          overflowY: y ? 'scroll' : 'hidden',
          scrollbarWidth: 'none',
        },
      },
    }
  })
</script>

<template>
  <Atom
    ref="viewport"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-if="renderless" v-bind="slotProps" />

    <div v-else :style="{ minWidth: '100%', display: 'table' }">
      <slot v-bind="slotProps" />
    </div>
  </Atom>
</template>
