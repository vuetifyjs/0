import type { ComputedRef, Ref } from 'vue'
import { computed, isRef } from 'vue'

export type FilterQuery = string | Ref<string> | number | Ref<number> | boolean | Ref<boolean>
export type FilterItem = string | number | boolean | Record<string, any>
export type FilterFunction = (query: FilterQuery, item: FilterItem) => boolean
export type FilterMode = 'every' | 'some'

export interface UseFilterOptions {
  customFilter?: FilterFunction
  keys?: string[]
  mode?: FilterMode
}

export interface UseFilterResult<T extends FilterItem = FilterItem> {
  items: ComputedRef<T[]>
}

function defaultFilter (query: FilterQuery, item: FilterItem, keys?: string[], mode?: FilterMode): boolean {
  if (['string', 'number', 'boolean'].includes(typeof item)) {
    return String(item).toLowerCase().includes(String(query).toLowerCase())
  }

  if (typeof item === 'object' && item !== null) {
    const values = keys?.length ? keys.map(k => item[k]) : Object.values(item)
    const matcher = (value: any) => String(value).toLowerCase().includes(String(query).toLowerCase())

    return mode === 'every' ? values.every(val => matcher(val)) : values.some(val => matcher(val))
  }

  return false
}

export function useFilter<T extends FilterItem> (
  query: FilterQuery,
  items: Ref<T[]> | T[],
  options: UseFilterOptions = {},
): UseFilterResult<T> {
  const { customFilter, keys, mode = 'some' } = options
  const filterFunction = customFilter ?? ((q, i) => defaultFilter(q, i, keys, mode))

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
