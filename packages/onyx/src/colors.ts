import { bandRecess, dark, girdleActive, light, materialDark, materialLight, pitchDeep } from './theme'

// Types
import type { Semantic } from './theme'

// Merges the semantic color map with the material geometry tokens for one theme, plus the two
// tokens shared across both themes (band-recess, girdle-active — see theme.ts) and the scrim
// color (pitch-deep, conventionally a dark veil regardless of the page's own theme). Adapter.ts's
// generate()/block() stay unaware of this merge — they just iterate whatever Record<string,string>
// palette() hands them, so this is the one place the token families come together.
export function palette (semantic: Semantic, material: Record<string, string> = {}): Record<string, string> {
  return { ...semantic, ...material, 'band-recess': bandRecess, 'girdle-active': girdleActive, 'pitch-deep': pitchDeep }
}

export const themes = {
  'onyx': { colors: palette(dark, materialDark), dark: true },
  'onyx-light': { colors: palette(light, materialLight) },
}
