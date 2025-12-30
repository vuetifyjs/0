import { bench, describe } from 'vitest'

// Utilities
import { ref } from 'vue'

import { createFilter, useFilter } from './index'

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

describe('useFilter benchmarks', () => {
  describe('primitive filtering', () => {
    const items1k = generatePrimitives(1000)
    const items10k = generatePrimitives(10_000)

    bench('Filter 1,000 string primitives with single query', () => {
      const filter = createFilter()
      filter.apply('item-50', items1k)
    })

    bench('Filter 10,000 string primitives with single query', () => {
      const filter = createFilter()
      filter.apply('item-50', items10k)
    })
  })

  describe('object filtering', () => {
    const items1k = generateObjects(1000)
    const items10k = generateObjects(10_000)

    bench('Filter 1,000 objects across all keys', () => {
      const filter = createFilter()
      filter.apply('user', items1k)
    })

    bench('Filter 1,000 objects with single key constraint', () => {
      const filter = createFilter({ keys: ['name'] })
      filter.apply('user', items1k)
    })

    bench('Filter 10,000 objects across all keys', () => {
      const filter = createFilter()
      filter.apply('user', items10k)
    })

    bench('Filter 10,000 objects with single key constraint', () => {
      const filter = createFilter({ keys: ['name'] })
      filter.apply('user', items10k)
    })
  })

  describe('filter modes', () => {
    const items = generateObjects(1000)

    bench('Filter 1,000 objects with some mode', () => {
      const filter = createFilter({ mode: 'some' })
      filter.apply('user', items)
    })

    bench('Filter 1,000 objects with every mode', () => {
      const filter = createFilter({ mode: 'every' })
      filter.apply('user', items)
    })

    bench('Filter 1,000 objects with union mode (2 queries)', () => {
      const filter = createFilter({ mode: 'union' })
      filter.apply(['user', 'example'], items)
    })

    bench('Filter 1,000 objects with intersection mode (2 queries)', () => {
      const filter = createFilter({ mode: 'intersection' })
      filter.apply(['user', 'example'], items)
    })
  })

  describe('reactive updates', () => {
    const items = generateObjects(1000)
    const itemsRef = ref(items)

    bench('Reactive filter: access computed 100 times', () => {
      const query = ref('user')
      const { items: filtered } = useFilter(query, itemsRef)
      for (let i = 0; i < 100; i++) {
        void filtered.value
      }
    })

    bench('Reactive filter: update query 10 times', () => {
      const query = ref('user')
      const { items: filtered } = useFilter(query, itemsRef)
      for (let i = 0; i < 10; i++) {
        query.value = `user-${i}`
        void filtered.value
      }
    })
  })

  describe('native comparison', () => {
    const items1k = generateObjects(1000)
    const items10k = generateObjects(10_000)

    bench('Native Array.filter 1,000 objects', () => {
      const query = 'user'.toLowerCase()
      items1k.filter(item =>
        Object.values(item).some(v =>
          String(v).toLowerCase().includes(query),
        ),
      )
    })

    bench('Native Array.filter 10,000 objects', () => {
      const query = 'user'.toLowerCase()
      items10k.filter(item =>
        Object.values(item).some(v =>
          String(v).toLowerCase().includes(query),
        ),
      )
    })
  })
})
