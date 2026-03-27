// Utilities
import { hexToRgb, isUndefined } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { Colors } from '..'
import type { App, ComputedRef, Ref } from 'vue'

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
  public rgb = false

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
        .map(([key, val]) => `  --${this.prefix}-${key}: ${this.rgb ? this.decompose(val) : val};`)
        .join('\n')

      css += `[data-theme="${theme}"] {\n${vars}\n}\n`
    }

    if (!isUndefined(isDark)) {
      css += `:root {\n  color-scheme: ${isDark ? 'dark' : 'light'};\n}\n`
    }

    return css
  }

  protected decompose (hex: string): string {
    const { r, g, b, a } = hexToRgb(hex)
    return isUndefined(a) ? `${r}, ${g}, ${b}` : `${r}, ${g}, ${b}, ${a}`
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
