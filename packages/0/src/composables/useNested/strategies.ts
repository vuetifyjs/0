/**
 * @module useNested/strategies
 *
 * @remarks
 * Open strategies for controlling how nested items expand/collapse.
 *
 * Key features:
 * - Multiple open strategy: allows multiple nodes to be open simultaneously
 * - Single open strategy: enforces only one node open at a time (accordion behavior)
 */

// Types
import type { ID } from '#v0/types'
import type { OpenStrategy, OpenStrategyContext } from './types'

/**
 * Multiple open strategy: allows multiple nodes to be open simultaneously.
 *
 * @remarks
 * Perfect for tree views, file explorers, and nested menus where users expect
 * to keep multiple sections expanded at once.
 *
 * @example
 * ```ts
 * const tree = createNested({ openStrategy: multipleOpenStrategy })
 * tree.open('node-1')
 * tree.open('node-2')
 * // Both nodes are now open
 * ```
 */
export const multipleOpenStrategy: OpenStrategy = {
  onOpen: undefined,
  onClose: undefined,
}

/**
 * Single open strategy: only one node can be open at a time (accordion behavior).
 *
 * @remarks
 * Perfect for accordions, single-select navigation, and contexts where only
 * one section should be visible at a time.
 *
 * @example
 * ```ts
 * const tree = createNested({ openStrategy: singleOpenStrategy })
 * tree.open('node-1') // node-1 opens
 * tree.open('node-2') // node-1 closes, node-2 opens
 * ```
 */
export const singleOpenStrategy: OpenStrategy = {
  onOpen: (id: ID, context: OpenStrategyContext) => {
    // Close all other items
    for (const openedId of context.openedIds) {
      if (openedId !== id) {
        context.openedIds.delete(openedId)
      }
    }
  },
  onClose: undefined,
}
