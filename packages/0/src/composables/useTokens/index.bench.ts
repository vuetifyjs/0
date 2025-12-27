// Utilities
import { bench, describe } from 'vitest'

import TOKENS from './fixtures/tokens'

// Composables
import { createTokens } from './index'

// Generate large token sets for benchmarking
function generateTokens (count: number) {
  const tokens: Record<string, Record<string, string>> = {}
  for (let i = 0; i < count; i++) {
    tokens[`category${i}`] = {
      primary: `#${i.toString(16).padStart(6, '0')}`,
      secondary: `{category${i}.primary}`,
      tertiary: `{category${Math.max(0, i - 1)}.primary}`,
    }
  }
  return tokens
}

describe('useTokens benchmarks', () => {
  describe('initialization', () => {
    bench('Initialize with fixture tokens (~100 tokens)', () => {
      createTokens(TOKENS)
    })

    bench('Initialize with 1,000 generated tokens', () => {
      createTokens(generateTokens(333))
    })

    bench('Initialize with 10,000 generated tokens', () => {
      createTokens(generateTokens(3333))
    })
  })

  describe('direct resolution', () => {
    const tokens = createTokens(TOKENS)

    bench('Resolve primitive token', () => {
      tokens.resolve('string')
    })

    bench('Resolve nested path (3 levels)', () => {
      tokens.resolve('theme.color.brand.primary.base')
    })

    bench('Resolve deep nested path (5 levels)', () => {
      tokens.resolve('components.Button.variant.solid.background')
    })
  })

  describe('alias resolution', () => {
    const tokens = createTokens(TOKENS)

    bench('Resolve single alias', () => {
      tokens.resolve('{theme.color.brand.primary.base}')
    })

    bench('Resolve chained alias (2 levels)', () => {
      tokens.resolve('{theme.color.semantic.info}')
    })

    bench('Resolve component alias reference', () => {
      tokens.resolve('{components.Button.radius}')
    })
  })

  describe('batch resolution', () => {
    const tokens = createTokens(TOKENS)
    const paths = [
      'theme.color.brand.primary.base',
      'theme.color.brand.secondary.base',
      'theme.spacing.md',
      'theme.radius.lg',
      'theme.typography.size.md',
    ]

    bench('Resolve 5 different paths sequentially', () => {
      for (const path of paths) {
        tokens.resolve(path)
      }
    })

    bench('Resolve 100 paths (20 unique, repeated)', () => {
      for (let i = 0; i < 100; i++) {
        tokens.resolve(paths[i % paths.length]!)
      }
    })
  })

  describe('cache performance', () => {
    const tokens = createTokens(TOKENS)
    // Prime the cache
    tokens.resolve('theme.color.brand.primary.base')

    bench('Resolve cached token 100 times', () => {
      for (let i = 0; i < 100; i++) {
        tokens.resolve('theme.color.brand.primary.base')
      }
    })
  })

  describe('large registry operations', () => {
    const largeTokens = createTokens(generateTokens(1000))

    bench('Resolve from 1,000 category registry', () => {
      largeTokens.resolve('category500.primary')
    })

    bench('Resolve alias from 1,000 category registry', () => {
      largeTokens.resolve('{category500.secondary}')
    })
  })
})
