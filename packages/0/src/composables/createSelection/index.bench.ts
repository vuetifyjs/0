/**
 * createSelection Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (select, unselect, toggle, mandate, select-all) share a
 *   populated fixture and time only the operation — the O(n) onboard is not
 *   re-paid per iteration. select is idempotent (Set add), unselect/select-all
 *   pair to a canonical end state, mandate resets first via the cheap reset()
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 *   or the op consumes the fixture with no cheap restore ('Reset selection'
 *   destroys the enrolled selection; re-establishing it is the O(n) enroll)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, selection operations, mandatory enforcement, batch operations, computed access
 */

import { bench, describe } from 'vitest'

// Framework
import { createSelection } from '@vuetify/v0/composables'

// Types
import type { SelectionContext, SelectionTicket, SelectionTicketInput } from '@vuetify/v0/composables'

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
  // WARM: shared multi-select fixture per size; the O(n) onboard is hoisted out
  // of the timed block. select adds an id (idempotent, no drift); unselect pairs
  // with a select so it ends empty each iteration; toggle oscillates between two
  // O(1) states. No computed reads in the timed block, so no memoization to defeat.
  // ===========================================================================
  describe('selection operations', () => {
    const sel1k = createPopulatedSelection(1000, { multiple: true })
    const sel10k = createPopulatedSelection(10_000, { multiple: true })

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
  // MANDATORY ENFORCEMENT - Select/unselect under mandatory constraints
  // WARM: shared mandatory fixtures; the O(n) onboard is hoisted out. select
  // clears + adds (single mode, self-canonicalizing); the blocked unselect leaves
  // the single selection intact (guard returns) — deterministic. 'Mandate on
  // empty' resets first via the cheap reset() so mandate() does real work (seek
  // first + select) each iteration, instead of the force-onboard's no-op.
  // ===========================================================================
  describe('mandatory enforcement', () => {
    const mandatory1k = createPopulatedSelection(1000, { mandatory: true })
    const force1k = createPopulatedSelection(1000, { mandatory: 'force' })

    bench('Select with mandatory (1,000 items)', () => {
      mandatory1k.select(LOOKUP_ID_1K)
    })

    bench('Unselect blocked by mandatory (1,000 items)', () => {
      mandatory1k.select(LOOKUP_ID_1K)
      mandatory1k.unselect(LOOKUP_ID_1K)
    })

    bench('Mandate on empty (1,000 items)', () => {
      force1k.reset()
      force1k.mandate()
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk select/unselect cycles
  // WARM: 'Select all' shares a multi-select fixture and resets first via the
  // cheap reset() so each iteration is a genuine empty -> full O(n) select loop;
  // 'Select then unselect all' loops both halves to a canonical empty end state.
  // The O(n) onboard is hoisted out of the timed block in both.
  // FRESH: 'Reset selection' consumes the fixture — reset() destroys the enrolled
  // selection, and re-establishing a full selection is the O(n) enroll (no cheap
  // restore), so it can't be warmed without paying the populate again.
  // ===========================================================================
  describe('batch operations', () => {
    const batch1k = createPopulatedSelection(1000, { multiple: true })
    const batch10k = createPopulatedSelection(10_000, { multiple: true })

    bench('Select all 1,000 items', () => {
      batch1k.reset()
      for (const item of ITEMS_1K) {
        batch1k.select(item.id)
      }
    })

    bench('Select all 10,000 items', () => {
      batch10k.reset()
      for (const item of ITEMS_10K) {
        batch10k.select(item.id)
      }
    })

    bench('Select then unselect all 1,000 items', () => {
      for (const item of ITEMS_1K) {
        batch1k.select(item.id)
      }
      for (const item of ITEMS_1K) {
        batch1k.unselect(item.id)
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
