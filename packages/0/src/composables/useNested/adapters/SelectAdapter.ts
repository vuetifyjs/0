/**
 * @module useNested/adapters/SelectAdapter
 *
 * @remarks
 * Base interface for selection strategy adapters in hierarchical/nested data structures.
 * Adapters control how selection propagates through parent-child relationships.
 *
 * This follows the adapter pattern used by other Vuetify 0 composables
 * (Theme, Logger, Storage, Locale) for consistent architecture.
 */

// Types
import type { ID } from '#v0/types'

/** Selection state for a node */
export type SelectionState = 'on' | 'off' | 'indeterminate'

/** Context data for selection operations */
export interface SelectContext {
  /** Parent-to-children relationship map */
  children: Map<ID, ID[]>
  /** Child-to-parent relationship map */
  parents: Map<ID, ID>
  /** Set of disabled node IDs */
  disabled: Set<ID>
}

/** Data passed to select operations */
export interface SelectData extends SelectContext {
  /** ID of the node being selected/unselected */
  id: ID
  /** Whether to select (true) or unselect (false) */
  value: boolean
  /** Current selection state map */
  selected: Map<ID, SelectionState>
}

/**
 * Selection adapter interface.
 *
 * All selection strategy adapters must implement this interface.
 * The adapter pattern allows for easy swapping of selection behaviors
 * without modifying the core useNested composable.
 */
export interface SelectAdapter {
  /** Unique name for the adapter */
  name: string

  /**
   * Handle individual selection action.
   *
   * @param data Selection data including id, value, current state, and tree structure
   * @returns Updated selection state map
   */
  select: (data: SelectData) => Map<ID, SelectionState>

  /**
   * Transform input array to selection state map.
   *
   * Called when setting initial/external selection values.
   *
   * @param values Array of selected IDs
   * @param context Tree structure context
   * @returns Selection state map
   */
  transformIn: (values: readonly ID[] | undefined, context: SelectContext) => Map<ID, SelectionState>

  /**
   * Transform selection state map to output array.
   *
   * Called when reading selection values for external consumption.
   *
   * @param state Current selection state map
   * @param context Tree structure context
   * @returns Array of selected IDs
   */
  transformOut: (state: Map<ID, SelectionState>, context: SelectContext) => ID[]
}

/** Available built-in adapter names */
export type SelectAdapterName =
  | 'independent'
  | 'single-independent'
  | 'leaf'
  | 'single-leaf'
  | 'classic'
  | 'trunk'
