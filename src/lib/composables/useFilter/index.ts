export type FilterQuery = string

export type FilterItem = string | number | boolean | Record<string, any>

export interface FilterFunction {
  (query: FilterQuery, item: FilterItem): boolean
}

export interface UseFilterResult {
  filter: (query: FilterQuery, items: FilterItem | FilterItem[]) => FilterItem[]
}

function defaultFilter (query: FilterQuery, item: FilterItem) {
  if (['string', 'number', 'boolean'].includes(typeof item)) {
    return String(item).toLowerCase().includes(String(query).toLowerCase())
  }

  if (typeof item === 'object' && item !== null) {
    return Object.values(item).some(value =>
      String(value).toLowerCase().includes(String(query).toLowerCase()),
    )
  }

  return false
}

export function useFilter (customFn?: FilterFunction): UseFilterResult {
  const filterFn = customFn ?? defaultFilter
  function filter (query: FilterQuery, item: FilterItem): FilterItem[] {
    if (!query) return []

    const array = Array.isArray(item) ? item : [item]
    return array.filter(i => filterFn(query, i))
  }

  return { filter }
}
