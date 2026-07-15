/**
 * createFilter Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - filter.apply() doesn't mutate state)
 * - WARM operations (reactive reads) build the filter + reactive computed ONCE and
 *   time only the reads/updates — never the createFilter()+apply() setup. "Access …
 *   cached" reads a constant query (the computed stays cached after the first read);
 *   "Update query" resets the query to its base then performs N distinct updates,
 *   each dirtying the computed so the read re-runs the O(n) filter (no drift).
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, primitive filtering, object filtering, filter modes, mutation operations, native comparison
 */

import { bench, describe } from 'vitest'

// Framework
import { createFilter } from '@vuetify/v0/composables'

// Utilities
import { ref } from 'vue'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkObject {
  [key: string]: unknown
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

describe('createFilter benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures filter creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty filter', () => {
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
  // WARM: the filter and its reactive computed are built ONCE per bench (the
  //   createFilter()+apply() construction is not the op). "Access … cached" reads
  //   a constant query, so the computed is evaluated once then served from cache —
  //   timing the 100 cached reads. "Update query" resets the query to its base then
  //   performs 10 distinct updates; each update dirties the computed so the read
  //   re-runs the O(n) filter. Deterministic: identical query sequence each
  //   iteration, no drift. Isolates the reactive read/recompute from setup.
  // ===========================================================================
  describe('mutation operations', () => {
    const itemsRef1k = ref(OBJECTS_1K)
    const itemsRef10k = ref(OBJECTS_10K)

    const readFilter1k = createFilter()
    const readFiltered1k = readFilter1k.apply(ref(LOOKUP_USER_1K), itemsRef1k).items

    const readFilter10k = createFilter()
    const readFiltered10k = readFilter10k.apply(ref(LOOKUP_USER_10K), itemsRef10k).items

    const updateQuery1k = ref(LOOKUP_USER_1K)
    const updateFilter1k = createFilter()
    const updateFiltered1k = updateFilter1k.apply(updateQuery1k, itemsRef1k).items

    const updateQuery10k = ref(LOOKUP_USER_10K)
    const updateFilter10k = createFilter()
    const updateFiltered10k = updateFilter10k.apply(updateQuery10k, itemsRef10k).items

    bench('Access filtered 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void readFiltered1k.value
      }
    })

    bench('Access filtered 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void readFiltered10k.value
      }
    })

    bench('Update query 10 times (1,000 items)', () => {
      updateQuery1k.value = LOOKUP_USER_1K
      for (let i = 0; i < 10; i++) {
        updateQuery1k.value = `User ${500 + i}`
        void updateFiltered1k.value
      }
    })

    bench('Update query 10 times (10,000 items)', () => {
      updateQuery10k.value = LOOKUP_USER_10K
      for (let i = 0; i < 10; i++) {
        updateQuery10k.value = `User ${5000 + i}`
        void updateFiltered10k.value
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
