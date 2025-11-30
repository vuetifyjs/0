/**
 * @module useNested/adapters/TrunkAdapter
 *
 * @remarks
 * Trunk selection adapter - classic propagation with trunk output.
 *
 * Uses the same selection logic as classic adapter, but the output
 * only includes the "highest" selected ancestors, filtering out
 * items whose parent is also fully selected.
 *
 * Useful when you want to know which "folders" are selected rather
 * than listing all individual "files".
 */

// Adapters
import { createClassicAdapter } from './ClassicAdapter'

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectContext, SelectionState } from './SelectAdapter'

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
      state: Map<ID, SelectionState>,
      context: SelectContext,
    ): ID[] => {
      const arr: ID[] = []

      for (const [key, value] of state.entries()) {
        if (value === 'on') {
          // Skip if parent is also fully selected
          if (context.parents.has(key)) {
            const parent = context.parents.get(key)!
            if (state.get(parent) === 'on') continue
          }
          arr.push(key)
        }
      }

      return arr
    },
  }

  return adapter
}
