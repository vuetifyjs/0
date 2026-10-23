/**
 * Runtime counterpart of `scripts/bake-theme.ts`; both render the emitters in
 * `css.ts`, so the sanitizer, the alias tables and the foundations are one
 * source.
 *
 * Two intentional differences from the baked stylesheet:
 * - **Selectors.** Colours land on `[data-theme="<id>"]` only (foundations stay
 *   on `:root`): on the plugin path the theme system owns that attribute. The
 *   bake additionally duplicates the light block onto `:root`, because the
 *   zero-config CSS-only path (`import '@paper/md1/theme.css'`) has no
 *   plugin to set `data-theme`.
 * - **Sanitizer response.** Here a `SAFE_IDENT` / `UNSAFE_CSS` hit skips the
 *   declaration silently: colours are user-supplied at runtime, and v0's own
 *   adapter drops rather than throws. At bake time the input is first-party
 *   `colors.ts`, so the script throws instead.
 */

// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'
import { isUndefined } from '@vuetify/v0/utilities'

import { block, foundations, SAFE_IDENT } from './css'

// Types
import type { Colors } from '@vuetify/v0'

/**
 * Deliberately no `prefix`: every Material Design 1 stylesheet hardcodes `var(--md1-*)`,
 * so a custom prefix would emit variables nothing reads and unstyle the whole
 * design system.
 */
export interface Md1AdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  /**
   * When true (default), also emit `--v0-*` aliases for the colour roles kits
   * (Genesis) consume, so kit chrome inherits the theme. See DESIGN_SYSTEMS.md
   * "Kit interop" and SPEC.md "The v0 bridge".
   */
  v0Aliases?: boolean
}

/**
 * Stylesheet adapter used by `createMd1Plugin`; not a consumer install step.
 * Apps `app.use(createMd1Plugin())` and/or import `theme.css`. Only a host
 * that already installs `createThemePlugin` needs this class, to wire Material Design 1
 * as its theme adapter together with `md1Colors` / `md1DarkColors`.
 */
export class Md1StyleSheetAdapter extends V0StyleSheetThemeAdapter {
  readonly v0Aliases: boolean

  constructor (options: Md1AdapterOptions = {}) {
    // Order is load-bearing: `stylesheetId` precedes the spread so callers can
    // override it, `prefix` follows so they cannot. A cast past
    // Md1AdapterOptions would otherwise unstyle every `var(--md1-*)`.
    super({ stylesheetId: 'md1-theme-stylesheet', ...options, prefix: 'md1' })
    this.v0Aliases = options.v0Aliases !== false
  }

  override generate (colors: Record<string, Colors>, isDark?: boolean): string {
    let css = foundations()

    for (const theme in colors) {
      if (!SAFE_IDENT.test(theme)) continue

      const themeColors = colors[theme]
      if (!themeColors) continue

      css += block(`[data-theme="${theme}"]`, themeColors, { aliases: this.v0Aliases })
    }

    if (!isUndefined(isDark)) {
      css += `:root {\n  color-scheme: ${isDark ? 'dark' : 'light'};\n}\n`
    }

    return css
  }
}
