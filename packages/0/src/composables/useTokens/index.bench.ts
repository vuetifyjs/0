// Composables
import { createTokensContext } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { run, compare } from '#v0/utilities/benchmark'

// Types
import type { TokenCollection } from './index'

describe('createTokensContext benchmarks', () => {
  it('should benchmark token flattening operations', async () => {
    const tokens: TokenCollection = {}

    // Generate flat tokens
    for (let i = 0; i < 1000; i++) {
      tokens[`token-${i}`] = `#${i.toString(16).padStart(6, '0')}`
    }

    const result = await run('flatten 1000 simple tokens', () => {
      createTokensContext('benchmark-flat', tokens)
    }, 10)

    expect(result.name).toBe('flatten 1000 simple tokens')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Token Flattening: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark nested token flattening', async () => {
    const tokens: TokenCollection = {
      colors: {},
      spacing: {},
      typography: {},
    }

    function getNestedCollection (parent: TokenCollection, key: string): TokenCollection {
      if (!parent[key]) parent[key] = {}
      return parent[key] as TokenCollection
    }

    for (let i = 0; i < 100; i++) {
      getNestedCollection(tokens, 'colors')[`color-${i}`] = `#${i.toString(16).padStart(6, '0')}`
      getNestedCollection(tokens, 'spacing')[`space-${i}`] = `${i * 4}px`
      getNestedCollection(tokens, 'typography')[`font-${i}`] = `${12 + i}px`
    }

    const result = await run('flatten 300 nested tokens', () => {
      createTokensContext('benchmark-nested', tokens)
    }, 10)

    expect(result.name).toBe('flatten 300 nested tokens')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Nested Flattening: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark alias resolution operations', async () => {
    const tokens: TokenCollection = {
      base: '#007BFF',
    }

    // Generate aliases
    for (let i = 0; i < 500; i++) {
      tokens[`alias-${i}`] = { $value: '{base}' }
    }

    const context = createTokensContext('benchmark-aliases', tokens)[2]

    const result = await run('resolve 500 simple aliases', () => {
      for (let i = 0; i < 500; i++) {
        context.resolve(`alias-${i}`)
      }
    }, 10)

    expect(result.name).toBe('resolve 500 simple aliases')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Alias Resolution: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark chained alias resolution', async () => {
    const tokens: TokenCollection = {
      base: '#007BFF',
    }

    // Create chain of aliases
    tokens.level1 = { $value: '{base}' }
    for (let i = 2; i <= 10; i++) {
      tokens[`level${i}`] = { $value: `{level${i - 1}}` }
    }

    const context = createTokensContext('benchmark-chained', tokens)[2]

    const result = await run('resolve 10-level chained alias', () => {
      for (let i = 0; i < 100; i++) {
        context.resolve('level10')
      }
    }, 50)

    expect(result.name).toBe('resolve 10-level chained alias')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Chained Resolution: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark token resolution with different formats', async () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
      secondary: { $value: '{primary}' },
    }

    const context = createTokensContext('benchmark-formats', tokens)[2]

    const result = await run('resolve tokens with different formats', () => {
      for (let i = 0; i < 1000; i++) {
        context.resolve('primary')
        context.resolve('{primary}')
        context.resolve('secondary')
        context.resolve('{secondary}')
      }
    }, 10)

    expect(result.name).toBe('resolve tokens with different formats')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Format Resolution: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should compare different token operation types', async () => {
    const simpleTokens: TokenCollection = {}
    const aliasTokens: TokenCollection = { base: '#007BFF' }

    for (let i = 0; i < 100; i++) {
      simpleTokens[`token-${i}`] = `#${i.toString(16).padStart(6, '0')}`
      aliasTokens[`alias-${i}`] = { $value: '{base}' }
    }

    const simpleContext = createTokensContext('benchmark-simple', simpleTokens)[2]
    const aliasContext = createTokensContext('benchmark-alias-comp', aliasTokens)[2]

    const results = await compare({
      'register 100 simple tokens': () => {
        createTokensContext('simple-test', simpleTokens)
      },
      'register 100 alias tokens': () => {
        createTokensContext('alias-test', aliasTokens)
      },
      'resolve 100 simple tokens': () => {
        for (let i = 0; i < 100; i++) {
          simpleContext.resolve(`token-${i}`)
        }
      },
      'resolve 100 alias tokens': () => {
        for (let i = 0; i < 100; i++) {
          aliasContext.resolve(`alias-${i}`)
        }
      },
    })

    expect(results).toHaveLength(4)

    console.log('Token operation comparison (fastest to slowest):')
    for (const [index, result] of results.entries()) {
      console.log(`${index + 1}. ${result.name}: ${result.ops} ops/sec`)
    }
  })

  it('should benchmark different token collection sizes', async () => {
    const sizes = [10, 100, 500, 1000]

    console.log('Token registration performance by collection size:')

    for (const size of sizes) {
      const tokens: TokenCollection = {}

      for (let i = 0; i < size; i++) {
        tokens[`token-${i}`] = `#${i.toString(16).padStart(6, '0')}`
      }

      const result = await run(`register ${size} tokens`, () => {
        createTokensContext(`benchmark-size-${size}`, tokens)
      }, 5)

      console.log(`Size ${size}: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)

      expect(result.ops).toBeGreaterThan(0)
    }
  })

  it('should benchmark token collection access patterns', async () => {
    const tokens: TokenCollection = {}

    for (let i = 0; i < 1000; i++) {
      tokens[`token-${i}`] = `value-${i}`
    }

    const context = createTokensContext('benchmark-access', tokens)[2]

    const result = await run('collection get operations', () => {
      for (let i = 0; i < 1000; i++) {
        context.collection.get(`token-${i}`)
      }
    }, 10)

    expect(result.name).toBe('collection get operations')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.ops).toBeGreaterThan(0)

    console.log(`Collection Access: ${result.ops} ops/sec (${result.duration.toFixed(2)}ms avg)`)
  })

  it('should benchmark token validation', async () => {
    const invalidTokens: TokenCollection = {}

    for (let i = 0; i < 500; i++) {
      invalidTokens[`valid-${i}`] = `#${i.toString(16).padStart(6, '0')}`
      invalidTokens[`circular-${i}`] = { $value: `{circular-${(i + 1) % 500}}` }
    }

    const result = await run('validate 1000 mixed tokens', () => {
      createTokensContext('benchmark-validation', invalidTokens)
    }, 5)

    console.log(`Token Validation: ${result.ops} ops/sec`)
  })
})
