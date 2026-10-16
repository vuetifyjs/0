/**
 * @module createVirtual
 *
 * @see https://0.vuetifyjs.com/composables/data/create-virtual
 *
 * @remarks
 * Virtual scrolling composable for efficiently rendering large lists.
 *
 * Key features:
 * - Trinity pattern for dependency injection (`createVirtualContext`, `useVirtual`)
 * - Renders only visible items (viewport + overscan)
 * - Dynamic or fixed item heights
 * - SSR-safe (checks IN_BROWSER)
 * - Bidirectional scrolling (forward/reverse for chat apps)
 * - Scroll anchoring (maintains position across data changes)
 * - Edge detection for infinite scroll
 * - iOS momentum and elastic scrolling
 * - Configurable overscan (extra items rendered for smooth scrolling)
 *
 * Perfect for large data sets, chat apps, and infinite scroll implementations.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createVirtual } from '@vuetify/v0'
 *
 * const items = shallowRef(Array.from({ length: 10000 }, (_, i) => ({ id: i })))
 * const virtual = createVirtual(items, { itemHeight: 40 })
 * console.log(virtual.items.value)
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'
import { useResizeObserver } from '#v0/composables/useResizeObserver'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isFunction, isNumber } from '#v0/utilities'
import { computed, nextTick, onScopeDispose, readonly, ref, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export type VirtualDirection = 'forward' | 'reverse'
export type VirtualState = 'loading' | 'empty' | 'error' | 'ok'
export type VirtualAnchor = 'auto' | 'start' | 'end' | ((items: readonly unknown[]) => number | string)

export interface ScrollToOptions {
  /**
   * The behavior of the scroll animation.
   */
  behavior?: 'auto' | 'smooth' | 'instant'
  /**
   * The alignment of the scroll position.
   */
  block?: 'start' | 'center' | 'end' | 'nearest'
  /**
   * The offset of the scroll position.
   */
  offset?: number
}

export interface VirtualOptions<T = unknown> {
  /**
   * The height of the item.
   */
  itemHeight?: number | string | null
  /**
   * The height of the container.
   */
  height?: number | string
  /**
   * The number of extra items to render.
   */
  overscan?: number
  /**
   * The direction of the scrolling.
   */
  direction?: VirtualDirection
  /**
   * The anchor of the scrolling.
   */
  anchor?: VirtualAnchor
  /**
   * Whether to smooth the anchor position.
   */
  anchorSmooth?: boolean
  /**
   * The callback to call when the start is reached.
   */
  onStartReached?: (distance: number) => void | Promise<void>
  /**
   * The callback to call when the end is reached.
   */
  onEndReached?: (distance: number) => void | Promise<void>
  /**
   * The threshold for the start.
   */
  startThreshold?: number
  /**
   * The threshold for the end.
   */
  endThreshold?: number
  /**
   * Whether to enable momentum scrolling.
   */
  momentum?: boolean
  /**
   * Whether to enable elastic scrolling.
   */
  elastic?: boolean
  /**
   * Element at the top of the list inside the scroll parent.
   *
   * Its `offsetTop` is removed from the scroll position, so a header or
   * padding above the list does not shift the window. Omit it when the
   * list starts at the top of the scroller.
   *
   * @example
   * ```ts
   * const marker = ref<HTMLElement>()
   * const virtual = createVirtual(items, { marker })
   * ```
   */
  marker?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /**
   * Identity of an item.
   *
   * Measured heights follow this key when items are prepended, filtered,
   * or reordered. Omit it to keep each height on its index. Duplicate keys
   * keep the latest measurement.
   *
   * @example
   * ```ts
   * const virtual = createVirtual(items, {
   *   itemKey: item => item.id,
   * })
   * ```
   */
  itemKey?: (item: T, index: number) => string | number
  /**
   * Write momentum and overscroll styles onto the scroll element.
   *
   * Set this to `false` when a parent owns that element.
   *
   * @default true
   *
   * @example
   * ```ts
   * const virtual = createVirtual(items, { ownElement: false })
   * ```
   */
  ownElement?: boolean
}

