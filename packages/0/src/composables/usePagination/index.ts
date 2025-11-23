/**
 * @module usePagination
 *
 * @remarks
 * Pagination composable that extends useStep with pagination-specific computed properties and methods.
 *
 * Key features:
 * - 1-based page numbers for user-friendly API
 * - Computed properties: page, totalPages, from, to, hasNextPage, hasPrevPage
 * - goToPage method for direct page navigation
 * - Optional auto-generation of pages from total/perPage
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
import { computed, toValue } from 'vue'
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
  totalPages: ComputedRef<number>
  /** Items per page (for metadata) */
  perPage: ComputedRef<number>
  /** Total number of items being paginated */
  total: ComputedRef<number>
  /** Index of the first item on the current page (1-based) */
  from: ComputedRef<number>
  /** Index of the last item on the current page (1-based) */
  to: ComputedRef<number>
  /** Whether there is a next page available */
  hasNextPage: ComputedRef<boolean>
  /** Whether there is a previous page available */
  hasPrevPage: ComputedRef<boolean>
  /** Navigate to a specific page by number (1-based) */
  goToPage: (pageNum: number) => void
}

export interface PaginationOptions extends StepOptions {
  /**
   * Number of items per page.
   * Used for computing `from`, `to`, and auto-generating pages when `total` is provided.
   * @default 10
   */
  perPage?: MaybeRefOrGetter<number>
  /**
   * Total number of items to paginate.
   * When provided with `perPage`, pages are auto-generated.
   */
  total?: MaybeRefOrGetter<number>
}

export interface PaginationContextOptions extends StepContextOptions {
  /**
   * Number of items per page.
   * @default 10
   */
  perPage?: MaybeRefOrGetter<number>
  /**
   * Total number of items to paginate.
   */
  total?: MaybeRefOrGetter<number>
}

/**
 * Creates a new pagination instance for navigating through pages.
 *
 * Extends `createStep` with pagination-specific computed properties like `page`, `totalPages`,
 * `from`, `to`, `hasNextPage`, `hasPrevPage`, and a `goToPage` method for direct navigation.
 *
 * @param options The options for the pagination instance.
 * @template Z The type of the pagination ticket.
 * @template E The type of the pagination context.
 * @returns A new pagination instance with pagination methods and computed properties.
 *
 * @remarks
 * **Key Features:**
 * - **1-based Page Numbers**: User-friendly `page` property (1, 2, 3...) instead of 0-based indexes
 * - **Computed Metadata**: `totalPages`, `from`, `to` for displaying pagination info
 * - **Navigation Helpers**: `hasNextPage`, `hasPrevPage` for enabling/disabling UI controls
 * - **Direct Navigation**: `goToPage(n)` to jump to any page
 * - **Auto-generation**: Optionally provide `total` and `perPage` to auto-create pages
 *
 * **Computed Properties:**
 * - `page`: Current page number (1-based, 0 if no selection)
 * - `totalPages`: Total number of pages (equals registry size)
 * - `perPage`: Items per page (from options, default 10)
 * - `total`: Total items (computed from pages if not provided)
 * - `from`: First item index on current page (1-based)
 * - `to`: Last item index on current page (1-based)
 * - `hasNextPage`: True if not on last page
 * - `hasPrevPage`: True if not on first page
 *
 * **Inherited Navigation:**
 * - `first()`: Go to first page
 * - `last()`: Go to last page
 * - `next()`: Go to next page
 * - `prev()`: Go to previous page
 * - `step(count)`: Step through pages by count
 *
 * **Inheritance Chain:**
 * `useRegistry` → `createSelection` → `createSingle` → `createStep` → `createPagination`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-pagination
 *
 * @example
 * ```ts
 * import { createPagination } from '@vuetify/v0'
 *
 * // Manual page registration
 * const pagination = createPagination({ perPage: 25 })
 * pagination.onboard([
 *   { id: 'page-1', value: 1 },
 *   { id: 'page-2', value: 2 },
 *   { id: 'page-3', value: 3 },
 * ])
 * pagination.first() // Go to page 1
 *
 * console.log(pagination.page.value) // 1
 * console.log(pagination.totalPages.value) // 3
 * console.log(pagination.from.value) // 1
 * console.log(pagination.to.value) // 25
 * console.log(pagination.hasNextPage.value) // true
 * console.log(pagination.hasPrevPage.value) // false
 *
 * pagination.goToPage(3)
 * console.log(pagination.page.value) // 3
 *
 * // Auto-generate pages from total
 * const autoPagination = createPagination({
 *   total: 100,
 *   perPage: 10,
 * })
 * // Automatically creates 10 pages
 * console.log(autoPagination.totalPages.value) // 10
 * ```
 */
export function createPagination<
  Z extends PaginationTicket = PaginationTicket,
  E extends PaginationContext<Z> = PaginationContext<Z>,
> (_options: PaginationOptions = {}): E {
  const {
    perPage: _perPage = 10,
    total: _total,
    ...options
  } = _options

  const registry = createStep<Z, E>(options)

  // If total is provided, auto-generate pages
  if (!isUndefined(_total)) {
    const totalValue = toValue(_total)
    const perPageValue = toValue(_perPage)
    const pageCount = Math.ceil(totalValue / perPageValue)

    for (let i = 1; i <= pageCount; i++) {
      registry.register({ id: `page-${i}`, value: i } as Partial<Z>)
    }
  }

  const perPage = computed(() => toValue(_perPage))
  const total = computed(() => {
    if (!isUndefined(_total)) return toValue(_total)
    // If total not provided, estimate from pages
    return registry.size * perPage.value
  })

  const page = computed(() => {
    const index = registry.selectedIndex.value
    return index >= 0 ? index + 1 : 0
  })

  const totalPages = computed(() => registry.size)

  const from = computed(() => {
    const currentPage = page.value
    if (currentPage === 0) return 0
    return (currentPage - 1) * perPage.value + 1
  })

  const to = computed(() => {
    const currentPage = page.value
    if (currentPage === 0) return 0
    const lastItem = currentPage * perPage.value
    return Math.min(lastItem, total.value)
  })

  const hasNextPage = computed(() => {
    const currentPage = page.value
    return currentPage > 0 && currentPage < totalPages.value
  })

  const hasPrevPage = computed(() => {
    const currentPage = page.value
    return currentPage > 1
  })

  function goToPage (pageNum: number) {
    if (pageNum < 1 || pageNum > registry.size) return

    const targetIndex = pageNum - 1
    const id = registry.lookup(targetIndex)

    if (!isUndefined(id)) {
      registry.selectedIds.clear()
      registry.select(id)
    }
  }

  return {
    ...registry,
    page,
    totalPages,
    perPage,
    total,
    from,
    to,
    hasNextPage,
    hasPrevPage,
    goToPage,
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
 *   perPage: 20,
 * })
 *
 * // In a parent component:
 * provideTablePagination()
 *
 * // In a child component:
 * const pagination = useTablePagination()
 * pagination.goToPage(2)
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
 *     <p>Page {{ pagination.page }} of {{ pagination.totalPages }}</p>
 *     <p>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }}</p>
 *     <button :disabled="!pagination.hasPrevPage" @click="pagination.prev()">Previous</button>
 *     <button :disabled="!pagination.hasNextPage" @click="pagination.next()">Next</button>
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
