// Types
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ThemeRecord } from '#v0/composables/useTheme'
import type { ID } from '#v0/types'

export interface PaletteDefinition {
  palette: TokenCollection
  themes: Record<ID, ThemeRecord>
}

export type PaletteGenerator<O = {}> = (seed: string, options?: O) => PaletteDefinition
