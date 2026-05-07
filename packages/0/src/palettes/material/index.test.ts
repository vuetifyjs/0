import { describe, expect, it } from 'vitest'

import { material } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_KEYS = ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error']

describe('material static palette', () => {
  it('should expose the MD3 baseline tonal palettes', () => {
    expect(material).toBeTypeOf('object')
    for (const key of EXPECTED_KEYS) {
      expect(material).toHaveProperty(key)
    }
  })

  it('should have hex strings at every leaf', () => {
    for (const key of EXPECTED_KEYS) {
      const ramp = material[key] as Record<number, string>
      expect(ramp).toBeTypeOf('object')
      expect(Object.keys(ramp).length).toBeGreaterThan(0)
      for (const value of Object.values(ramp)) {
        expect(value).toMatch(HEX_RE)
      }
    }
  })
})
