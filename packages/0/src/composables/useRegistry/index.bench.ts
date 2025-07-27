// Composables
import { useRegistry } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { run, compare } from '#v0/utilities/benchmark'

// Types
import type { RegistryTicket } from './index'

describe('useRegistry benchmarks', () => {
  type Context = ReturnType<typeof useRegistry>[2]

  function createContext (name: string) {
    return useRegistry(name)[2]
  }

  function create (count: number, context: Context, idPrefix = 'item') {
    const tickets: RegistryTicket[] = []
    for (let i = 0; i < count; i++) {
      tickets.push(context.register({ id: `${idPrefix}-${i}` }))
    }
    return tickets
  }

  async function bench (name: string, operation: () => void, iterations = 10) {
    const result = await run(name, operation, iterations)
    expect(result.name).toBe(name)
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)
    return result
  }

  it('should benchmark registration operations', async () => {
    const context = createContext('benchmark-test')

    const result = await bench('register 1000 items', () => {
      create(1000, context)
    })

    console.log(`Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark unregistration operations', async () => {
    const context = createContext('benchmark-test')
    const items = create(1000, context)

    const result = await bench('unregister 1000 items', () => {
      for (const item of items) {
        context.unregister(item.id)
      }
    })

    console.log(`Unregistration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark lookup operations', async () => {
    const context = createContext('benchmark-test')
    create(1000, context)

    const result = await bench('lookup 1000 items', () => {
      for (let i = 0; i < 1000; i++) {
        context.lookup(i)
      }
    })

    console.log(`Lookup: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark reindexing operations', async () => {
    const context = createContext('benchmark-test')
    create(1000, context)

    const result = await bench('reindex 1000 items', () => {
      context.reindex()
    }, 100)

    console.log(`Reindexing: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark browse operations', async () => {
    const context = createContext('benchmark-test')
    const items = create(1000, context)

    const result = await bench('browse 1000 items', () => {
      for (const item of items) {
        context.browse(item.value)
      }
    })

    console.log(`Browse: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark find operations', async () => {
    const context = createContext('benchmark-test')
    const items = create(1000, context)

    const result = await bench('find 1000 items', () => {
      for (const item of items) {
        context.find(item.id)
      }
    })

    console.log(`Find: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should compare different operation types', async () => {
    const context = createContext('benchmark-test')
    const items = create(100, context)

    const results = await compare({
      'register 100 items': () => {
        const ctx = createContext('register-test')
        create(100, ctx)
      },
      'lookup 100 items': () => {
        for (let i = 0; i < 100; i++) {
          context.lookup(i)
        }
      },
      'browse 100 items': () => {
        for (const item of items) {
          context.browse(item.value)
        }
      },
      'find 100 items': () => {
        for (const item of items) {
          context.find(item.id)
        }
      },
      'reindex 100 items': () => {
        context.reindex()
      },
    })

    expect(results).toHaveLength(5)
    expect(results[0].ops).toBeGreaterThanOrEqual(results[1].ops)

    console.log('Operation comparison (fastest to slowest):')
    for (const [i, result] of results.entries()) {
      console.log(`${i + 1}. ${result.name}: ${result.ops} ops/sec`)
    }
  })

  it('should benchmark different collection sizes', async () => {
    const sizes = [10, 100, 1000, 5000]

    console.log('Registration performance by collection size:')

    for (const size of sizes) {
      const context = createContext(`benchmark-size-${size}`)

      const result = await bench(`register ${size} items`, () => {
        create(size, context)
      }, 5)

      console.log(`Size ${size}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
    }
  })

  it('should benchmark shallow reactivity registration operations', async () => {
    const context = useRegistry('shallow-test')[2]

    const result = await bench('register 1000 items (shallow)', () => {
      create(1000, context)
    })

    console.log(`Shallow Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark deep reactivity registration operations', async () => {
    const context = useRegistry('deep-test', { deep: true })[2]

    const result = await bench('register 1000 items (deep)', () => {
      create(1000, context)
    })

    console.log(`Deep Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })
})
