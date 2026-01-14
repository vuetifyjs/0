// Types
import type { GroupContext, GroupContextOptions, GroupOptions, GroupTicket } from '#v0/composables/createGroup'
import type { ID } from '#v0/types'
import type { ComputedRef, Reactive, Ref } from 'vue'

/**
 * Ticket for nested/hierarchical items with parent-child relationships.
 *
 * @remarks
 * Extends GroupTicket with open/close state and leaf detection.
 * Each ticket knows its parent and can control its own open/closed state.
 */
export interface NestedTicket<V = unknown> extends GroupTicket<V> {
  /** ID of the parent ticket, or undefined if this is a root item */
  parentId: ID | undefined
  /** Whether this ticket is currently open/expanded */
  isOpen: Readonly<Ref<boolean>>
  /** Whether this ticket is a leaf node (has no children) */
  isLeaf: Readonly<Ref<boolean>>
  /** Depth in tree (0 = root) */
  depth: Readonly<Ref<number>>
  /** Open/expand this ticket */
  open: () => void
  /** Close/collapse this ticket */
  close: () => void
  /** Flip this ticket's open/closed state */
  flip: () => void
  /** Get path from root to self (includes self) */
  getPath: () => ID[]
  /** Get ancestors excluding self */
  getAncestors: () => ID[]
  /** Get all descendants */
  getDescendants: () => ID[]
}

/**
 * Minimal context interface for open strategy callbacks.
 * Only exposes the state needed for open/close operations.
 */
export interface OpenStrategyContext {
  /** Set of currently opened item IDs (mutable for strategy control) */
  openedIds: Reactive<Set<ID>>
  /** Map of parent IDs to child ID arrays (readonly - use for traversal only) */
  readonly children: ReadonlyMap<ID, readonly ID[]>
  /** Map of child IDs to parent IDs (readonly - use for traversal only) */
  readonly parents: ReadonlyMap<ID, ID | undefined>
}

/**
 * Strategy interface for controlling how items are opened.
 *
 * @remarks
 * Strategies define the behavior when an item is opened:
 * - Single: Only one item open at a time
 * - Multiple: Multiple items can be open
 * - Custom: Implement your own logic
 */
export interface OpenStrategy {
  /** Called when an item is opened */
  onOpen?: (id: ID, context: OpenStrategyContext) => void
  /** Called when an item is closed */
  onClose?: (id: ID, context: OpenStrategyContext) => void
}

/**
 * Registration input for nested items.
 * Allows inline children definition for easier tree construction.
 */
export interface NestedRegistration<V = unknown> {
  /** Unique identifier (auto-generated if not provided) */
  id?: ID
  /** Value associated with this item */
  value?: V
  /** Parent ID (set automatically when using children property) */
  parentId?: ID
  /** Whether this item is disabled */
  disabled?: boolean
  /** Inline children to register with this item as parent */
  children?: NestedRegistration<V>[]
}

/**
 * Context for managing nested/hierarchical item collections.
 *
 * @remarks
 * Extends GroupContext with parent-child relationship tracking, open/close state,
 * and hierarchical traversal methods. Perfect for tree structures, nested menus,
 * file explorers, and organizational charts.
 */
