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
  import { useLogger } from '#v0/composables/useLogger'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isNull, isNumber, isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type {
    ScrollToOptions,
    VirtualAnchor,
    VirtualContext,
    VirtualDirection,
    VirtualItem,
  } from '#v0/composables/createVirtual'
  import type { ShallowRef } from 'vue'

  export interface VirtualizerRootContext<T = unknown> extends VirtualContext<T> {
    /** True once Root begins unmounting; Items skip their focus hand-off */
    closing: Readonly<ShallowRef<boolean>>
  }

  export interface VirtualizerRootProps<T = unknown> extends AtomProps {
    /** The items to virtualize */
    items?: readonly T[]
    /** The height of each item, in pixels (a number or numeric string). Used as the initial estimate for unmeasured items */
    itemHeight?: number | `${number}` | null
    /** Height of the scroll container; numbers and unitless numeric strings are pixels, other strings pass through as CSS */
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

  export interface VirtualizerRootSlotProps<T = unknown> {
    /** The currently visible (rendered) items, with overscan applied */
    items: readonly VirtualItem<T>[]
    /** Scroll to an item by index */
    scrollTo: (index: number, options?: ScrollToOptions) => void
    /** Reset the virtualizer to its initial scroll state */
    reset: () => void
  }

  export const [useVirtualizerRoot, provideVirtualizerRoot] = createContext<VirtualizerRootContext>()
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'VirtualizerRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: VirtualizerRootSlotProps<T>) => any
  }>()

  const {
    as = 'div',
    renderless,
    items = [],
    itemHeight,
    height: _height,
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
  } = defineProps<VirtualizerRootProps<T>>()

  // Atom renders a null `as` without a wrapper, exactly like renderless
  const bare = toRef(() => renderless || isNull(as))

  if (bare.value) {
    const logger = useLogger()
    logger.warn('[v0:virtualizer] `renderless` and `as="null"` are not supported on Virtualizer.Root — the spacers and scroll measurement require the wrapper element. Remove them or use createVirtual directly.')
  }

  const _items = toRef(() => items)

  const virtual = createVirtual<T>(_items, {
    itemHeight,
    height: _height,
    overscan,
    direction,
    anchor,
    anchorSmooth,
    // createVirtual captures options once; read the callback props at fire
    // time so a replaced handler (inline `() => load(page)`) stays current
    onStartReached: distance => onStartReached?.(distance),
    onEndReached: distance => onEndReached?.(distance),
    startThreshold,
    endThreshold,
    momentum,
    elastic,
  })

  const containerRef = useTemplateRef<AtomExpose>('container')
  const el = toRef(() => toElement(containerRef.value?.element) ?? null)

  watch(el, element => {
    virtual.element.value = (element ?? undefined) as HTMLElement | undefined
  })

  // Root's beforeUnmount runs before its Items', with or without a leave
  // transition, so this tells them the whole list is going away
  const closing = shallowRef(false)

  onBeforeUnmount(() => {
    closing.value = true
  })

  provideVirtualizerRoot(namespace, { ...virtual, closing })

  // A unitless numeric string ("400") is pixels; anything else is CSS
  const height = toRef(() => {
    if (isUndefined(_height)) return undefined
    return isNumber(_height) || /^\d*\.?\d+$/.test(_height) ? `${_height}px` : _height
  })

  // Root always binds these to its own element (renderless is unsupported),
  // so they stay out of the slot. tabindex and overflow are defaults, not
  // state, so consumer attrs are merged last and win.
  const containerAttrs = toRef(() => ({
    tabindex: 0,
    style: {
      overflowY: 'auto',
      ...(height.value ? { height: height.value } : {}),
    },
    onScroll: virtual.scroll,
    onScrollend: virtual.scrollend,
  }))

  const slotProps = toRef((): VirtualizerRootSlotProps<T> => ({
    items: virtual.items.value,
    scrollTo: virtual.scrollTo,
    reset: virtual.reset,
  }))
</script>

<template>
  <Atom
    ref="container"
    v-bind="mergeProps(containerAttrs, attrs)"
    :as
    :renderless
  >
    <div v-if="!bare" data-spacer="start" :style="{ height: `${virtual.offset.value}px` }" />

    <slot v-bind="slotProps" />

    <div v-if="!bare" data-spacer="end" :style="{ height: `${virtual.size.value}px` }" />
  </Atom>
</template>
