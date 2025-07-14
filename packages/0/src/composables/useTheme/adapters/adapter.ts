// Types
import type { Colors } from '..'

export interface ThemeAdapter {
  update: (colors: Colors) => void
}

export abstract class BaseThemeAdapter implements ThemeAdapter {
  protected prefix: string

  constructor (prefix: string) {
    this.prefix = prefix
  }

  generate (colors: Colors): string {
    const vars = Object.entries(colors)
      .map(([key, val]) => `  --${this.prefix}-${key}: ${val};`)
      .join('\n')

    return `:root {\n${vars}\n}`
  }

  abstract update (colors: Colors): void
}
