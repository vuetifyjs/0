/**
 * @module createVirtual
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

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useResizeObserver } from '#v0/composables/useResizeObserver'

// Utilities
import { clamp, isFunction, isNumber } from '#v0/utilities'
import { computed, onScopeDispose, readonly, ref, shallowRef, watch } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, Ref, ShallowRef } from 'vue'

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

export interface VirtualContextOptions extends VirtualOptions {
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
 * @see https://0.vuetifyjs.com/composables/utilities/create-virtual
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
export function createVirtual<T = unknown> (
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

    /* v8 ignore start -- browser-only style assignments */
    if (momentum) (el.style as any).webkitOverflowScrolling = 'touch'
    if (!elastic) el.style.overscrollBehavior = 'none'
    /* v8 ignore stop */
  })

  useResizeObserver(element, entries => {
    if (!entries[0]) return /* v8 ignore -- defensive guard */

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
    if (!element.value) return /* v8 ignore -- defensive guard */

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
      /* v8 ignore start -- default anchor capture */
      // Default: capture first visible item
      anchorIndex = first.value
      anchorOffset = element.value.scrollTop - (offsets.value[first.value] || 0)
      /* v8 ignore stop */
    }
  }

  function restoreAnchor () {
    if (!element.value || anchorIndex < 0) return

    const newScrollTop = (offsets.value[anchorIndex] || 0) + anchorOffset

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
    if (!element.value) return /* v8 ignore -- defensive guard */

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

  function resize (index: number, height: number) {
    if (heights.value[index] === height) return /* v8 ignore -- no-op when height unchanged */
    heights.value[index] = height
    if (!itemHeight.value) itemHeight.value = height /* v8 ignore -- first height assignment */
    if (IN_BROWSER) {
      cancelAnimationFrame(rebuildRaf)
      rebuildRaf = requestAnimationFrame(rebuild)
    /* v8 ignore start -- SSR fallback */
    } else rebuild()
    /* v8 ignore stop */
  }

  function scroll () {
    if (IN_BROWSER) {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)

      checkEdges()
    /* v8 ignore start -- SSR fallback */
    } else update()
    /* v8 ignore stop */
  }

  function scrollTo (index: number, scrollOptions?: ScrollToOptions) {
    if (!element.value) return /* v8 ignore -- defensive guard */

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

  onScopeDispose(() => {
    cancelAnimationFrame(raf)
    cancelAnimationFrame(rebuildRaf)
    cancelAnimationFrame(edgeRaf)
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
 * @see https://0.vuetifyjs.com/composables/utilities/create-virtual
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
  _options: VirtualContextOptions = {},
): ContextTrinity<VirtualContext<T>> {
  const {
    namespace = 'v0:virtual',
    ...options
  } = _options

  const [useVirtualContext, _provideVirtualContext] = createContext<VirtualContext<T>>(namespace)

  const context = createVirtual<T>(items, options)

  function provideVirtualContext (_context: VirtualContext<T> = context, app?: App): VirtualContext<T> {
    return _provideVirtualContext(_context, app)
  }

  return createTrinity<VirtualContext<T>>(useVirtualContext, provideVirtualContext, context)
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
 * @see https://0.vuetifyjs.com/composables/utilities/create-virtual
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
