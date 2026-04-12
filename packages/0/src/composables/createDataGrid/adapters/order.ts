// Types
import type { ID } from '#v0/types'

/** Reorder items by an ID-based order, appending unmatched items at the end. */
export function applyOrder<T extends Record<string, unknown>> (
  items: readonly T[],
  order: readonly ID[],
  itemKey: string,
): readonly T[] {
  if (order.length === 0) return items

  const map = new Map<ID, T>()
  for (const item of items) {
    map.set(item[itemKey] as ID, item)
  }

  const result: T[] = []
  for (const id of order) {
    const item = map.get(id)
    if (item) result.push(item)
  }

  const ordered = new Set(order)
  for (const item of items) {
    if (!ordered.has(item[itemKey] as ID)) {
      result.push(item)
    }
  }

  return result
}
