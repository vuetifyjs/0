// Framework
import { createReducedMotionPlugin, createThemePlugin } from '@vuetify/v0'

// Adapters
import { Md1StyleSheetAdapter } from './adapter'
import { md1Colors, md1DarkColors } from './colors'
// Icons
import { createMd1IconsPlugin } from './icons'

// Types
import type { Md1IconsPluginOptions } from './icons'
import type { ReducedMotionPluginOptions, ThemePluginOptions } from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface Md1PluginOptions {
  /**
   * Options for v0's `createThemePlugin`, merged over MD1's defaults
   * (`md1-light` / `md1-dark`, the adapter, `system` following the OS).
   * `false` when the host installs `createThemePlugin` itself and registers
   * `Md1StyleSheetAdapter` plus `md1Colors` / `md1DarkColors`.
   */
  theme?: ThemePluginOptions | false
  /**
   * Options forwarded to `createMd1IconsPlugin`. `false` skips installing
   * it; `Md1Icon` then falls back to the built-in set on its own.
   *
   * Note this does **not** drop the glyph map from your bundle; see the
   * function docs below.
   */
  icons?: Md1IconsPluginOptions | false
  /**
   * Options forwarded to v0's `createReducedMotionPlugin`. `false` when the
   * host installs it itself. Composed here because `Md1Ripple` reads
   * `useReducedMotion().isReduced`, which falls back to `false` with no plugin
   * installed; the stylesheets stay gated on `prefers-reduced-motion` either way.
   */
  reducedMotion?: ReducedMotionPluginOptions | false
}

type ThemeMap = NonNullable<ThemePluginOptions['themes']>

function md1ThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'md1-light',
    system: { light: 'md1-light', dark: 'md1-dark' },
    adapter: new Md1StyleSheetAdapter(),
    themes: {
      'md1-light': { colors: md1Colors },
      'md1-dark': { colors: md1DarkColors, dark: true },
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
 * Install MD1 theming, its icon set and reduced-motion detection. This is
 * the consumer entry: adapter, the default `md1-light` / `md1-dark`
 * pair following the OS until `useTheme().select`, kit `--v0-*` aliases, the
 * icon roles every `Md1*` component draws from, and the `isReduced` flag
 * `Md1Ripple` reads are prewired.
 *
 * Locale, storage and hydration are host app concerns; not auto-installed.
 *
 * Escape hatches, independent of each other: `{ theme: false }` when the host
 * already installs `createThemePlugin` and will attach
 * `Md1StyleSheetAdapter` + `md1Colors` itself; `{ icons: false }` to
 * leave the app-level icon registry unset; `{ reducedMotion: false }` when the
 * host installs `createReducedMotionPlugin` itself.
 *
 * `{ icons: false }` skips the install; it does not shrink your bundle. Static
 * imports cannot be conditional, so composing the icon plugin here pins the
 * glyph map (DESIGN_SYSTEMS.md ruling 6). Nothing is lost by it in practice:
 * every `Md1*` component that draws a glyph imports `Md1Icon`, so any app using
 * MD1's controls already carries the map. To leave it out entirely,
 * install `createMd1IconsPlugin` yourself and skip this entry.
 */
export function createMd1Plugin (options: Md1PluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.reducedMotion !== false) {
        app.use(createReducedMotionPlugin(options.reducedMotion))
      }

      if (options.icons !== false) {
        app.use(createMd1IconsPlugin(options.icons))
      }

      if (options.theme === false) return

      const defaults = md1ThemeDefaults()
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
