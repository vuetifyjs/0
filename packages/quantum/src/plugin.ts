// Framework
import { createReducedMotionPlugin, createThemePlugin } from '@vuetify/v0'

// Adapters
import { QuantumStyleSheetAdapter } from './adapter'
import { quantumColors, quantumDarkColors } from './colors'
// Icons
import { createQuantumIconsPlugin } from './icons'

// Types
import type { QuantumIconsPluginOptions } from './icons'
import type { ReducedMotionPluginOptions, ThemePluginOptions } from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface QuantumPluginOptions {
  /**
   * Options for v0's `createThemePlugin`, merged over Quantum's defaults
   * (`quantum-light` / `quantum-dark`, the adapter, `system` following the OS).
   * `false` when the host installs `createThemePlugin` itself and registers
   * `QuantumStyleSheetAdapter` plus `quantumColors` / `quantumDarkColors`.
   */
  theme?: ThemePluginOptions | false
  /**
   * Options forwarded to `createQuantumIconsPlugin`. `false` skips installing
   * it; `QuIcon` then falls back to the built-in set on its own.
   *
   * Note this does **not** drop the glyph map from your bundle; see the
   * function docs below.
   */
  icons?: QuantumIconsPluginOptions | false
  /**
   * Options forwarded to v0's `createReducedMotionPlugin`. `false` when the
   * host installs it itself. Composed here because `QuRipple` reads
   * `useReducedMotion().isReduced`, which falls back to `false` with no plugin
   * installed; the stylesheets stay gated on `prefers-reduced-motion` either way.
   */
  reducedMotion?: ReducedMotionPluginOptions | false
}

type ThemeMap = NonNullable<ThemePluginOptions['themes']>

function quantumThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'quantum-light',
    system: { light: 'quantum-light', dark: 'quantum-dark' },
    adapter: new QuantumStyleSheetAdapter(),
    themes: {
      'quantum-light': { colors: quantumColors },
      'quantum-dark': { colors: quantumDarkColors, dark: true },
    },
  }
}

/** Per-id shallow merge, with `colors` merged one level deeper so a consumer overrides a few roles, not the whole map. */
function mergeThemes (defaults: ThemeMap | undefined, overrides: ThemeMap | undefined): ThemeMap {
  const base: ThemeMap = { ...defaults }
  if (!overrides) return base

  for (const [id, ticket] of Object.entries(overrides)) {
    const prev = base[id]
    base[id] = prev
      ? {
          ...prev,
          ...ticket,
          colors: { ...prev.colors, ...ticket.colors },
        }
      : ticket
  }

  return base
}

/**
 * Install Quantum theming, its icon set and reduced-motion detection. This is
 * the consumer entry: adapter, the default `quantum-light` / `quantum-dark`
 * pair following the OS until `useTheme().select`, kit `--v0-*` aliases, the
 * icon roles every `Qu*` component draws from, and the `isReduced` flag
 * `QuRipple` reads are prewired.
 *
 * Locale, storage and hydration are host app concerns; not auto-installed.
 *
 * Escape hatches, independent of each other: `{ theme: false }` when the host
 * already installs `createThemePlugin` and will attach
 * `QuantumStyleSheetAdapter` + `quantumColors` itself; `{ icons: false }` to
 * leave the app-level icon registry unset; `{ reducedMotion: false }` when the
 * host installs `createReducedMotionPlugin` itself.
 *
 * `{ icons: false }` skips the install; it does not shrink your bundle. Static
 * imports cannot be conditional, so composing the icon plugin here pins the
 * glyph map (DESIGN_SYSTEMS.md ruling 6). Nothing is lost by it in practice:
 * every `Qu*` component that draws a glyph imports `QuIcon`, so any app using
 * Quantum's controls already carries the map. To leave it out entirely,
 * install `createQuantumIconsPlugin` yourself and skip this entry.
 */
export function createQuantumPlugin (options: QuantumPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.reducedMotion !== false) {
        app.use(createReducedMotionPlugin(options.reducedMotion))
      }

      if (options.icons !== false) {
        app.use(createQuantumIconsPlugin(options.icons))
      }

      if (options.theme === false) return

      const defaults = quantumThemeDefaults()
      const theme = options.theme
        ? {
            ...defaults,
            ...options.theme,
            themes: mergeThemes(defaults.themes, options.theme.themes),
            adapter: options.theme.adapter ?? defaults.adapter,
          }
        : defaults

      app.use(createThemePlugin(theme))
    },
  }
}
