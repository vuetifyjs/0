/**
 * useFilter Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - filter.apply() doesn't mutate state)
 * - REACTIVE UPDATE operations create fresh fixtures per iteration (refs are mutated)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, primitive filtering, object filtering, filter modes, mutation operations, native comparison
 */

import { bench, describe } from 'vitest'

// Utilities
import { ref } from 'vue'

import { createFilter, useFilter } from './index'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkObject {
  id: string
  name: string
  email: string
}

// Pre-generated primitive arrays (avoids allocation in benchmarks)
const PRIMITIVES_1K: string[] = Array.from({ length: 1000 }, (_, i) =>
  `item-${i}-${Math.random().toString(36).slice(2)}`,
)

const PRIMITIVES_10K: string[] = Array.from({ length: 10_000 }, (_, i) =>
  `item-${i}-${Math.random().toString(36).slice(2)}`,
)

// Pre-generated object arrays (avoids allocation in benchmarks)
const OBJECTS_1K: BenchmarkObject[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `id-${i}`,
  name: `User ${i} ${Math.random().toString(36).slice(2)}`,
  email: `user${i}@example.com`,
}))

const OBJECTS_10K: BenchmarkObject[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: `id-${i}`,
  name: `User ${i} ${Math.random().toString(36).slice(2)}`,
  email: `user${i}@example.com`,
}))

// Lookup targets (middle of dataset for realistic access pattern)
const LOOKUP_QUERY_1K = 'item-500'
const LOOKUP_QUERY_10K = 'item-5000'
const LOOKUP_USER_1K = 'User 500'
const LOOKUP_USER_10K = 'User 5000'

// Pre-created filters for read-only benchmarks
function createPrimitiveFilter (): ReturnType<typeof createFilter> {
  return createFilter()
}

function createObjectFilter (): ReturnType<typeof createFilter> {
  return createFilter()
}

function createObjectFilterWithKeys (): ReturnType<typeof createFilter> {
  return createFilter({ keys: ['name'] })
}