export interface VirtualItem<T = unknown> {
  raw: T
  index: number
  /** `itemKey` result, or the index when no key function was passed. */
  key: string | number
}

export interface VirtualContext<T = unknown> {
  /**
   * The element that is being virtualized.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { element } = virtual
   * </script>
   *
   * <template>
   *   <div ref="element">
   *     <div v-for="item in items" :key="item.index">
   *       {{ item.raw }}
   *     </div>
   *   </div>
   * </template>
   */
  element: Ref<HTMLElement | undefined>
  /**
   * The items that are being virtualized.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { items } = virtual
   * </script>
   *
   * <template>
   *   <div v-for="item in items" :key="item.index">
   *     {{ item.raw }}
   *   </div>
   * </template>
   * ```
   */
  items: ComputedRef<VirtualItem<T>[]>
  /**
   * The offset of the virtualized items.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { offset } = virtual
   * </script>
   *
   * <template>
   *   <div :style="{ height: `${offset}px` }" />
   * </template>
   * ```
   */
  offset: Readonly<ShallowRef<number>>
  /**
   * The size of the virtualized items.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { size } = virtual
   * </script>
   *
   * <template>
   *   <div :style="{ height: `${size}px` }" />
   * </template>
   * ```
   */
  size: Readonly<ShallowRef<number>>
  /**
   * The state of the virtualized items.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { state } = virtual
   * </script>
   *
   * <template>
   *   <div v-if="state === 'loading'">Loading...</div>
   *   <div v-else-if="state === 'empty'">No items</div>
   *   <div v-else-if="state === 'error'">Error</div>
   *   <div v-else>Items</div>
   * </template>
   * ```
   */
  state: ShallowRef<VirtualState>
  /**
   * Scroll to an item by index.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { scrollTo } = virtual
   * </script>
   *
   * <template>
   *   <button @click="scrollTo(0)">Scroll to top</button>
   *   <button @click="scrollTo(items.length - 1)">Scroll to bottom</button>
   * </template>
   * ```
   */
  scrollTo: (index: number, options?: ScrollToOptions) => void
  /**
   * The scroll event handler.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { element, scroll } = virtual
   * </script>
   *
   * <template>
   *   <div ref="element" @scroll="scroll">
   *     <div v-for="item in items" :key="item.index">
   *       {{ item.raw }}
   *     </div>
   *   </div>
   * </template>
   * ```
   */
  scroll: () => void
  /**
   * The scrollend event handler.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { scroll, scrollend } = virtual
   * </script>
   *
   * <template>
   *   <div ref="element" @scroll="scroll" @scrollend="scrollend">
   *     <div v-for="item in items" :key="item.index">
   *       {{ item.raw }}
   *     </div>
   *   </div>
   * </template>
   * ```
   */
  scrollend: () => void
  /**
   * Resize an item by index.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { resize } = virtual
   * </script>
   *
   * <template>
   *   <button @click="resize(0, 100)">Resize first item</button>
   * </template>
   * ```
   */
  resize: (index: number, height: number) => void
  /**
   * Reset the virtualized items.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { createVirtual } from '@vuetify/v0'
   *
   *   const virtual = createVirtual(items)
   *   const { reset } = virtual
   * </script>
   *
   * <template>
   *   <button @click="reset">Reset</button>
   *   <div v-for="item in items" :key="item.index">
   *     {{ item.raw }}
   *   </div>
   * </template>
   * ```
   */
  reset: () => void
}

