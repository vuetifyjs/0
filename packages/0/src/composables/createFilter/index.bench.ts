/**
 * createFilter Performance Benchmarks
 *
 * Structure:
 * - WARM filter benches build the filter and its computed once over a plain array.
 *   Each iteration assigns a different query, then reads items.value. The timed
 *   region is the filter, never createFilter() or apply().
 * - WARM update benches flip between two queries and read once. One pass per
 *   iteration, so ops/s and the tier describe the same operation. The deep
 *   ref(array) pair is the per-field subscription path. The plain-array pair
 *   is the same update without it.
 * - "Access … cached" reads a constant query, so only the first read filters.
 * - FRESH fixtures only where construction IS the op (initialization)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, primitive filtering, object filtering, filter modes, mutation operations, native comparison
 */

import { bench, describe } from 'vitest'

// Framework
import { createFilter } from '@vuetify/v0/composables'

// Utilities
import { ref, shallowRef } from 'vue'

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
  // Warm: computed built once over a plain array. Each iteration assigns a
  // different query, then reads items.value, so the timed region is the filter.
  // ===========================================================================
  describe('primitive filtering', () => {
    const filter = createPrimitiveFilter()
    const query1k = shallowRef('')
    const filtered1k = filter.apply(query1k, PRIMITIVES_1K).items
    const query10k = shallowRef('')
    const filtered10k = filter.apply(query10k, PRIMITIVES_10K).items

    bench('Filter 1,000 string primitives with single query', () => {
      query1k.value = query1k.value === LOOKUP_QUERY_1K ? 'item-501' : LOOKUP_QUERY_1K
      void filtered1k.value
    })

    bench('Filter 10,000 string primitives with single query', () => {
      query10k.value = query10k.value === LOOKUP_QUERY_10K ? 'item-5001' : LOOKUP_QUERY_10K
      void filtered10k.value
    })
  })

  // ===========================================================================
  // OBJECT FILTERING - Object array filtering with key constraints
  // Warm: computed built once over a plain array. Each iteration assigns a
  // different query, then reads items.value, so the timed region is the filter.
  // ===========================================================================
  describe('object filtering', () => {
    const filter = createObjectFilter()
    const filterWithKeys = createObjectFilterWithKeys()
    const all1k = shallowRef('')
    const allFiltered1k = filter.apply(all1k, OBJECTS_1K).items
    const keyed1k = shallowRef('')
    const keyedFiltered1k = filterWithKeys.apply(keyed1k, OBJECTS_1K).items
    const all10k = shallowRef('')
    const allFiltered10k = filter.apply(all10k, OBJECTS_10K).items
    const keyed10k = shallowRef('')
    const keyedFiltered10k = filterWithKeys.apply(keyed10k, OBJECTS_10K).items

    bench('Filter 1,000 objects across all keys', () => {
      all1k.value = all1k.value === LOOKUP_USER_1K ? 'User 501' : LOOKUP_USER_1K
      void allFiltered1k.value
    })

    bench('Filter 1,000 objects with single key constraint', () => {
      keyed1k.value = keyed1k.value === LOOKUP_USER_1K ? 'User 501' : LOOKUP_USER_1K
      void keyedFiltered1k.value
    })

    bench('Filter 10,000 objects across all keys', () => {
      all10k.value = all10k.value === LOOKUP_USER_10K ? 'User 5001' : LOOKUP_USER_10K
      void allFiltered10k.value
    })

    bench('Filter 10,000 objects with single key constraint', () => {
      keyed10k.value = keyed10k.value === LOOKUP_USER_10K ? 'User 5001' : LOOKUP_USER_10K
      void keyedFiltered10k.value
    })
  })

  // ===========================================================================
  // FILTER MODES - Different matching strategies
  // Warm: computed built once over a plain array. Each iteration assigns a
  // different query, then reads items.value. Two-query modes assign a new
  // array each iteration so the shallow query ref stays dirty.
  // ===========================================================================
  describe('filter modes', () => {
    const filterSome = createFilterWithMode('some')
    const filterEvery = createFilterWithMode('every')
    const filterUnion = createFilterWithMode('union')
    const filterIntersection = createFilterWithMode('intersection')
    const some1k = shallowRef('')
    const someFiltered1k = filterSome.apply(some1k, OBJECTS_1K).items
    const every1k = shallowRef('')
    const everyFiltered1k = filterEvery.apply(every1k, OBJECTS_1K).items
    const union1k = shallowRef<string[]>([])
    const unionFiltered1k = filterUnion.apply(union1k, OBJECTS_1K).items
    const intersection1k = shallowRef<string[]>([])
    const intersectionFiltered1k = filterIntersection.apply(intersection1k, OBJECTS_1K).items
    const some10k = shallowRef('')
    const someFiltered10k = filterSome.apply(some10k, OBJECTS_10K).items
    const every10k = shallowRef('')
    const everyFiltered10k = filterEvery.apply(every10k, OBJECTS_10K).items

    bench('Filter 1,000 objects with some mode', () => {
      some1k.value = some1k.value === LOOKUP_USER_1K ? 'User 501' : LOOKUP_USER_1K
      void someFiltered1k.value
    })

    bench('Filter 1,000 objects with every mode', () => {
      every1k.value = every1k.value === LOOKUP_USER_1K ? 'User 501' : LOOKUP_USER_1K
      void everyFiltered1k.value
    })

    bench('Filter 1,000 objects with union mode (2 queries)', () => {
      union1k.value = union1k.value[1] === 'example'
        ? [LOOKUP_USER_1K, 'example.com']
        : [LOOKUP_USER_1K, 'example']
      void unionFiltered1k.value
    })

    bench('Filter 1,000 objects with intersection mode (2 queries)', () => {
      intersection1k.value = intersection1k.value[1] === 'example'
        ? [LOOKUP_USER_1K, 'example.com']
        : [LOOKUP_USER_1K, 'example']
      void intersectionFiltered1k.value
    })

    bench('Filter 10,000 objects with some mode', () => {
      some10k.value = some10k.value === LOOKUP_USER_10K ? 'User 5001' : LOOKUP_USER_10K
      void someFiltered10k.value
    })

    bench('Filter 10,000 objects with every mode', () => {
      every10k.value = every10k.value === LOOKUP_USER_10K ? 'User 5001' : LOOKUP_USER_10K
      void everyFiltered10k.value
    })
  })

  // ===========================================================================
  // REACTIVE UPDATES - Same filter, two item containers
  // WARM: the filter and its computed are built once. "Access … cached" reads a
  //   constant query. "Update query" flips to the other query and reads once, so
  //   the timed region is one recompute. The name has no "N times": that suffix
  //   is the tier's repeat divisor, and a loop of 10 would grade the whole loop
  //   as a tenth of its latency while ops/s still counted every pass. The unnamed
  //   pair passes ref(array), which subscribes to every field. The plain-array
  //   pair passes the shared fixture directly. The flip always changes the query.
  // ===========================================================================
  describe('mutation operations', () => {
    // Copies, so ref() does not turn the shared plain fixtures into proxies.
    const itemsRef1k = ref(OBJECTS_1K.map(item => ({ ...item })))
    const itemsRef10k = ref(OBJECTS_10K.map(item => ({ ...item })))
    const plainQuery1k = shallowRef(LOOKUP_USER_1K)
    const plainFiltered1k = createFilter().apply(plainQuery1k, OBJECTS_1K).items
    const plainQuery10k = shallowRef(LOOKUP_USER_10K)
    const plainFiltered10k = createFilter().apply(plainQuery10k, OBJECTS_10K).items

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

    bench('Update query (1,000 items)', () => {
      updateQuery1k.value = updateQuery1k.value === LOOKUP_USER_1K ? 'User 501' : LOOKUP_USER_1K
      void updateFiltered1k.value
    })

    bench('Update query (10,000 items)', () => {
      updateQuery10k.value = updateQuery10k.value === LOOKUP_USER_10K ? 'User 5001' : LOOKUP_USER_10K
      void updateFiltered10k.value
    })

    bench('Update query (1,000 items, plain array)', () => {
      plainQuery1k.value = plainQuery1k.value === LOOKUP_USER_1K ? 'User 501' : LOOKUP_USER_1K
      void plainFiltered1k.value
    })

    bench('Update query (10,000 items, plain array)', () => {
      plainQuery10k.value = plainQuery10k.value === LOOKUP_USER_10K ? 'User 5001' : LOOKUP_USER_10K
      void plainFiltered10k.value
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
