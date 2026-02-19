/**
 * createSelection Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, selection operations, mandatory enforcement, batch operations, computed access
 */

import { bench, describe } from 'vitest'

// Types
import type { SelectionContext, SelectionTicket, SelectionTicketInput } from './index'

import { createSelection } from './index'

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

function createPopulatedSelection (
  count: number,
  options?: Parameters<typeof createSelection>[0],
): SelectionContext<SelectionTicketInput, SelectionTicket> {
  const selection = createSelection(options)
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  selection.onboard(items.slice(0, count))
  return selection
}

const LOOKUP_ID_1K = 'item-500'
const LOOKUP_ID_10K = 'item-5000'

// Pre-populated shared fixtures for read-only benchmarks
const selection1k = createPopulatedSelection(1000, { multiple: true })
selection1k.select(LOOKUP_ID_1K)

const selection10k = createPopulatedSelection(10_000, { multiple: true })
selection10k.select(LOOKUP_ID_10K)

const enrolled1k = createPopulatedSelection(1000, { multiple: true, enroll: true })
const enrolled10k = createPopulatedSelection(10_000, { multiple: true, enroll: true })

const partial1k = createPopulatedSelection(1000, { multiple: true })
for (let i = 0; i < 100; i++) partial1k.select(`item-${i}`)

const partial10k = createPopulatedSelection(10_000, { multiple: true })
for (let i = 0; i < 1000; i++) partial10k.select(`item-${i}`)

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createSelection benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty selection', () => {
      createSelection()
    })

    bench('Onboard 1,000 items', () => {
      const selection = createSelection()
      selection.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items', () => {
      const selection = createSelection()
      selection.onboard(ITEMS_10K)
    })

    bench('Onboard 1,000 items (enroll)', () => {
      const selection = createSelection({ enroll: true, multiple: true })
      selection.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items (enroll)', () => {
      const selection = createSelection({ enroll: true, multiple: true })
      selection.onboard(ITEMS_10K)
    })

    bench('Onboard 1,000 items (mandatory: force)', () => {
      const selection = createSelection({ mandatory: 'force' })
      selection.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items (mandatory: force)', () => {
      const selection = createSelection({ mandatory: 'force' })
      selection.onboard(ITEMS_10K)
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Read-only state queries
  // Shared fixture (safe - no state changes)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('lookup operations', () => {
    bench('Check selected (1,000 items)', () => {
      selection1k.selected(LOOKUP_ID_1K)
    })

    bench('Check selected (10,000 items)', () => {
      selection10k.selected(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Single item select/unselect/toggle
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost
  // ===========================================================================
  describe('selection operations', () => {
    bench('Select single item (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { multiple: true })
      selection.select(LOOKUP_ID_1K)
    })

    bench('Select single item (10,000 items)', () => {
      const selection = createPopulatedSelection(10_000, { multiple: true })
      selection.select(LOOKUP_ID_10K)
    })

    bench('Unselect single item (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { multiple: true })
      selection.select(LOOKUP_ID_1K)
      selection.unselect(LOOKUP_ID_1K)
    })

    bench('Unselect single item (10,000 items)', () => {
      const selection = createPopulatedSelection(10_000, { multiple: true })
      selection.select(LOOKUP_ID_10K)
      selection.unselect(LOOKUP_ID_10K)
    })

    bench('Toggle single item (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { multiple: true })
      selection.toggle(LOOKUP_ID_1K)
    })

    bench('Toggle single item (10,000 items)', () => {
      const selection = createPopulatedSelection(10_000, { multiple: true })
      selection.toggle(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // MANDATORY ENFORCEMENT - Select/unselect under mandatory constraints
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: guard logic overhead
  // ===========================================================================
  describe('mandatory enforcement', () => {
    bench('Select with mandatory (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { mandatory: true })
      selection.select(LOOKUP_ID_1K)
    })

    bench('Unselect blocked by mandatory (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { mandatory: true })
      selection.select(LOOKUP_ID_1K)
      selection.unselect(LOOKUP_ID_1K)
    })

    bench('Mandate on empty (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { mandatory: 'force' })
      selection.mandate()
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk select/unselect cycles
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost for bulk workflows
  // ===========================================================================
  describe('batch operations', () => {
    bench('Select all 1,000 items', () => {
      const selection = createPopulatedSelection(1000, { multiple: true })
      for (const item of ITEMS_1K) {
        selection.select(item.id)
      }
    })

    bench('Select all 10,000 items', () => {
      const selection = createPopulatedSelection(10_000, { multiple: true })
      for (const item of ITEMS_10K) {
        selection.select(item.id)
      }
    })

    bench('Select then unselect all 1,000 items', () => {
      const selection = createPopulatedSelection(1000, { multiple: true })
      for (const item of ITEMS_1K) {
        selection.select(item.id)
      }
      for (const item of ITEMS_1K) {
        selection.unselect(item.id)
      }
    })

    bench('Reset selection (1,000 items)', () => {
      const selection = createPopulatedSelection(1000, { multiple: true, enroll: true })
      selection.reset()
    })

    bench('Reset selection (10,000 items)', () => {
      const selection = createPopulatedSelection(10_000, { multiple: true, enroll: true })
      selection.reset()
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - selectedItems, selectedValues derivation
  // Shared fixture (safe - reading .value doesn't mutate state)
  // Measures: amortized cost of repeated computed reads
  // ===========================================================================
  describe('computed access', () => {
    bench('Access selectedItems 100 times (100 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial1k.selectedItems.value
      }
    })

    bench('Access selectedItems 100 times (1,000 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void enrolled1k.selectedItems.value
      }
    })

    bench('Access selectedItems 100 times (1,000 of 10,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial10k.selectedItems.value
      }
    })

    bench('Access selectedValues 100 times (100 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void partial1k.selectedValues.value
      }
    })

    bench('Access selectedValues 100 times (1,000 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void enrolled1k.selectedValues.value
      }
    })

    bench('Access selectedValues 100 times (1,000 of 10,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void enrolled10k.selectedValues.value
      }
    })
  })
})
