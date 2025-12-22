/**
 * @module useOverflow
 *
 * @remarks
 * Composable for computing how many items fit in a container based on available width.
 * Enables responsive truncation logic for Pagination, Breadcrumbs, and similar components.
 *
 * Key features:
 * - Container width tracking via ResizeObserver
 * - Two modes: variable-width (per-item) or uniform-width (sample-based)
 * - Computes capacity (how many items fit)
 * - SSR-safe with Infinity fallback
 * - Supports reserved space for nav buttons, ellipsis, etc.
 *
 * Use variable mode (default) for items with different widths like Breadcrumbs.
 * Use uniform mode (itemWidth option) for same-width items like Pagination buttons.
 */

import type { ContextTrinity } from '#v0/composables/createTrinity'
// Types
import type { App, ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Factories
import { createContext, useContext } from '#v0/composables/createContext'

import { createTrinity } from '#v0/composables/createTrinity'
// Composables
import { useElementSize } from '#v0/composables/useResizeObserver'

import { isUndefined } from '#v0/utilities'
// Utilities
import { computed, shallowRef, toRef, toValue } from 'vue'

export interface OverflowOptions {
  /**
   * Container element to track. Can be a ref, getter, or MaybeRefOrGetter.
   * When provided, useOverflow tracks this element's width automatically.
   */
  container?: MaybeRefOrGetter<Element | undefined>
  /** Gap between items in pixels */
  gap?: MaybeRefOrGetter<number>
  /** Reserved space in pixels (for nav buttons, ellipsis, etc) */
  reserved?: MaybeRefOrGetter<number>
  /**
   * Uniform item width in pixels. When provided, enables uniform mode
   * where capacity is calculated as available space / itemWidth.
   * Use this for same-width items like pagination buttons.
   */
  itemWidth?: MaybeRefOrGetter<number>
  /**
   * Calculate capacity from end instead of start.
   * Useful for breadcrumbs where trailing items take priority.
   * Only affects variable mode (uniform mode capacity is direction-independent).
   */
  reverse?: MaybeRefOrGetter<boolean>
}

export interface OverflowContext {
  /** Container element ref */
  container: ShallowRef<Element | undefined>
  /** Current container width */
  width: Readonly<ShallowRef<number>>
  /** How many items fit in available space */
  capacity: ComputedRef<number>
  /** Total width of all measured items */
  total: ComputedRef<number>
  /** Whether items overflow the container */
  isOverflowing: Readonly<Ref<boolean>>
  /** Register an item's element for width measurement */
  measure: (index: number, el: Element | undefined) => void
  /** Clear all measurements */
  reset: () => void
}

export interface OverflowContextOptions extends OverflowOptions {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a new overflow context for computing how many items fit in a container.
 *
 * @param options Configuration options
 * @returns Overflow context with container ref, capacity, and measurement functions
 *
 * @example Variable-width mode (Breadcrumbs)
 * ```vue
 * <script lang="ts" setup>
 *   import { useTemplateRef } from 'vue'
 *   import { createOverflow } from '@vuetify/v0'
 *
 *   const containerRef = useTemplateRef('container')
 *   const overflow = createOverflow({
 *     container: containerRef,
 *     gap: 8,
 *     reserved: 40,
 *   })
 * </script>
 *
 * <template>
 *   <div ref="container">
 *     <span
 *       v-for="(item, i) in items.slice(0, overflow.capacity.value)"
 *       :key="i"
 *       :ref="el => overflow.measure(i, el)"
 *     >
 *       {{ item }}
 *     </span>
 *     <span v-if="overflow.isOverflowing.value">...</span>
 *   </div>
 * </template>
 * ```
 *
 * @example Uniform-width mode (Pagination)
 * ```ts
 * const overflow = createOverflow({
 *   container: () => atom.value?.element,
 *   itemWidth: buttonWidth,
 *   reserved: () => buttonWidth.value * 4,
 * })
 * ```
 */
export function createOverflow<
  E extends OverflowContext = OverflowContext,
> (options: OverflowOptions = {}): E {
  const {
    container: _container,
    gap = 0,
    reserved = 0,
    itemWidth,
    reverse,
  } = options

  const container = isUndefined(_container) ? shallowRef<Element | undefined>() : toRef(_container)
  const widths = shallowRef<Map<number, number>>(new Map())

  const { width } = useElementSize(container)

  function measure (index: number, el: Element | undefined) {
    if (!el) {
      if (widths.value.has(index)) {
        const next = new Map(widths.value)
        next.delete(index)
        widths.value = next
      }
      return
    }

    const style = getComputedStyle(el)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    const w = (el as HTMLElement).offsetWidth + marginX

    if (widths.value.get(index) !== w) {
      widths.value = new Map(widths.value).set(index, w)
    }
  }

  function reset () {
    widths.value = new Map()
  }

  const total = computed(() => {
    const g = toValue(gap)
    let sum = 0
    let count = 0

    for (const w of widths.value.values()) {
      sum += w + (count > 0 ? g : 0)
      count++
    }

    return sum
  })

  const capacity = computed(() => {
    const available = width.value - toValue(reserved)

    // SSR or not measured yet - show all
    if (width.value === 0) return Infinity
    if (available <= 0) return 0

    const g = toValue(gap)
    const uniformWidth = toValue(itemWidth)

    // Uniform mode: calculate how many items of fixed width fit
    if (uniformWidth && uniformWidth > 0) {
      // First item: uniformWidth, subsequent: uniformWidth + gap
      // available >= w + (n-1)(w+g) => n <= (available - w) / (w+g) + 1
      const first = uniformWidth
      const subsequent = uniformWidth + g
      if (available < first) return 0
      return Math.max(1, Math.floor((available - first) / subsequent) + 1)
    }

    // Variable mode: sum measured widths until overflow
    const entries = [...widths.value.entries()].toSorted((a, b) => a[0] - b[0])
    if (toValue(reverse)) entries.reverse()

    let sum = 0
    let count = 0

    for (const [, w] of entries) {
      const next = sum + w + (count > 0 ? g : 0)
      if (next > available) break
      sum = next
      count++
    }

    return count
  })

  const isOverflowing = toRef(() => {
    return total.value > (width.value - toValue(reserved))
  })

  return {
    container,
    width,
    capacity,
    total,
    isOverflowing,
    measure,
    reset,
  } as E
}

/**
 * Creates an overflow context with dependency injection support.
 *
 * @param options Configuration options including namespace
 * @returns Trinity tuple: [useContext, provideContext, defaultContext]
 *
 * @example
 * ```ts
 * // Create injectable context
 * const [useOverflow, provideOverflow, overflow] = createOverflowContext({
 *   namespace: 'my-overflow',
 *   gap: 8,
 *   reserved: 160,
 * })
 *
 * // In parent component
 * provideOverflow()
 *
 * // In child component
 * const overflow = useOverflow()
 * ```
 */
export function createOverflowContext<
  E extends OverflowContext = OverflowContext,
> (_options: OverflowContextOptions = {}): ContextTrinity<E> {
  const {
    namespace = 'v0:overflow',
    ...options
  } = _options

  const [useOverflowContext, _provideOverflowContext] = createContext<E>(namespace)

  const context = createOverflow<E>(options)

  function provideOverflowContext (_context: E = context, app?: App): E {
    return _provideOverflowContext(_context, app)
  }

  return createTrinity<E>(useOverflowContext, provideOverflowContext, context)
}

/**
 * Returns the current overflow context from dependency injection.
 *
 * @param namespace The namespace for the overflow context. Defaults to `v0:overflow`.
 * @returns The current overflow context.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { useOverflow } from '@vuetify/v0'
 *
 *   // Inject overflow context provided by parent
 *   const overflow = useOverflow()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Capacity: {{ overflow.capacity.value }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useOverflow<
  E extends OverflowContext = OverflowContext,
> (namespace = 'v0:overflow'): E {
  return useContext<E>(namespace)
}
