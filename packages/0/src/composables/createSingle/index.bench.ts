/**
 * createSingle Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (select, unselect, toggle) share a populated fixture; the
 *   O(n) onboard is hoisted out. select enforces single-selection (clears others
 *   then adds); unselect pairs with select so it ends empty; toggle oscillates.
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, selection operations, computed access
 */

import { bench, describe } from 'vitest'

// Framework
import { createSingle } from '@vuetify/v0/composables'

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

function createPopulatedSingle (count: number, options?: Parameters<typeof createSingle>[0]) {
  const single = createSingle(options)
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  single.onboard(items.slice(0, count))
  return single
}

const LOOKUP_ID_1K = 'item-500'
const LOOKUP_ID_10K = 'item-5000'

// Pre-populated shared fixtures for read-only benchmarks
const single1k = createPopulatedSingle(1000)
single1k.select(LOOKUP_ID_1K)

const single10k = createPopulatedSingle(10_000)
single10k.select(LOOKUP_ID_10K)

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createSingle benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty single', () => {
      createSingle()
    })

    bench('Onboard 1,000 items', () => {
      const single = createSingle()
      single.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items', () => {
      const single = createSingle()
      single.onboard(ITEMS_10K)
    })

    bench('Onboard 1,000 items (mandatory)', () => {
      const single = createSingle({ mandatory: true })
      single.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items (mandatory)', () => {
      const single = createSingle({ mandatory: true })
      single.onboard(ITEMS_10K)
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Read-only state queries
  // Shared fixture (safe - no state changes)
  // ===========================================================================
  describe('lookup operations', () => {
    bench('Check selected (1,000 items)', () => {
      single1k.selected(LOOKUP_ID_1K)
    })

    bench('Check selected (10,000 items)', () => {
      single10k.selected(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Single-item select / unselect / toggle
  // WARM: shared fixtures; the O(n) onboard is hoisted out.
  // createSingle enforces single-selection: select clears existing selection then
  // adds the new id (two O(1) operations). unselect pairs with select to reach a
  // canonical empty end state each iteration. toggle oscillates between two O(1)
  // states.
  // ===========================================================================
  describe('selection operations', () => {
    const sel1k = createPopulatedSingle(1000)
    const sel10k = createPopulatedSingle(10_000)

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
  // COMPUTED ACCESS - selectedId, selectedItem, selectedIndex, selectedValue
  // Shared fixture (safe - reading .value does not mutate state)
  // Measures amortized cost of repeated computed reads on single-selection refs
  // ===========================================================================
  describe('computed access', () => {
    bench('Access selectedId 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void single1k.selectedId.value
      }
    })

    bench('Access selectedId 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void single10k.selectedId.value
      }
    })

    bench('Access selectedItem 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void single1k.selectedItem.value
      }
    })

    bench('Access selectedIndex 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void single1k.selectedIndex.value
      }
    })

    bench('Access selectedValue 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void single1k.selectedValue.value
      }
    })
  })
})
