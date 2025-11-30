/**
 * @module useNested/adapters/IndependentAdapter
 *
 * @remarks
 * Independent selection adapter - no parent-child propagation.
 * Each node can be selected/unselected independently without affecting
 * parent or child nodes. Supports multi-selection.
 *
 * Uses Set<ID> for consistency with useSelection/useGroup.
 */

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectContext, SelectData } from './SelectAdapter'

/**
 * Creates an independent selection adapter.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function createIndependentAdapter (mandatory = false): SelectAdapter {
  const adapter: SelectAdapter = {
    name: 'independent',

    select: ({ id, value, selected }: SelectData): Set<ID> => {
      const newSelected = new Set(selected)

      // Respect mandatory constraint
      if (mandatory && !value && newSelected.size === 1 && newSelected.has(id)) {
        return newSelected
      }

      if (value) {
        newSelected.add(id)
      } else {
        newSelected.delete(id)
      }

      return newSelected
    },

    transformIn: (
      values: readonly ID[] | undefined,
      _context: SelectContext,
    ): Set<ID> => {
      return values ? new Set(values) : new Set()
    },

    transformOut: (selected: Set<ID>): ID[] => {
      return Array.from(selected)
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
  const adapter: SelectAdapter = {
    name: 'single-independent',

    select: ({ id, value, selected }: SelectData): Set<ID> => {
      // Respect mandatory constraint
      if (mandatory && !value && selected.size === 1 && selected.has(id)) {
        return new Set(selected)
      }

      if (value) {
        // Single selection: clear all and add this one
        return new Set([id])
      } else {
        const newSelected = new Set(selected)
        newSelected.delete(id)
        return newSelected
      }
    },

    transformIn: (
      values: readonly ID[] | undefined,
      _context: SelectContext,
    ): Set<ID> => {
      // Only take the first item for single selection
      if (values && values.length > 0) {
        return new Set([values[0] as ID])
      }
      return new Set()
    },

    transformOut: (selected: Set<ID>): ID[] => {
      return Array.from(selected)
    },
  }

  return adapter
}
