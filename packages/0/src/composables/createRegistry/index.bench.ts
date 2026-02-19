/**
 * useRegistry Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup, mutation, batch, computed access, seek
 */

import { bench, describe } from 'vitest'

// Types
import type { RegistryContext, RegistryTicket } from './index'

import { createRegistry } from './index'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkItem {
  id: string
  value: string
}

// Pre-generated item arrays (avoids allocation in benchmarks)
const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

const ITEMS_10K: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

// Pre-populated registries for READ-ONLY benchmarks only
function createPopulatedRegistry (count: number): RegistryContext<RegistryTicket> {
  const registry = createRegistry()
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  registry.onboard(items.slice(0, count))
  return registry
}

// Lookup targets (middle of registry for realistic access pattern)
const LOOKUP_ID_1K = 'item-500'
const LOOKUP_ID_10K = 'item-5000'
const LOOKUP_VALUE_1K = 'value-500'
const LOOKUP_VALUE_10K = 'value-5000'
const LOOKUP_INDEX_1K = 500
const LOOKUP_INDEX_10K = 5000

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createRegistry benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty registry', () => {
      createRegistry()
    })

    bench('Onboard 1,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_10K)
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Single item access
  // Shared fixture (safe - read-only operations, no state changes)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('lookup operations', () => {
    const registry1k = createPopulatedRegistry(1000)
    const registry10k = createPopulatedRegistry(10_000)

    bench('Get by id (1,000 items)', () => {
      registry1k.get(LOOKUP_ID_1K)
    })

    bench('Get by id (10,000 items)', () => {
      registry10k.get(LOOKUP_ID_10K)
    })

    bench('Lookup by index (1,000 items)', () => {
      registry1k.lookup(LOOKUP_INDEX_1K)
    })

    bench('Lookup by index (10,000 items)', () => {
      registry10k.lookup(LOOKUP_INDEX_10K)
    })

    bench('Browse by value (1,000 items)', () => {
      registry1k.browse(LOOKUP_VALUE_1K)
    })

    bench('Browse by value (10,000 items)', () => {
      registry10k.browse(LOOKUP_VALUE_10K)
    })

    bench('Check has (1,000 items)', () => {
      registry1k.has(LOOKUP_ID_1K)
    })

    bench('Check has (10,000 items)', () => {
      registry10k.has(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // MUTATION OPERATIONS - Single item changes
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost (unavoidable for mutations)
  // ===========================================================================
  describe('mutation operations', () => {
    bench('Upsert single item (1,000 items)', () => {
      const registry = createPopulatedRegistry(1000)
      registry.upsert(LOOKUP_ID_1K, { value: 'updated' })
    })

    bench('Upsert single item (10,000 items)', () => {
      const registry = createPopulatedRegistry(10_000)
      registry.upsert(LOOKUP_ID_10K, { value: 'updated' })
    })

    bench('Register single item', () => {
      const registry = createRegistry()
      registry.register({ id: 'single', value: 'test' })
    })

    bench('Register then unregister single item', () => {
      const registry = createRegistry()
      registry.register({ id: 'temp', value: 'test' })
      registry.unregister('temp')
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk actions
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: setup + operation cost (realistic for batch workflows)
  // ===========================================================================
  describe('batch operations', () => {
    bench('Onboard then clear 1,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_1K)
      registry.clear()
    })

    bench('Onboard then clear 10,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_10K)
      registry.clear()
    })

    bench('Onboard then reindex 1,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_1K)
      registry.reindex()
    })

    bench('Onboard then reindex 10,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_10K)
      registry.reindex()
    })

    const halfIds1k = ITEMS_1K.slice(0, 500).map(i => i.id)
    const halfIds10k = ITEMS_10K.slice(0, 5000).map(i => i.id)

    bench('Onboard 1,000 then offboard 500 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_1K)
      registry.offboard(halfIds1k)
    })

    bench('Onboard 10,000 then offboard 5,000 items', () => {
      const registry = createRegistry()
      registry.onboard(ITEMS_10K)
      registry.offboard(halfIds10k)
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - Cached iterator performance
  // Shared fixture (safe - cache is rebuilt on first access, then stable)
  // Measures: amortized cost of 100 cached reads
  // ===========================================================================
  describe('computed access', () => {
    const registry1k = createPopulatedRegistry(1000)
    const registry10k = createPopulatedRegistry(10_000)

    bench('Access keys 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        registry1k.keys()
      }
    })

    bench('Access keys 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        registry10k.keys()
      }
    })

    bench('Access values 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        registry1k.values()
      }
    })

    bench('Access values 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        registry10k.values()
      }
    })

    bench('Access entries 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        registry1k.entries()
      }
    })

    bench('Access entries 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        registry10k.entries()
      }
    })
  })

  // ===========================================================================
  // SEEK OPERATIONS - Directional search
  // Shared fixture (safe - seek is read-only)
  // Measures: isolated operation cost
  // ===========================================================================
  describe('seek operations', () => {
    const registry1k = createPopulatedRegistry(1000)
    const registry10k = createPopulatedRegistry(10_000)

    bench('Seek first (1,000 items)', () => {
      registry1k.seek('first')
    })

    bench('Seek first (10,000 items)', () => {
      registry10k.seek('first')
    })

    bench('Seek last (1,000 items)', () => {
      registry1k.seek('last')
    })

    bench('Seek last (10,000 items)', () => {
      registry10k.seek('last')
    })

    bench('Seek with predicate (1,000 items)', () => {
      registry1k.seek('first', 0, t => t.value === LOOKUP_VALUE_1K)
    })

    bench('Seek with predicate (10,000 items)', () => {
      registry10k.seek('first', 0, t => t.value === LOOKUP_VALUE_10K)
    })
  })
})
