/**
 * @module usePagination
 *
 * @remarks
 * Pagination composable that extends useStep with pagination-specific computed properties and methods.
 *
 * Key features:
 * - 1-based page numbers for user-friendly API
 * - Computed properties: page, length, from, to, hasNext, hasPrev
 * - go method for direct page navigation
 * - Optional auto-generation of pages from count/size
 * - Perfect for data tables, lists, galleries, search results
 *
 * Inheritance chain: useRegistry → useSelection → useSingle → useStep → usePagination
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createStep } from '#v0/composables/useStep'

// Utilities
import { toRef, toValue } from 'vue'
import { isUndefined } from '#v0/utilities'

// Types
import type { App, ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { StepContext, StepContextOptions, StepOptions, StepTicket } from '#v0/composables/useStep'

export interface PaginationTicket extends StepTicket {}

export interface PaginationContext<Z extends PaginationTicket> extends StepContext<Z> {
  /** Current page number (1-based) */
  page: ComputedRef<number>
  /** Total number of pages */
  length: ComputedRef<number>
  /** Total number of items being paginated */
  count: ComputedRef<number>
  /** Index of the first item on the current page (1-based) */
  from: ComputedRef<number>
  /** Index of the last item on the current page (1-based) */
  to: ComputedRef<number>
  /** Whether there is a next page available */
  hasNext: ComputedRef<boolean>
  /** Whether there is a previous page available */
  hasPrev: ComputedRef<boolean>
  /** Navigate to a specific page by number (1-based) */
  go: (page: number) => void
}

export interface PaginationOptions extends StepOptions {
  /**
   * Number of items per page.
   * Used for computing `from`, `to`, and auto-generating pages when `count` is provided.
   * @default 10
   */
  size?: MaybeRefOrGetter<number>
  /**
   * Total number of items to paginate.
   * When provided with `size`, pages are auto-generated.
   */
  count?: MaybeRefOrGetter<number>
}

export interface PaginationContextOptions extends StepContextOptions {
  /**
   * Number of items per page.
   * @default 10
   */
  size?: MaybeRefOrGetter<number>
  /**
   * Total number of items to paginate.
   */
  count?: MaybeRefOrGetter<number>
}

/**
 * Creates a new pagination instance for navigating through pages.
 *
 * Extends `createStep` with pagination-specific computed properties like `page`, `length`,
 * `from`, `to`, `forward`, `backward`, and a `go` method for direct navigation.
 *
 * @param options The options for the pagination instance.
 * @template Z The type of the pagination ticket.
 * @template E The type of the pagination context.
 * @returns A new pagination instance with pagination methods and computed properties.
 *
 * @remarks
 * **Key Features:**
 * - **1-based Page Numbers**: User-friendly `page` property (1, 2, 3...) instead of 0-based indexes
 * - **Computed Metadata**: `length`, `from`, `to` for displaying pagination info
 * - **Navigation Helpers**: `hasNext`, `hasPrev` for enabling/disabling UI controls
 * - **Direct Navigation**: `go(n)` to jump to any page
 * - **Auto-generation**: Optionally provide `count` and `size` to auto-create pages
 *
 * **Computed Properties:**
 * - `page`: Current page number (1-based, 0 if no selection)
 * - `length`: Total number of pages (equals registry size)
 * - `count`: Total items (computed from pages if not provided)
 * - `from`: First item index on current page (1-based)
 * - `to`: Last item index on current page (1-based)
 * - `hasNext`: True if not on last page
 * - `hasPrev`: True if not on first page
 *
 * **Inherited Navigation:**
 * - `first()`: Go to first page
 * - `last()`: Go to last page
 * - `next()`: Go to next page
 * - `prev()`: Go to previous page
 * - `step(count)`: Step through pages by count
 *
 * **Inheritance Chain:**
 * `useRegistry` → `useSelection` → `useSingle` → `useStep` → `usePagination`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-pagination
 *
 * @example
 * ```ts
 * import { createPagination } from '@vuetify/v0'
 *
 * // Manual page registration
 * const pagination = createPagination({ size: 25 })
 * pagination.onboard([
 *   { id: 'page-1', value: 1 },
 *   { id: 'page-2', value: 2 },
 *   { id: 'page-3', value: 3 },
 * ])
 * pagination.first() // Go to page 1
 *
 * console.log(pagination.page.value) // 1
 * console.log(pagination.length.value) // 3
 * console.log(pagination.from.value) // 1
 * console.log(pagination.to.value) // 25
 * console.log(pagination.hasNext.value) // true
 * console.log(pagination.hasPrev.value) // false
 *
 * pagination.go(3)
 * console.log(pagination.page.value) // 3
 *
 * // Auto-generate pages from count
 * const autoPagination = createPagination({
 *   count: 100,
 *   size: 10,
 * })
 * // Automatically creates 10 pages
 * console.log(autoPagination.length.value) // 10
 * ```
 */
