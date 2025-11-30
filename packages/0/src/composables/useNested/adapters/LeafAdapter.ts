/**
 * @module useNested/adapters/LeafAdapter
 *
 * @remarks
 * Leaf selection adapters - only leaf nodes can be selected.
 * Nodes with children (branches/folders) cannot be selected.
 *
 * Uses Set<ID> for consistency with useSelection/useGroup.
 */

// Adapters
import { createIndependentAdapter, createIndependentSingleAdapter } from './IndependentAdapter'

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectData } from './SelectAdapter'

/**
 * Creates a leaf selection adapter.
 *
 * Only leaf nodes (nodes without children) can be selected.
 * Supports multi-selection of leaf nodes.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function createLeafAdapter (mandatory = false): SelectAdapter {
  const baseAdapter = createIndependentAdapter(mandatory)

  const adapter: SelectAdapter = {
    name: 'leaf',

    select: ({ id, children, ...rest }: SelectData): Set<ID> => {
      // Skip if this node has children (is a branch)
      if (children.has(id)) return new Set(rest.selected)

      return baseAdapter.select({ id, children, ...rest })
    },

    transformIn: baseAdapter.transformIn,
    transformOut: baseAdapter.transformOut,
  }

  return adapter
}

/**
 * Creates a leaf single-selection adapter.
 *
 * Combines leaf-only restriction with single selection constraint.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function createLeafSingleAdapter (mandatory = false): SelectAdapter {
  const baseAdapter = createIndependentSingleAdapter(mandatory)

  const adapter: SelectAdapter = {
    name: 'single-leaf',

    select: ({ id, children, ...rest }: SelectData): Set<ID> => {
      // Skip if this node has children (is a branch)
      if (children.has(id)) return new Set(rest.selected)

      return baseAdapter.select({ id, children, ...rest })
    },

    transformIn: baseAdapter.transformIn,
    transformOut: baseAdapter.transformOut,
  }

  return adapter
}
