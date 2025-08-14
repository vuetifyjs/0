// Composables
import { useRegistry } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { run } from '#v0/utilities/benchmark'

describe('useRegistry benchmarks', () => {
  function* enroll (count: number) {
    for (let i = 0; i < count; i++) yield i
  }

  async function bench (name: string, operation: () => void, iterations = 10) {
    const result = await run(name, operation, iterations)
    expect(result.name).toBe(name)
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)
    return result
  }

  describe('registration', () => {
    it('should benchmark registration operations', async () => {
      const registry = useRegistry()

      const result = await bench('register 1000 items', () => {
        for (const item of enroll(1000)) {
          registry.register({ id: `item-${item}`, value: `value-${item}` })
        }
        registry.clear()
      })

      console.log(`Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })

    it('should benchmark unregistration operations', async () => {
      const registry = useRegistry()

      for (const item of enroll(1000)) {
        registry.register({ id: `item-${item}`, value: `value-${item}` })
      }

      const result = await bench('unregister 1000 items', () => {
        for (const item of enroll(1000)) {
          registry.unregister(`item-${item}`)
        }
      })

      console.log(`Unregistration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })
  })

  describe('lookup operations', () => {
    it('should benchmark get by id', async () => {
      const registry = useRegistry()

      for (const item of enroll(1000)) {
        registry.register({ id: `item-${item}`, value: `value-${item}` })
      }

      const result = await bench('get 1000 items by id', () => {
        for (const item of enroll(1000)) {
          registry.get(`item-${item}`)
        }
      })

      console.log(`Get by ID: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })

    it('should benchmark lookup by index', async () => {
      const registry = useRegistry()

      for (const item of enroll(1000)) {
        registry.register({ id: `item-${item}`, value: `value-${item}` })
      }

      const result = await bench('lookup 1000 items by index', () => {
        for (const index of enroll(1000)) {
          registry.lookup(index)
        }
      })

      console.log(`Lookup by index: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })

    it('should benchmark browsing by value', async () => {
      const registry = useRegistry()

      for (const item of enroll(1000)) {
        registry.register({ id: `item-${item}`, value: `value-${item}` })
      }

      const result = await bench('browse 1000 items by value', () => {
        for (const item of enroll(1000)) {
          registry.browse(`value-${item}`)
        }
      })

      console.log(`Browse by value: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })

    it('should benchmark has operations', async () => {
      const registry = useRegistry()

      for (const item of enroll(1000)) {
        registry.register({ id: `item-${item}`, value: `value-${item}` })
      }

      const result = await bench('check has 1000 items', () => {
        for (const item of enroll(1000)) {
          registry.has(`item-${item}`)
        }
      })

      console.log(`Has operations: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })
  })

  describe('management operations', () => {
    it('should benchmark clear operations', async () => {
      const result = await bench('clear registry with 1000 items', () => {
        const registry = useRegistry()

        for (const item of enroll(1000)) {
          registry.register({ id: `item-${item}`, value: `value-${item}` })
        }

        registry.clear()
      })

      console.log(`Clear operations: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })

    it('should benchmark reindex operations', async () => {
      const registry = useRegistry()

      for (const item of enroll(1000)) {
        registry.register({ id: `item-${item}`, value: `value-${item}` })
      }

      const result = await bench('reindex 1000 items', () => {
        registry.reindex()
      })

      console.log(`Reindex operations: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    })
  })
})
