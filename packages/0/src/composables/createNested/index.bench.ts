/**
 * createNested Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup, traversal, open/close, selection, mutation, batch
 */

import { bench, describe } from 'vitest'

// Types
import type { NestedContext, NestedRegistration, NestedTicket } from './types'

import { createNested } from './index'

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

// Pre-populated instances for READ-ONLY benchmarks
function createPopulatedNested (items: NestedRegistration[]): NestedContext<NestedTicket> {
  const nested = createNested()
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
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost
  // ===========================================================================
  describe('open/close operations', () => {
    bench('Open single node (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.open(LOOKUP_ROOT_TREE)
    })

    bench('Open single node (10,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_10K)
      nested.open(LOOKUP_ROOT_TREE)
    })

    bench('Close single node (1,000 tree items)', () => {
      const nested = createPopulatedNestedWithOpen(TREE_1K)
      nested.close(LOOKUP_ROOT_TREE)
    })

    bench('Toggle open (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.flip(LOOKUP_ROOT_TREE)
    })

    bench('Expand all (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.expandAll()
    })

    bench('Expand all (10,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_10K)
      nested.expandAll()
    })

    bench('Collapse all (1,000 tree items)', () => {
      const nested = createPopulatedNestedWithOpen(TREE_1K)
      nested.collapseAll()
    })

    bench('Collapse all (10,000 tree items)', () => {
      const nested = createPopulatedNestedWithOpen(TREE_10K)
      nested.collapseAll()
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Cascading selection
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + cascading selection cost
  // ===========================================================================
  describe('selection operations', () => {
    bench('Select leaf node (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.select(LOOKUP_ID_TREE_1K)
    })

    bench('Select root node with cascade (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.select(LOOKUP_ROOT_TREE)
    })

    bench('Select root node with cascade (10,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_10K)
      nested.select(LOOKUP_ROOT_TREE)
    })

    bench('Unselect root node with cascade (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.select(LOOKUP_ROOT_TREE)
      nested.unselect(LOOKUP_ROOT_TREE)
    })

    bench('Toggle selection (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.toggle(LOOKUP_ROOT_TREE)
    })

    bench('Select all via selectAll (1,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_1K)
      nested.selectAll()
    })

    bench('Select all via selectAll (10,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_10K)
      nested.selectAll()
    })
  })

  // ===========================================================================
  // MUTATION OPERATIONS - Single item changes
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost
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
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost
  // ===========================================================================
  describe('batch operations', () => {
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
      const nested = createPopulatedNested(TREE_1K)
      nested.toFlat()
    })

    bench('toFlat conversion (10,000 tree items)', () => {
      const nested = createPopulatedNested(TREE_10K)
      nested.toFlat()
    })
  })

  // ===========================================================================
  // SELECTION MODE COMPARISON - Different selection strategies
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: relative cost of different selection modes
  // ===========================================================================
  describe('selection mode comparison', () => {
    bench('Select root - cascade mode (1,000 tree items)', () => {
      const nested = createNested({ selection: 'cascade' })
      nested.onboard(TREE_1K)
      nested.select(LOOKUP_ROOT_TREE)
    })

    bench('Select root - independent mode (1,000 tree items)', () => {
      const nested = createNested({ selection: 'independent' })
      nested.onboard(TREE_1K)
      nested.select(LOOKUP_ROOT_TREE)
    })

    bench('Select root - leaf mode (1,000 tree items)', () => {
      const nested = createNested({ selection: 'leaf' })
      nested.onboard(TREE_1K)
      nested.select(LOOKUP_ROOT_TREE)
    })
  })

  // ===========================================================================
  // OPEN MODE COMPARISON - Single vs multiple open strategies
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: relative cost of different open modes
  // ===========================================================================
  describe('open mode comparison', () => {
    bench('Open 3 nodes - multiple mode (1,000 tree items)', () => {
      const nested = createNested({ open: 'multiple' })
      nested.onboard(TREE_1K)
      nested.open('node-0')
      nested.open('node-1')
      nested.open('node-2')
    })

    bench('Open 3 nodes - single mode (1,000 tree items)', () => {
      const nested = createNested({ open: 'single' })
      nested.onboard(TREE_1K)
      nested.open('node-0')
      nested.open('node-1')
      nested.open('node-2')
    })
  })
})
