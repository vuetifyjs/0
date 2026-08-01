import { dark, light } from './theme'

// Types
import type { Semantic } from './theme'

export function palette (semantic: Semantic): Record<string, string> {
  return { ...semantic }
}

export const themes = {
  'onyx': { colors: palette(dark), dark: true },
  'onyx-light': { colors: palette(light) },
}
