/**
 * @module createOverflow
 *
 * @see https://0.vuetifyjs.com/composables/semantic/create-overflow
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
 * Use uniform mode when every item is the `itemWidth` you pass.
 * Set `probe` when the fitting count is not mounted yet. Render `capacity`, measure, then `settle()`.
 *
 * ## Item registration contract
 *
 * Every child item must call `measure(index, el)` on mount and
 * `measure(index, undefined)` on unmount, regardless of mode. The width arg
 * is recorded in both modes but **only consumed by uniform mode for
 * isOverflowing's count** — capacity in uniform mode is derived purely
 * from `itemWidth`. Variable mode uses the per-item widths for both
 * capacity and isOverflowing.
 *
 * Consumers that compute their own capacity outside this composable (e.g.,
 * with a separate registry) still need the measure() calls if they want
 * `isOverflowing` to reflect reality — without them the count source is
 * empty and the signal is permanently false.
 *
 * @example
 * ```ts
 * import { useTemplateRef } from 'vue'
 * import { createOverflow } from '@vuetify/v0'
 *
 * const el = useTemplateRef('container')
 * const overflow = createOverflow({ container: el })
 * console.log(overflow.capacity.value) // number of items that fit
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'
import { useRaf } from '#v0/composables/useRaf'
import { useElementSize, useResizeObserver } from '#v0/composables/useResizeObserver'

// Transformers
import { toElement } from '#v0/composables/toElement'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isNumber, isUndefined, pxToNumber } from '#v0/utilities'
import { computed, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export interface OverflowOptions {
  /**
   * Container element to track. Can be a ref, getter, or MaybeRefOrGetter.
   * When provided, useOverflow tracks this element's width automatically.
   * Also accepts Vue `useTemplateRef` — Vue 3.5.42 wraps that in a deep
   * `Readonly<Ref>` that is not assignable to `MaybeRefOrGetter`.
   */
  container?: MaybeRefOrGetter<Element | null | undefined> | { readonly value: unknown }
  /** Gap between items in pixels */
  gap?: MaybeRefOrGetter<number>
  /** Reserved space in pixels (for nav buttons, ellipsis, etc) */
  reserved?: MaybeRefOrGetter<number>
  /** Uniform item width. Every item must actually be this width. */
  itemWidth?: MaybeRefOrGetter<number>
  /**
   * Fit a count that is not mounted yet. Render `capacity`, measure, then call `settle()`. Off by default.
   * @example
   * ```ts
   * const overflow = createOverflow({ container, probe: true, max: () => totalVisible })
   * ```
   */
  probe?: boolean
  /** Largest count probe mode may ask for. */
  max?: MaybeRefOrGetter<number | undefined>
  /**
   * Content-box budget in pixels. When omitted, probe claims free space in the parent instead of the element's own width.
   */
  budget?: MaybeRefOrGetter<number | undefined>
  /**
   * Calculate capacity from end instead of start.
   * Useful for breadcrumbs where trailing items take priority.
   * Only affects variable mode (uniform mode capacity is direction-independent).
   */
  reverse?: MaybeRefOrGetter<boolean>
}

