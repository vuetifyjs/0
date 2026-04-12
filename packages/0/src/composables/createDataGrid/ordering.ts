/**
 * @module createDataGrid/ordering
 *
 * @remarks
 * Row ordering state. Maintains an ID-based order that can be applied
 * as a post-sort transform. The component layer handles drag interaction;
 * this module only manages ordering state.
 */

// Utilities
import { shallowRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { ShallowRef } from 'vue'

export interface RowOrdering {
  order: Readonly<ShallowRef<ID[]>>
  initialize: (ids: ID[]) => void
  move: (fromIndex: number, toIndex: number) => void
  reset: () => void
  apply: <T extends Record<string, unknown>>(items: readonly T[], itemKey: string) => readonly T[]
}

export function createRowOrdering (): RowOrdering {
  const order = shallowRef<ID[]>([])

  function initialize (ids: ID[]) {
    order.value = [...ids]
  }

  function move (fromIndex: number, toIndex: number) {
    const arr = [...order.value]
    if (fromIndex < 0 || fromIndex >= arr.length) return
    if (toIndex < 0 || toIndex >= arr.length) return

    const [moved] = arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, moved)
    order.value = arr
  }

  function reset () {
    order.value = []
  }

  function apply<T extends Record<string, unknown>> (
    items: readonly T[],
    itemKey: string,
  ): readonly T[] {
    if (order.value.length === 0) return items

    const map = new Map<ID, T>()
    for (const item of items) {
      map.set(item[itemKey] as ID, item)
    }

    const result: T[] = []
    for (const id of order.value) {
      const item = map.get(id)
      if (item) result.push(item)
    }

    // Append items not in the order (new items added after reorder)
    const ordered = new Set(order.value)
    for (const item of items) {
      if (!ordered.has(item[itemKey] as ID)) {
        result.push(item)
      }
    }

    return result
  }

  return {
    order,
    initialize,
    move,
    reset,
    apply,
  }
}
