/**
 * @module useVirtual
 *
 * @remarks
 * Virtual scrolling composable for efficiently rendering large lists.
 *
 * Key features:
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
 */

// Composables
import { useResizeObserver } from '#v0/composables/useResizeObserver'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { clamp, isFunction, isNumber } from '#v0/utilities'

// Vue
import { computed, readonly, ref, shallowRef, watch } from 'vue'

// Types
import type { ComputedRef, Ref, ShallowRef } from 'vue'

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

export interface VirtualOptions {
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
}

export interface VirtualItem<T = unknown> {
  raw: T
  index: number
}

export interface VirtualContext<T = unknown> {
  /**
   * The element that is being virtualized.
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { element } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { items } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { offset } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { size } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { state } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { scrollTo } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { element, scroll } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { scroll, scrollend } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { resize } = useVirtual(items)
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
   *   import { useVirtual } from '@vuetify/v0'
   *
   *   const { reset } = useVirtual(items)
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

/**
 * Virtual scrolling composable for efficiently rendering large lists
 *
 * @param items Reactive array of items to virtualize
 * @param options Configuration options
 * @returns Virtual scrolling context
 *
 * @see https://0.vuetifyjs.com/composables/utilities/use-virtual
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useVirtual } from '@vuetify/v0'
 *
 *   const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })))
 * </script>
 *
 * <template>
 *   <div
 *     ref="element"
 *     style="height: 600px; overflow-y: auto;"
 *     @scroll="scroll"
 *   >
 *     <div :style="{ height: `${offset}px` }" />
 *
 *     <div v-for="item in items" :key="item.index">
 *       {{ item.raw.name }}
 *     </div>
 *
 *     <div :style="{ height: `${size}px` }" />
 *   </div>
 * </template>
 * ```
 */
export function useVirtual<T = unknown> (
  items: Ref<readonly T[]>,
  _options: VirtualOptions = {},
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
  } = _options

  const element = ref<HTMLElement>()
  const itemHeight = shallowRef(Number.parseFloat(String(_itemHeight || 0)))
  const heights = shallowRef<(number | null)[]>([])
  const offsets = shallowRef<number[]>([])
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
  let edgeRaf = -1
  const cachedViewport = Number.parseInt(String(height)) || 0

  let anchorIndex = -1
  let anchorOffset = 0

  const computedItems = computed(() =>
    items.value.slice(first.value, last.value).map((item, i) => ({
      raw: item,
      index: i + first.value,
    })),
  )

  // Apply iOS optimizations when element is assigned
  watch(element, el => {
    if (!IN_BROWSER || !el?.style) return

    if (momentum) (el.style as any).webkitOverflowScrolling = 'touch'
    if (!elastic) el.style.overscrollBehavior = 'none'
  })

  useResizeObserver(element, entries => {
    if (!entries[0]) return

    viewportHeight.value = entries[0].contentRect.height

    update()
  })

  watch(items, newItems => {
    captureAnchor()
    const length = newItems.length
    const newHeights = heights.value.length === length ? heights.value : Array.from({ length }, () => null)
    if (heights.value !== newHeights) heights.value = newHeights as (number | null)[]
    rebuild()
  }, { immediate: true })

