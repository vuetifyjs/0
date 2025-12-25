// Utilities
import { bench, describe } from 'vitest'

// Composables
import { createFilter } from './index'

// Test data generators
function generatePrimitives (count: number): string[] {
  return Array.from({ length: count }, (_, i) => `item-${i}-${Math.random().toString(36).slice(2)}`)
}

function generateObjects (count: number): Array<{ id: string, name: string, email: string }> {
  return Array.from({ length: count }, (_, i) => ({
    id: `id-${i}`,
    name: `User ${i} ${Math.random().toString(36).slice(2)}`,
    email: `user${i}@example.com`,
  }))
}

function getName (i: number): string {
  if (i === 0) return 'first-match'
  if (i === 999) return 'last-match'
  return `user-${i}`
}

describe('useFilter benchmarks', () => {
  describe('primitive filtering', () => {
    const items1k = generatePrimitives(1000)
    const items10k = generatePrimitives(10_000)

    bench('filter 1000 primitives (single query)', () => {
      const filter = createFilter()
      void filter.apply('item-50', items1k).items.value
    })

    bench('filter 10000 primitives (single query)', () => {
      const filter = createFilter()
      void filter.apply('item-50', items10k).items.value
    })
  })

  describe('object filtering', () => {
    const items1k = generateObjects(1000)
    const items10k = generateObjects(10_000)

    bench('filter 1000 objects (all keys)', () => {
      const filter = createFilter()
      void filter.apply('user', items1k).items.value
    })

    bench('filter 1000 objects (specific keys)', () => {
      const filter = createFilter({ keys: ['name'] })
      void filter.apply('user', items1k).items.value
    })

    bench('filter 10000 objects (all keys)', () => {
      const filter = createFilter()
      void filter.apply('user', items10k).items.value
    })

    bench('filter 10000 objects (specific keys)', () => {
      const filter = createFilter({ keys: ['name'] })
      void filter.apply('user', items10k).items.value
    })
  })

  describe('filter modes', () => {
    const items = generateObjects(1000)

    bench('mode: some (default)', () => {
      const filter = createFilter({ mode: 'some' })
      void filter.apply('user', items).items.value
    })

    bench('mode: every', () => {
      const filter = createFilter({ mode: 'every' })
      void filter.apply('user', items).items.value
    })

    bench('mode: union (multiple queries)', () => {
      const filter = createFilter({ mode: 'union' })
      void filter.apply(['user', 'example'], items).items.value
    })

    bench('mode: intersection (multiple queries)', () => {
      const filter = createFilter({ mode: 'intersection' })
      void filter.apply(['user', 'example'], items).items.value
    })
  })

  describe('union/intersection scaling', () => {
    const items10k = generateObjects(10_000)

    bench('union: 2 queries, 10k items', () => {
      const filter = createFilter({ mode: 'union', keys: ['name', 'email'] })
      void filter.apply(['user', 'example'], items10k).items.value
    })

    bench('union: 5 queries, 10k items', () => {
      const filter = createFilter({ mode: 'union', keys: ['name', 'email'] })
      void filter.apply(['user', 'example', 'id', 'test', 'data'], items10k).items.value
    })

    bench('union: 10 queries, 10k items', () => {
      const filter = createFilter({ mode: 'union', keys: ['name', 'email'] })
      void filter.apply(['user', 'example', 'id', 'test', 'data', 'foo', 'bar', 'baz', 'qux', 'quux'], items10k).items.value
    })

    bench('intersection: 2 queries, 10k items', () => {
      const filter = createFilter({ mode: 'intersection', keys: ['name', 'email'] })
      void filter.apply(['user', 'example'], items10k).items.value
    })

    bench('intersection: 5 queries, 10k items', () => {
      const filter = createFilter({ mode: 'intersection', keys: ['name', 'email'] })
      void filter.apply(['user', 'example', 'id', 'test', 'data'], items10k).items.value
    })
  })

  describe('early vs late match scenarios', () => {
    // Create items where 'first' is in item 0, 'last' is in item 999
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: `id-${i}`,
      name: getName(i),
      email: `user${i}@example.com`,
    }))

    bench('union: early match (first item)', () => {
      const filter = createFilter({ mode: 'union', keys: ['name'] })
      void filter.apply(['first-match'], items).items.value
    })

    bench('union: late match (last item)', () => {
      const filter = createFilter({ mode: 'union', keys: ['name'] })
      void filter.apply(['last-match'], items).items.value
    })

    bench('union: no match', () => {
      const filter = createFilter({ mode: 'union', keys: ['name'] })
      void filter.apply(['nonexistent', 'notfound'], items).items.value
    })

    bench('intersection: early match (first item)', () => {
      const filter = createFilter({ mode: 'intersection', keys: ['name'] })
      void filter.apply(['first'], items).items.value
    })

    bench('intersection: early fail (no match for one query)', () => {
      const filter = createFilter({ mode: 'intersection', keys: ['name'] })
      void filter.apply(['user', 'nonexistent'], items).items.value
    })
  })

  describe('fast paths', () => {
    const primitives = generatePrimitives(1000)
    const objects = generateObjects(1000)

    bench('primitives: union 2 queries', () => {
      const filter = createFilter({ mode: 'union' })
      void filter.apply(['item', 'test'], primitives).items.value
    })

    bench('primitives: intersection 2 queries', () => {
      const filter = createFilter({ mode: 'intersection' })
      void filter.apply(['item', '50'], primitives).items.value
    })

    bench('single key: union 2 queries', () => {
      const filter = createFilter({ mode: 'union', keys: ['name'] })
      void filter.apply(['user', 'example'], objects).items.value
    })

    bench('single key: intersection 2 queries', () => {
      const filter = createFilter({ mode: 'intersection', keys: ['name'] })
      void filter.apply(['user', '50'], objects).items.value
    })
  })

  describe('reused filter instance', () => {
    const items10k = generateObjects(10_000)
    const unionFilter = createFilter({ mode: 'union', keys: ['name', 'email'] })
    const intersectionFilter = createFilter({ mode: 'intersection', keys: ['name', 'email'] })

    bench('reused union filter', () => {
      void unionFilter.apply(['user', 'example'], items10k).items.value
    })

    bench('reused intersection filter', () => {
      void intersectionFilter.apply(['user', 'example'], items10k).items.value
    })
  })
})
