import { describe, expect, it } from 'vitest'

import { md1HueTheme } from './colors'
import { md1Palette } from './design-system'

// Types
import type { Md1Hue } from './design-system'

const TONES = ['500', '400', '300', '200', '100', '50'] as const

// The tone each primary hue's dark `primary-ink` lands on (measured 2026-10-26).
const EXPECTED: Record<Md1Hue, (typeof TONES)[number]> = {
  'red': '100',
  'pink': '100',
  'purple': '100',
  'deep-purple': '100',
  'indigo': '100',
  'blue': '200',
  'light-blue': '200',
  'cyan': '200',
  'teal': '100',
  'green': '200',
  'light-green': '300',
  'lime': '500',
  'yellow': '500',
  'amber': '500',
  'orange': '300',
  'deep-orange': '100',
  'brown': '100',
  'grey': '300',
  'blue-grey': '100',
}

function rgb (hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16)

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function luminance ([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map(channel => {
    const c = channel / 255

    return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * lr! + 0.7152 * lg! + 0.0722 * lb!
}

function contrast (a: [number, number, number], b: [number, number, number]): number {
  const [light, dark] = [luminance(a), luminance(b)].toSorted((x, y) => y - x)

  return (light! + 0.05) / (dark! + 0.05)
}

// Grey 800, and Grey 800 under the white 7% selected list band.
const SHEET = rgb(md1Palette['grey-800'])
const BAND = SHEET.map(channel => channel + (255 - channel) * 0.07) as [number, number, number]

describe('md1HueTheme', () => {
  describe('primary-ink', () => {
    it.each(Object.entries(EXPECTED) as [Md1Hue, (typeof TONES)[number]][])('should ink %s on dark in its %s tone', (hue, tone) => {
      expect(md1HueTheme(hue, 'pink').dark['primary-ink']).toBe(md1Palette[`${hue}-${tone}`])
    })

    it.each(Object.keys(EXPECTED) as Md1Hue[])('should keep %s at the 500 on light', hue => {
      expect(md1HueTheme(hue, 'pink').light['primary-ink']).toBe(md1Palette[`${hue}-500`])
    })

    it.each(Object.keys(EXPECTED) as Md1Hue[])('should pick the darkest %s tone that reaches 4.5:1 on the dark sheet and band', hue => {
      const ink = md1HueTheme(hue, 'pink').dark['primary-ink']
      const index = TONES.findIndex(tone => md1Palette[`${hue}-${tone}`] === ink)

      expect(contrast(rgb(ink), SHEET)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(rgb(ink), BAND)).toBeGreaterThanOrEqual(4.5)

      if (index > 0) {
        expect(contrast(rgb(md1Palette[`${hue}-${TONES[index - 1]}`]), BAND)).toBeLessThan(4.5)
      }
    })
  })
})
