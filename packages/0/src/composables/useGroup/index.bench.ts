// Composables
import { createGroupContext } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { run, compare } from '#v0/utilities/benchmark'

describe('createGroupContext benchmarks', () => {
  it('should benchmark registration operations', async () => {
    const context = createGroupContext('benchmark-test')[2]

    const result = await run('register 1000 group items', () => {
      for (let i = 0; i < 1000; i++) {
        context.register({ value: `item-${i}`, disabled: false })
      }
    }, 10)

    expect(result.name).toBe('register 1000 group items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Group Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark selection operations', async () => {
    const context = createGroupContext('benchmark-test')[2]

    // Pre-populate with items
    const ids: (string | number)[] = []
    for (let i = 0; i < 1000; i++) {
      const item = context.register({ value: `item-${i}`, disabled: false })
      ids.push(item.id)
    }

    const result = await run('select 1000 items', () => {
      for (const id of ids) {
        context.select(id)
      }
    }, 10)

    expect(result.name).toBe('select 1000 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Selection: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark browse operations', async () => {
    const context = createGroupContext('benchmark-test')[2]

    // Pre-populate with items
    for (let i = 0; i < 1000; i++) {
      context.register({ value: `item-${i}`, disabled: false })
    }

    const result = await run('browse 1000 values', () => {
      for (let i = 0; i < 1000; i++) {
        context.browse(`item-${i}`)
      }
    }, 10)

    expect(result.name).toBe('browse 1000 values')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Browse: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark multiple selection operations', async () => {
    const context = createGroupContext('benchmark-test-multiple', { multiple: true })[2]

    // Pre-populate with items
    const ids: (string | number)[] = []
    for (let i = 0; i < 100; i++) {
      const item = context.register({ value: `item-${i}`, disabled: false })
      ids.push(item.id)
    }

    const result = await run('select multiple 100 items', () => {
      context.select(ids)
    }, 50)

    expect(result.name).toBe('select multiple 100 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Multiple Selection: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark reset operations', async () => {
    const context = createGroupContext('benchmark-test')[2]

    // Pre-populate with items and selections
    for (let i = 0; i < 1000; i++) {
      const item = context.register({ value: `item-${i}`, disabled: false })
      if (i % 10 === 0) context.select(item.id)
    }

    const result = await run('reset 1000 items', () => {
      context.reset()
    }, 100)

    expect(result.name).toBe('reset 1000 items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Reset: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark mandate operations', async () => {
    const context = createGroupContext('benchmark-test-mandatory', { mandatory: true })[2]

    // Pre-populate with items
    for (let i = 0; i < 1000; i++) {
      context.register({ value: `item-${i}`, disabled: i % 100 === 0 })
    }

    const result = await run('mandate selection', () => {
      context.selectedIds.clear()
      context.mandate()
    }, 100)

    expect(result.name).toBe('mandate selection')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Mandate: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should compare different group operation types', async () => {
    const context = createGroupContext('benchmark-test')[2]

    // Pre-populate for operations
    const items: any[] = []
    for (let i = 0; i < 100; i++) {
      const item = context.register({ value: `item-${i}`, disabled: false })
      items.push(item)
    }

    const results = await compare({
      'register 100 group items': () => {
        const ctx = createGroupContext('register-test')[2]
        for (let i = 0; i < 100; i++) {
          ctx.register({ value: `item-${i}`, disabled: false })
        }
      },
      'select 100 items': () => {
        for (const item of items) {
          context.select(item.id)
        }
      },
      'browse 100 values': () => {
        for (let i = 0; i < 100; i++) {
          context.browse(`item-${i}`)
        }
      },
      'reset 100 items': () => {
        context.reset()
      },
    })

    expect(results).toHaveLength(4)

    console.log('Group operation comparison (fastest to slowest):')
    for (const [index, result] of results.entries()) {
      console.log(`${index + 1}. ${result.name}: ${result.ops} ops/sec`)
    }
  })

  it('should benchmark different group sizes', async () => {
    const sizes = [10, 100, 1000, 5000]

    console.log('Group registration performance by collection size:')

    for (const size of sizes) {
      const context = createGroupContext(`benchmark-size-${size}`)[2]

      const result = await run(`register ${size} group items`, () => {
        for (let i = 0; i < size; i++) {
          context.register({ value: `item-${i}`, disabled: false })
        }
      }, 5)

      console.log(`Size ${size}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)

      expect(result.ops).toBeGreaterThan(0)
    }
  })

  it('should benchmark different group configurations', async () => {
    const configs = [
      { name: 'default', options: {} },
      { name: 'multiple', options: { multiple: true } },
      { name: 'mandatory', options: { mandatory: true } },
      { name: 'returnObject', options: { returnObject: true } },
      { name: 'multiple + mandatory', options: { multiple: true, mandatory: true } },
    ]

    console.log('Group registration performance by configuration:')

    for (const config of configs) {
      const context = createGroupContext(`benchmark-config-${config.name}`, config.options)[2]

      const result = await run(`register 500 items (${config.name})`, () => {
        for (let i = 0; i < 500; i++) {
          context.register({ value: `item-${i}`, disabled: false })
        }
      }, 5)

      console.log(`${config.name}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)

      expect(result.ops).toBeGreaterThan(0)
    }
  })
})
