import type { ID } from '#v0/types'
// Types
import type { App, ComputedRef, Ref } from 'vue'
import type { Colors } from '..'
import { isUndefined } from '#v0/utilities'

export interface ThemeAdapterSetupContext {
  colors: ComputedRef<Record<string, Colors>>
  selectedId: Ref<ID | null | undefined>
  isDark: Readonly<Ref<boolean>>
}

export interface ThemeAdapterInterface {
  setup: <T extends ThemeAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ) => void
  update: (
    colors: Record<string, Colors>,
    isDark?: boolean,
  ) => void
}

export abstract class ThemeAdapter implements ThemeAdapterInterface {
  public stylesheetId = 'v0-theme-stylesheet'
  public prefix: string

  constructor (prefix: string) {
    this.prefix = prefix
  }

  generate (
    colors: Record<string, Colors>,
    isDark?: boolean,
  ): string {
    let css = ''

    for (const theme in colors) {
      const themeColors = colors[theme]

      if (!themeColors) continue

      const vars = Object.entries(themeColors)
        .map(([key, val]) => `  --${this.prefix}-${key}: ${val};`)
        .join('\n')

      css += `[data-theme="${theme}"] {\n${vars}\n}\n`
    }

    if (!isUndefined(isDark)) {
      css += `:root {\n  color-scheme: ${isDark ? 'dark' : 'light'};\n}\n`
    }

    return css
  }

  abstract setup<T extends ThemeAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null
  ): void
  abstract update (
    colors: Record<string, Colors>,
    isDark?: boolean
  ): void
}
