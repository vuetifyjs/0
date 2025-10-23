// Types
import type { Colors } from '..'

export interface ThemeAdapterInterface {
  update: (colors: Record<string, Colors>) => void
}

export abstract class ThemeAdapter implements ThemeAdapterInterface {
  public stylesheetId = 'v0-theme-stylesheet'
  public prefix: string

  constructor (prefix: string) {
    this.prefix = prefix
  }

  generate (colors: Record<string, Colors>): string {
    let css = ''

    for (const theme in colors) {
      const themeColors = colors[theme]

      if (!themeColors) continue

      const vars = Object.entries(themeColors)
        .map(([key, val]) => `  --${this.prefix}-${key}: ${val};`)
        .join('\n')

      css += `.${this.prefix}-theme--${theme} {\n${vars}\n}\n`
    }

    return css
  }

  abstract update (colors: Record<string, Colors>): void
}
