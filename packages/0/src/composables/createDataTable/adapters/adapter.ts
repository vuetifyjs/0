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
import { isNaN, isNullOrUndefined, isNumber, isObject, isString } from '#v0/utilities'
import { computed, toRef, toValue } from 'vue'

// Types
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationContext, PaginationOptions } from '#v0/composables/createPagination'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

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
  sortBy: Readonly<Ref<SortEntry[]>>
  /** Locale for sorting (reactive, from useLocale or options) */
  locale: Readonly<Ref<string | undefined>>
  /** Filter options (keys excluded, derived from columns) */
  filterOptions: Omit<FilterOptions, 'keys'>
  /** Pagination options (size excluded, derived from pipeline) */
  paginationOptions: Omit<PaginationOptions, 'size'>
  /** Per-column custom sort comparators */
  customSorts: Record<string, (a: unknown, b: unknown) => number>
  /** Per-column custom filter functions */
  customColumnFilters: Record<string, (value: unknown, query: string) => boolean>
}

/** Outputs returned by the adapter to createDataTable */
export interface DataTableAdapterResult<T extends Record<string, unknown>> {
  /** Raw unprocessed items */
  allItems: Readonly<Ref<readonly T[]>>
  /** Items after filtering */
  filteredItems: Readonly<Ref<readonly T[]>>
  /** Items after filtering and sorting */
  sortedItems: Readonly<Ref<readonly T[]>>
  /** Final visible items (paginated or virtualized) */
  items: Readonly<Ref<readonly T[]>>
  /** Pagination controls */
  pagination: PaginationContext
  /** Total row count for aria-rowcount */
  total: Readonly<Ref<number>>
  /** Loading state (optional, for async adapters) */
  loading?: Readonly<Ref<boolean>>
  /** Error state (optional, for async adapters) */
  error?: Readonly<Ref<Error | null>>
}

/** Pipeline adapter interface for data table strategies */
export interface DataTableAdapterInterface<T extends Record<string, unknown>> {
  setup: (context: DataTableAdapterContext<T>) => DataTableAdapterResult<T>
}

function getNestedValue (obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.')
  let result: unknown = obj
  for (const k of keys) {
    if (isNullOrUndefined(result)) return undefined
    result = (result as Record<string, unknown>)[k]
  }
  return result
}

function compareValues (a: unknown, b: unknown, locale?: string): number {
  if (a === b) return 0
  if (isNullOrUndefined(a)) return 1
  if (isNullOrUndefined(b)) return -1

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
    const hasColumnFilters = Object.keys(context.customColumnFilters).length > 0

    // When per-column filters exist and no global customFilter, compose them
    const filterOptions: FilterOptions = hasColumnFilters && !context.filterOptions.customFilter
      ? {
          ...context.filterOptions,
          keys: context.filterableKeys,
          customFilter: (query, item) => {
            if (!isObject(item)) return false
            const q = String(Array.isArray(query) ? query[0] : query).toLowerCase()
            if (!q) return true
            const obj = item as Record<string, unknown>

            for (const key of context.filterableKeys) {
              const customFn = context.customColumnFilters[key]

              if (customFn) {
                if (customFn(obj[key], q)) return true
              } else {
                const val = obj[key]
                if (!isNullOrUndefined(val) && String(val).toLowerCase().includes(q)) return true
              }
            }
            return false
          },
        }
      : {
          ...context.filterOptions,
          keys: context.filterableKeys,
        }

    const filter = createFilter(filterOptions)

    const allItems = toRef(() => toValue(context.items))
    const { items: filteredItems } = filter.apply(context.search, allItems)

    return { allItems, filteredItems }
  }

  /** Create the sort pipeline stage */
  protected sort (
    filteredItems: Readonly<Ref<readonly T[]>>,
    sortBy: Readonly<Ref<SortEntry[]>>,
    locale?: Readonly<Ref<string | undefined>>,
    customSorts?: Record<string, (a: unknown, b: unknown) => number>,
  ): Readonly<Ref<readonly T[]>> {
    return computed(() => {
      const entries = sortBy.value
      if (entries.length === 0) return filteredItems.value

      const loc = locale?.value

      return filteredItems.value.toSorted((a, b) => {
        for (const { key, direction } of entries) {
          const aVal = getNestedValue(a, key)
          const bVal = getNestedValue(b, key)
          const customSort = customSorts?.[key]
          const cmp = customSort ? customSort(aVal, bVal) : compareValues(aVal, bVal, loc)
          if (cmp !== 0) return direction === 'desc' ? -cmp : cmp
        }
        return 0
      })
    })
  }

  abstract setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T>
}
