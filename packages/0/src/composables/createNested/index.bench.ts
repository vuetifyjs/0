/**
 * createNested Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (open/close, expand/collapse, select/unselect/toggle,
 *   selectAll, toFlat, mode comparisons) share a populated tree and time only
 *   the operation — the O(n) onboard is not re-paid per iteration. open/select/
 *   selectAll/expandAll run their full body on already-open/selected nodes (no
 *   early return), so they stay deterministic without a reset; close/unselect
 *   pair with an open/select; flip/toggle oscillate; collapseAll alternates with
 *   expandAll so every iteration is a full O(n) pass (collapse on empty is a no-op)
 * - FRESH fixtures only where the populate IS the measured op (initialization,
 *   onboard-then-clear) or the op grows/consumes the fixture (register grows the
 *   tree, unregister shrinks it — neither has a cheap stable-size restore)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup, traversal, open/close, selection, mutation, batch
 */

import { bench, describe } from 'vitest'

// Framework
import { createNested } from '@vuetify/v0/composables'

// Types
import type { NestedContext, NestedRegistration, NestedTicket } from '@vuetify/v0/composables'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

// Generate flat items (no hierarchy)
function generateFlatItems (count: number): NestedRegistration[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    value: `value-${i}`,
  }))
}

// Generate balanced tree: each non-leaf has `branching` children
// depth=3, branching=10 → ~1,111 items (1 + 10 + 100 + 1000)
function generateTree (depth: number, branching: number, prefix = 'node'): NestedRegistration[] {
  if (depth === 0) return []

  return Array.from({ length: branching }, (_, i) => ({
    id: `${prefix}-${i}`,
    value: `${prefix}-${i}`,
    children: depth > 1 ? generateTree(depth - 1, branching, `${prefix}-${i}`) : undefined,
  }))
}

// Pre-generated item arrays
const FLAT_1K = generateFlatItems(1000)
const FLAT_10K = generateFlatItems(10_000)

// Trees: depth 3 with branching 10 = 1,111 nodes, depth 4 with branching 10 = 11,111 nodes
const TREE_1K = generateTree(3, 10) // ~1,111 nodes
const TREE_10K = generateTree(4, 10) // ~11,111 nodes

// Pre-populated instances for READ-ONLY and WARM benchmarks
function createPopulatedNested (
  items: NestedRegistration[],
  options?: Parameters<typeof createNested>[0],
): NestedContext<NestedTicket> {
  const nested = createNested(options)
  nested.onboard(items)
  return nested
}

function createPopulatedNestedWithOpen (items: NestedRegistration[]): NestedContext<NestedTicket> {
  const nested = createNested()
  nested.onboard(items)
  nested.expandAll()
  return nested
}

