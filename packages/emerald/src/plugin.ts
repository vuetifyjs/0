// Framework
import { createThemePlugin } from '@vuetify/v0'

// Adapters
import { EmeraldStyleSheetAdapter } from './adapter'
import { emeraldColors, emeraldDarkColors } from './colors'
// Icons
import { createEmIcons, provideEmIcons } from './icons'

// Types
import type { EmeraldIconsOptions } from './icons'
import type { ThemePluginOptions } from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface EmeraldPluginOptions {
  theme?: ThemePluginOptions | false
  /**
   * Icon roles for the whole app. Omit for the built-in set; pass overrides and
   * aliases to reshape it. `false` skips registration entirely — `EmIcon` then
   * falls back to the built-in set on its own.
   */
  icons?: EmeraldIconsOptions | false
}

type ThemeMap = NonNullable<ThemePluginOptions['themes']>

function emeraldThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'emerald',
    adapter: new EmeraldStyleSheetAdapter(),
    themes: {
      'emerald': { colors: emeraldColors },
      'emerald-dark': { colors: emeraldDarkColors, dark: true },
    },
  }
}

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
 * Install Emerald theming and its icon set. This is the consumer entry:
 * adapter, default `emerald` theme, kit `--v0-*` aliases, and the icon roles
 * every Em* component draws from are prewired.
 *
 * Locale / storage / hydration are host app concerns — not auto-installed.
 *
 * Escape hatches, independent of each other: `{ theme: false }` when the host
 * already installs `createThemePlugin` and will attach
 * `EmeraldStyleSheetAdapter` + `emeraldColors` itself; `{ icons: false }` to
 * leave the app-level icon registry unset.
 */
export function createEmeraldPlugin (options: EmeraldPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.icons !== false) {
        provideEmIcons(createEmIcons(options.icons), app)
      }

      if (options.theme === false) return

      const defaults = emeraldThemeDefaults()
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