export interface NestedContext<Z extends NestedTicket> extends Omit<GroupContext<Z>, 'register' | 'onboard' | 'select' | 'unselect' | 'toggle'> {
  /** Map of parent IDs to arrays of child IDs. Use register/unregister to modify. */
  readonly children: ReadonlyMap<ID, readonly ID[]>
  /** Map of child IDs to their parent ID (or undefined for roots). Use register/unregister to modify. */
  readonly parents: ReadonlyMap<ID, ID | undefined>
  /** Reactive Set of opened/expanded item IDs. Use open/close/flip to modify. */
  readonly openedIds: Reactive<Set<ID>>
  /** Computed Set of opened/expanded item instances */
  openedItems: ComputedRef<Set<Z>>
  /** Open/expand one or more items by ID */
  open: (ids: ID | ID[]) => void
  /** Close/collapse one or more items by ID */
  close: (ids: ID | ID[]) => void
  /** Flip one or more items' open/closed state by ID */
  flip: (ids: ID | ID[]) => void
  /** Check if an item is open by ID */
  opened: (id: ID) => boolean
  /** Expand all non-leaf nodes */
  expandAll: () => void
  /** Collapse all nodes */
  collapseAll: () => void
  /** Convert tree to flat array with parentId references */
  toFlat: () => Array<{ id: ID, parentId: ID | undefined, value: unknown }>
  /** Get the path from root to the specified item (inclusive) */
  getPath: (id: ID) => ID[]
  /** Get all descendants of an item */
  getDescendants: (id: ID) => ID[]
  /** Get all ancestors of an item (excluding self) */
  getAncestors: (id: ID) => ID[]
  /** Check if an item is a leaf node */
  isLeaf: (id: ID) => boolean
  /** Get the depth level of an item in the tree */
  getDepth: (id: ID) => number
  /** Computed array of root items (items with no parent) */
  roots: ComputedRef<Z[]>
  /** Computed array of leaf items (items with no children) */
  leaves: ComputedRef<Z[]>
  /** Strategy controlling how items are opened */
  openStrategy: OpenStrategy
  /** Select item(s) and all descendants, updating ancestor mixed states */
  select: (ids: ID | ID[]) => void
  /** Unselect item(s) and all descendants, updating ancestor mixed states */
  unselect: (ids: ID | ID[]) => void
  /** Toggle selection with cascading behavior */
  toggle: (ids: ID | ID[]) => void
  /** Register a node with optional inline children */
  register: (registration?: NestedRegistration) => Z
  /** Batch register nodes with optional inline children */
  onboard: (registrations: NestedRegistration[]) => Z[]
  /** Unregister a node, optionally cascading to descendants */
  unregister: (id: ID, cascade?: boolean) => void
  /** Offboard multiple nodes, optionally cascading */
  offboard: (ids: ID[], cascade?: boolean) => void
}

/**
 * Open mode for nested items.
 * - `'multiple'` (default): Multiple nodes can be open simultaneously
 * - `'single'`: Only one node can be open at a time (accordion behavior)
 */
export type NestedOpenMode = 'single' | 'multiple'

/**
 * Selection mode for nested items.
 * - `'cascade'` (default): Selecting a parent selects all descendants; ancestors show mixed state
 * - `'independent'`: Each node is selected independently, no cascading
 * - `'leaf'`: Only leaf nodes can be selected; selecting parent selects all leaf descendants
 */
export type NestedSelectionMode = 'cascade' | 'independent' | 'leaf'

/**
 * Options for creating a nested instance.
 */
export interface NestedOptions extends GroupOptions {
  /**
   * Controls how nodes expand/collapse.
   * - `'multiple'` (default): Multiple nodes can be open simultaneously
   * - `'single'`: Only one node open at a time (accordion behavior)
   */
  open?: NestedOpenMode
  /**
   * Controls how selection cascades through the hierarchy.
   * - `'cascade'` (default): Selecting parent selects descendants; ancestors show mixed state
   * - `'independent'`: Each node selected independently
   * - `'leaf'`: Only leaf nodes selectable; parent selection selects leaf descendants
   */
  selection?: NestedSelectionMode
  /**
   * Advanced: Custom strategy for open behavior.
   * Overrides `open` option if provided.
   * @deprecated Use `open` option for simple cases
   */
  openStrategy?: OpenStrategy
}

/**
 * Options for creating a nested context.
 */
export interface NestedContextOptions extends GroupContextOptions {
  /**
   * Controls how nodes expand/collapse.
   * - `'multiple'` (default): Multiple nodes can be open simultaneously
   * - `'single'`: Only one node open at a time (accordion behavior)
   */
  open?: NestedOpenMode
  /**
   * Controls how selection cascades through the hierarchy.
   * - `'cascade'` (default): Selecting parent selects descendants; ancestors show mixed state
   * - `'independent'`: Each node selected independently
   * - `'leaf'`: Only leaf nodes selectable; parent selection selects leaf descendants
   */
  selection?: NestedSelectionMode
  /**
   * Advanced: Custom strategy for open behavior.
   * Overrides `open` option if provided.
   * @deprecated Use `open` option for simple cases
   */
  openStrategy?: OpenStrategy
}
