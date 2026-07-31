/**
 * createModel Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (select, unselect, toggle, apply, reset) share a populated
 *   fixture and time only the operation — the O(n) register loop is not re-paid
 *   per iteration. Single-mode select self-canonicalizes (clear + add), so the
 *   fixture stays deterministic without an explicit reset
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 *   or the op consumes the fixture (onboard-then-offboard); 'Apply ref value'
 *   stays fresh as an O(1) empty + single-register construction (no populate)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, selection operations, apply operations, batch operations, computed access
 */

import { bench, describe } from 'vitest'

// Framework
import { createModel } from '@vuetify/v0/composables'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { ModelContext, ModelTicket, ModelTicketInput } from '@vuetify/v0/composables'

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

function createPopulatedModel (
  count: number,
  options?: Parameters<typeof createModel>[0],
): ModelContext<ModelTicketInput, ModelTicket> {
  const model = createModel(options)
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  for (const item of items.slice(0, count)) {
    model.register(item)
  }
  return model
}

const LOOKUP_ID_1K = 'item-500'
const LOOKUP_ID_10K = 'item-5000'

// Pre-populated shared fixtures for read-only benchmarks
const model1k = createPopulatedModel(1000)
model1k.select(LOOKUP_ID_1K)

const model10k = createPopulatedModel(10_000)
model10k.select(LOOKUP_ID_10K)

describe('createModel benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - the register loop IS the measured op)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty model', () => {
      createModel()
    })

    bench('Register 1,000 items', () => {
      const model = createModel()
      for (const item of ITEMS_1K) {
        model.register(item)
      }
    })

    bench('Register 10,000 items', () => {
      const model = createModel()
      for (const item of ITEMS_10K) {
        model.register(item)
      }
    })

    bench('Register 1,000 items (disabled)', () => {
      const model = createModel({ disabled: true })
      for (const item of ITEMS_1K) {
        model.register(item)
      }
    })

    bench('Register 10,000 items (disabled)', () => {
      const model = createModel({ disabled: true })
      for (const item of ITEMS_10K) {
        model.register(item)
      }
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Read-only state queries
  // Shared fixture (safe - no state changes)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('lookup operations', () => {
    bench('Check selected (1,000 items)', () => {
      model1k.selected(LOOKUP_ID_1K)
    })

    bench('Check selected (10,000 items)', () => {
      model10k.selected(LOOKUP_ID_10K)
    })

    bench('Get by id (1,000 items)', () => {
      model1k.get(LOOKUP_ID_1K)
    })

    bench('Get by id (10,000 items)', () => {
      model10k.get(LOOKUP_ID_10K)
    })

    bench('Browse by value (1,000 items)', () => {
      model1k.browse('value-500')
    })

    bench('Browse by value (10,000 items)', () => {
      model10k.browse('value-5000')
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Single item select/unselect/toggle
  // WARM: shared populated fixture per size; the O(n) register loop is hoisted
  // out of the timed block. Single-mode select clears + adds (self-canonicalizing,
  // no drift, no reset needed); unselect pairs with a select so it ends empty
  // each iteration; toggle oscillates between two O(1) states. The disabled
  // fixture follows the same pattern — select is a guarded no-op. No computed
  // reads in the timed block, so no memoization to defeat.
  // ===========================================================================
  describe('selection operations', () => {
    const sel1k = createPopulatedModel(1000)
    const sel10k = createPopulatedModel(10_000)
    const disabled1k = createPopulatedModel(1000, { disabled: true })

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

    bench('Select disabled item (1,000 items)', () => {
      disabled1k.select(LOOKUP_ID_1K)
    })
  })

  // ===========================================================================
  // APPLY OPERATIONS - useProxyModel value bridge
  // WARM: shared populated fixture; the static path browse-resolves a value
  // (clear + browse + select), deterministic to the resolved id each iteration.
  // The undefined path pairs a select with apply([undefined]) so it clears real
  // state each iteration. FRESH: 'Apply ref value' builds an empty model + one
  // ref ticket — O(1) construction, not an O(n) populate, so nothing to hoist.
  // ===========================================================================
  describe('apply operations', () => {
    const apply1k = createPopulatedModel(1000)
    const apply10k = createPopulatedModel(10_000)

    bench('Apply static value (1,000 items)', () => {
      apply1k.apply(['value-500'])
    })

    bench('Apply static value (10,000 items)', () => {
      apply10k.apply(['value-5000'])
    })

    bench('Apply ref value (1,000 items)', () => {
      const model = createModel()
      const value = shallowRef('Apple')
      model.register({ id: 'ref-ticket', value })
      model.select('ref-ticket')
      model.apply(['Banana'])
    })

    bench('Apply undefined (1,000 items)', () => {
      apply1k.select(LOOKUP_ID_1K)
      apply1k.apply([undefined])
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk lifecycle
  // WARM: 'Reset' shares a populated fixture and pairs select + reset so each
  // iteration clears real selection state via the cheap reset() (O(1) Set clear).
  // FRESH: 'Onboard then offboard' consumes the fixture (offboard removes the
  // tickets), so both halves are the measured batch and can't be shared; the
  // offboard id arrays are hoisted so only the batch is timed.
  // ===========================================================================
  describe('batch operations', () => {
    const offboardIds1k = ITEMS_1K.slice(0, 100).map(item => item.id)
    const offboardIds10k = ITEMS_10K.slice(0, 1000).map(item => item.id)

    const reset1k = createPopulatedModel(1000)
    const reset10k = createPopulatedModel(10_000)

    bench('Onboard 1,000 then offboard 100 items', () => {
      const model = createPopulatedModel(1000)
      model.select(LOOKUP_ID_1K)
      model.offboard(offboardIds1k)
    })

    bench('Onboard 10,000 then offboard 1,000 items', () => {
      const model = createPopulatedModel(10_000)
      model.select(LOOKUP_ID_10K)
      model.offboard(offboardIds10k)
    })

    bench('Reset (1,000 items)', () => {
      reset1k.select(LOOKUP_ID_1K)
      reset1k.reset()
    })

    bench('Reset (10,000 items)', () => {
      reset10k.select(LOOKUP_ID_10K)
      reset10k.reset()
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - selectedItems, selectedValues derivation
  // Shared fixture (safe - reading .value doesn't mutate state)
  // Measures: amortized cost of 100 cached reads (one selected of N)
  // ===========================================================================
  describe('computed access', () => {
    bench('Access selectedItems 100 times (1 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void model1k.selectedItems.value
      }
    })

    bench('Access selectedItems 100 times (1 of 10,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void model10k.selectedItems.value
      }
    })

    bench('Access selectedValues 100 times (1 of 1,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void model1k.selectedValues.value
      }
    })

    bench('Access selectedValues 100 times (1 of 10,000 selected, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void model10k.selectedValues.value
      }
    })
  })
})
