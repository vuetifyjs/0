import { describe, expect, it, vi } from 'vitest'

// `@material/material-color-utilities@0.4.0` ships extensionless `.js`
// re-exports between sibling files, which Node's native ESM resolver
// rejects under Vitest's `vmThreads` pool. We mock the surface the
// generator consumes — the package's runtime is exercised in production
// builds (Vite resolves the missing extensions) and in the docs build.
vi.mock('@material/material-color-utilities', () => {
  function pad (value: number) {
    return value.toString(16).padStart(2, '0')
  }

  function hexFromArgb (argb: number) {
    const r = (argb >> 16) & 0xff
    const g = (argb >> 8) & 0xff
    const b = argb & 0xff
    return `#${pad(r)}${pad(g)}${pad(b)}`
  }

  function argbFromHex (hex: string) {
    const trimmed = hex.replace('#', '')
    const expanded = trimmed.length === 3
      ? trimmed.split('').map(c => c + c).join('')
      : trimmed.slice(0, 6)
    return Number.parseInt(expanded, 16)
  }

  function makeTonalPalette (seed: number) {
    return {
      seed,
      tone (value: number) {
        return ((seed + value * 0x01_02_03) >>> 0) & 0xff_ff_ff
      },
    }
  }

  const Hct = {
    fromInt (argb: number) {
      return { argb }
    },
  }

  function makeScheme (source: { argb: number }, dark: boolean, _contrast: number) {
    const seed = source.argb || 0x12_34_56
    function role (offset: number) {
      const base = seed ^ offset
      return (base + (dark ? 0x20_20_20 : 0)) & 0xff_ff_ff
    }
    return {
      dark,
      primaryPalette: makeTonalPalette(seed),
      secondaryPalette: makeTonalPalette(seed ^ 0x1_11),
      tertiaryPalette: makeTonalPalette(seed ^ 0x2_22),
      neutralPalette: makeTonalPalette(seed ^ 0x3_33),
      neutralVariantPalette: makeTonalPalette(seed ^ 0x4_44),
      errorPalette: makeTonalPalette(0xff_00_00),
      primary: role(0x01),
      onPrimary: role(0x02),
      primaryContainer: role(0x03),
      onPrimaryContainer: role(0x04),
      secondary: role(0x05),
      onSecondary: role(0x06),
      secondaryContainer: role(0x07),
      onSecondaryContainer: role(0x08),
      tertiary: role(0x09),
      onTertiary: role(0x0a),
      tertiaryContainer: role(0x0b),
      onTertiaryContainer: role(0x0c),
      error: role(0x0d),
      onError: role(0x0e),
      errorContainer: role(0x0f),
      onErrorContainer: role(0x10),
      surface: role(0x11),
      onSurface: role(0x12),
      surfaceVariant: role(0x13),
      onSurfaceVariant: role(0x14),
      outline: role(0x15),
      outlineVariant: role(0x16),
      background: role(0x17),
      onBackground: role(0x18),
    }
  }

  // The generator does `new SchemeClass(...)`. Returning an object from a
  // constructor replaces `this`, so this is the simplest way to mimic the
  // upstream DynamicScheme classes without restating every getter name.
  class Scheme {
    constructor (source: { argb: number }, dark: boolean, contrast: number) {
      return makeScheme(source, dark, contrast) as unknown as Scheme
    }
  }

  return {
    Hct,
    SchemeTonalSpot: Scheme,
    SchemeVibrant: Scheme,
    SchemeExpressive: Scheme,
    SchemeFidelity: Scheme,
    SchemeMonochrome: Scheme,
    SchemeNeutral: Scheme,
    argbFromHex,
    hexFromArgb,
  }
})

import { material } from './index'

const HEX_RE = /^#[0-9a-f]{6}$/i

function expectHex (value: string) {
  expect(value).toMatch(HEX_RE)
}

function expectAllHex (record: Record<string, string>) {
  for (const value of Object.values(record)) {
    expectHex(value)
  }
}