export function createPagination<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (_options: PaginationOptions = {}): E {
  const {
    size: _size = 10,
    count: _count,
    ...options
  } = _options

  const registry = createStep<Z, E>(options)

  // If count is provided, auto-generate pages
  if (!isUndefined(_count)) {
    const countValue = toValue(_count)
    const sizeValue = toValue(_size)
    const pages = Math.ceil(countValue / sizeValue)

    for (let i = 1; i <= pages; i++) {
      registry.register({ id: `page-${i}`, value: i } as Partial<Z>)
    }
  }

  const count = toRef(() => {
    if (!isUndefined(_count)) return toValue(_count)
    // If count not provided, estimate from pages
    return registry.size * toValue(_size)
  })

  const page = toRef(() => {
    const index = registry.selectedIndex.value
    return index >= 0 ? index + 1 : 0
  })

  const length = toRef(() => registry.size)

  const from = toRef(() => {
    const current = page.value
    if (current === 0) return 0
    return (current - 1) * toValue(_size) + 1
  })

  const to = toRef(() => {
    const current = page.value
    if (current === 0) return 0
    const last = current * toValue(_size)
    return Math.min(last, count.value)
  })

  const hasNext = toRef(() => {
    const current = page.value
    return current > 0 && current < length.value
  })

  const hasPrev = toRef(() => {
    const current = page.value
    return current > 1
  })

  function go (target: number) {
    registry.goto(target - 1)
  }

  return {
    ...registry,
    page,
    length,
    count,
    from,
    to,
    hasNext,
    hasPrev,
    go,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new pagination context.
 *
 * @param options The options for the pagination context.
 * @template Z The type of the pagination ticket.
 * @template E The type of the pagination context.
 * @returns A new pagination context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-pagination
 *
 * @example
 * ```ts
 * import { createPaginationContext } from '@vuetify/v0'
 *
 * export const [useTablePagination, provideTablePagination, tablePagination] = createPaginationContext({
 *   namespace: 'table-pagination',
 *   size: 20,
 * })
 *
 * // In a parent component:
 * provideTablePagination()
 *
 * // In a child component:
 * const pagination = useTablePagination()
 * pagination.go(2)
 * ```
 */
export function createPaginationContext<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (_options: PaginationContextOptions): ContextTrinity<E> {
  const { namespace, ...options } = _options
  const [usePaginationContext, _providePaginationContext] = createContext<E>(namespace)
  const context = createPagination<Z, E>(options)

  function providePaginationContext (_context: E = context, app?: App): E {
    return _providePaginationContext(_context, app)
  }

  return createTrinity<E>(usePaginationContext, providePaginationContext, context)
}

/**
 * Returns the current pagination instance.
 *
 * @param namespace The namespace for the pagination context. Defaults to `'v0:pagination'`.
 * @returns The current pagination instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-pagination
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { usePagination } from '@vuetify/v0'
 *
 *   const pagination = usePagination()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Page {{ pagination.page }} of {{ pagination.length }}</p>
 *     <p>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.count }}</p>
 *     <button :disabled="!pagination.hasPrev" @click="pagination.prev()">Previous</button>
 *     <button :disabled="!pagination.hasNext" @click="pagination.next()">Next</button>
 *   </div>
 * </template>
 * ```
 */
export function usePagination<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (namespace = 'v0:pagination'): E {
  return useContext<E>(namespace)
}
