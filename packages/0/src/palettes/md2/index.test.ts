import { describe, expect, it } from 'vitest'

import { md2 } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_KEYS = [
  'red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue',
  'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber',
  'orange', 'deepOrange', 'brown', 'grey', 'blueGrey',
]

describe('md2 static palette', () => {
  it('should expose the Material Design 2 color groups', () => {
    expect(md2).toBeTypeOf('object')
    for (const key of EXPECTED_KEYS) {
      expect(md2).toHaveProperty(key)
    }
  })

  it('should have hex strings at every leaf', () => {
    for (const key of EXPECTED_KEYS) {
      const ramp = md2[key] as Record<string, string>
      expect(ramp).toBeTypeOf('object')
      expect(Object.keys(ramp).length).toBeGreaterThan(0)
      for (const value of Object.values(ramp)) {
        expect(value).toMatch(HEX_RE)
      }
    }
  })
})
