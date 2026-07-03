// Utilities
import { hexToRgb, isUndefined, V0Error } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { Colors } from '..'
import type { App, ComputedRef, Ref } from 'vue'

export interface ThemeAdapterSetupContext {
  colors: ComputedRef<Record<string, Colors>>
  selectedId: Ref<ID | null | undefined>
  isDark: Readonly<Ref<boolean>>
}

export abstract class ThemeAdapter {
  private static UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]/i
  private static SAFE_IDENT = /^[a-zA-Z0-9_-]+$/

  public stylesheetId = 'v0-theme-stylesheet'
  public prefix: string
  public rgb = false
  /**
   * Teardown registered by `setup`. Called once via `app.onUnmount` on the
   * plugin path and available as a reachable handle on standalone paths.
   */
  dispose?: () => void

  constructor (prefix: string) {
    if (!ThemeAdapter.SAFE_IDENT.test(prefix)) {
      throw new V0Error(`Invalid theme prefix: "${prefix}". Expected an identifier matching ${ThemeAdapter.SAFE_IDENT}.`, {
        code: 'V0_THEME_INVALID_PREFIX',
        prefix,
      })
    }

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
