import { describe, expect, it } from 'vitest'

import { tailwind } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_KEYS = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
]

describe('tailwind static palette', () => {
  it('should expose the Tailwind color groups', () => {
    expect(tailwind).toBeTypeOf('object')
    for (const key of EXPECTED_KEYS) {
      expect(tailwind).toHaveProperty(key)
    }
  })

  it('should have hex strings at every leaf', () => {
    for (const key of EXPECTED_KEYS) {
      const ramp = tailwind[key] as Record<string, string>
      expect(ramp).toBeTypeOf('object')
      expect(Object.keys(ramp).length).toBeGreaterThan(0)
      for (const value of Object.values(ramp)) {
        expect(value).toMatch(HEX_RE)
      }
    }
  })
})