export interface OverflowContext {
  /** Container element ref */
  container: ShallowRef<Element | null | undefined>
  /** Current container width */
  width: Readonly<ShallowRef<number>>
  /** How many items fit in available space */
  capacity: ComputedRef<number>
  /** Total width of all measured items */
  total: ComputedRef<number>
  /** Whether items overflow the container */
  isOverflowing: Readonly<Ref<boolean>>
  /**
   * Register an item's element for width measurement. Required for every
   * child in both modes — variable mode reads the measured widths for
   * capacity; uniform mode reads only the entry count for isOverflowing.
   * Pass `undefined` to unregister.
   */
  measure: (index: number, el: Element | undefined) => void
  /** Clear all measurements */
  reset: () => void
  /** Probe step. No-op unless `probe` is set. Call after `measure`. */
  settle: (committed?: boolean) => void
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
 * @example Uniform-width mode
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
    probe = false,
    max,
    budget,
  } = options

  const container = isUndefined(_container)
    ? shallowRef<Element | null | undefined>()
    : toRef(() => toElement(_container as MaybeElementRef) ?? null)
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

    /* v8 ignore start -- browser-only measurement code */
    if (!IN_BROWSER) return

    const style = getComputedStyle(el)
    const marginX = pxToNumber(style.marginLeft) + pxToNumber(style.marginRight)
    const w = ((el as HTMLElement).offsetWidth || 0) + marginX

    if (widths.value.get(index) !== w) {
      widths.value = new Map(widths.value).set(index, w)
    }
    /* v8 ignore stop */
  }

  function reset () {
    widths.value = new Map()
  }

  // low: largest count that fit. high: smallest that overflowed (0 = unknown).
  // Same count with new widths clears the search. A resize scales by the narrowest item,
  // not the average — the average includes the wide last page and the next drag stops short.
  const target = shallowRef(Infinity)
  const fitting = shallowRef(true)
  let low = 0
  let high = 0
  let lastCount = -1
  let lastSignature = ''
  let steps = 0
  const seen = new Set<number>()
  // Counts the caller rendered shorter than asked. visible <= 2 comes back as one button.
  const collapsed = new Set<number>()
  let lastShort = -1
  let pitch = 0
  let basisCount = 0
  let basisFree = 0

  function forget () {
    low = 0
    high = 0
    steps = 0
    seen.clear()
    lastShort = -1
    pitch = 0
    basisCount = 0
    basisFree = 0
  }

  function assign (next: number) {
    const clamped = Math.max(1, next)
    const stuck = seen.has(clamped) && clamped !== target.value
    if (!stuck) {
      seen.add(clamped)
      if (target.value === clamped) return
      steps++
    }
    if (stuck || steps > 24) {
      const frozen = low > 0 ? low : clamped
      if (target.value !== frozen) target.value = frozen
      return
    }
    target.value = clamped
  }

  // A flex-grow sibling with min-width:auto is free space.
  // An explicit px min, or a sibling that does not grow, is not.
  function claimable (el: HTMLElement): number {
    const parent = el.parentElement
    if (!parent) return width.value
    const parentStyle = getComputedStyle(parent)
    let others = 0
    let kids = 0
    for (const child of parent.children) {
      if (!(child instanceof HTMLElement)) continue
      const style = getComputedStyle(child)
      if (style.display === 'none' || style.position === 'absolute' || style.position === 'fixed') continue
      kids++
      if (child === el) continue
      const grows = Number.parseFloat(style.flexGrow) > 0
      const min = style.minWidth.endsWith('px')
        ? pxToNumber(style.minWidth)
        : (grows ? 0 : child.getBoundingClientRect().width)
      others += min + pxToNumber(style.marginLeft) + pxToNumber(style.marginRight)
    }
    const gapPx = pxToNumber(parentStyle.columnGap) || pxToNumber(parentStyle.gap)
    const style = getComputedStyle(el)
    const chrome = pxToNumber(style.marginLeft) + pxToNumber(style.marginRight)
      + pxToNumber(style.paddingLeft) + pxToNumber(style.paddingRight)
      + pxToNumber(style.borderLeftWidth) + pxToNumber(style.borderRightWidth)
    const inner = parent.clientWidth - pxToNumber(parentStyle.paddingLeft) - pxToNumber(parentStyle.paddingRight)
    return Math.max(width.value, inner - others - Math.max(0, kids - 1) * gapPx - chrome)
  }

  function room (): number {
    const explicit = toValue(budget)
    if (isNumber(explicit) && explicit > 0) return explicit
    if (!IN_BROWSER || !container.value) return width.value
    return claimable(container.value as HTMLElement)
  }

  function settle (committed = true) {
    if (!probe) return
    const live = room()
    if (!(live > 0)) {
      if (target.value !== Infinity) target.value = Infinity
      return
    }
    const entries = [...widths.value.values()]
    const count = entries.length
    if (count === 0) return

    const gapPx = toValue(gap)
    const reservedPx = toValue(reserved)
    // reserved already includes one gap per control.
    const cost = entries.reduce((acc, item) => acc + item, 0) + gapPx * Math.max(0, count - 1) + reservedPx
    const nav = container.value as HTMLElement | null
    const fits = cost <= live + 0.5 && !(nav && nav.clientWidth > 0 && nav.scrollWidth > nav.clientWidth + 1)
    const sig = [...widths.value.entries()]
      .toSorted((a, b) => a[0] - b[0])
      .map(([index, item]) => `${index}:${Math.round(item)}`)
      .join(',')
    if (count === lastCount && sig !== lastSignature) forget()
    lastCount = count
    lastSignature = sig

    const raw = toValue(max)
    const ceiling = isNumber(raw) && raw > 0 ? Math.floor(raw) : Infinity
    const free = live - reservedPx
    const step = Math.min(...entries) + gapPx

    function stay () {
      if (step > 0) {
        pitch = step
        basisCount = count
        basisFree = free
      }
      assign(count)
    }

    function place (next: number, priced = false) {
      let clamped = Math.max(1, Math.min(ceiling, Math.floor(next)))
      while (collapsed.has(clamped) && clamped < ceiling) clamped++
      // Priced steps keep the sub-pitch remainder. Spending it stops a drag one slot early.
      if (priced) basisFree += (clamped - basisCount) * pitch
      else basisFree = free
      basisCount = clamped
      seen.clear()
      steps = 0
      low = 0
      high = 0
      lastShort = -1
      if (!fits) fitting.value = false
      if (target.value !== clamped) target.value = clamped
    }

    function slide (): boolean {
      // forget() already dropped the pitch, so a width change cannot take this path.
      if (!(pitch > 0)) return false
      const projected = basisCount + Math.trunc((free - basisFree) / pitch)
      // Fewer slots than asked. Let the search climb past the refused count.
      if (committed && count < target.value) return false
      if (!fits && committed && count === target.value) place(projected < count ? projected : count - 1)
      else if (projected > basisCount || (projected < basisCount && !fits)) place(projected, true)
      return true
    }

    function down () {
      fitting.value = false
      high = high > 0 ? Math.min(high, count) : count
      if (low >= count) low = 0
      if (count <= 1) return assign(1)
      assign(Math.min(count - 1, Math.max(low, Math.floor((low + count) / 2))))
    }

    function search () {
      // Uncommitted settles run before paint. A half row is not a refused count.
      if (!committed && (target.value === Infinity || count !== target.value || !fits)) return
      const short = fits && target.value !== Infinity && count < target.value
      if (short) {
        collapsed.add(target.value)
        if (count === lastShort) {
          fitting.value = true
          low = Math.max(low, count)
          return stay()
        }
        lastShort = count
      }
      if (!fits) return down()

      fitting.value = true
      low = Math.max(low, count)
      if (!short && count >= ceiling) return count === ceiling ? stay() : assign(ceiling)
      if (!short && high > 0 && high <= count + 1) return stay()
      if (!short && high === 0) {
        const extra = step > 0 ? Math.floor((live - cost + gapPx) / step) : 0
        if (extra <= 0) return stay()
        return assign(Math.min(ceiling, count + Math.min(8, extra)))
      }
      let next = count + 1
      if (high > 0) next = Math.max(next, Math.floor((count + high) / 2))
      if (short) while (collapsed.has(next) && next < ceiling && (high === 0 || next < high)) next++
      // Asking for high repeats a count that already overflowed.
      if (high > 0 && next >= high) return stay()
      assign(Math.min(ceiling, next))
    }

    if (slide()) return
    search()
  }

  if (probe) {
    const schedule = useRaf(() => {
      settle(false)
    })
    watch(width, () => schedule(), { flush: 'post' })
    useResizeObserver(
      () => container.value?.parentElement,
      () => schedule(),
    )
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
    if (probe) return target.value

    const available = width.value - toValue(reserved)

    // SSR or not measured yet - show all
    if (width.value === 0) return Infinity
    if (available <= 0) return 0

    const g = toValue(gap)
    const uniformWidth = toValue(itemWidth) ?? 0

    // Uniform mode: calculate how many items of fixed width fit
    // If itemWidth option was provided but value is 0, not measured yet - show all
    if (!isUndefined(itemWidth) && uniformWidth <= 0) return Infinity
    if (uniformWidth > 0) {
      // First item: uniformWidth, subsequent: uniformWidth + gap
      // available >= w + (n-1)(w+g) => n <= (available - w) / (w+g) + 1
      const subsequent = uniformWidth + g
      if (available < uniformWidth) return 0
      return Math.max(1, Math.floor((available - uniformWidth) / subsequent) + 1)
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
    if (probe) {
      const explicit = toValue(budget)
      if (width.value === 0 && !(isNumber(explicit) && explicit > 0)) return false
      return !fitting.value
    }

    if (width.value === 0) return false

    // Uniform mode (itemWidth set): registered count vs capacity drives the
    // signal. Measured widths in `widths` are irrelevant — itemWidth is the
    // canonical width. Consumers must still call measure(i, el) per item
    // to signal presence; the width arg is recorded but ignored here.
    if (!isUndefined(itemWidth)) {
      const cap = capacity.value
      if (cap === Infinity) return false
      return widths.value.size > cap
    }

    // Variable mode: sum of measured widths vs available.
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
    settle,
  } as E
}

/**
 * Creates an overflow context with dependency injection support.
 *
 * @param options Configuration options including namespace
 * @template E The type of the overflow context
 * @returns Trinity tuple: [useOverflow, provideOverflow, defaultOverflow]
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

  const context = createOverflow<E>(options)

  return createTrinity<E>(namespace, context)
}

/**
 * Returns the current overflow context from dependency injection.
 *
 * @param namespace The namespace for the overflow context. Defaults to `v0:overflow`.
 * @template E The type of the overflow context
 * @returns The current overflow context.
 *
 * @throws An error if the overflow context is not found and no default is provided.
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