  watch(element, () => {
    if (!element.value) return

    if (direction === 'reverse' && items.value.length > 0) {
      const lastIndex = items.value.length - 1
      const totalHeight = (offsets.value[lastIndex] || 0) + (heights.value[lastIndex] || itemHeight.value)
      element.value.scrollTop = totalHeight
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
      if (isNumber(result)) {
        anchorIndex = result
        anchorOffset = element.value.scrollTop - (offsets.value[result] || 0)
      }
    } else {
      // Default: capture first visible item
      anchorIndex = first.value
      anchorOffset = element.value.scrollTop - (offsets.value[first.value] || 0)
    }
  }

  function restoreAnchor () {
    if (!element.value || anchorIndex < 0) return

    const newScrollTop = (offsets.value[anchorIndex] || 0) + anchorOffset

    if (anchorSmooth && direction === 'forward') {
      element.value.scrollTo({ top: newScrollTop, behavior: 'smooth' })
    } else {
      element.value.scrollTop = newScrollTop
    }

    anchorIndex = -1
    anchorOffset = 0
  }

  function rebuild () {
    const length = items.value.length
    const newOffsets = offsets.value.length === length ? offsets.value : Array.from<number>({ length })

    let offset = 0
    for (let i = 0; i < length; i++) {
      newOffsets[i] = offset
      offset += heights.value[i] || itemHeight.value
    }

    if (offsets.value !== newOffsets) offsets.value = newOffsets

    update()
    restoreAnchor()
  }

  function findIndex (scrollTop: number) {
    const arr = offsets.value
    if (arr.length === 0) return 0

    let low = 0
    let high = arr.length - 1

    while (low <= high) {
      const mid = (low + high) >> 1
      if (arr[mid]! <= scrollTop) low = mid + 1
      else high = mid - 1
    }

    return Math.max(0, high)
  }

  function update () {
    if (!element.value) return
    const viewport = viewportHeight.value || cachedViewport
    if (!viewport || !itemHeight.value) return

    const scrollTop = element.value.scrollTop || 0
    const length = items.value.length

    const visibleStart = findIndex(scrollTop)
    const visibleEnd = findIndex(scrollTop + viewport) + 1

    const start = clamp(visibleStart - overscan, 0, length)
    const end = clamp(visibleEnd + overscan, start, length)

    first.value = start
    last.value = end
    offset.value = offsets.value[start] || 0
    const lastIndex = length - 1
    const totalHeight = (offsets.value[lastIndex] || 0) + (heights.value[lastIndex] || itemHeight.value)
    size.value = totalHeight - (offsets.value[end] || totalHeight)
  }

  function checkEdges () {
    if (!element.value) return

    const scrollTop = element.value.scrollTop
    const scrollHeight = element.value.scrollHeight
    const clientHeight = element.value.clientHeight

    const distanceFromStart = scrollTop
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
    } else {
      if (onStartReached && distanceFromStart <= startThreshold) {
        onStartReached(distanceFromStart)
      }
      if (onEndReached && distanceFromEnd <= endThreshold) {
        onEndReached(distanceFromEnd)
      }
    }
  }

  function resize (index: number, height: number) {
    if (heights.value[index] === height) return
    heights.value[index] = height
    if (!itemHeight.value) itemHeight.value = height
    if (IN_BROWSER) {
      cancelAnimationFrame(rebuildRaf)
      rebuildRaf = requestAnimationFrame(rebuild)
    } else rebuild()
  }

  function scroll () {
    if (IN_BROWSER) {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)

      checkEdges()
    } else update()
  }

  function scrollTo (index: number, scrollOptions?: ScrollToOptions) {
    if (!element.value) return

    const targetOffset = offsets.value[index] || 0
    const behavior = scrollOptions?.behavior ?? 'auto'
    const block = scrollOptions?.block ?? 'start'
    const extraOffset = scrollOptions?.offset ?? 0

    let scrollTop = targetOffset + extraOffset

    switch (block) {
      case 'center': {
        const viewport = viewportHeight.value || cachedViewport
        const itemH = heights.value[index] || itemHeight.value
        scrollTop = targetOffset - (viewport / 2) + (itemH / 2) + extraOffset

        break
      }
      case 'end': {
        const viewport = viewportHeight.value || cachedViewport
        const itemH = heights.value[index] || itemHeight.value
        scrollTop = targetOffset - viewport + itemH + extraOffset

        break
      }
      case 'nearest': {
        const viewport = viewportHeight.value || cachedViewport
        const currentScroll = element.value.scrollTop
        const itemH = heights.value[index] || itemHeight.value

        if (targetOffset < currentScroll) {
          scrollTop = targetOffset + extraOffset
        } else if (targetOffset + itemH > currentScroll + viewport) {
          scrollTop = targetOffset - viewport + itemH + extraOffset
        } else {
          return // Already visible
        }

        break
      }
      // No default
    }

    if (behavior === 'smooth') {
      element.value.scrollTo({ top: scrollTop, behavior: 'smooth' })
    } else {
      element.value.scrollTop = scrollTop
    }

    // Update visible items immediately
    update()
  }

  function reset () {
    state.value = 'ok'
    anchorIndex = -1
    anchorOffset = 0
    if (element.value && direction === 'reverse' && items.value.length > 0) {
      const lastIndex = items.value.length - 1
      const totalHeight = (offsets.value[lastIndex] || 0) + (heights.value[lastIndex] || itemHeight.value)
      element.value.scrollTop = totalHeight
    }
  }

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
