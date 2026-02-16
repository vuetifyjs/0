/**
 * @module createDataTable/adapters
 *
 * @remarks
 * Defines the adapter interface and abstract base class for data table
 * pipeline strategies. Adapters control how raw items are filtered, sorted,
 * and sliced into visible items.
 *
 * The abstract DataTableAdapter provides shared filter and sort pipelines
 * used by client-side adapters. Server adapters that delegate pipeline
 * operations externally can implement DataTableAdapterInterface directly.
 */

// Composables
import { createFilter } from '#v0/composables/createFilter'

// Utilities
import { isNaN, isNumber, isString, isUndefined } from '#v0/utilities'
import { computed, toValue } from 'vue'

// Types
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationContext, PaginationOptions } from '#v0/composables/createPagination'
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export type SortDirection = 'asc' | 'desc' | 'none'

export interface SortEntry {
  key: string
  direction: SortDirection
}

/** Inputs provided by createDataTable to the adapter */
export interface DataTableAdapterContext<T extends Record<string, unknown>> {
  /** Source items */
  items: MaybeRefOrGetter<T[]>
  /** Search query ref */
  search: ShallowRef<string>
  /** Column keys eligible for filtering */
  filterableKeys: string[]
  /** Current sort state derived from sort controls */
  sortBy: ComputedRef<SortEntry[]>
  /** Locale for sorting (reactive, from useLocale or options) */
  locale: ComputedRef<string | undefined>
  /** Filter options (keys excluded, derived from columns) */
  filterOptions: Omit<FilterOptions, 'keys'>
  /** Pagination options (size excluded, derived from pipeline) */
  paginationOptions: Omit<PaginationOptions, 'size'>
}

/** Outputs returned by the adapter to createDataTable */
export interface DataTableAdapterResult<T extends Record<string, unknown>> {
  /** Raw unprocessed items */
  allItems: ComputedRef<readonly T[]>
  /** Items after filtering */
  filteredItems: ComputedRef<readonly T[]>
  /** Items after filtering and sorting */
  sortedItems: ComputedRef<readonly T[]>
  /** Final visible items (paginated or virtualized) */
  items: ComputedRef<readonly T[]>
  /** Pagination controls */
  pagination: PaginationContext
  /** Total row count for aria-rowcount */
  total: ComputedRef<number>
  /** Loading state (optional, for async adapters) */
  loading?: ComputedRef<boolean>
  /** Error state (optional, for async adapters) */
  error?: ComputedRef<Error | null>
}

/** Pipeline adapter interface for data table strategies */
export interface DataTableAdapterInterface<T extends Record<string, unknown>> {
  setup: (context: DataTableAdapterContext<T>) => DataTableAdapterResult<T>
}

function getNestedValue (obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.')
  let result: unknown = obj
  for (const k of keys) {
    if (isUndefined(result) || result === null) return undefined
    result = (result as Record<string, unknown>)[k]
  }
  return result
}

function compareValues (a: unknown, b: unknown, locale?: string): number {
  if (a === b) return 0
  if (isUndefined(a) || a === null) return 1
  if (isUndefined(b) || b === null) return -1

  if (isString(a) && isString(b)) {
    return a.localeCompare(b, locale)
  }

  if (isNumber(a) && isNumber(b)) {
    if (isNaN(a)) return 1
    if (isNaN(b)) return -1
    return a - b
  }

  return String(a).localeCompare(String(b), locale)
}

export abstract class DataTableAdapter<T extends Record<string, unknown>> implements DataTableAdapterInterface<T> {
  /** Create the filter pipeline stage */
  protected filter (context: DataTableAdapterContext<T>) {
    const filter = createFilter({
      ...context.filterOptions,
      keys: context.filterableKeys,
    })

    const allItems = computed(() => toValue(context.items))
    const { items: filteredItems } = filter.apply(context.search, allItems)

    return { allItems, filteredItems }
  }

  /** Create the sort pipeline stage */
  protected sort (
    filteredItems: ComputedRef<readonly T[]>,
    sortBy: ComputedRef<SortEntry[]>,
    locale?: ComputedRef<string | undefined>,
  ): ComputedRef<readonly T[]> {
    return computed(() => {
      const entries = sortBy.value
      if (entries.length === 0) return filteredItems.value

      const loc = locale?.value
      const items = [...filteredItems.value]

      items.sort((a, b) => {
        for (const { key, direction } of entries) {
          const aVal = getNestedValue(a, key)
          const bVal = getNestedValue(b, key)
          const cmp = compareValues(aVal, bVal, loc)
          if (cmp !== 0) return direction === 'desc' ? -cmp : cmp
        }
        return 0
      })

      return items
    })
  }

  abstract setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T>
}
