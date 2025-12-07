/**
 * @module usePagination
 *
 * @remarks
 * Lightweight pagination composable for navigating through pages.
 *
 * Key features:
 * - No registry overhead - just a bounded integer
 * - Direct ref support for v-model compatibility
 * - Navigation methods: next, prev, first, last
 * - Computed visible items with ellipsis
 * - Trinity pattern for dependency injection
 *
 * Unlike registry-based composables, pagination tracks a single number
 * within a range, making it efficient for large page counts.
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { computed, isRef, shallowRef, toValue } from 'vue'
import { isNaN, range } from '#v0/utilities'

// Vue
import type { App, ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'

export type PaginationTicket =
  | { type: 'page', value: number }
  | { type: 'ellipsis', value: string }

export interface PaginationContext<Z extends PaginationTicket = PaginationTicket> {
  /** Current page (1-indexed) */
  page: ShallowRef<number>
  /** Items per page */
  itemsPerPage: number
  /** Total number of items */
  size: number
  /** Total number of pages (computed from size / itemsPerPage) */
  pages: number
  /** Ellipsis character, or false if disabled */
  ellipsis: string | false
  /** Visible page numbers and ellipsis for rendering */
  items: ComputedRef<Z[]>
  /** Start index of items on current page (0-indexed) */
  pageStart: ComputedRef<number>
  /** End index of items on current page (exclusive, 0-indexed) */
  pageStop: ComputedRef<number>
  /** Whether current page is the first page */
  isFirst: ComputedRef<boolean>
  /** Whether current page is the last page */
  isLast: ComputedRef<boolean>
  /** Go to first page */
  first: () => void
  /** Go to last page */
  last: () => void
  /** Go to next page */
  next: () => void
  /** Go to previous page */
  prev: () => void
  /** Go to specific page */
  select: (value: number) => void
}

export interface PaginationOptions {
  /** Initial page or ref for v-model (1-indexed). @default 1 */
  page?: number | ShallowRef<number>
  /** Items per page. @default 10 */
  itemsPerPage?: MaybeRefOrGetter<number>
  /** Total number of items. @default 0 */
  size?: MaybeRefOrGetter<number>
  /** Maximum visible page buttons. @default 5 */
  visible?: MaybeRefOrGetter<number>
  /** Ellipsis character. @default '…' */
  ellipsis?: string | false
}

