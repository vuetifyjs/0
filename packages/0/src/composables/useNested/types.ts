// Types
import type { ComputedRef, Reactive, Ref } from 'vue'
import type { ID } from '#v0/types'
import type { GroupContext, GroupContextOptions, GroupOptions, GroupTicket } from '#v0/composables/useGroup'

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
  /** Toggle this ticket's open/closed state */
  toggleOpen: () => void
  /** Get path from root to self (includes self) */
  getPath: () => ID[]
  /** Get ancestors excluding self */
  getAncestors: () => ID[]
  /** Get all descendants */
  getDescendants: () => ID[]
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
  onOpen?: (id: ID, context: NestedContext<any>) => void
  /** Called when an item is closed */
  onClose?: (id: ID, context: NestedContext<any>) => void
}

/**
 * Context for managing nested/hierarchical item collections.
 *
 * @remarks
 * Extends GroupContext with parent-child relationship tracking, open/close state,
 * and hierarchical traversal methods. Perfect for tree structures, nested menus,
 * file explorers, and organizational charts.
 */
export interface NestedContext<Z extends NestedTicket> extends GroupContext<Z> {
  /** Map of parent IDs to arrays of child IDs */
  children: Map<ID, ID[]>
  /** Map of child IDs to their parent ID (or undefined for roots) */
  parents: Map<ID, ID | undefined>
  /** Reactive Set of opened/expanded item IDs */
  openedIds: Reactive<Set<ID>>
  /** Computed Set of opened/expanded item instances */
  openedItems: ComputedRef<Set<Z>>
  /** Open/expand an item by ID */
  open: (id: ID) => void
  /** Close/collapse an item by ID */
  close: (id: ID) => void
  /** Toggle an item's open/closed state by ID */
  toggleOpen: (id: ID) => void
  /** Check if an item is open by ID */
  opened: (id: ID) => boolean
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
}

/**
 * Options for creating a nested instance.
 */
export interface NestedOptions extends GroupOptions {
  /** Strategy for controlling open behavior */
  openStrategy?: OpenStrategy
}

/**
 * Options for creating a nested context.
 */
export interface NestedContextOptions extends GroupContextOptions {
  /** Strategy for controlling open behavior */
  openStrategy?: OpenStrategy
}
