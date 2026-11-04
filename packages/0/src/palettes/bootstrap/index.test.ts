import { describe, expect, it } from 'vitest'

import { bootstrap } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

const EXPECTED_HUES = [
  'blue', 'indigo', 'violet', 'purple', 'pink', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'teal', 'cyan', 'brown', 'gray', 'pewter',
]

const EXPECTED_STOPS = [
  '025', '050', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', '975',
]

describe('bootstrap static palette', () => {
  it('should expose the Bootstrap 6 hues in source order', () => {
    expect(Object.keys(bootstrap)).toEqual(EXPECTED_HUES)
  })

  it('should expose every Bootstrap stop as sRGB hex', () => {
    for (const hue of EXPECTED_HUES) {
      const ramp = bootstrap[hue] as Record<string, string>
      const stops = Object.keys(ramp).toSorted((a, b) => Number(a) - Number(b))
      expect(stops).toEqual(EXPECTED_STOPS)
      for (const stop of EXPECTED_STOPS) {
        expect(ramp[stop]).toMatch(HEX_RE)
      }
    }
  })

  it('should keep the pinned blue seed, tint, and shade', () => {
    const blue = bootstrap.blue as Record<string, string>
    expect(blue['025']).toBe('#eff9ff')
    expect(blue['500']).toBe('#0087fe')
    expect(blue['975']).toBe('#000b1f')
  })
})
