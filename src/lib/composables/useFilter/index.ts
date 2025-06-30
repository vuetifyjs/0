import type { ComputedRef, Ref } from 'vue'
import { computed, isRef } from 'vue'

export type FilterQuery = string | Ref<string> | number | Ref<number> | boolean | Ref<boolean>
export type FilterItem = string | number | boolean | Record<string, any>
export type FilterFunction = (query: FilterQuery, item: FilterItem) => boolean

export interface UseFilterOptions {
  customFilter?: FilterFunction
  keys?: string[]
}

export interface UseFilterResult<T extends FilterItem = FilterItem> {
  items: ComputedRef<T[]>
}

function defaultFilter (query: FilterQuery, item: FilterItem, keys?: string[]): boolean {
  if (['string', 'number', 'boolean'].includes(typeof item)) {
    return String(item).toLowerCase().includes(String(query).toLowerCase())
  }

  if (typeof item === 'object' && item !== null) {
    const values = keys?.length ? keys.map(k => item[k]) : Object.values(item)
    return values.some(value =>
      String(value).toLowerCase().includes(String(query).toLowerCase()),
    )
  }

  return false
}

export function useFilter<T extends FilterItem> (
  query: FilterQuery,
  items: Ref<T[]> | T[],
  options: UseFilterOptions = {},
): UseFilterResult<T> {
  const { customFilter, keys } = options
  const filterFunction = customFilter ?? ((q, i) => defaultFilter(q, i, keys))

  const itemsRef = isRef(items) ? items : computed(() => items)
  const queryRef = isRef(query) ? query : computed(() => query)

  const filteredItems = computed(() => {
    if (!queryRef.value) return itemsRef.value
    return itemsRef.value.filter(item => filterFunction(queryRef.value, item))
  })

  return {
    items: filteredItems,
  }
}
