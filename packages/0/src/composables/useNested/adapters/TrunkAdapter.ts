/**
 * @module useNested/adapters/TrunkAdapter
 *
 * @remarks
 * Trunk selection adapter - classic propagation with trunk output.
 *
 * Uses the same selection logic as classic adapter, but the output
 * only includes the "highest" fully selected ancestors.
 *
 * A node is considered fully selected when all its descendants are selected.
 * The trunk output filters out items whose parent is also fully selected.
 *
 * Useful when you want to know which "folders" are selected rather
 * than listing all individual "files".
 *
 * Uses Set<ID> for consistency with useSelection/useGroup.
 */

// Adapters
import { createClassicAdapter } from './ClassicAdapter'

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectContext } from './SelectAdapter'

/**
 * Check if all descendants of a node are selected.
 */
function isFullySelected (
  id: ID,
  selected: Set<ID>,
  children: Map<ID, ID[]>,
  disabled: Set<ID>,
): boolean {
  // Must be in selected set
  if (!selected.has(id)) return false

  // Check all children recursively
  const childIds = children.get(id)
  if (!childIds) return true // Leaf node

  for (const childId of childIds) {
    if (disabled.has(childId)) continue
    if (!isFullySelected(childId, selected, children, disabled)) {
      return false
    }
  }

  return true
}

/**
 * Creates a trunk selection adapter.
 *
 * @param mandatory When true, prevents deselecting all items
 */
export function createTrunkAdapter (mandatory = false): SelectAdapter {
  const classicAdapter = createClassicAdapter(mandatory)

  const adapter: SelectAdapter = {
    name: 'trunk',

    select: classicAdapter.select,
    transformIn: classicAdapter.transformIn,

    transformOut: (
      selected: Set<ID>,
      context: SelectContext,
    ): ID[] => {
      const arr: ID[] = []

      for (const id of selected) {
        // Check if this node is fully selected
        if (!isFullySelected(id, selected, context.children, context.disabled)) {
          continue
        }

        // Skip if parent is also fully selected
        if (context.parents.has(id)) {
          const parent = context.parents.get(id)!
          if (isFullySelected(parent, selected, context.children, context.disabled)) {
            continue
          }
        }

        arr.push(id)
      }

      return arr
    },
  }

  return adapter
}
