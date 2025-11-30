/**
 * @module useNested/adapters
 *
 * @remarks
 * Selection strategy adapters for hierarchical/nested data structures.
 * Ported from Vuetify 3's nested composable with adaptations for Vuetify 0.
 *
 * Adapters control how selection propagates through parent-child relationships:
 * - independent: No propagation, any node selectable
 * - single-independent: No propagation, single selection
 * - leaf: Only leaf nodes selectable, multi-select
 * - single-leaf: Only leaf nodes selectable, single selection
 * - classic: Tri-state with bidirectional propagation
 * - trunk: Classic but outputs highest selected ancestors
 */

// Adapters
export { createClassicAdapter } from './ClassicAdapter'
export { createIndependentAdapter, createIndependentSingleAdapter } from './IndependentAdapter'
export { createLeafAdapter, createLeafSingleAdapter } from './LeafAdapter'
// Types
export type {
  SelectAdapter,
  SelectAdapterName,
  SelectContext,
  SelectData,
  SelectionState,
} from './SelectAdapter'

export { createTrunkAdapter } from './TrunkAdapter'

// Types
import type { SelectAdapter, SelectAdapterName } from './SelectAdapter'
import { createClassicAdapter } from './ClassicAdapter'
import { createIndependentAdapter, createIndependentSingleAdapter } from './IndependentAdapter'
import { createLeafAdapter, createLeafSingleAdapter } from './LeafAdapter'
import { createTrunkAdapter } from './TrunkAdapter'

/**
 * Get a selection adapter by name or return a custom adapter.
 *
 * @param adapter Adapter name, custom adapter, or adapter factory function
 * @param mandatory Whether selection is mandatory
 */
export function getSelectAdapter (
  adapter: SelectAdapterName | SelectAdapter | ((mandatory: boolean) => SelectAdapter),
  mandatory: boolean,
): SelectAdapter {
  if (typeof adapter === 'function') {
    return adapter(mandatory)
  }

  if (typeof adapter === 'object') {
    return adapter
  }

  switch (adapter) {
    case 'independent': {
      return createIndependentAdapter(mandatory)
    }
    case 'single-independent': {
      return createIndependentSingleAdapter(mandatory)
    }
    case 'leaf': {
      return createLeafAdapter(mandatory)
    }
    case 'single-leaf': {
      return createLeafSingleAdapter(mandatory)
    }
    case 'classic': {
      return createClassicAdapter(mandatory)
    }
    case 'trunk': {
      return createTrunkAdapter(mandatory)
    }
    default: {
      return createClassicAdapter(mandatory)
    }
  }
}
