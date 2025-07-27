// Composables
import { useSelection } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { run, compare } from '#v0/utilities/benchmark'

// Types
import type { SelectionTicket } from './index'

describe('useSelection benchmarks', () => {
  type Context = ReturnType<typeof useSelection>[2]

  function createContext (name: string) {
    return useSelection(name)[2]
  }

  function create (count: number, context: Context, idPrefix = 'item') {
    const tickets: SelectionTicket[] = []
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

  it('should benchmark selection toggle operations', async () => {
    const context = createContext('benchmark-test')
    const items = create(1000, context)

    const result = await bench('toggle 1000 items', () => {
      for (const item of items) {
        item.toggle()
      }
    })

    console.log(`Toggle: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark isActive check operations', async () => {
    const context = createContext('benchmark-test')
    const items = create(1000, context)

    // Select half the items
    for (let i = 0; i < items.length; i += 2) {
      items[i].toggle()
    }

    const result = await bench('check isActive 1000 items', () => {
      for (const item of items) {
        void item.isActive.value
      }
    })

    console.log(`IsActive Check: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark reset operations', async () => {
    const context = createContext('benchmark-test')
    create(1000, context)

    const result = await bench('reset 1000 items', () => {
      context.reset()
    }, 100)

    console.log(`Reset: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
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

  it('should benchmark selection vs registry performance', async () => {
    const selectionContext = useSelection('selection-perf')[2]
    const { useRegistry } = await import('#v0/composables/useRegistry')
    const registryContext = useRegistry('registry-perf')[2]

    const selectionResult = await bench('selection register 1000 items', () => {
      for (let i = 0; i < 1000; i++) {
        selectionContext.register({ id: `item-${i}` })
      }
    }, 3)

    const registryResult = await bench('registry register 1000 items', () => {
      for (let i = 0; i < 1000; i++) {
        registryContext.register({ id: `item-${i}` })
      }
    }, 3)

    const overhead = ((registryResult.ops - selectionResult.ops) / registryResult.ops * 100).toFixed(1)

    console.log(`Selection vs Registry: ${selectionResult.ops} vs ${registryResult.ops} ops/sec (${overhead}% overhead)`)
  })

  it('should compare different operation types', async () => {
    const context = createContext('benchmark-test')
    const items = create(100, context)

    const results = await compare({
      'register 100 items': () => {
        const ctx = createContext('register-test')
        create(100, ctx)
      },
      'toggle 100 items': () => {
        for (const item of items) {
          item.toggle()
        }
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
      'reset 100 items': () => {
        context.reset()
      },
    })

    expect(results).toHaveLength(6)
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
})
