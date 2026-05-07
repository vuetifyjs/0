import { describe, expect, it } from 'vitest'

import { ant } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

function expectHex (value: string) {
  expect(value).toMatch(HEX_RE)
}

function expectAllHex (record: Record<string, string>) {
  for (const value of Object.values(record)) {
    expectHex(value)
  }
}

describe('ant palette generator', () => {
  describe('shape', () => {
    it('should return palette and themes keys', () => {
      const result = ant('#1677ff')

      expect(result).toHaveProperty('palette')
      expect(result).toHaveProperty('themes')
      expect(result.themes).toHaveProperty('light')
      expect(result.themes).toHaveProperty('dark')
    })

    it('should mark light theme dark:false and dark theme dark:true', () => {
      const result = ant('#1677ff')

      expect(result.themes.light!.dark).toBe(false)
      expect(result.themes.dark!.dark).toBe(true)
    })

    it('should expose four palette ramps with ten stops each', () => {
      const result = ant('#1677ff')

      expect(Object.keys(result.palette)).toEqual(['primary', 'primaryDark', 'neutral', 'neutralDark'])
      for (const key of ['primary', 'primaryDark', 'neutral', 'neutralDark'] as const) {
        const ramp = result.palette[key] as Record<number, string>
        expect(Object.keys(ramp)).toHaveLength(10)
        expectAllHex(ramp)
      }
    })

    it('should produce hex strings for every theme color', () => {
      const result = ant('#1677ff')
      const light = result.themes.light!.colors as Record<string, string>
      const dark = result.themes.dark!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expect(dark.primary).toMatch(HEX_RE)
      expectAllHex(light)
      expectAllHex(dark)
    })
  })

  describe('seed validation', () => {
    it('should accept 6-char lowercase hex', () => {
      expect(() => ant('#1677ff')).not.toThrow()
    })

    it('should accept 6-char uppercase hex', () => {
      expect(() => ant('#1677FF')).not.toThrow()
    })

    it('should accept 3-char shorthand hex', () => {
      expect(() => ant('#1af')).not.toThrow()
    })

    it('should accept 8-char hex with alpha', () => {
      expect(() => ant('#1677ffaa')).not.toThrow()
    })

    it('should throw on missing hash', () => {
      expect(() => ant('1677ff')).toThrow('[@vuetify/v0] Invalid seed color: "1677ff". Expected a hex string (e.g., "#1677ff").')
    })

    it('should throw on non-hex characters', () => {
      expect(() => ant('#zzzzzz')).toThrow('[@vuetify/v0]')
    })

    it('should throw on empty string', () => {
      expect(() => ant('')).toThrow('[@vuetify/v0]')
    })

    it('should throw on wrong length', () => {
      expect(() => ant('#12345')).toThrow('[@vuetify/v0]')
    })
  })

  describe('options', () => {
    it('should default the dark background to #141414', () => {
      const result = ant('#1677ff')

      expect(result.themes.dark!.colors.background).toBe('#141414')
    })

    it('should honor a custom background', () => {
      const result = ant('#1677ff', { background: '#000000' })

      expect(result.themes.dark!.colors.background).toBe('#000000')
    })
  })

  describe('contrast', () => {
    it('should pick black for a light primary seed', () => {
      const result = ant('#ffff00')
      const light = result.themes.light!.colors as Record<string, string>

      expect(light['on-primary']).toBe('#000000')
    })

    it('should pick white for a dark primary seed', () => {
      const result = ant('#000080')
      const light = result.themes.light!.colors as Record<string, string>

      expect(light['on-primary']).toBe('#ffffff')
    })
  })
})
