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

/**
 * Install Emerald theming (and only theming).
 * Locale / storage / hydration are host app concerns — not auto-installed.
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
            themes: { ...defaults.themes, ...options.theme.themes },
            adapter: options.theme.adapter ?? defaults.adapter,
          }
        : defaults

      app.use(createThemePlugin(theme))
    },
  }
}

export { emeraldColors } from './colors'
