/**
 * Runtime counterpart of `scripts/bake-theme.ts`; both render the emitters in
 * `css.ts`, so the sanitizer, the alias tables and the foundations are one
 * source.
 *
 * Two intentional differences from the baked stylesheet:
 * - **Selectors.** Colours land on `[data-theme="<id>"]` only (foundations stay
 *   on `:root`): on the plugin path the theme system owns that attribute. The
 *   bake additionally duplicates the light block onto `:root`, because the
 *   zero-config CSS-only path (`import '@paper/quantum/theme.css'`) has no
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
 * Deliberately no `prefix`: every Quantum stylesheet hardcodes `var(--quantum-*)`,
 * so a custom prefix would emit variables nothing reads and unstyle the whole
 * design system.
 */
export interface QuantumAdapterOptions {
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
 * Stylesheet adapter used by `createQuantumPlugin`; not a consumer install step.
 * Apps `app.use(createQuantumPlugin())` and/or import `theme.css`. Only a host
 * that already installs `createThemePlugin` needs this class, to wire Quantum
 * as its theme adapter together with `quantumColors` / `quantumDarkColors`.
 */
export class QuantumStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  readonly v0Aliases: boolean

  constructor (options: QuantumAdapterOptions = {}) {
    // Order is load-bearing: `stylesheetId` precedes the spread so callers can
    // override it, `prefix` follows so they cannot. A cast past
    // QuantumAdapterOptions would otherwise unstyle every `var(--quantum-*)`.
    super({ stylesheetId: 'quantum-theme-stylesheet', ...options, prefix: 'quantum' })
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
