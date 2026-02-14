// Types
import type { GroupContext, GroupContextOptions, GroupOptions, GroupTicket, GroupTicketInput } from '#v0/composables/createGroup'
import type { ID } from '#v0/types'
import type { ComputedRef, Reactive, Ref } from 'vue'

/**
 * Input type for nested tickets - what users provide to register().
 * Extend this interface to add custom properties.
 *
 * @template V The type of the ticket value.
 */
export interface NestedTicketInput<V = unknown> extends GroupTicketInput<V> {
  /** ID of the parent ticket, or undefined if this is a root item */
  parentId?: ID
  /** Whether this ticket is initially active */
  active?: boolean
}

/**
 * Output type for nested tickets - what users receive from get().
 * Includes all input properties plus tree traversal and state methods.
 *
 * @template Z The input ticket type that extends NestedTicketInput.
 */
export type NestedTicket<Z extends NestedTicketInput = NestedTicketInput> = GroupTicket<Z> & {
  /** ID of the parent ticket, or undefined if this is a root item */
  parentId: ID | undefined
  /** Whether this ticket is currently open/expanded */
  isOpen: Readonly<Ref<boolean>>
  /** Whether this ticket is currently active/highlighted */
  isActive: Readonly<Ref<boolean>>
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
  /** Reveal this ticket by opening all ancestors */
  reveal: () => void
  /** Activate/highlight this ticket */
  activate: () => void
  /** Deactivate/unhighlight this ticket */
  deactivate: () => void
  /** Get path from root to self (includes self) */
  getPath: () => ID[]
  /** Get ancestors excluding self */
  getAncestors: () => ID[]
  /** Get all descendants */
  getDescendants: () => ID[]
  /** Check if this ticket is an ancestor of the given ID */
  isAncestorOf: (descendantId: ID) => boolean
  /** Check if this ticket has the given ID as an ancestor */
  hasAncestor: (ancestorId: ID) => boolean
  /** Get sibling IDs (including self) */
  siblings: () => ID[]
  /** Get 1-indexed position among siblings (for aria-posinset) */
  position: () => number
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
 *
 * @template Z The input ticket type that extends NestedTicketInput.
 */
export type NestedRegistration<Z extends NestedTicketInput = NestedTicketInput> = Partial<Z> & {
  /** Inline children to register with this item as parent */
  children?: NestedRegistration<Z>[]
}

/**
 * Context for managing nested/hierarchical item collections.
 *
 * @template Z The input ticket type.
 * @template E The output ticket type.
 *
 * @remarks
 * Extends GroupContext with parent-child relationship tracking, open/close state,
 * and hierarchical traversal methods. Perfect for tree structures, nested menus,
 * file explorers, and organizational charts.
 */
export interface NestedContext<
  Z extends NestedTicketInput = NestedTicketInput,
  E extends NestedTicket<Z> = NestedTicket<Z>,
> extends Omit<GroupContext<Z, E>, 'register' | 'onboard' | 'select' | 'unselect' | 'toggle'> {
  /** Map of parent IDs to arrays of child IDs. Use register/unregister to modify. */
  readonly children: ReadonlyMap<ID, readonly ID[]>
  /** Map of child IDs to their parent ID (or undefined for roots). Use register/unregister to modify. */
  readonly parents: ReadonlyMap<ID, ID | undefined>
  /** Reactive Set of opened/expanded item IDs. Use open/close/flip to modify. */
  readonly openedIds: Reactive<Set<ID>>
  /** Computed Set of opened/expanded item instances */
  openedItems: ComputedRef<Set<E>>
  /** Reactive Set of active/highlighted item IDs. Use activate/deactivate to modify. */
  readonly activeIds: Reactive<Set<ID>>
  /** Computed Set of active/highlighted item instances */
  activeItems: ComputedRef<Set<E>>
  /** Computed Set of active item indexes (position-based) */
  activeIndexes: ComputedRef<Set<number>>
  /** Activate/highlight one or more items by ID */
  activate: (ids: ID | ID[]) => void
  /** Deactivate/unhighlight one or more items by ID */
  deactivate: (ids: ID | ID[]) => void
  /** Check if an item is active by ID */
  activated: (id: ID) => boolean
  /** Deactivate all items */
  deactivateAll: () => void
  /** Open/expand one or more items by ID */
  open: (ids: ID | ID[]) => void
  /** Close/collapse one or more items by ID */
  close: (ids: ID | ID[]) => void
  /** Flip one or more items' open/closed state by ID */
  flip: (ids: ID | ID[]) => void
  /** Check if an item is open by ID */
  opened: (id: ID) => boolean
  /** Open node(s) and their immediate non-leaf children */
  unfold: (ids: ID | ID[]) => void
  /** Reveal node(s) by opening all ancestors (makes node visible without opening it) */
  reveal: (ids: ID | ID[]) => void
  /** Fully expand node(s) and all their non-leaf descendants */
  expand: (ids: ID | ID[]) => void
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
  /** Check if ancestorId is an ancestor of descendantId */
  isAncestorOf: (ancestorId: ID, descendantId: ID) => boolean
  /** Check if id has ancestorId as an ancestor (semantic alias for isAncestorOf) */
  hasAncestor: (id: ID, ancestorId: ID) => boolean
  /** Get sibling IDs (including self). For roots, returns all root IDs. */
  siblings: (id: ID) => ID[]
  /** Get 1-indexed position among siblings (for aria-posinset). Returns 0 if not found. */
  position: (id: ID) => number
  /** Computed array of root items (items with no parent) */
  roots: ComputedRef<E[]>
  /** Computed array of leaf items (items with no children) */
  leaves: ComputedRef<E[]>
  /** Strategy controlling how items are opened */
  openStrategy: OpenStrategy
  /** Select item(s) and all descendants, updating ancestor mixed states */
  select: (ids: ID | ID[]) => void
  /** Unselect item(s) and all descendants, updating ancestor mixed states */
  unselect: (ids: ID | ID[]) => void
  /** Toggle selection with cascading behavior */
  toggle: (ids: ID | ID[]) => void
  /** Register a node with optional inline children (accepts input type, returns output type) */
  register: (registration?: NestedRegistration<Z>) => E
  /** Batch register nodes with optional inline children */
  onboard: (registrations: NestedRegistration<Z>[]) => E[]
  /** Unregister a node, optionally cascading to descendants */
  unregister: (id: ID, cascade?: boolean) => void
  /** Offboard multiple nodes, optionally cascading */
  offboard: (ids: ID[], cascade?: boolean) => void
  /** Clear all nodes and nested state (children, parents, openedIds) */
  clear: () => void
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
/**
 * Active mode for nested items.
 * - `'single'` (default): Only one item can be active at a time
 * - `'multiple'`: Multiple items can be active simultaneously
 */
export type NestedActiveMode = 'single' | 'multiple'

export interface NestedOptions extends GroupOptions {
  /**
   * Controls how nodes expand/collapse.
   * - `'multiple'` (default): Multiple nodes can be open simultaneously
   * - `'single'`: Only one node open at a time (accordion behavior)
   */
  open?: NestedOpenMode
  /**
   * When true, parent nodes automatically open when children are registered.
   * Similar to `enroll` in selection composables but for open state.
   */
  openAll?: boolean
  /**
   * When true, opening a node also opens all its ancestors.
   * Ensures the opened node is always visible in the tree.
   */
  reveal?: boolean
  /**
   * Controls how selection cascades through the hierarchy.
   * - `'cascade'` (default): Selecting parent selects descendants; ancestors show mixed state
   * - `'independent'`: Each node selected independently
   * - `'leaf'`: Only leaf nodes selectable; parent selection selects leaf descendants
   */
  selection?: NestedSelectionMode
  /**
   * Controls how many items can be active/highlighted simultaneously.
   * - `'single'` (default): Only one item active at a time
   * - `'multiple'`: Multiple items can be active simultaneously
   */
  active?: NestedActiveMode
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
   * When true, parent nodes automatically open when children are registered.
   * Similar to `enroll` in selection composables but for open state.
   */
  openAll?: boolean
  /**
   * When true, opening a node also opens all its ancestors.
   * Ensures the opened node is always visible in the tree.
   */
  reveal?: boolean
  /**
   * Controls how selection cascades through the hierarchy.
   * - `'cascade'` (default): Selecting parent selects descendants; ancestors show mixed state
   * - `'independent'`: Each node selected independently
   * - `'leaf'`: Only leaf nodes selectable; parent selection selects leaf descendants
   */
  selection?: NestedSelectionMode
  /**
   * Controls how many items can be active/highlighted simultaneously.
   * - `'single'` (default): Only one item active at a time
   * - `'multiple'`: Multiple items can be active simultaneously
   */
  active?: NestedActiveMode
  /**
   * Advanced: Custom strategy for open behavior.
   * Overrides `open` option if provided.
   * @deprecated Use `open` option for simple cases
   */
  openStrategy?: OpenStrategy
}
