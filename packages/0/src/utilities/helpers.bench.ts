import { bench, describe } from 'vitest'

// Utilities
import { mergeDeep } from './helpers'

describe('mergeDeep', () => {
  bench('shallow merge (2 objects, 5 keys each)', () => {
    mergeDeep(
      { a: 1, b: 2, c: 3, d: 4, e: 5 },
      { f: 6, g: 7, h: 8, c: 30, d: 40 },
    )
  })

  bench('deep nested merge (3 levels)', () => {
    mergeDeep(
      { a: { b: { c: 1, d: 2 }, e: 3 }, f: 4 },
      { a: { b: { c: 10, x: 20 }, y: 30 }, z: 40 },
    )
  })

  bench('many sources (5 objects)', () => {
    mergeDeep(
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: 4 },
      { e: 5 },
    )
  })

  bench('realistic theme merge', () => {
    mergeDeep(
      {
        mobileBreakpoint: 'lg',
        breakpoints: { xs: 0, sm: 600, md: 840, lg: 1145, xl: 1545, xxl: 2138 },
      },
      {
        breakpoints: { sm: 400 },
      },
    )
  })

  bench('large flat object (50 keys)', () => {
    const target: Record<string, number> = {}
    const source: Record<string, number> = {}
    for (let i = 0; i < 50; i++) {
      target[`key${i}`] = i
      source[`key${i}`] = i * 10
    }
    mergeDeep(target, source)
  })
})
