/**
 * @module useNested/adapters/IndependentAdapter
 *
 * @remarks
 * Independent selection adapter - no parent-child propagation.
 * Each node can be selected/unselected independently without affecting
 * parent or child nodes. Supports multi-selection.
 */

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectContext, SelectData, SelectionState } from './SelectAdapter'

/**
 * Creates an independent selection adapter.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function createIndependentAdapter (mandatory = false): SelectAdapter {
  const adapter: SelectAdapter = {
    name: 'independent',

    select: ({ id, value, selected }: SelectData): Map<ID, SelectionState> => {
      // Respect mandatory constraint
      if (mandatory && !value) {
        const on = Array.from(selected.entries())
          .filter(([, v]) => v === 'on')
          .map(([k]) => k)
        if (on.length === 1 && on[0] === id) return selected
      }

      selected.set(id, value ? 'on' : 'off')
      return selected
    },

    transformIn: (
      values: readonly ID[] | undefined,
      context: SelectContext,
    ): Map<ID, SelectionState> => {
      const map = new Map<ID, SelectionState>()

      for (const id of values || []) {
        adapter.select({
          id,
          value: true,
          selected: map,
          ...context,
        })
      }

      return map
    },

    transformOut: (state: Map<ID, SelectionState>): ID[] => {
      const arr: ID[] = []

      for (const [key, value] of state.entries()) {
        if (value === 'on') arr.push(key)
      }

      return arr
    },
  }

  return adapter
}

/**
 * Creates an independent single-selection adapter.
 *
 * Like independent but only allows one item to be selected at a time.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function createIndependentSingleAdapter (mandatory = false): SelectAdapter {
  const baseAdapter = createIndependentAdapter(mandatory)

  const adapter: SelectAdapter = {
    name: 'single-independent',

    select: ({ selected, id, ...rest }: SelectData): Map<ID, SelectionState> => {
      // Keep only this item's previous state (if any) for single selection
      const singleSelected = selected.has(id)
        ? new Map<ID, SelectionState>([[id, selected.get(id)!]])
        : new Map<ID, SelectionState>()

      return baseAdapter.select({ ...rest, id, selected: singleSelected })
    },

    transformIn: (
      values: readonly ID[] | undefined,
      context: SelectContext,
    ): Map<ID, SelectionState> => {
      // Only take the first item for single selection
      if (values?.length) {
        return baseAdapter.transformIn(values.slice(0, 1), context)
      }
      return new Map<ID, SelectionState>()
    },

    transformOut: (
      state: Map<ID, SelectionState>,
      context: SelectContext,
    ): ID[] => {
      return baseAdapter.transformOut(state, context)
    },
  }

  return adapter
}
