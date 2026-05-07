import { describe, expect, it } from 'vitest'

import { ant } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_KEYS = [
  'red', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green',
  'cyan', 'blue', 'geekblue', 'purple', 'magenta',
]

describe('ant static palette', () => {
  it('should expose the canonical Ant Design color groups', () => {
    expect(ant).toBeTypeOf('object')
    for (const key of EXPECTED_KEYS) {
      expect(ant).toHaveProperty(key)
    }
  })

  it('should have hex strings at every leaf', () => {
    for (const key of EXPECTED_KEYS) {
      const ramp = ant[key] as Record<number, string>
      expect(ramp).toBeTypeOf('object')
      expect(Object.keys(ramp).length).toBeGreaterThan(0)
      for (const value of Object.values(ramp)) {
        expect(value).toMatch(HEX_RE)
      }
    }
  })
})
