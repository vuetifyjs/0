// Utilities
import { computed, isRef, toRef, toValue } from 'vue'

// Types
import type { ComputedRef, Ref, MaybeRefOrGetter, MaybeRef } from 'vue'

export type Primitive = string | number | boolean
export type FilterQuery = MaybeRefOrGetter<Primitive | Primitive[]>
export type FilterItem = Primitive | Record<string, any>
export type FilterMode = 'some' | 'every' | 'union' | 'intersection'
export type FilterFunction = (query: Primitive | Primitive[], item: FilterItem) => boolean

export interface UseFilterOptions {
  customFilter?: FilterFunction
  keys?: string[]
  mode?: FilterMode
}

export interface UseFilterResult<Z extends FilterItem = FilterItem> {
  items: ComputedRef<Z[]>
}

function defaultFilter (
  query: Primitive | Primitive[],
  item: FilterItem,
  keys?: string[],
  mode: FilterMode = 'some',
): boolean {
  const queries = Array.isArray(query) ? query.map(q => String(q).toLowerCase()) : [String(query).toLowerCase()]

  function match (value: any, q: string) {
    return String(value).toLowerCase().includes(q)
  }

  const values =
      typeof item === 'object' && item !== null
        ? (keys?.length
            ? keys.map(k => item[k])
            : Object.values(item))
        : [item]

  const stringValues = values.map(v => String(v).toLowerCase())

  if (mode === 'some') {
    return stringValues.some(val => match(val, queries[0]))
  }

  if (mode === 'every') {
    return stringValues.every(val => match(val, queries[0]))
  }

  if (mode === 'union') {
    return queries.some(q => stringValues.some(val => match(val, q)))
  }

  if (mode === 'intersection') {
    return queries.every(q => stringValues.some(val => match(val, q)))
  }

  return false
}

function toRefOrGetter<T> (value: MaybeRefOrGetter<T>): Ref<T> {
  return isRef(value) ? value : (typeof value === 'function' ? toRef(value as () => T) : toRef(() => value as T))
}

/**
 * Creates a reactive filter for arrays based on query matching with configurable search modes.
 * Supports 'some' (any field matches), 'every' (all fields match), 'union' (any query matches),
 * and 'intersection' (all queries match) filtering strategies.
 *
 * @param query Filter query to match against items.
 * @param items Collection of items to filter.
 * @param options Optional configuration for the filter behavior.
 * @template Z The type of the items being filtered.
 * @returns A computed reference to the filtered items based on the query and options.
 */
export function useFilter<Z extends FilterItem> (
  query: FilterQuery,
  items: MaybeRef<Z[]>,
  options: UseFilterOptions = {},
): UseFilterResult<Z> {
  const { customFilter, keys, mode = 'some' } = options
  const filterFunction = customFilter ?? ((q, i) => defaultFilter(q, i, keys, mode))

  const itemsRef = isRef(items) ? items : toRef(() => items)
  const queryRef = toRefOrGetter(query)

  const filteredItems = computed(() => {
    const q = toValue(queryRef)
    const queries = (Array.isArray(q) ? q : [q]).filter(q => String(q).trim())

    if (queries.length === 0) return itemsRef.value

    const queryParam = queries.length === 1 ? queries[0] : queries
    return itemsRef.value.filter(item =>
      filterFunction(queryParam, item),
    )
  })

  return {
    items: filteredItems,
  }
}
