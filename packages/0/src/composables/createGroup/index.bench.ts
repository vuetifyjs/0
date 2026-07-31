/**
 * createGroup Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (select, unselect, toggle, selectAll, unselectAll) share a
 *   populated fixture and time only the operation — the O(n) onboard is hoisted
 *   out. select/unselect pair to a canonical state; selectAll resets first via
 *   the cheap reset() so each iteration is a genuine empty→full loop; toggleAll
 *   oscillates between two states via isAllSelected.
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 *   or the op consumes the fixture with no cheap restore (unselectAll + mandatory)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, selection operations, mixed state,
 *   batch operations, computed access
 */

import { bench, describe } from 'vitest'

// Framework
import { createGroup } from '@vuetify/v0/composables'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkItem {
  id: string
  value: string
}

const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

const ITEMS_10K: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

function createPopulatedGroup (count: number, options?: Parameters<typeof createGroup>[0]) {
  const group = createGroup(options)
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  group.onboard(items.slice(0, count))
  return group
}

const LOOKUP_ID_1K = 'item-500'
const LOOKUP_ID_10K = 'item-5000'

// Pre-populated shared fixtures for read-only benchmarks
const group1k = createPopulatedGroup(1000)
group1k.select(LOOKUP_ID_1K)

const group10k = createPopulatedGroup(10_000)
group10k.select(LOOKUP_ID_10K)

// Partially selected fixtures for computed access benchmarks
const partial1k = createPopulatedGroup(1000)
for (let i = 0; i < 100; i++) partial1k.select(`item-${i}`)

const partial10k = createPopulatedGroup(10_000)
for (let i = 0; i < 1000; i++) partial10k.select(`item-${i}`)

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createGroup benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty group', () => {
      createGroup()
    })

    bench('Onboard 1,000 items', () => {
      const group = createGroup()
      group.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items', () => {
      const group = createGroup()
      group.onboard(ITEMS_10K)
    })

    bench('Onboard 1,000 items (mandatory)', () => {
      const group = createGroup({ mandatory: true })
      group.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items (mandatory)', () => {
      const group = createGroup({ mandatory: true })
      group.onboard(ITEMS_10K)
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Read-only state queries
  // Shared fixture (safe - no state changes)
  // ===========================================================================
  describe('lookup operations', () => {
    bench('Check selected (1,000 items)', () => {
      group1k.selected(LOOKUP_ID_1K)
    })

    bench('Check selected (10,000 items)', () => {
      group10k.selected(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Single item select/unselect/toggle
  // WARM: shared fixtures; the O(n) onboard is hoisted out. select adds/removes
  // from the Set (idempotent on repeated select); unselect pairs with select.
  // toggle oscillates between selected/unselected states.
  // ===========================================================================
  describe('selection operations', () => {
    const sel1k = createPopulatedGroup(1000)
    const sel10k = createPopulatedGroup(10_000)

    bench('Select single item (1,000 items)', () => {
      sel1k.select(LOOKUP_ID_1K)
    })

    bench('Select single item (10,000 items)', () => {
      sel10k.select(LOOKUP_ID_10K)
    })

    bench('Unselect single item (1,000 items)', () => {
      sel1k.select(LOOKUP_ID_1K)
      sel1k.unselect(LOOKUP_ID_1K)
    })

    bench('Unselect single item (10,000 items)', () => {
      sel10k.select(LOOKUP_ID_10K)
      sel10k.unselect(LOOKUP_ID_10K)
    })

    bench('Toggle single item (1,000 items)', () => {
      sel1k.toggle(LOOKUP_ID_1K)
    })

    bench('Toggle single item (10,000 items)', () => {
      sel10k.toggle(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // MIXED STATE - Indeterminate (mixed/unmix) operations
  // WARM: shared fixtures; mix/unmix are O(1) Set operations.
  // ===========================================================================
  describe('mixed state', () => {
    const mix1k = createPopulatedGroup(1000)

    bench('Mix single item (1,000 items)', () => {
      mix1k.select(LOOKUP_ID_1K)
      mix1k.mix(LOOKUP_ID_1K)
    })

    bench('Unmix single item (1,000 items)', () => {
      mix1k.mix(LOOKUP_ID_1K)
      mix1k.unmix(LOOKUP_ID_1K)
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - selectAll / unselectAll / toggleAll
  // WARM: selectAll resets first via the cheap reset() so each iteration is a
  // genuine empty→full O(n) pass. unselectAll + toggleAll use similarly hoisted
  // setup so only the target operation is timed.
  // ===========================================================================
  describe('batch operations', () => {
    const batch1k = createPopulatedGroup(1000)
    const batch10k = createPopulatedGroup(10_000)

    bench('Select all 1,000 items', () => {
      batch1k.reset()
      batch1k.selectAll()
    })

    bench('Select all 10,000 items', () => {
      batch10k.reset()
      batch10k.selectAll()
    })

    bench('Unselect all 1,000 items (from full)', () => {
      batch1k.selectAll()
      batch1k.unselectAll()
    })

    bench('Toggle all 1,000 items (none→all)', () => {
      batch1k.reset()
      batch1k.toggleAll()
    })

    bench('Toggle all 1,000 items (all→none)', () => {
      batch1k.selectAll()
      batch1k.toggleAll()
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - selectedIndexes, isAllSelected, isNoneSelected, isMixed
  // Shared fixture (safe - reading .value does not mutate state)
  // Measures amortized cost of repeated computed reads
  // ===========================================================================
  describe('computed access', () => {
    bench('Access selectedIndexes 100 times (100 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial1k.selectedIndexes.value
      }
    })

    bench('Access selectedIndexes 100 times (1,000 of 10,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial10k.selectedIndexes.value
      }
    })

    bench('Access isAllSelected 100 times (partial, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial1k.isAllSelected.value
      }
    })

    bench('Access isNoneSelected 100 times (partial, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial1k.isNoneSelected.value
      }
    })

    bench('Access isMixed 100 times (partial, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial1k.isMixed.value
      }
    })
  })
})
