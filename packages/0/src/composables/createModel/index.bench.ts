/**
 * createModel Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, selection operations, apply operations, batch operations, computed access
 */

import { bench, describe } from 'vitest'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { ModelContext, ModelTicket, ModelTicketInput } from './index'

import { createModel } from './index'

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

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createModel benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
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
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost
  // ===========================================================================
  describe('selection operations', () => {
    bench('Select single item (1,000 items)', () => {
      const model = createPopulatedModel(1000)
      model.select(LOOKUP_ID_1K)
    })

    bench('Select single item (10,000 items)', () => {
      const model = createPopulatedModel(10_000)
      model.select(LOOKUP_ID_10K)
    })

    bench('Unselect single item (1,000 items)', () => {
      const model = createPopulatedModel(1000)
      model.select(LOOKUP_ID_1K)
      model.unselect(LOOKUP_ID_1K)
    })

    bench('Unselect single item (10,000 items)', () => {
      const model = createPopulatedModel(10_000)
      model.select(LOOKUP_ID_10K)
      model.unselect(LOOKUP_ID_10K)
    })

    bench('Toggle single item (1,000 items)', () => {
      const model = createPopulatedModel(1000)
      model.toggle(LOOKUP_ID_1K)
    })

    bench('Toggle single item (10,000 items)', () => {
      const model = createPopulatedModel(10_000)
      model.toggle(LOOKUP_ID_10K)
    })

    bench('Select disabled item (1,000 items)', () => {
      const model = createPopulatedModel(1000, { disabled: true })
      model.select(LOOKUP_ID_1K)
    })
  })

  // ===========================================================================
  // APPLY OPERATIONS - External value sync via apply bridge
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: apply resolution cost (browse-based vs ref-based)
  // ===========================================================================
  describe('apply operations', () => {
    bench('Apply static value (1,000 items)', () => {
      const model = createPopulatedModel(1000)
      model.apply(['value-500'])
    })

    bench('Apply static value (10,000 items)', () => {
      const model = createPopulatedModel(10_000)
      model.apply(['value-5000'])
    })

    bench('Apply ref value (1,000 items)', () => {
      const model = createModel()
      const value = shallowRef('Apple')
      model.register({ id: 'ref-ticket', value })
      model.select('ref-ticket')
      model.apply(['Banana'])
    })

    bench('Apply undefined (1,000 items)', () => {
      const model = createPopulatedModel(1000)
      model.select(LOOKUP_ID_1K)
      model.apply([undefined])
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk register/offboard/reset cycles
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost for bulk workflows
  // ===========================================================================
  describe('batch operations', () => {
    bench('Onboard 1,000 then offboard 100 items', () => {
      const model = createPopulatedModel(1000)
      model.select(LOOKUP_ID_1K)
      const ids = ITEMS_1K.slice(0, 100).map(item => item.id)
      model.offboard(ids)
    })

    bench('Onboard 10,000 then offboard 1,000 items', () => {
      const model = createPopulatedModel(10_000)
      model.select(LOOKUP_ID_10K)
      const ids = ITEMS_10K.slice(0, 1000).map(item => item.id)
      model.offboard(ids)
    })

    bench('Reset (1,000 items)', () => {
      const model = createPopulatedModel(1000)
      model.select(LOOKUP_ID_1K)
      model.reset()
    })

    bench('Reset (10,000 items)', () => {
      const model = createPopulatedModel(10_000)
      model.select(LOOKUP_ID_10K)
      model.reset()
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - selectedItems, selectedValues derivation
  // Shared fixture (safe - reading .value doesn't mutate state)
  // Measures: amortized cost of repeated computed reads
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
