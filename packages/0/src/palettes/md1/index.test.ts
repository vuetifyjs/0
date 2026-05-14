import { describe, expect, it } from 'vitest'

import { md1 } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_KEYS = [
  'red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue',
  'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber',
  'orange', 'deepOrange',
]

describe('md1 static palette', () => {
  it('should expose the Material Design 1 color groups', () => {
    expect(md1).toBeTypeOf('object')
    for (const key of EXPECTED_KEYS) {
      expect(md1).toHaveProperty(key)
    }
  })

  it('should have hex strings at every leaf', () => {
    for (const key of EXPECTED_KEYS) {
      const ramp = md1[key] as Record<string, string>
      expect(ramp).toBeTypeOf('object')
      expect(Object.keys(ramp).length).toBeGreaterThan(0)
      for (const value of Object.values(ramp)) {
        expect(value).toMatch(HEX_RE)
      }
    }
  })
})