function createFilterWithMode (mode: 'some' | 'every' | 'union' | 'intersection'): ReturnType<typeof createFilter> {
  return createFilter({ mode })
}

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('useFilter benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures filter creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create filter with default options', () => {
      createFilter()
    })

    bench('Create filter with keys constraint', () => {
      createFilter({ keys: ['name', 'email'] })
    })

    bench('Create filter with custom matcher', () => {
      createFilter({
        customFilter: (query, item) => String(item).includes(String(query)),
      })
    })
  })

  // ===========================================================================
  // PRIMITIVE FILTERING - String array filtering
  // Shared fixture (safe - apply() doesn't mutate state)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('primitive filtering', () => {
    const filter = createPrimitiveFilter()

    bench('Filter 1,000 string primitives with single query', () => {
      filter.apply(LOOKUP_QUERY_1K, PRIMITIVES_1K)
    })

    bench('Filter 10,000 string primitives with single query', () => {
      filter.apply(LOOKUP_QUERY_10K, PRIMITIVES_10K)
    })
  })

  // ===========================================================================
  // OBJECT FILTERING - Object array filtering with key constraints
  // Shared fixture (safe - apply() doesn't mutate state)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('object filtering', () => {
    const filter = createObjectFilter()
    const filterWithKeys = createObjectFilterWithKeys()

    bench('Filter 1,000 objects across all keys', () => {
      filter.apply(LOOKUP_USER_1K, OBJECTS_1K)
    })

    bench('Filter 1,000 objects with single key constraint', () => {
      filterWithKeys.apply(LOOKUP_USER_1K, OBJECTS_1K)
    })

    bench('Filter 10,000 objects across all keys', () => {
      filter.apply(LOOKUP_USER_10K, OBJECTS_10K)
    })

    bench('Filter 10,000 objects with single key constraint', () => {
      filterWithKeys.apply(LOOKUP_USER_10K, OBJECTS_10K)
    })
  })

  // ===========================================================================
  // FILTER MODES - Different matching strategies
  // Shared fixture (safe - apply() doesn't mutate state)
  // Measures: mode-specific operation cost
  // ===========================================================================
  describe('filter modes', () => {
    const filterSome = createFilterWithMode('some')
    const filterEvery = createFilterWithMode('every')
    const filterUnion = createFilterWithMode('union')
    const filterIntersection = createFilterWithMode('intersection')

    bench('Filter 1,000 objects with some mode', () => {
      filterSome.apply(LOOKUP_USER_1K, OBJECTS_1K)
    })

    bench('Filter 1,000 objects with every mode', () => {
      filterEvery.apply(LOOKUP_USER_1K, OBJECTS_1K)
    })

    bench('Filter 1,000 objects with union mode (2 queries)', () => {
      filterUnion.apply([LOOKUP_USER_1K, 'example'], OBJECTS_1K)
    })

    bench('Filter 1,000 objects with intersection mode (2 queries)', () => {
      filterIntersection.apply([LOOKUP_USER_1K, 'example'], OBJECTS_1K)
    })

    bench('Filter 10,000 objects with some mode', () => {
      filterSome.apply(LOOKUP_USER_10K, OBJECTS_10K)
    })

    bench('Filter 10,000 objects with every mode', () => {
      filterEvery.apply(LOOKUP_USER_10K, OBJECTS_10K)
    })
  })

  // ===========================================================================
  // REACTIVE UPDATES - Reactive filtering with refs
  // Fresh fixture per iteration (required - ref mutations change state)
  // Measures: setup + operation cost (unavoidable for mutations)
  // ===========================================================================
  describe('mutation operations', () => {
    const itemsRef1k = ref(OBJECTS_1K)
    const itemsRef10k = ref(OBJECTS_10K)

    bench('Reactive filter: access computed 100 times (1,000 items)', () => {
      const query = ref(LOOKUP_USER_1K)
      const { items: filtered } = useFilter(query, itemsRef1k)
      for (let i = 0; i < 100; i++) {
        void filtered.value
      }
    })

    bench('Reactive filter: access computed 100 times (10,000 items)', () => {
      const query = ref(LOOKUP_USER_10K)
      const { items: filtered } = useFilter(query, itemsRef10k)
      for (let i = 0; i < 100; i++) {
        void filtered.value
      }
    })

    bench('Reactive filter: update query 10 times (1,000 items)', () => {
      const query = ref(LOOKUP_USER_1K)
      const { items: filtered } = useFilter(query, itemsRef1k)
      for (let i = 0; i < 10; i++) {
        query.value = `User ${500 + i}`
        void filtered.value
      }
    })

    bench('Reactive filter: update query 10 times (10,000 items)', () => {
      const query = ref(LOOKUP_USER_10K)
      const { items: filtered } = useFilter(query, itemsRef10k)
      for (let i = 0; i < 10; i++) {
        query.value = `User ${5000 + i}`
        void filtered.value
      }
    })
  })

  // ===========================================================================
  // NATIVE COMPARISON - Baseline for comparison
  // Shared fixture (safe - Array.filter doesn't mutate original)
  // Measures: native JavaScript performance baseline
  // ===========================================================================
  describe('native comparison', () => {
    bench('Native Array.filter 1,000 objects', () => {
      const query = LOOKUP_USER_1K.toLowerCase()
      OBJECTS_1K.filter(item =>
        Object.values(item).some(v =>
          String(v).toLowerCase().includes(query),
        ),
      )
    })

    bench('Native Array.filter 10,000 objects', () => {
      const query = LOOKUP_USER_10K.toLowerCase()
      OBJECTS_10K.filter(item =>
        Object.values(item).some(v =>
          String(v).toLowerCase().includes(query),
        ),
      )
    })
  })
})