export interface VirtualContextOptions<T = unknown> extends VirtualOptions<T> {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Virtual scrolling composable for efficiently rendering large lists
 *
 * @param items Reactive array of items to virtualize
 * @param options Configuration options
 * @returns Virtual scrolling context
 *
 * @see https://0.vuetifyjs.com/composables/data/create-virtual
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { createVirtual } from '@vuetify/v0'
 *
 *   const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })))
 *   const virtual = createVirtual(items)
 * </script>
 *
 * <template>
 *   <div
 *     ref="virtual.element"
 *     style="height: 600px; overflow-y: auto;"
 *     @scroll="virtual.scroll"
 *   >
 *     <div :style="{ height: `${virtual.offset.value}px` }" />
 *
 *     <div v-for="item in virtual.items.value" :key="item.index">
 *       {{ item.raw.name }}
 *     </div>
 *
 *     <div :style="{ height: `${virtual.size.value}px` }" />
 *   </div>
 * </template>
 * ```
 */
const FALLBACK_HEIGHT = 40

// Small and monomorphic on purpose. Inside createVirtual these loops share a
// closure with the rest of the engine, and V8 left the 10k walk slow.
function findOffset (offsets: Float64Array, top: number): number {
  let low = 0
  let high = offsets.length - 1

  while (low <= high) {
    const mid = (low + high) >> 1
    if (offsets[mid]! <= top) low = mid + 1
    else high = mid - 1
  }

  return Math.max(high, 0)
}

function shiftOffsets (offsets: Float64Array, from: number, delta: number) {
  const length = offsets.length
  for (let index = from; index < length; index++) {
    offsets[index] = offsets[index]! + delta
  }
}

// A uniform add on offsets[index + 1, length) moves a search boundary by one
// row when the delta is smaller than that row. -1 means it moved farther.
function shiftIndex (
  offsets: Float64Array,
  item: number,
  bound: number,
  index: number,
  delta: number,
  length: number,
): number {
  if (item < index) return item
  if (delta >= 0 && item === index) return item

  if (delta >= 0) {
    if (offsets[item]! <= bound) return item
    const prev = item - 1
    if (offsets[prev]! <= bound) return prev
    return -1
  }

  const next = item + 1
  if (next >= length || offsets[next]! > bound) return item
  const further = next + 1
  if (further < length && offsets[further]! <= bound) return -1
  return next
}

function placeWindow (
  offsets: Float64Array,
  heights: Float64Array,
  anchor: number,
  edge: number,
  length: number,
  overscan: number,
  fallback: number,
) {
  let start = anchor - overscan
  if (start < 0) start = 0
  else if (start > length) start = length
  let end = edge + 1 + overscan
  if (end < start) end = start
  else if (end > length) end = length

  const lastIndex = length - 1
  const total = lastIndex < 0
    ? 0
    : (offsets[lastIndex] || 0) + (heights[lastIndex] || fallback)

  return {
    start,
    end,
    offset: offsets[start] || 0,
    size: total - (offsets[end] || total),
  }
}

function reattach<T> (
  items: readonly T[],
  keyOf: (item: T, index: number) => string | number,
  prev: Map<string | number, number>,
  rows: Float64Array,
  offsets: Float64Array,
  fallback: number,
): Map<string | number, number> {
  const next = new Map<string | number, number>()
  const length = items.length
  let sum = 0
  for (let index = 0; index < length; index++) {
    const key = keyOf(items[index]!, index)
    const known = prev.get(key)
    // typeof, not isNumber: the call kept this walk from optimizing.
    if (typeof known === 'number') {
      rows[index] = known
      next.set(key, known)
      offsets[index] = sum
      sum += known || fallback
    } else {
      rows[index] = 0
      offsets[index] = sum
      sum += fallback
    }
  }
  return next
}

export function createVirtual<T = unknown> (
  items: Ref<readonly T[]>,
  _options: VirtualOptions<T> = {},
): VirtualContext<T> {
  const {
    itemHeight: _itemHeight,
    height,
    overscan = 5,
    direction = 'forward',
    anchor = 'auto',
    anchorSmooth = true,
    onStartReached,
    onEndReached,
    startThreshold = 0,
    endThreshold = 0,
    momentum: momentumOption,
    elastic: elasticOption,
    marker,
    itemKey,
    ownElement = true,
  } = _options

  const element = ref<HTMLElement>()
  const itemHeight = shallowRef(Number.parseFloat(String(_itemHeight || 0)))

  function estimate () {
    return itemHeight.value || FALLBACK_HEIGHT
  }
  // Packed buffers. A holey array stayed slower than a packed tail add, and a
  // ref read per row dominated the walk before that.
  // 0 means "unmeasured" and contributes the estimate, matching `height || estimate()`.
  let heights = new Float64Array(0)
  let offsets = new Float64Array(0)
  let repairEpoch = 0
  let repairScheduled = 0
  let repairCount = 0
  let repairIndex = 0
  let repairPrev = 0
  let fallbackDirty = false
  const first = shallowRef(0)
  const last = shallowRef(0)
  const offset = shallowRef(0)
  const size = shallowRef(0)
  const viewportHeight = shallowRef(0)
  const state = shallowRef<VirtualState>('ok')

  const isIOS = IN_BROWSER && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const momentum = momentumOption ?? isIOS
  const elastic = elasticOption ?? isIOS

  let raf = -1
  let rebuildRaf = -1
  let repairPending = false
  let edgeRaf = -1
  let anchorItem = 0
  let endItem = 0
  let windowTop = 0
  let windowReady = false
  const cachedViewport = Number.parseInt(String(height)) || 0

  let anchorIndex = -1
  let anchorOffset = 0
  let markerOffset = 0
  let lastScrollAt = 0
  let clampHeight = 0
  let clampToken = 0
  let clampRaf = -1
  let pending: { index: number, options?: ScrollToOptions } | null = null
  let measured = new Map<string | number, number>()
  const markerEl = toRef(() => toValue(marker) ?? undefined)

  function refreshMarker () {
    const node = markerEl.value
    markerOffset = node ? node.offsetTop : 0
  }

  refreshMarker()

  const computedItems = computed(() =>
    items.value.slice(first.value, last.value).map((item, i) => {
      const index = i + first.value
      return {
        raw: item,
        index,
        key: itemKey ? itemKey(item, index) : index,
      }
    }),
  )

  // iOS scrolling styles belong on an element this engine owns
  watch(element, el => {
    if (!ownElement || !IN_BROWSER || !el?.style) return

    /* v8 ignore start -- browser-only style assignments */
    if (momentum) (el.style as unknown as Record<string, string>).webkitOverflowScrolling = 'touch'
    if (!elastic) el.style.overscrollBehavior = 'none'
    /* v8 ignore stop */
  })

  useResizeObserver(element, entries => {
    /* v8 ignore next -- defensive: ResizeObserver always emits at least one entry */
    if (!entries[0]) return

    viewportHeight.value = entries[0].contentRect.height

    update()
  })

  useResizeObserver(markerEl, () => {
    refreshMarker()
    update()
  })

  watch(markerEl, () => {
    refreshMarker()
    update()
  })

  function syncItems (newItems: readonly T[]) {
    captureAnchor()
    const length = newItems.length
    const keyOf = itemKey

    // Same length and nothing to reattach: offsets already match the heights.
    // No itemKey keeps index-aligned measurements, so a same-length swap does not move them.
    if (heights.length === length && offsets.length === length && (!keyOf || measured.size === 0)) {
      restoreAnchor()
      return
    }

    // Drop a pending resize repair. This walk writes the offsets itself.
    repairEpoch++
    repairCount = 0
    fallbackDirty = false

    if (keyOf && measured.size > 0) {
      const fallback = itemHeight.value || FALLBACK_HEIGHT
      if (heights.length !== length) heights = new Float64Array(length)
      if (offsets.length !== length) offsets = new Float64Array(length)
      measured = reattach(newItems, keyOf, measured, heights, offsets, fallback)
      update()
      restoreAnchor()
      return
    }

    // Preserve the measured prefix. A prepend misattributes until the next resize;
    // an append keeps the prefix and estimates the tail.
    const prevRows = heights
    const copy = Math.min(prevRows.length, length)
    const nextRows = new Float64Array(length)
    nextRows.set(prevRows.subarray(0, copy))
    heights = nextRows
    writeOffsets()
    update()
    restoreAnchor()
  }

  watch(items, syncItems, { immediate: true })

  watch(element, () => {
    /* v8 ignore next -- defensive: watch fires only when element is present */
    if (!element.value) return

    if (pending) {
      const next = pending
      pending = null
      scrollTo(next.index, next.options)
      return
    }

    if (direction === 'reverse' && items.value.length > 0) {
      pinEnd()
      return
    }

    update()
  })

  function captureAnchor () {
    if (!element.value || anchor === 'auto') return

    if (anchor === 'start') {
      anchorIndex = 0
      anchorOffset = 0
    } else if (anchor === 'end') {
      anchorIndex = items.value.length - 1
      anchorOffset = 0
    } else if (isFunction(anchor)) {
      const result = anchor(items.value)
      /* v8 ignore next 4 -- function-anchor: tested with valid number return; non-number rejection branch is implicit */
      if (isNumber(result)) {
        anchorIndex = result
        anchorOffset = listTop() - (offsets[result] || 0)
      }
    } else {
      /* v8 ignore start -- default anchor capture */
      // Default: capture first visible item
      anchorIndex = first.value
      anchorOffset = listTop() - (offsets[first.value] || 0)
      /* v8 ignore stop */
    }
  }

  function restoreAnchor () {
    if (!element.value || anchorIndex < 0) return

    const newScrollTop = portTop((offsets[anchorIndex] || 0) + anchorOffset)

    if (anchorSmooth && direction === 'forward') {
      element.value.scrollTo({ top: newScrollTop, behavior: 'smooth' })
    /* v8 ignore start -- non-smooth scroll */
    } else {
      element.value.scrollTop = newScrollTop
    }
    /* v8 ignore stop */

    anchorIndex = -1
    anchorOffset = 0
  }

  function writeOffsets () {
    const fallback = itemHeight.value || FALLBACK_HEIGHT
    const rows = heights
    const length = rows.length
    if (offsets.length !== length) offsets = new Float64Array(length)
    const offs = offsets
    let sum = 0
    for (let i = 0; i < length; i++) {
      offs[i] = sum
      sum += rows[i]! || fallback
    }
  }

  function viewportOf () {
    return viewportHeight.value || cachedViewport
  }

  function contentHeight () {
    const lastIndex = items.value.length - 1
    if (lastIndex < 0) return 0
    return (offsets[lastIndex] || 0) + (heights[lastIndex] || estimate())
  }

  function listTop () {
    const node = element.value
    if (!node) return 0
    return Math.max(0, node.scrollTop - markerOffset)
  }

  function portTop (top: number) {
    return top + markerOffset
  }

  function commitWindow (
    anchor: number,
    edge: number,
    length: number,
    fallback: number,
  ) {
    anchorItem = anchor
    endItem = edge
    const placed = placeWindow(offsets, heights, anchor, edge, length, overscan, fallback)
    if (first.value !== placed.start) first.value = placed.start
    if (last.value !== placed.end) last.value = placed.end
    if (offset.value !== placed.offset) offset.value = placed.offset
    if (size.value !== placed.size) size.value = placed.size
  }

  function applyWindow (top: number) {
    const viewport = viewportHeight.value || cachedViewport
    if (!viewport) return

    const length = items.value.length
    const anchor = findOffset(offsets, top)
    const edge = findOffset(offsets, top + viewport)
    windowTop = top
    windowReady = true
    commitWindow(anchor, edge, length, itemHeight.value || FALLBACK_HEIGHT)
  }

  // Single-row tail add. Keeps the window when the boundary stays on the same
  // row or its neighbor; a larger jump falls back to the search.
  function retarget (index: number, delta: number, fallback: number) {
    const node = element.value
    const viewport = viewportHeight.value || cachedViewport
    if (!node || !viewport || !windowReady) return false

    const top = Math.max(0, node.scrollTop - markerOffset)
    if (top !== windowTop) return false

    const length = items.value.length
    const anchor = shiftIndex(offsets, anchorItem, top, index, delta, length)
    if (anchor < 0) return false
    const edge = shiftIndex(offsets, endItem, top + viewport, index, delta, length)
    if (edge < 0) return false

    commitWindow(anchor, edge, length, fallback)
    return true
  }

  function update () {
    const node = element.value
    if (!node) return
    applyWindow(Math.max(0, node.scrollTop - markerOffset))
  }

  function checkEdges () {
    if (!element.value) return /* v8 ignore -- defensive guard */

    const scrollTop = element.value.scrollTop
    const scrollHeight = element.value.scrollHeight
    const clientHeight = element.value.clientHeight

    const distanceFromStart = Math.max(0, scrollTop - markerOffset)
    const distanceFromEnd = scrollHeight - (scrollTop + clientHeight)

    if (IN_BROWSER) {
      cancelAnimationFrame(edgeRaf)
      edgeRaf = requestAnimationFrame(() => {
        if (onStartReached && distanceFromStart <= startThreshold) {
          onStartReached(distanceFromStart)
        }

        if (onEndReached && distanceFromEnd <= endThreshold) {
          onEndReached(distanceFromEnd)
        }
      })
    /* v8 ignore start -- SSR fallback */
    } else {
      if (onStartReached && distanceFromStart <= startThreshold) {
        onStartReached(distanceFromStart)
      }
      if (onEndReached && distanceFromEnd <= endThreshold) {
        onEndReached(distanceFromEnd)
      }
    }
    /* v8 ignore stop */
  }

  function remember (index: number, height: number) {
    if (!itemKey || index < 0 || index >= items.value.length) return
    measured.set(itemKey(items.value[index]!, index), height)
  }

  function onRepairFrame () {
    repairPending = false
    if (repairScheduled !== repairEpoch) return
    flushRepair()
  }

  function scheduleRepair () {
    if (!IN_BROWSER) {
      flushRepair()
      return
    }

    repairScheduled = repairEpoch
    if (repairPending) cancelAnimationFrame(rebuildRaf)
    repairPending = true
    rebuildRaf = requestAnimationFrame(onRepairFrame)
  }

  function flushRepair () {
    const count = repairCount
    const index = repairIndex
    const prev = repairPrev
    const dirty = fallbackDirty
    repairCount = 0
    fallbackDirty = false
    if (count === 0 && !dirty) return

    // One changed row: every later offset moves by the same delta.
    // A fallback change or a second resize in the same frame rewrites the prefix.
    if (
      !dirty
      && count === 1
      && index >= 0
      && index < heights.length
      && offsets.length === heights.length
    ) {
      const fallback = itemHeight.value || FALLBACK_HEIGHT
      const next = heights[index] || fallback
      const before = prev || fallback
      const delta = next - before
      if (delta !== 0) {
        shiftOffsets(offsets, index + 1, delta)
        if (!retarget(index, delta, fallback)) update()
      }
    } else {
      writeOffsets()
      update()
    }

    restoreAnchor()
  }

  function resize (index: number, height: number) {
    if (index < 0 || index >= heights.length) return
    const current = heights[index]!
    if (current === height) return
    if (repairCount === 0) {
      repairIndex = index
      repairPrev = current
    }
    repairCount++
    heights[index] = height
    if (itemKey) remember(index, height)
    /* v8 ignore next -- first-call only: itemHeight bootstrapped from initial measurement */
    if (!itemHeight.value) {
      itemHeight.value = height
      fallbackDirty = true
    }
    scheduleRepair()
  }

  function scroll () {
    const now = IN_BROWSER ? performance.now() : 0
    if (now - lastScrollAt >= 500) refreshMarker()
    lastScrollAt = now

    if (IN_BROWSER) {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)

      checkEdges()
    /* v8 ignore start -- SSR fallback */
    } else update()
    /* v8 ignore stop */
  }

  function pinEnd () {
    const top = contentHeight()
    applyWindow(top)
    clampHeight = 0
    const token = ++clampToken
    writeTop(portTop(top), 'auto', token)
  }

  function writeTop (top: number, behavior: ScrollToOptions['behavior'], token: number) {
    const node = element.value
    if (!node || token !== clampToken) return

    if (behavior === 'smooth') {
      node.scrollTo({ top, behavior: 'smooth' })
      update()
      return
    }

    node.scrollTop = top

    // Spacers for this window are in state, but the browser clamps scrollTop
    // until that layout exists. Retry while the scroll height is still growing.
    // A zero target fails `scrollTop < top - 1` on its own. Item 0 still retries
    // when a marker makes the port target positive.
    if (node.scrollTop < top - 1 && node.scrollHeight > clampHeight) {
      clampHeight = node.scrollHeight
      nextTick(() => {
        /* v8 ignore start -- SSR has no animation frame */
        if (!IN_BROWSER) {
          writeTop(top, behavior, token)
          return
        }
        /* v8 ignore stop */
        cancelAnimationFrame(clampRaf)
        clampRaf = requestAnimationFrame(() => {
          writeTop(top, behavior, token)
        })
      })
      return
    }

    clampHeight = 0
    update()
  }

  function scrollTo (index: number, scrollOptions?: ScrollToOptions) {
    if (!element.value) {
      pending = { index, options: scrollOptions }
      return
    }

    pending = null
    const behavior = scrollOptions?.behavior ?? 'auto'
    const block = scrollOptions?.block ?? 'start'
    const extraOffset = scrollOptions?.offset ?? 0
    const targetOffset = offsets[index] || 0

    let top = targetOffset + extraOffset

    switch (block) {
      case 'center': {
        const viewport = viewportOf()
        const itemH = heights[index] || estimate()
        top = targetOffset - (viewport / 2) + (itemH / 2) + extraOffset

        break
      }
      case 'end': {
        const viewport = viewportOf()
        const itemH = heights[index] || estimate()
        top = targetOffset - viewport + itemH + extraOffset

        break
      }
      case 'nearest': {
        const viewport = viewportOf()
        const currentScroll = listTop()
        const itemH = heights[index] || estimate()

        if (targetOffset < currentScroll) {
          top = targetOffset + extraOffset
        } else if (targetOffset + itemH > currentScroll + viewport) {
          top = targetOffset - viewport + itemH + extraOffset
        } else {
          return
        }

        break
      }
      // No default
    }

    if (behavior !== 'smooth') applyWindow(top)
    clampHeight = 0
    const token = ++clampToken
    writeTop(portTop(top), behavior, token)
  }

  function reset () {
    state.value = 'ok'
    anchorIndex = -1
    anchorOffset = 0
    if (element.value && direction === 'reverse' && items.value.length > 0) pinEnd()
  }

  onScopeDispose(() => {
    if (!IN_BROWSER) return

    cancelAnimationFrame(raf)
    cancelAnimationFrame(rebuildRaf)
    cancelAnimationFrame(edgeRaf)
    cancelAnimationFrame(clampRaf)
  }, true)

  return {
    element,
    items: computedItems,
    offset: readonly(offset),
    size: readonly(size),
    state,
    scrollTo,
    scroll,
    scrollend: scroll,
    resize,
    reset,
  }
}

/**
 * Creates a virtual scrolling context with dependency injection support.
 *
 * @param items Reactive array of items to virtualize
 * @param options Configuration options including namespace
 * @template T The type of the items
 * @returns Trinity tuple: [useVirtual, provideVirtual, defaultVirtual]
 *
 * @see https://0.vuetifyjs.com/composables/data/create-virtual
 *
 * @example
 * ```ts
 * // Create injectable context
 * const [useVirtual, provideVirtual, virtual] = createVirtualContext(items, {
 *   namespace: 'my-virtual',
 *   overscan: 10,
 * })
 *
 * // In parent component
 * provideVirtual()
 *
 * // In child component
 * const virtual = useVirtual()
 * ```
 */
export function createVirtualContext<T = unknown> (
  items: Ref<readonly T[]>,
  _options: VirtualContextOptions<T> = {},
): ContextTrinity<VirtualContext<T>> {
  const {
    namespace = 'v0:virtual',
    ...options
  } = _options

  const context = createVirtual<T>(items, options)

  return createTrinity<VirtualContext<T>>(namespace, context)
}

/**
 * Returns the current virtual context from dependency injection.
 *
 * @param namespace The namespace for the virtual context. Defaults to `v0:virtual`.
 * @template T The type of the items
 * @returns The current virtual context.
 *
 * @throws An error if the virtual context is not found and no default is provided.
 *
 * @see https://0.vuetifyjs.com/composables/data/create-virtual
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { createVirtual } from '@vuetify/v0'
 *
 *   // Inject virtual context provided by parent
 *   const virtual = useVirtual()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Visible items: {{ virtual.items.value.length }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useVirtual<T = unknown> (namespace = 'v0:virtual'): VirtualContext<T> {
  return useContext<VirtualContext<T>>(namespace)
}