// Lookup targets
const LOOKUP_ID_FLAT_1K = 'item-500'
const LOOKUP_ID_FLAT_10K = 'item-5000'
const LOOKUP_ID_TREE_1K = 'node-5-5-5' // Deep node in 1K tree
const LOOKUP_ID_TREE_10K = 'node-5-5-5-5' // Deep node in 10K tree
const LOOKUP_ROOT_TREE = 'node-5' // Root level node

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createNested benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty nested', () => {
      createNested()
    })

    bench('Onboard 1,000 flat items', () => {
      const nested = createNested()
      nested.onboard(FLAT_1K)
    })

    bench('Onboard 10,000 flat items', () => {
      const nested = createNested()
      nested.onboard(FLAT_10K)
    })

    bench('Onboard ~1,000 tree items (depth 3)', () => {
      const nested = createNested()
      nested.onboard(TREE_1K)
    })

    bench('Onboard ~10,000 tree items (depth 4)', () => {
      const nested = createNested()
      nested.onboard(TREE_10K)
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Single item access
  // Shared fixture (safe - read-only operations, no state changes)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('lookup operations', () => {
    const flat1k = createPopulatedNested(FLAT_1K)
    const flat10k = createPopulatedNested(FLAT_10K)
    const tree1k = createPopulatedNested(TREE_1K)
    const tree10k = createPopulatedNested(TREE_10K)

    bench('Get by id (1,000 flat items)', () => {
      flat1k.get(LOOKUP_ID_FLAT_1K)
    })

    bench('Get by id (10,000 flat items)', () => {
      flat10k.get(LOOKUP_ID_FLAT_10K)
    })

    bench('Check isLeaf (1,000 tree items)', () => {
      tree1k.isLeaf(LOOKUP_ID_TREE_1K)
    })

    bench('Check isLeaf (10,000 tree items)', () => {
      tree10k.isLeaf(LOOKUP_ID_TREE_10K)
    })

    bench('Get depth (1,000 tree items)', () => {
      tree1k.getDepth(LOOKUP_ID_TREE_1K)
    })

    bench('Get depth (10,000 tree items)', () => {
      tree10k.getDepth(LOOKUP_ID_TREE_10K)
    })

    bench('Check opened state (1,000 items)', () => {
      tree1k.opened(LOOKUP_ROOT_TREE)
    })

    bench('Check selected state (1,000 items)', () => {
      tree1k.selected(LOOKUP_ID_TREE_1K)
    })
  })

  // ===========================================================================
  // TRAVERSAL OPERATIONS - Tree navigation
  // Shared fixture (safe - read-only operations)
  // Measures: path/ancestor/descendant computation cost
  // ===========================================================================
  describe('traversal operations', () => {
    const tree1k = createPopulatedNested(TREE_1K)
    const tree10k = createPopulatedNested(TREE_10K)

    bench('Get path to deep node (1,000 tree items)', () => {
      tree1k.getPath(LOOKUP_ID_TREE_1K)
    })

    bench('Get path to deep node (10,000 tree items)', () => {
      tree10k.getPath(LOOKUP_ID_TREE_10K)
    })

    bench('Get ancestors of deep node (1,000 tree items)', () => {
      tree1k.getAncestors(LOOKUP_ID_TREE_1K)
    })

    bench('Get ancestors of deep node (10,000 tree items)', () => {
      tree10k.getAncestors(LOOKUP_ID_TREE_10K)
    })

    bench('Get descendants of root node (1,000 tree items)', () => {
      tree1k.getDescendants(LOOKUP_ROOT_TREE)
    })

    bench('Get descendants of root node (10,000 tree items)', () => {
      tree10k.getDescendants(LOOKUP_ROOT_TREE)
    })

    bench('Access roots (1,000 tree items)', () => {
      void tree1k.roots.value
    })

    bench('Access leaves (1,000 tree items)', () => {
      void tree1k.leaves.value
    })
  })

  // ===========================================================================
  // OPEN/CLOSE OPERATIONS - Expand/collapse state
  // WARM: shared populated trees per size; the O(n) onboard is hoisted out of
  // the timed block. open/expandAll on already-open nodes still run their full
  // body (no early return), so they stay deterministic without a reset. close
  // pairs with an open so each iteration adds then removes the same node. flip
  // oscillates open↔closed. collapseAll empties openedIds, so a collapsed fixture
  // would measure nothing — it alternates collapse↔expand instead, keeping every
  // iteration a full O(n) pass (the mean is the average of the two).
  // ===========================================================================
  describe('open/close operations', () => {
    const openTree1k = createPopulatedNestedWithOpen(TREE_1K)
    const openTree10k = createPopulatedNestedWithOpen(TREE_10K)
    const closeTree1k = createPopulatedNestedWithOpen(TREE_1K)
    const flipTree1k = createPopulatedNested(TREE_1K)
    const expandTree1k = createPopulatedNestedWithOpen(TREE_1K)
    const expandTree10k = createPopulatedNestedWithOpen(TREE_10K)
    const collapseTree1k = createPopulatedNestedWithOpen(TREE_1K)
    const collapseTree10k = createPopulatedNestedWithOpen(TREE_10K)
    let collapsed1k = false
    let collapsed10k = false

    bench('Open single node (1,000 tree items)', () => {
      openTree1k.open(LOOKUP_ROOT_TREE)
    })

    bench('Open single node (10,000 tree items)', () => {
      openTree10k.open(LOOKUP_ROOT_TREE)
    })

    bench('Close single node (1,000 tree items)', () => {
      closeTree1k.open(LOOKUP_ROOT_TREE)
      closeTree1k.close(LOOKUP_ROOT_TREE)
    })

    bench('Toggle open (1,000 tree items)', () => {
      flipTree1k.flip(LOOKUP_ROOT_TREE)
    })

    bench('Expand all (1,000 tree items)', () => {
      expandTree1k.expandAll()
    })

    bench('Expand all (10,000 tree items)', () => {
      expandTree10k.expandAll()
    })

    bench('Collapse all (1,000 tree items)', () => {
      if (collapsed1k) collapseTree1k.expandAll()
      else collapseTree1k.collapseAll()
      collapsed1k = !collapsed1k
    })

    bench('Collapse all (10,000 tree items)', () => {
      if (collapsed10k) collapseTree10k.expandAll()
      else collapseTree10k.collapseAll()
      collapsed10k = !collapsed10k
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Cascading selection
  // WARM: shared populated tree per bench; the O(n) onboard is hoisted out of
  // the timed block. select/selectAll on already-selected items cause no state
  // change but still perform the full O(descendants)/O(n) traversal (no early
  // return), so they stay deterministic without a reset. unselect pairs with a
  // select so each iteration selects then clears the subtree; toggle oscillates.
  // Each warm bench owns its fixture so divergent end states don't couple.
  // ===========================================================================
  describe('selection operations', () => {
    const selLeaf1k = createPopulatedNested(TREE_1K)
    const selRoot1k = createPopulatedNested(TREE_1K)
    const unselRoot1k = createPopulatedNested(TREE_1K)
    const toggleSel1k = createPopulatedNested(TREE_1K)
    const selectAll1k = createPopulatedNested(TREE_1K)
    const tree10kAllSelected = createPopulatedNested(TREE_10K)
    tree10kAllSelected.selectAll()

    bench('Select leaf node (1,000 tree items)', () => {
      selLeaf1k.select(LOOKUP_ID_TREE_1K)
    })

    bench('Select root node with cascade (1,000 tree items)', () => {
      selRoot1k.select(LOOKUP_ROOT_TREE)
    })

    bench('Select root node with cascade (10,000 tree items)', () => {
      tree10kAllSelected.select(LOOKUP_ROOT_TREE)
    })

    bench('Unselect root node with cascade (1,000 tree items)', () => {
      unselRoot1k.select(LOOKUP_ROOT_TREE)
      unselRoot1k.unselect(LOOKUP_ROOT_TREE)
    })

    bench('Toggle selection (1,000 tree items)', () => {
      toggleSel1k.toggle(LOOKUP_ROOT_TREE)
    })

    bench('Select all via selectAll (1,000 tree items)', () => {
      selectAll1k.selectAll()
    })

    bench('Select all via selectAll (10,000 tree items)', () => {
      tree10kAllSelected.selectAll()
    })
  })

  // ===========================================================================
  // MUTATION OPERATIONS - Single item changes
  // FRESH: register grows the tree and unregister shrinks it, so neither has a
  // cheap stable-size restore — a shared fixture would grow/shrink unbounded
  // across iterations. 'Register single root item' is an empty create + one
  // register (O(1) construction, not an O(n) populate, so nothing to hoist).
  // The populated register/unregister benches pay the O(n) onboard by necessity.
  // ===========================================================================
  describe('mutation operations', () => {
    bench('Register single root item', () => {
      const nested = createNested()
      nested.register({ id: 'single', value: 'test' })
    })

    bench('Register item with parent (1,000 items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.register({ id: 'new-child', value: 'test', parentId: LOOKUP_ROOT_TREE })
    })

    bench('Unregister leaf node (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.unregister(LOOKUP_ID_TREE_1K)
    })

    bench('Unregister root with cascade (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.unregister(LOOKUP_ROOT_TREE, true)
    })

    bench('Unregister root with cascade (10,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_10K)
      nested.unregister(LOOKUP_ROOT_TREE, true)
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk actions
  // WARM: 'toFlat' is read-only (maps values to a new array, no state change),
  //   so it shares a populated tree and runs its full O(n) map each iteration.
  // FRESH: 'Onboard then clear' consumes the fixture — clear empties it, so both
  //   halves are the measured batch and can't be shared.
  // ===========================================================================
  describe('batch operations', () => {
    const toFlatTree1k = createPopulatedNested(TREE_1K)
    const toFlatTree10k = createPopulatedNested(TREE_10K)

    bench('Onboard then clear 1,000 tree items', () => {
      const nested = createNested()
      nested.onboard(TREE_1K)
      nested.clear()
    })

    bench('Onboard then clear 10,000 tree items', () => {
      const nested = createNested()
      nested.onboard(TREE_10K)
      nested.clear()
    })

    bench('toFlat conversion (1,000 tree items)', () => {
      toFlatTree1k.toFlat()
    })

    bench('toFlat conversion (10,000 tree items)', () => {
      toFlatTree10k.toFlat()
    })
  })

  // ===========================================================================
  // SELECTION MODE COMPARISON - Different selection strategies
  // WARM: one shared fixture per mode; the O(n) onboard is hoisted out of the
  // timed block. select(ROOT) runs its full mode-specific traversal on each
  // iteration and is idempotent (Set adds), so it stays deterministic without a
  // reset. Measures the relative cost of each selection mode's select path.
  // ===========================================================================
  describe('selection mode comparison', () => {
    const cascade1k = createPopulatedNested(TREE_1K, { selection: 'cascade' })
    const independent1k = createPopulatedNested(TREE_1K, { selection: 'independent' })
    const leaf1k = createPopulatedNested(TREE_1K, { selection: 'leaf' })

    bench('Select root - cascade mode (1,000 tree items)', () => {
      cascade1k.select(LOOKUP_ROOT_TREE)
    })

    bench('Select root - independent mode (1,000 tree items)', () => {
      independent1k.select(LOOKUP_ROOT_TREE)
    })

    bench('Select root - leaf mode (1,000 tree items)', () => {
      leaf1k.select(LOOKUP_ROOT_TREE)
    })
  })

  // ===========================================================================
  // OPEN MODE COMPARISON - Single vs multiple open strategies
  // WARM: one shared fixture per mode; the O(n) onboard is hoisted out of the
  // timed block. Opening the same three nodes each iteration is idempotent
  // (multiple mode accumulates; single mode closes others, ending on node-2),
  // so both stay deterministic. Measures the relative cost of each open mode.
  // ===========================================================================
  describe('open mode comparison', () => {
    const multiOpen1k = createPopulatedNested(TREE_1K, { open: 'multiple' })
    const singleOpen1k = createPopulatedNested(TREE_1K, { open: 'single' })

    bench('Open 3 nodes - multiple mode (1,000 tree items)', () => {
      multiOpen1k.open('node-0')
      multiOpen1k.open('node-1')
      multiOpen1k.open('node-2')
    })

    bench('Open 3 nodes - single mode (1,000 tree items)', () => {
      singleOpen1k.open('node-0')
      singleOpen1k.open('node-1')
      singleOpen1k.open('node-2')
    })
  })
})
