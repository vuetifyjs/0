import { Color, Theme } from '@adobe/leonardo-contrast-colors'

// Types
import type { PaletteDefinition } from '#v0/palettes'

export interface LeonardoGenerateOptions {
  ratios?: number[]
  colorSpace?: 'CAM02' | 'CAM02p' | 'HSL' | 'HSLuv' | 'HSV' | 'LAB' | 'LCH' | 'OKLAB' | 'OKLCH' | 'RGB'
}

const DEFAULT_RATIOS = [1.25, 1.5, 2, 3, 4.5, 7, 11]

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

function extractColors (entries: unknown[]): Record<number, string> {
  const colors: Record<number, string> = {}
  for (const entry of entries) {
    if (entry && typeof entry === 'object' && 'values' in entry) {
      const e = entry as { values: Array<{ contrast: number, value: string }> }
      for (const v of e.values) {
        colors[v.contrast] = v.value
      }
    }
  }
  return colors
}

function mapSemanticColors (colors: Record<number, string>, ratios: number[]): Record<string, string> {
  function at (ratio: number): string {
    if (colors[ratio]) return colors[ratio]
    let closest = ratios[0]!
    let delta = Math.abs(ratio - closest)
    for (const r of ratios) {
      const d = Math.abs(ratio - r)
      if (d < delta) {
        closest = r
        delta = d
      }
    }
    return colors[closest] ?? Object.values(colors)[0] ?? '#000000'
  }

  const low1 = at(1.25)
  const low2 = at(1.5)
  const low3 = at(2)
  const mid1 = at(3)
  const mid2 = at(4.5)
  const high1 = at(7)
  const high2 = at(11)

  return {
    'primary': mid2,
    'on-primary': high2,
    'primary-container': low1,
    'on-primary-container': high1,
    'secondary': mid2,
    'on-secondary': high2,
    'secondary-container': low2,
    'on-secondary-container': high1,
    'tertiary': mid2,
    'on-tertiary': high2,
    'tertiary-container': low3,
    'on-tertiary-container': high1,
    'surface': low1,
    'on-surface': high1,
    'surface-variant': low1,
    'on-surface-variant': high1,
    'outline': mid1,
    'outline-variant': low2,
  }
}

export function leonardo (seed: string, options: LeonardoGenerateOptions = {}): PaletteDefinition {
  if (!HEX_RE.test(seed)) {
    throw new Error(`[@vuetify/v0] Invalid seed color: "${seed}". Expected a hex string (e.g., "#0ea5e9").`)
  }

  const { ratios = DEFAULT_RATIOS, colorSpace = 'OKLCH' } = options

  // @adobe/leonardo-contrast-colors has loose typings — string args are correct at runtime
  const color = new Color({
    name: 'primary',
    colorKeys: [seed as never],
    ratios,
    colorSpace: colorSpace as never,
  })

  const light = new Theme({ colors: [color], backgroundColor: '#ffffff' as never, lightness: 100 })
  const dark = new Theme({ colors: [color], backgroundColor: '#121212' as never, lightness: 8 })

  const lightColors = extractColors(light.contrastColors as unknown[])
  const darkColors = extractColors(dark.contrastColors as unknown[])

  const lightSemantic = mapSemanticColors(lightColors, ratios)
  const darkSemantic = mapSemanticColors(darkColors, ratios)

  return {
    palette: {
      primary: lightColors,
      primaryDark: darkColors,
    },
    themes: {
      light: {
        dark: false,
        colors: {
          ...lightSemantic,
          'error': '#ba1a1a',
          'on-error': '#ffffff',
          'error-container': '#ffdad6',
          'on-error-container': '#410002',
          'background': '#ffffff',
          'on-background': lightSemantic['on-surface'] ?? '#000000',
        },
      },
      dark: {
        dark: true,
        colors: {
          ...darkSemantic,
          'error': '#ffb4ab',
          'on-error': '#690005',
          'error-container': '#93000a',
          'on-error-container': '#ffdad6',
          'background': '#121212',
          'on-background': darkSemantic['on-surface'] ?? '#ffffff',
        },
      },
    },
  }
}
