import { describe, expect, it } from 'vitest'

import { leonardo } from './index'

const HEX_RE = /^#[0-9a-f]{6,8}$/i

function expectHex (value: string) {
  expect(value).toMatch(HEX_RE)
}

function expectAllHex (record: Record<string, string>) {
  for (const value of Object.values(record)) {
    expectHex(value)
  }
}

describe('leonardo palette generator', () => {
  describe('shape', () => {
    it('should return palette and themes keys', () => {
      const result = leonardo('#0ea5e9')

      expect(result).toHaveProperty('palette')
      expect(result).toHaveProperty('themes')
      expect(result.themes).toHaveProperty('light')
      expect(result.themes).toHaveProperty('dark')
    })

    it('should mark light theme dark:false and dark theme dark:true', () => {
      const result = leonardo('#0ea5e9')

      expect(result.themes.light!.dark).toBe(false)
      expect(result.themes.dark!.dark).toBe(true)
    })

    it('should expose primary and primaryDark palette ramps', () => {
      const result = leonardo('#0ea5e9')

      expect(Object.keys(result.palette)).toEqual(['primary', 'primaryDark'])
      expectAllHex(result.palette.primary as Record<string, string>)
      expectAllHex(result.palette.primaryDark as Record<string, string>)
    })

    it('should produce hex strings for every theme color', () => {
      const result = leonardo('#0ea5e9')
      const light = result.themes.light!.colors as Record<string, string>
      const dark = result.themes.dark!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expect(dark.primary).toMatch(HEX_RE)
      expectAllHex(light)
      expectAllHex(dark)
    })

    it('should populate the canonical semantic keys', () => {
      const result = leonardo('#0ea5e9')
      const keys = Object.keys(result.themes.light!.colors)

      for (const key of [
        'primary',
        'on-primary',
        'primary-container',
        'on-primary-container',
        'secondary',
        'tertiary',
        'surface',
        'outline',
        'error',
        'background',
        'on-background',
      ]) {
        expect(keys).toContain(key)
      }
    })
  })

  describe('seed validation', () => {
    it('should accept 6-char hex', () => {
      expect(() => leonardo('#0ea5e9')).not.toThrow()
    })

    it('should accept 3-char shorthand hex', () => {
      expect(() => leonardo('#0af')).not.toThrow()
    })

    it('should accept 8-char hex with alpha', () => {
      expect(() => leonardo('#0ea5e9aa')).not.toThrow()
    })

    it('should accept uppercase hex', () => {
      expect(() => leonardo('#0EA5E9')).not.toThrow()
    })

    it('should throw on missing hash', () => {
      expect(() => leonardo('0ea5e9')).toThrow('[@vuetify/v0] Invalid seed color: "0ea5e9". Expected a hex string (e.g., "#0ea5e9").')
    })

    it('should throw on non-hex characters', () => {
      expect(() => leonardo('#zzzzzz')).toThrow('[@vuetify/v0]')
    })
  })

  describe('options', () => {
    it('should accept custom ratios', () => {
      const result = leonardo('#0ea5e9', { ratios: [1.5, 3, 7] })

      expect(Object.keys(result.palette.primary as Record<string, string>).length).toBeGreaterThan(0)
      expectAllHex(result.themes.light!.colors as Record<string, string>)
    })

    it('should accept the OKLCH color space', () => {
      const result = leonardo('#0ea5e9', { colorSpace: 'OKLCH' })
      const light = result.themes.light!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expectAllHex(light)
    })

    it('should accept the LAB color space', () => {
      const result = leonardo('#0ea5e9', { colorSpace: 'LAB' })
      const light = result.themes.light!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expectAllHex(light)
    })

    it('should accept the RGB color space', () => {
      const result = leonardo('#0ea5e9', { colorSpace: 'RGB' })
      const light = result.themes.light!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expectAllHex(light)
    })
  })

  describe('error palette', () => {
    it('should pin light error to #ba1a1a', () => {
      const result = leonardo('#0ea5e9')

      expect(result.themes.light!.colors.error).toBe('#ba1a1a')
    })

    it('should pin dark error to #ffb4ab', () => {
      const result = leonardo('#0ea5e9')

      expect(result.themes.dark!.colors.error).toBe('#ffb4ab')
    })
  })

  describe('background', () => {
    it('should pin light background to white', () => {
      const result = leonardo('#0ea5e9')

      expect(result.themes.light!.colors.background).toBe('#ffffff')
    })

    it('should pin dark background to #121212', () => {
      const result = leonardo('#0ea5e9')

      expect(result.themes.dark!.colors.background).toBe('#121212')
    })
  })
})