export interface PaginationContextOptions extends PaginationOptions {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a pagination instance.
 *
 * @param options The options for the pagination instance.
 * @returns A pagination context with navigation methods.
 *
 * @example
 * ```ts
 * import { createPagination } from '@vuetify/v0'
 *
 * // Basic usage
 * const pagination = createPagination({ size: 100 })
 * pagination.next()
 * pagination.items.value // [{ type: 'page', value: 1 }, { type: 'page', value: 2 }, ...]
 *
 * // With v-model (pass a ref)
 * const page = ref(1)
 * const pagination = createPagination({ page, size: 100 })
 * // Mutating pagination.page or the passed ref syncs both
 * ```
 */
export function createPagination<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (_options: PaginationOptions = {}): E {
  const {
    page: _page = 1,
    itemsPerPage: _itemsPerPage = 10,
    size: _size = 0,
    visible: _visible = 7,
    ellipsis = '...',
  } = _options

  const page: ShallowRef<number> = isRef(_page) ? _page : shallowRef(_page)

  // Compute total pages from size (total items) and itemsPerPage
  const pages = computed(() => {
    const size = toValue(_size)
    const perPage = toValue(_itemsPerPage)
    if (size <= 0 || isNaN(size)) return 0
    return Math.ceil(size / perPage)
  })

  function first () {
    page.value = 1
  }

  function last () {
    page.value = Math.max(1, pages.value)
  }

  function next () {
    if (page.value < pages.value) page.value++
  }

  function prev () {
    if (page.value > 1) page.value--
  }

  function select (value: number) {
    if (value < 1) {
      page.value = 1
    } else if (value > pages.value) {
      page.value = Math.max(1, pages.value)
    } else {
      page.value = value
    }
  }

  const isFirst = computed(() => page.value <= 1)
  const isLast = computed(() => page.value >= pages.value)
  const pageStart = computed(() => (page.value - 1) * toValue(_itemsPerPage))
  const pageStop = computed(() => Math.min(pageStart.value + toValue(_itemsPerPage), toValue(_size)))

  function toPage (value: number): Z {
    return { type: 'page', value } as Z
  }

  function toEllipsis (): Z | false {
    return ellipsis === false ? false : { type: 'ellipsis', value: ellipsis } as Z
  }

  function filter (array: (Z | false)[]): Z[] {
    return array.filter(Boolean) as Z[]
  }

  const items = computed<Z[]>(() => {
    const pageCount = pages.value
    const visible = toValue(_visible)
    const current = page.value

    if (pageCount <= 0 || isNaN(pageCount) || pageCount > Number.MAX_SAFE_INTEGER) return []
    if (visible <= 0) return []
    if (visible <= 2) return [toPage(current)]
    if (pageCount <= visible) return range(pageCount, 1).map(toPage)
    if (visible === 3) {
      const mid = current <= 1 ? 2 : (current >= pageCount ? pageCount - 1 : current)
      return [toPage(1), toPage(mid), toPage(pageCount)]
    }

    const boundary = visible - 2
    const middle = visible - 4

    if (middle <= 0) {
      // [1, 2, 3, …, 10]
      if (current <= boundary) {
        return filter([...range(boundary, 1).map(toPage), toEllipsis(), toPage(pageCount)])
      }
      // [1, …, 8, 9, 10]
      if (current > pageCount - boundary) {
        return filter([toPage(1), toEllipsis(), ...range(boundary, pageCount - boundary + 1).map(toPage)])
      }
      // [1, 3, …, 10] or [1, …, 7, 10]
      return current <= Math.ceil(pageCount / 2)
        ? filter([toPage(1), toPage(current), toEllipsis(), toPage(pageCount)])
        : filter([toPage(1), toEllipsis(), toPage(current), toPage(pageCount)])
    }

    const leftThreshold = boundary - 1
    const rightThreshold = pageCount - boundary + 2

    // [1, 2, 3, 4, …, 20]
    if (current <= leftThreshold) {
      return filter([...range(boundary, 1).map(toPage), toEllipsis(), toPage(pageCount)])
    // [1, …, 17, 18, 19, 20]
    } else if (current >= rightThreshold) {
      return filter([toPage(1), toEllipsis(), ...range(boundary, pageCount - boundary + 1).map(toPage)])
    // [1, …, 9, 10, 11, …, 20]
    } else {
      const half = Math.floor(middle / 2)
      const start = current - half
      return filter([toPage(1), toEllipsis(), ...range(middle, start).map(toPage), toEllipsis(), toPage(pageCount)])
    }
  })

  return {
    page,
    ellipsis,
    items,
    pageStart,
    pageStop,
    isFirst,
    isLast,
    first,
    last,
    next,
    prev,
    select,
    get itemsPerPage () {
      return toValue(_itemsPerPage)
    },
    get size () {
      return toValue(_size)
    },
    get pages () {
      return pages.value
    },
  } as E
}

/**
 * Creates a pagination context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [usePagination, providePagination, defaultContext]
 *
 * @example
 * ```ts
 * // With default namespace 'v0:pagination'
 * const [usePagination, providePaginationContext] = createPaginationContext({ size: 50 })
 *
 * // Or with custom namespace
 * const [usePagination, providePaginationContext] = createPaginationContext({
 *   namespace: 'my-pagination',
 *   size: 50,
 * })
 *
 * // Parent component
 * providePaginationContext()
 *
 * // Child component
 * const pagination = usePagination()
 * pagination.next()
 * ```
 */
export function createPaginationContext<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (_options: PaginationContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:pagination', ...options } = _options
  const [usePaginationContext, _providePaginationContext] = createContext<E>(namespace)
  const context = createPagination<Z, E>(options)

  function providePaginationContext (_context: E = context, app?: App): E {
    return _providePaginationContext(_context, app)
  }

  return createTrinity<E>(usePaginationContext, providePaginationContext, context)
}

/**
 * Returns the current pagination instance from context.
 *
 * @param namespace The namespace. @default 'v0:pagination'
 * @returns The pagination context.
 *
 * @example
 * ```vue
 * <script setup>
 *  import { usePagination } from '@vuetify/v0'
 *
 *  const pagination = usePagination()
 * </script>
 *
 * <template>
 *   <button @click="pagination.prev()" :disabled="pagination.isFirst.value">Prev</button>
 *   <button @click="pagination.next()" :disabled="pagination.isLast.value">Next</button>
 * </template>
 * ```
 */
export function usePagination<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (namespace = 'v0:pagination'): E {
  return useContext<E>(namespace)
}
