// Types
import type { Colors } from '..'

export interface ThemeAdapterInterface {
  update: (colors: Colors | undefined) => void
}

export abstract class ThemeAdapter implements ThemeAdapterInterface {
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

  abstract update (colors: Colors | undefined): void
}
