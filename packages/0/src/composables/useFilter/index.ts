/**
 * @module useFilter
 *
 * @remarks
 * Reactive array filtering composable with multiple filter modes.
 *
 * Key features:
 * - Four filter modes: some, every, union, intersection
 * - Case-insensitive filtering
 * - Custom filter functions
 * - Reactive updates
 * - Context-based DI support
 * - Perfect for search, multi-criteria filtering
 *
 * Filters arrays based on query strings with configurable matching strategies.
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { isObject } from '#v0/utilities'
import { computed, isRef, toRef, toValue } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, MaybeRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export type Primitive = string | number | boolean
export type FilterQuery = MaybeRefOrGetter<Primitive | Primitive[]>
export type FilterItem = Primitive | Record<string, any>
export type FilterMode = 'some' | 'every' | 'union' | 'intersection'
export type FilterFunction = (query: Primitive | Primitive[], item: FilterItem) => boolean

export interface FilterOptions {
  customFilter?: FilterFunction
  keys?: string[]
  mode?: FilterMode
}

export interface FilterResult<Z extends FilterItem = FilterItem> {
  items: ComputedRef<Z[]>
}

export interface FilterContext<Z extends FilterItem = FilterItem> {
  /** The filter mode */
  mode: FilterMode
  /** Keys to filter on for object items */
  keys: string[] | undefined
  /** Custom filter function */
  customFilter: FilterFunction | undefined
  /** Current query ref */
  query: ShallowRef<Primitive | Primitive[]>
  /**
   * Apply filter to an array of items
   *
   * @param query The query to filter by
   * @param items The items to filter
   * @returns The filtered items as a computed ref
   */
  apply: <T extends Z>(query: FilterQuery, items: MaybeRef<T[]>) => FilterResult<T>
}

export interface FilterContextOptions extends FilterOptions {
  namespace?: string
}

type NonEmptyArray<T> = [T, ...T[]]

/** Filter a single normalized string value against queries */
function filterSingleValue (value: string, queries: NonEmptyArray<string>, mode: FilterMode): boolean {
  const [firstQuery] = queries
  if (mode === 'some' || mode === 'every') {
    return value.includes(firstQuery)
  }
  if (mode === 'union') {
    for (const q of queries) {
      if (value.includes(q)) return true
    }
    return false
  }
  // intersection: all queries must match the single value
  for (const q of queries) {
    if (!value.includes(q)) return false
  }
  return true
}

/** Filter multiple string values against queries */
function filterMultipleValues (stringValues: string[], queries: NonEmptyArray<string>, mode: FilterMode): boolean {
  const [firstQuery] = queries

  if (mode === 'some') {
    for (const val of stringValues) {
      if (val.includes(firstQuery)) return true
    }
    return false
  }

  if (mode === 'every') {
    for (const val of stringValues) {
      if (!val.includes(firstQuery)) return false
    }
    return true
  }

  // intersection: ALL queries must match (each can match different fields)
  for (const q of queries) {
    let queryMatched = false
    for (const val of stringValues) {
      if (val.includes(q)) {
        queryMatched = true
        break
      }
    }
    if (!queryMatched) return false
  }
  return true
}

function defaultFilter (
  query: Primitive | Primitive[],
  item: FilterItem,
  keys?: string[],
  mode: FilterMode = 'some',
): boolean {
  const queries: NonEmptyArray<string> = Array.isArray(query)
    ? query.map(q => String(q).toLowerCase()) as NonEmptyArray<string>
    : [String(query).toLowerCase()]

  // Fast path: primitive item (string, number, boolean)
  if (!isObject(item)) {
    return filterSingleValue(String(item).toLowerCase(), queries, mode)
  }

  // Fast path: single key lookup
  if (keys?.length === 1) {
    const key = keys[0]
    return filterSingleValue(String(item[key!]).toLowerCase(), queries, mode)
  }

  // Multi-value path: object with multiple keys or all keys
  const rawValues = keys?.length
    ? keys.map(k => item[k])
    : Object.values(item)

  // Union mode: inline normalization with early exit
  if (mode === 'union') {
    for (const q of queries) {
      for (const rawValue of rawValues) {
        if (String(rawValue).toLowerCase().includes(q)) return true
      }
    }
    return false
  }

  // Pre-normalize for other modes
  const stringValues = rawValues.map(v => String(v).toLowerCase())
  return filterMultipleValues(stringValues, queries, mode)
}

