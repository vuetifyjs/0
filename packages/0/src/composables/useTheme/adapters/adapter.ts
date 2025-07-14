// Types
import type { Colors } from '..'

export interface ThemeAdapter {
  update: (colors: Colors) => void
}
