import { describe, expect, it } from 'vitest'

import { radix } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_KEYS = [
  'amber', 'blue', 'bronze', 'brown', 'crimson', 'cyan', 'gold', 'grass',
  'gray', 'green', 'indigo', 'iris', 'jade', 'lime', 'mauve', 'mint',
  'olive', 'orange', 'pink', 'plum', 'purple', 'red', 'ruby', 'sage',
  'sand', 'sky', 'slate', 'teal', 'tomato', 'violet', 'yellow',
]

describe('radix static palette', () => {
  it('should expose the Radix color groups', () => {
    expect(radix).toBeTypeOf('object')
    for (const key of EXPECTED_KEYS) {
      expect(radix).toHaveProperty(key)
    }
  })

  it('should have hex strings at every leaf', () => {
    for (const key of EXPECTED_KEYS) {
      const ramp = radix[key] as Record<number, string>
      expect(ramp).toBeTypeOf('object')
      expect(Object.keys(ramp).length).toBeGreaterThan(0)
      for (const value of Object.values(ramp)) {
        expect(value).toMatch(HEX_RE)
      }
    }
  })
})
