// Composables
import { useStep } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { run, compare } from '#v0/utilities/benchmark'

describe('useStep benchmarks', () => {
  it('should benchmark registration operations', async () => {
    const context = useStep('benchmark-test')[2]

    const result = await run('register 1000 step items', () => {
      for (let i = 0; i < 1000; i++) {
        context.register({ value: `item-${i}`, disabled: false })
      }
    }, 10)

    expect(result.name).toBe('register 1000 step items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Step Registration: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark selection operations', async () => {
    const context = useStep('benchmark-test')[2]

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
    const context = useStep('benchmark-test')[2]

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

  it('should benchmark step navigation operations', async () => {
    const context = useStep('benchmark-test-step', {})[2]

    // Pre-populate with items
    for (let i = 0; i < 100; i++) {
      context.register({ value: `item-${i}`, disabled: false })
    }

    const result = await run('step navigation 1000 times', () => {
      for (let i = 0; i < 1000; i++) {
        if (i % 4 === 0) context.next()
        else if (i % 4 === 1) context.prev()
        else if (i % 4 === 2) context.step(5)
        else context.step(-3)
      }
    }, 50)

    expect(result.name).toBe('step navigation 1000 times')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Step Navigation: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark reset operations', async () => {
    const context = useStep('benchmark-test')[2]

    // Pre-populate with items and selection
    for (let i = 0; i < 1000; i++) {
      const item = context.register({ value: `item-${i}`, disabled: false })
      if (i === 500) context.select(item.id)
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
    const context = useStep('benchmark-test-mandatory', { mandatory: true })[2]

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

  it('should compare different step operation types', async () => {
    const context = useStep('benchmark-test')[2]

    // Pre-populate for operations
    const items: any[] = []
    for (let i = 0; i < 100; i++) {
      const item = context.register({ value: `item-${i}`, disabled: false })
      items.push(item)
    }

    const results = await compare({
      'register 100 step items': () => {
        const ctx = useStep('register-test')[2]
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
      'next 100 times': () => {
        for (let i = 0; i < 100; i++) {
          context.next()
        }
      },
      'prev 100 times': () => {
        for (let i = 0; i < 100; i++) {
          context.prev()
        }
      },
      'step(5) 100 times': () => {
        for (let i = 0; i < 100; i++) {
          context.step(5)
        }
      },
      'first/last 100 times': () => {
        for (let i = 0; i < 100; i++) {
          if (i % 2 === 0) context.first()
          else context.last()
        }
      },
      'reset 100 items': () => {
        context.reset()
      },
    })

    expect(results).toHaveLength(8)

    console.log('Step operation comparison (fastest to slowest):')
    for (const [index, result] of results.entries()) {
      console.log(`${index + 1}. ${result.name}: ${result.ops} ops/sec`)
    }
  })

  it('should benchmark different step sizes', async () => {
    const sizes = [10, 100, 1000, 5000]

    console.log('Step registration performance by collection size:')

    for (const size of sizes) {
      const context = useStep(`benchmark-size-${size}`)[2]

      const result = await run(`register ${size} step items`, () => {
        for (let i = 0; i < size; i++) {
          context.register({ value: `item-${i}`, disabled: false })
        }
      }, 5)

      console.log(`Size ${size}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)

      expect(result.ops).toBeGreaterThan(0)
    }
  })

  it('should benchmark different step configurations', async () => {
    const configs = [
      { name: 'default', options: {} },
      { name: 'mandatory', options: { mandatory: true } },
      { name: 'returnObject', options: { returnObject: true } },
      { name: 'mandatory + returnObject', options: { mandatory: true, returnObject: true } },
    ]

    console.log('Step registration performance by configuration:')

    for (const config of configs) {
      const context = useStep(`benchmark-config-${config.name}`, config.options)[2]

      const result = await run(`register 500 items (${config.name})`, () => {
        for (let i = 0; i < 500; i++) {
          context.register({ value: `item-${i}`, disabled: false })
        }
      }, 5)

      console.log(`${config.name}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)

      expect(result.ops).toBeGreaterThan(0)
    }
  })

  it('should benchmark step navigation with disabled items', async () => {
    const context = useStep('benchmark-disabled')[2]

    // Pre-populate with items, some disabled
    for (let i = 0; i < 100; i++) {
      context.register({ value: `item-${i}`, disabled: i % 10 === 0 })
    }

    const result = await run('navigate with disabled items', () => {
      for (let i = 0; i < 500; i++) {
        // Test navigation that needs to skip disabled items
        if (i % 3 === 0) context.next()
        else if (i % 3 === 1) context.prev()
        else context.step(7)
      }
    }, 10)

    expect(result.name).toBe('navigate with disabled items')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Navigation with Disabled Items: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark step vs single performance comparison', async () => {
    const { useSingle } = await import('#v0/composables/useSingle')

    const results = await compare({
      'useStep selection': () => {
        const ctx = useStep('step-overhead')[2]
        const ids: (string | number)[] = []

        // Register items
        for (let i = 0; i < 100; i++) {
          const item = ctx.register({ value: `item-${i}`, disabled: false })
          ids.push(item.id)
        }

        // Test selection pattern
        for (const id of ids) {
          ctx.select(id)
        }
      },
      'useSingle selection': () => {
        const ctx = useSingle('single-overhead')[2]
        const ids: (string | number)[] = []

        // Register items
        for (let i = 0; i < 100; i++) {
          const item = ctx.register({ value: `item-${i}`, disabled: false })
          ids.push(item.id)
        }

        // Test selection pattern
        for (const id of ids) {
          ctx.select(id)
        }
      },
      'useStep navigation': () => {
        const ctx = useStep('step-nav-overhead')[2]

        // Register items
        for (let i = 0; i < 100; i++) {
          ctx.register({ value: `item-${i}`, disabled: false })
        }

        // Test step-specific navigation
        for (let i = 0; i < 100; i++) {
          if (i % 4 === 0) ctx.next()
          else if (i % 4 === 1) ctx.prev()
          else if (i % 4 === 2) ctx.first()
          else ctx.last()
        }
      },
    })

    expect(results).toHaveLength(3)

    console.log('useStep vs useSingle performance comparison:')
    for (const [index, result] of results.entries()) {
      console.log(`${index + 1}. ${result.name}: ${result.ops} ops/sec`)
    }

    const stepPerf = results.find(r => r.name.includes('useStep selection'))!
    const singlePerf = results.find(r => r.name.includes('useSingle'))!
    const overhead = ((singlePerf.ops - stepPerf.ops) / singlePerf.ops * 100).toFixed(2)
    console.log(`Performance difference: ${overhead}% ${overhead.startsWith('-') ? 'faster' : 'slower'} than useSingle`)
  })
})