describe('material palette generator', () => {
  describe('shape', () => {
    it('should return palette and themes keys', () => {
      const result = material('#6750A4')

      expect(result).toHaveProperty('palette')
      expect(result).toHaveProperty('themes')
      expect(result.themes).toHaveProperty('light')
      expect(result.themes).toHaveProperty('dark')
    })

    it('should mark light theme dark:false and dark theme dark:true', () => {
      const result = material('#6750A4')

      expect(result.themes.light!.dark).toBe(false)
      expect(result.themes.dark!.dark).toBe(true)
    })

    it('should expose all six tonal palettes', () => {
      const result = material('#6750A4')

      expect(Object.keys(result.palette).toSorted()).toEqual([
        'error',
        'neutral',
        'neutralVariant',
        'primary',
        'secondary',
        'tertiary',
      ])
    })

    it('should populate every tonal palette with 26 stops of hex', () => {
      const result = material('#6750A4')

      for (const key of ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error'] as const) {
        const ramp = result.palette[key] as Record<number, string>
        expect(Object.keys(ramp)).toHaveLength(26)
        expectAllHex(ramp)
      }
    })

    it('should produce hex strings for every theme color', () => {
      const result = material('#6750A4')
      const light = result.themes.light!.colors as Record<string, string>
      const dark = result.themes.dark!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expect(dark.primary).toMatch(HEX_RE)
      expectAllHex(light)
      expectAllHex(dark)
    })

    it('should populate the canonical semantic keys', () => {
      const result = material('#6750A4')
      const keys = Object.keys(result.themes.light!.colors)

      for (const key of [
        'primary',
        'on-primary',
        'primary-container',
        'on-primary-container',
        'secondary',
        'tertiary',
        'error',
        'surface',
        'outline',
        'background',
        'on-background',
      ]) {
        expect(keys).toContain(key)
      }
    })
  })

  describe('seed validation', () => {
    it('should accept 6-char lowercase hex', () => {
      expect(material('#6750a4').themes.light).toBeDefined()
    })

    it('should accept 6-char uppercase hex', () => {
      expect(material('#6750A4').themes.light).toBeDefined()
    })

    it('should accept 3-char shorthand hex', () => {
      expect(material('#6a4').themes.light).toBeDefined()
    })

    it('should accept 8-char hex with alpha', () => {
      expect(material('#6750a4ff').themes.light).toBeDefined()
    })

    it('should throw on missing hash', () => {
      expect(() => material('6750A4')).toThrow('[@vuetify/v0] Invalid seed color: "6750A4". Expected a hex string (e.g., "#6750A4").')
    })

    it('should throw on non-hex characters', () => {
      expect(() => material('#zzzzzz')).toThrow('[@vuetify/v0]')
    })

    it('should throw on empty string', () => {
      expect(() => material('')).toThrow('[@vuetify/v0]')
    })
  })

  describe('variants', () => {
    it('should accept tonalSpot', () => {
      expect(material('#6750A4', { variant: 'tonalSpot' }).themes.light).toBeDefined()
    })

    it('should accept vibrant', () => {
      expect(material('#6750A4', { variant: 'vibrant' }).themes.light).toBeDefined()
    })

    it('should accept expressive', () => {
      expect(material('#6750A4', { variant: 'expressive' }).themes.light).toBeDefined()
    })

    it('should accept fidelity', () => {
      expect(material('#6750A4', { variant: 'fidelity' }).themes.light).toBeDefined()
    })

    it('should accept monochrome', () => {
      expect(material('#6750A4', { variant: 'monochrome' }).themes.light).toBeDefined()
    })

    it('should accept neutral', () => {
      expect(material('#6750A4', { variant: 'neutral' }).themes.light).toBeDefined()
    })

    it('should throw on an unknown variant', () => {
      // @ts-expect-error testing invalid variant value
      expect(() => material('#6750A4', { variant: 'bogus' })).toThrow('[@vuetify/v0] Unknown material variant: "bogus"')
    })
  })

  describe('contrast option', () => {
    it('should accept zero contrast', () => {
      const result = material('#6750A4', { contrast: 0 })
      const light = result.themes.light!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expectAllHex(light)
    })

    it('should accept positive contrast', () => {
      const result = material('#6750A4', { contrast: 0.5 })
      const light = result.themes.light!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expectAllHex(light)
    })

    it('should accept maximum contrast', () => {
      const result = material('#6750A4', { contrast: 1 })
      const light = result.themes.light!.colors as Record<string, string>

      expect(light.primary).toMatch(HEX_RE)
      expectAllHex(light)
    })
  })
})
