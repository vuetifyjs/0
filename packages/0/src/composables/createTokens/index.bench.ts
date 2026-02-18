/**
 * useTokens Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 token datasets
 * - Categories: initialization, lookup, alias resolution, batch resolution, computed access
 */

import { bench, describe } from 'vitest'

// Types
import type { TokenContext, TokenTicket } from './index'

// Fixtures
import TOKENS from './fixtures/tokens'

// Composables
import { createTokens } from './index'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

// Generated tokens match TokenCollection structure
type GeneratedTokens = Record<string, Record<string, string>>

/**
 * Generates token categories for benchmarking.
 * Each category has primary, secondary (alias to primary), and tertiary (alias to previous category).
 */
function generateTokens (count: number): GeneratedTokens {
  const tokens: GeneratedTokens = {}
  for (let i = 0; i < count; i++) {
    tokens[`category${i}`] = {
      primary: `#${i.toString(16).padStart(6, '0')}`,
      secondary: `{category${i}.primary}`,
      tertiary: `{category${Math.max(0, i - 1)}.primary}`,
    }
  }
  return tokens
}

/**
 * Creates a pre-populated token context for benchmarking.
 */
function createPopulatedTokens (count: number): TokenContext<TokenTicket> {
  const tokens = count <= 1000 ? TOKENS_1K : TOKENS_10K
  return createTokens(tokens)
}

// Pre-generated token sets (avoids allocation in benchmarks)
// ~333 categories * 3 tokens each = ~1,000 tokens
const TOKENS_1K: GeneratedTokens = generateTokens(333)
// ~3,333 categories * 3 tokens each = ~10,000 tokens
const TOKENS_10K: GeneratedTokens = generateTokens(3333)

// Lookup targets (middle of token set for realistic access pattern)
const LOOKUP_ID_1K = 'category166.primary'
const LOOKUP_ID_10K = 'category1666.primary'
const LOOKUP_ALIAS_1K = '{category166.secondary}'
const LOOKUP_ALIAS_10K = '{category1666.secondary}'

// Fixture token paths (from TOKENS fixture file)
const FIXTURE_PRIMITIVE_PATH = 'string'
const FIXTURE_NESTED_PATH = 'theme.color.brand.primary.base'
const FIXTURE_DEEP_PATH = 'components.Button.variant.solid.background'
const FIXTURE_ALIAS_SINGLE = '{theme.color.brand.primary.base}'
const FIXTURE_ALIAS_CHAINED = '{theme.color.semantic.info}'
const FIXTURE_ALIAS_COMPONENT = '{components.Button.radius}'

// Batch resolution paths
const BATCH_PATHS: string[] = [
  'theme.color.brand.primary.base',
  'theme.color.brand.secondary.base',
  'theme.spacing.md',
  'theme.radius.lg',
  'theme.typography.size.md',
]

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('useTokens benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create tokens (~100 tokens)', () => {
      createTokens(TOKENS)
    })

    bench('Create tokens (1,000 tokens)', () => {
      createTokens(TOKENS_1K)
    })

    bench('Create tokens (10,000 tokens)', () => {
      createTokens(TOKENS_10K)
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Direct path resolution (non-alias)
  // Shared fixture (safe - read-only operations, no state changes)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('lookup operations', () => {
    const fixtureTokens = createTokens(TOKENS)
    const tokens1k = createPopulatedTokens(1000)
    const tokens10k = createPopulatedTokens(10_000)

    bench('Resolve primitive token', () => {
      fixtureTokens.resolve(FIXTURE_PRIMITIVE_PATH)
    })

    bench('Resolve nested path (3 levels)', () => {
      fixtureTokens.resolve(FIXTURE_NESTED_PATH)
    })

    bench('Resolve deep nested path (5 levels)', () => {
      fixtureTokens.resolve(FIXTURE_DEEP_PATH)
    })

    bench('Resolve by id (1,000 tokens)', () => {
      tokens1k.resolve(LOOKUP_ID_1K)
    })

    bench('Resolve by id (10,000 tokens)', () => {
      tokens10k.resolve(LOOKUP_ID_10K)
    })
  })

  // ===========================================================================
  // ALIAS RESOLUTION - Token alias lookup with chaining
  // Shared fixture (safe - read-only operations, no state changes)
  // Measures: isolated alias resolution cost
  // ===========================================================================
  describe('alias resolution', () => {
    const fixtureTokens = createTokens(TOKENS)
    const tokens1k = createPopulatedTokens(1000)
    const tokens10k = createPopulatedTokens(10_000)

    bench('Resolve single alias', () => {
      fixtureTokens.resolve(FIXTURE_ALIAS_SINGLE)
    })

    bench('Resolve chained alias (2 levels)', () => {
      fixtureTokens.resolve(FIXTURE_ALIAS_CHAINED)
    })

    bench('Resolve component alias reference', () => {
      fixtureTokens.resolve(FIXTURE_ALIAS_COMPONENT)
    })

    bench('Resolve alias (1,000 tokens)', () => {
      tokens1k.resolve(LOOKUP_ALIAS_1K)
    })

    bench('Resolve alias (10,000 tokens)', () => {
      tokens10k.resolve(LOOKUP_ALIAS_10K)
    })
  })

  // ===========================================================================
  // BATCH RESOLUTION - Multiple sequential lookups
  // Shared fixture (safe - read-only operations, no state changes)
  // Measures: throughput of repeated resolve calls
  // ===========================================================================
  describe('batch resolution', () => {
    const fixtureTokens = createTokens(TOKENS)

    bench('Resolve 5 different paths sequentially', () => {
      for (const path of BATCH_PATHS) {
        fixtureTokens.resolve(path)
      }
    })

    bench('Resolve 100 paths (20 unique, repeated)', () => {
      for (let i = 0; i < 100; i++) {
        fixtureTokens.resolve(BATCH_PATHS[i % BATCH_PATHS.length]!)
      }
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - Cache performance
  // Shared fixture (safe - cache is stable after first access)
  // Measures: amortized cost of repeated cached reads
  // ===========================================================================
  describe('computed access', () => {
    const fixtureTokens = createTokens(TOKENS)
    const tokens1k = createPopulatedTokens(1000)
    const tokens10k = createPopulatedTokens(10_000)

    // Prime the caches
    fixtureTokens.resolve(FIXTURE_NESTED_PATH)
    tokens1k.resolve(LOOKUP_ID_1K)
    tokens10k.resolve(LOOKUP_ID_10K)

    bench('Access token 100 times (fixture, cached)', () => {
      for (let i = 0; i < 100; i++) {
        fixtureTokens.resolve(FIXTURE_NESTED_PATH)
      }
    })

    bench('Access token 100 times (1,000 tokens, cached)', () => {
      for (let i = 0; i < 100; i++) {
        tokens1k.resolve(LOOKUP_ID_1K)
      }
    })

    bench('Access token 100 times (10,000 tokens, cached)', () => {
      for (let i = 0; i < 100; i++) {
        tokens10k.resolve(LOOKUP_ID_10K)
      }
    })
  })
})
