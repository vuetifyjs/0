/**
 * @module createDataGrid/ordering
 *
 * @remarks
 * Row ordering state. Maintains an ID-based order that can be applied
 * as a post-sort transform. The component layer handles drag interaction;
 * this module only manages ordering state.
 */

// Adapters
import { applyOrder } from './adapters/order'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { ShallowRef } from 'vue'

export interface RowOrdering {
  order: Readonly<ShallowRef<ID[]>>
  initialize: (ids: ID[]) => void
  move: (from: number, to: number) => void
  reset: () => void
  apply: <T extends Record<string, unknown>>(items: readonly T[], itemKey: string) => readonly T[]
}

/**
 * Creates row ordering state for a data grid.
 *
 * @returns Row ordering state and mutation methods
 */
export function createRowOrdering (): RowOrdering {
  const order = shallowRef<ID[]>([])

  function initialize (ids: ID[]) {
    order.value = [...ids]
  }

  function move (from: number, to: number) {
    if (from === to) return
    const arr = [...order.value]
    if (from < 0 || from >= arr.length) return
    if (to < 0 || to >= arr.length) return

    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    order.value = arr
  }

  function reset () {
    order.value = []
  }

  function apply<T extends Record<string, unknown>> (
    items: readonly T[],
    itemKey: string,
  ): readonly T[] {
    return applyOrder(items, order.value, itemKey)
  }

  return {
    order,
    initialize,
    move,
    reset,
    apply,
  }
}
