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
  private static UNSAFE_CSS = /url\s*\(|@import|expression\s*\(|[{}]/i
  private static SAFE_IDENT = /^[a-zA-Z0-9_-]+$/

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
      if (!ThemeAdapter.SAFE_IDENT.test(theme)) continue

      const vars = Object.entries(themeColors)
        .filter(([key, val]) => ThemeAdapter.SAFE_IDENT.test(key) && !ThemeAdapter.UNSAFE_CSS.test(val))
        .map(([key, val]) => `  --${this.prefix}-${key}: ${this.rgb ? this.decompose(val) : val};`)
        .join('\n')

      css += `[data-theme="${theme}"] {\n${vars}\n  color: var(--${this.prefix}-on-background);\n}\n`
    }

    if (!isUndefined(isDark)) {
      css += `:root {\n  color-scheme: ${isDark ? 'dark' : 'light'};\n}\n`
    }

    return css
  }

  private decompose (hex: string): string {
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
