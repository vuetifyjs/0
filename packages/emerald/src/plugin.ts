// Framework
import { createThemePlugin } from '@vuetify/v0'

// Adapters
import { EmeraldStyleSheetAdapter } from './adapter'
import { emeraldColors } from './colors'

// Types
import type { ThemePluginOptions } from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface EmeraldPluginOptions {
  theme?: ThemePluginOptions | false
}

type ThemeMap = NonNullable<ThemePluginOptions['themes']>

function emeraldThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'emerald',
    adapter: new EmeraldStyleSheetAdapter(),
    themes: {
      emerald: { colors: emeraldColors },
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
 * Install Emerald theming (and only theming).
 * Locale / storage / hydration are host app concerns — not auto-installed.
 *
 * Hosts that already call `createThemePlugin` should pass `{ theme: false }`
 * and register `EmeraldStyleSheetAdapter` + `emeraldColors` on their own theme.
 */
export function createEmeraldPlugin (options: EmeraldPluginOptions = {}): Plugin {
  return {
    install (app: App) {
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
