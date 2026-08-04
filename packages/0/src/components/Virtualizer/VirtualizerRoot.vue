/**
 * @module VirtualizerRoot
 *
 * @see https://0.vuetifyjs.com/components/data/virtualizer
 *
 * @remarks
 * Root component for virtualized lists. Creates virtual-scrolling context
 * via createVirtual, provides it to Virtualizer.Item, and renders the
 * scroll container with leading/trailing spacer elements that reserve
 * space for the items scrolled out of view.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createVirtual } from '#v0/composables/createVirtual'

  // Utilities
  import { mergeProps, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type {
    ScrollToOptions,
    VirtualAnchor,
    VirtualContext,
    VirtualDirection,
    VirtualItem,
    VirtualState,
  } from '#v0/composables/createVirtual'
  import type { Ref } from 'vue'

  export interface VirtualizerRootContext extends VirtualContext {
    /** Total item count across the full (unvirtualized) list — for aria-setsize */
    itemsLength: Readonly<Ref<number>>
  }

  export interface VirtualizerRootProps extends AtomProps {
    /** The items to virtualize */
    items?: readonly unknown[]
    /** The height of each item, in pixels. Used as the initial estimate for unmeasured items */
    itemHeight?: number | string | null
    /** The height of the scroll container, in pixels */
    height?: number | string
    /** Extra items rendered outside the viewport for smoother scrolling (default: 5) */
    overscan?: number
    /** The direction of scrolling (default: 'forward') */
    direction?: VirtualDirection
    /** How scroll position is preserved across data changes (default: 'auto') */
    anchor?: VirtualAnchor
    /** Whether anchor restoration scrolls smoothly (default: true) */
    anchorSmooth?: boolean
    /** Called when scrolling reaches within `startThreshold` of the start */
    onStartReached?: (distance: number) => void | Promise<void>
    /** Called when scrolling reaches within `endThreshold` of the end */
    onEndReached?: (distance: number) => void | Promise<void>
    /** Distance from the start that triggers onStartReached (default: 0) */
    startThreshold?: number
    /** Distance from the end that triggers onEndReached (default: 0) */
    endThreshold?: number
    /** Enable iOS momentum scrolling (default: auto-detected) */
    momentum?: boolean
    /** Enable elastic overscroll (default: auto-detected) */
    elastic?: boolean
    /** Namespace for context provision */
    namespace?: string
  }

  export interface VirtualizerRootSlotProps {
    /** The currently visible (rendered) items, with overscan applied */
    items: readonly VirtualItem[]
    /** Loading/empty/error/ok state */
    state: VirtualState
    /** Scroll to an item by index */
    scrollTo: (index: number, options?: ScrollToOptions) => void
    /** Reset the virtualizer to its initial scroll state */
    reset: () => void
    /** Attributes to bind to the scroll container */
    attrs: {
      tabindex: 0
      style: { overflowY: 'auto', height: string | undefined }
      onScroll: () => void
      onScrollend: () => void
    }
  }

  export const [useVirtualizerRoot, provideVirtualizerRoot] = createContext<VirtualizerRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'VirtualizerRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: VirtualizerRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    items = [],
    itemHeight,
    height,
    overscan = 5,
    direction = 'forward',
    anchor = 'auto',
    anchorSmooth = true,
    onStartReached,
    onEndReached,
    startThreshold = 0,
    endThreshold = 0,
    momentum,
    elastic,
    namespace = 'v0:virtualizer:root',
  } = defineProps<VirtualizerRootProps>()

  const itemsRef = toRef(() => items)

  const virtual = createVirtual(itemsRef, {
    itemHeight,
    height,
    overscan,
    direction,
    anchor,
    anchorSmooth,
    onStartReached,
    onEndReached,
    startThreshold,
    endThreshold,
    momentum,
    elastic,
  })

  const containerRef = useTemplateRef<{ element: HTMLElement | null }>('container')

  watch(() => containerRef.value?.element, el => {
    virtual.element.value = (el as HTMLElement | null) ?? undefined
  })

  const itemsLength = toRef(() => itemsRef.value.length)

  const context: VirtualizerRootContext = {
    ...virtual,
    itemsLength,
  }

  provideVirtualizerRoot(namespace, context)

  const containerHeight = toRef(() => {
    if (height === undefined) return undefined
    return typeof height === 'number' ? `${height}px` : height
  })

  const slotProps = toRef((): VirtualizerRootSlotProps => ({
    items: virtual.items.value,
    state: virtual.state.value,
    scrollTo: virtual.scrollTo,
    reset: virtual.reset,
    attrs: {
      tabindex: 0,
      style: { overflowY: 'auto', height: containerHeight.value },
      onScroll: virtual.scroll,
      onScrollend: virtual.scrollend,
    },
  }))
</script>

<template>
  <Atom
    ref="container"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <div data-virtualizer-spacer="start" :style="{ height: `${virtual.offset.value}px` }" />

    <slot v-bind="slotProps" />

    <div data-virtualizer-spacer="end" :style="{ height: `${virtual.size.value}px` }" />
  </Atom>
</template>
