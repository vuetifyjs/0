/**
 * @module useNested/adapters/SelectAdapter
 *
 * @remarks
 * Base interface for selection adapters in hierarchical/nested data structures.
 * Adapters control how selection propagates through parent-child relationships.
 *
 * Uses Set<ID> for selection storage, consistent with useSelection/useGroup.
 * Indeterminate state is computed dynamically rather than stored.
 *
 * This follows the adapter pattern used by other Vuetify 0 composables
 * (Theme, Logger, Storage, Locale) for consistent architecture.
 */

// Types
import type { ID } from '#v0/types'

/** Selection state for a node (computed, not stored) */
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
  /** Current selected IDs */
  selected: Set<ID>
}

/**
 * Selection adapter interface.
 *
 * All selection adapters must implement this interface.
 * The adapter pattern allows for easy swapping of selection behaviors
 * without modifying the core useNested composable.
 *
 * Uses Set<ID> for consistency with useSelection and useGroup.
 */
export interface SelectAdapter {
  /** Unique name for the adapter */
  name: string

  /**
   * Handle individual selection action.
   *
   * @param data Selection data including id, value, current state, and tree structure
   * @returns Updated set of selected IDs
   */
  select: (data: SelectData) => Set<ID>

  /**
   * Transform input array to selection set.
   *
   * Called when setting initial/external selection values.
   *
   * @param values Array of selected IDs
   * @param context Tree structure context
   * @returns Set of selected IDs
   */
  transformIn: (values: readonly ID[] | undefined, context: SelectContext) => Set<ID>

  /**
   * Transform selection set to output array.
   *
   * Called when reading selection values for external consumption.
   *
   * @param selected Current selected IDs
   * @param context Tree structure context
   * @returns Array of selected IDs
   */
  transformOut: (selected: Set<ID>, context: SelectContext) => ID[]
}

/** Available built-in adapter names */
export type SelectAdapterName =
  | 'independent'
  | 'single-independent'
  | 'leaf'
  | 'single-leaf'
  | 'classic'
  | 'trunk'
