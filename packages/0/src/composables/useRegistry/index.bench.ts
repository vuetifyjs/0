// Composables
import { useRegistry } from './index'

// Utitilities
import { describe, it, expect } from 'vitest'
import { run, compare } from '#v0/utilities/benchmark'

describe('useRegistry benchmarks', () => {
  it('should benchmark registration operations', async () => {
    const context = useRegistry('benchmark-test')[2]

    const result = await run('register 1000 items', () => {
      for (let i = 0; i < 1000; i++) {
        context.register({ id: `item-${i}` })
      }
    }, 10)

    expect(result.name).toBe('register 1000 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark lookup operations', async () => {
    const context = useRegistry('benchmark-test')[2]

    // Pre-populate with items
    for (let i = 0; i < 1000; i++) {
      context.register({ id: `item-${i}` })
    }

    const result = await run('lookup 1000 items', () => {
      for (let i = 0; i < 1000; i++) {
        context.lookup(i)
      }
    }, 10)

    expect(result.name).toBe('lookup 1000 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Lookup: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark unregistration operations', async () => {
    const context = useRegistry('benchmark-test')[2]

    // Pre-populate with items
    const items: { id: string, index: number }[] = []
    for (let i = 0; i < 1000; i++) {
      const item = context.register({ id: `item-${i}` })
      items.push(item)
    }

    const result = await run('unregister 1000 items', () => {
      for (const item of items) {
        context.unregister(item.id)
      }
    }, 10)

    expect(result.name).toBe('unregister 1000 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Unregistration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark reindexing operations', async () => {
    const context = useRegistry('benchmark-test')[2]

    // Pre-populate with items
    for (let i = 0; i < 1000; i++) {
      context.register({ id: `item-${i}` })
    }

    const result = await run('reindex 1000 items', () => {
      context.reindex()
    }, 100)

    expect(result.name).toBe('reindex 1000 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Reindexing: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should compare different operation types', async () => {
    const context = useRegistry('benchmark-test')[2]

    // Pre-populate for lookup and unregister tests
    const items: { id: string, index: number }[] = []
    for (let i = 0; i < 100; i++) {
      const item = context.register({ id: `item-${i}` })
      items.push(item)
    }

    const results = await compare({
      'register 100 items': () => {
        const ctx = useRegistry('register-test')[2]
        for (let i = 0; i < 100; i++) {
          ctx.register({ id: `item-${i}` })
        }
      },
      'lookup 100 items': () => {
        for (let i = 0; i < 100; i++) {
          context.lookup(i)
        }
      },
      'reindex 100 items': () => {
        context.reindex()
      },
    })

    expect(results).toHaveLength(3)
    expect(results[0].ops).toBeGreaterThanOrEqual(results[1].ops)

    console.log('Operation comparison (fastest to slowest):')
    for (const [index, result] of results.entries()) {
      console.log(`${index + 1}. ${result.name}: ${result.ops} ops/sec`)
    }
  })

  it('should benchmark different collection sizes', async () => {
    const sizes = [10, 100, 1000, 5000]

    console.log('Registration performance by collection size:')

    for (const size of sizes) {
      const context = useRegistry(`benchmark-size-${size}`)[2]

      const result = await run(`register ${size} items`, () => {
        for (let i = 0; i < size; i++) {
          context.register({ id: `item-${i}` })
        }
      }, 5)

      console.log(`Size ${size}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)

      expect(result.ops).toBeGreaterThan(0)
    }
  })
})