/**
 * Creates a filter context with pre-configured options.
 *
 * @param options The filter options
 * @template Z The type of the items
 * @template E The type of the filter context
 * @returns A filter context
 *
 * @see https://0.vuetifyjs.com/composables/utilities/use-filter
 *
 * @example
 * ```ts
 * import { createFilter } from '@vuetify/v0'
 *
 * const filter = createFilter({
 *   mode: 'intersection',
 *   keys: ['name', 'email'],
 * })
 *
 * const { items } = filter.apply(query, users)
 * ```
 */
export function createFilter<
  Z extends FilterItem = FilterItem,
  E extends FilterContext<Z> = FilterContext<Z>,
> (options: FilterOptions = {}): E {
  const { customFilter, keys, mode = 'some' } = options
  const filterFunction = customFilter ?? ((q, i) => defaultFilter(q, i, keys, mode))
  const query = toRef<Primitive | Primitive[]>('')

  function apply<T extends Z> (
    _query: FilterQuery,
    items: MaybeRef<T[]>,
  ): FilterResult<T> {
    const itemsRef = isRef(items) ? items : toRef(() => items)
    const queryRef = toRef(_query)

    const filteredItems = computed(() => {
      const q = toValue(queryRef)
      query.value = q
      const queries = (Array.isArray(q) ? q : [q]).filter(q => String(q).trim())

      if (queries.length === 0) return itemsRef.value

      const queryParam = queries.length === 1 ? queries[0]! : queries
      return itemsRef.value.filter(item =>
        filterFunction(queryParam, item),
      )
    })

    return { items: filteredItems }
  }

  return {
    mode,
    keys,
    customFilter,
    query,
    apply,
  } as E
}

/**
 * Creates a filter context with dependency injection support.
 *
 * @param options The filter context options
 * @template Z The type of the items
 * @template E The type of the filter context
 * @returns A trinity tuple: [useContext, provideContext, defaultContext]
 *
 * @see https://0.vuetifyjs.com/composables/utilities/use-filter
 *
 * @example
 * ```ts
 * import { createFilterContext } from '@vuetify/v0'
 *
 * export const [useSearchFilter, provideSearchFilter, searchFilter] = createFilterContext({
 *   namespace: 'app:search',
 *   mode: 'union',
 *   keys: ['title', 'description'],
 * })
 *
 * // In parent component
 * provideSearchFilter()
 *
 * // In child component
 * const filter = useSearchFilter()
 * const { items } = filter.apply(query, products)
 * ```
 */
export function createFilterContext<
  Z extends FilterItem = FilterItem,
  E extends FilterContext<Z> = FilterContext<Z>,
> (_options: FilterContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:filter', ...options } = _options
  const [useFilterContext, _provideFilterContext] = createContext<E>(namespace)
  const context = createFilter<Z, E>(options)

  function provideFilterContext (_context: E = context, app?: App): E {
    return _provideFilterContext(_context, app)
  }

  return createTrinity<E>(useFilterContext, provideFilterContext, context)
}

/**
 * A reusable function for filtering an array of items.
 *
 * @param query The query to filter by.
 * @param items The items to filter.
 * @param options The filter options.
 * @template Z The type of the items.
 * @returns The filtered items.
 *
 * @see https://0.vuetifyjs.com/composables/utilities/use-filter
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useFilter } from '@vuetify/v0'
 *
 * const items = ref([
 *   { name: 'John Doe', age: 30 },
 *   { name: 'Jane Doe', age: 25 },
 *   { name: 'Peter Jones', age: 40 },
 * ])
 *
 * const query = ref('doe')
 * const { items: filtered } = useFilter(query, items, { keys: ['name'] })
 *
 * console.log(filtered.value) // [ { name: 'John Doe', age: 30 }, { name: 'Jane Doe', age: 25 } ]
 * ```
 */
export function useFilter<Z extends FilterItem> (
  query: FilterQuery,
  items: MaybeRef<Z[]>,
  options: FilterOptions = {},
): FilterResult<Z> {
  const ctx = createFilter<Z>(options)
  return ctx.apply(query, items)
}

/**
 * Returns the current filter context from dependency injection.
 *
 * @param namespace The namespace for the filter context. Defaults to `'v0:filter'`.
 * @template Z The type of the items.
 * @template E The type of the filter context.
 * @returns The current filter context.
 *
 * @see https://0.vuetifyjs.com/composables/utilities/use-filter
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useFilterContext } from '@vuetify/v0'
 *
 *   const filter = useFilterContext()
 *   const { items } = filter.apply(query, products)
 * </script>
 * ```
 */
export function useFilterContext<
  Z extends FilterItem = FilterItem,
  E extends FilterContext<Z> = FilterContext<Z>,
> (namespace = 'v0:filter'): E {
  return useContext<E>(namespace)
}
