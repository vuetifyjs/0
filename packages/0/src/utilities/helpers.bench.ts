/**
 * mergeDeep Performance Benchmarks
 *
 * Structure:
 * - Pure-function benches: mergeDeep returns a new object and never mutates its
 *   inputs, so every bench shares module-level constant inputs (pre-allocated to
 *   keep object construction out of the timed region) and times only the merge.
 * - No fixture construction, no mutation, no per-iteration setup.
 * - Category: mergeDeep
 */

import { bench, describe } from 'vitest'

// Framework
import { mergeDeep } from '@vuetify/v0'

// =============================================================================
// FIXTURES - Pre-allocated inputs, reused across all benches.
// Safe to share: mergeDeep is pure (copies target into a fresh object, never
// mutates target or sources), so the inputs never drift across iterations and
// object construction stays out of the timed region.
// =============================================================================

const SHALLOW_TARGET = { a: 1, b: 2, c: 3, d: 4, e: 5 } as Record<string, number>
const SHALLOW_SOURCE = { f: 6, g: 7, h: 8, c: 30, d: 40 }

const NESTED_TARGET = { a: { b: { c: 1, d: 2 }, e: 3 }, f: 4 } as Record<string, unknown>
const NESTED_SOURCE = { a: { b: { c: 10, x: 20 }, y: 30 }, z: 40 }

const MANY_TARGET = { a: 1 } as Record<string, number>
const MANY_SOURCES: Record<string, number>[] = [{ b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }]

const THEME_TARGET = {
  mobileBreakpoint: 'lg',
  breakpoints: { xs: 0, sm: 600, md: 840, lg: 1145, xl: 1545, xxl: 2138 },
} as Record<string, unknown>
const THEME_SOURCE = { breakpoints: { sm: 400 } }

function buildFlat (multiplier: number): Record<string, number> {
  const out: Record<string, number> = {}
  for (let i = 0; i < 50; i++) {
    out[`key${i}`] = i * multiplier
  }
  return out
}

const FLAT_TARGET = buildFlat(1)
const FLAT_SOURCE = buildFlat(10)

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('mergeDeep benchmarks', () => {
  bench('shallow merge (2 objects, 5 keys each)', () => {
    mergeDeep(SHALLOW_TARGET, SHALLOW_SOURCE)
  })

  bench('deep nested merge (3 levels)', () => {
    mergeDeep(NESTED_TARGET, NESTED_SOURCE)
  })

  bench('many sources (5 objects)', () => {
    mergeDeep(MANY_TARGET, ...MANY_SOURCES)
  })

  bench('realistic theme merge', () => {
    mergeDeep(THEME_TARGET, THEME_SOURCE)
  })

  bench('large flat object (50 keys)', () => {
    mergeDeep(FLAT_TARGET, FLAT_SOURCE)
  })
})
