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
})
