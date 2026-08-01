// Framework
import { createThemePlugin } from '@vuetify/v0'

// Adapters
import { OnyxStyleSheetAdapter } from './adapter'
import { themes } from './colors'

// Types
import type { ThemePluginOptions } from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface OnyxPluginOptions {
  theme?: false | ThemePluginOptions
}

function onyxThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'onyx',
    adapter: new OnyxStyleSheetAdapter(),
    themes,
  }
}

/**
 * Install Onyx theming (and only theming).
 * Locale / storage / hydration are host app concerns — not auto-installed.
 */
export function createOnyxPlugin (options: OnyxPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.theme === false) return

      const defaults = onyxThemeDefaults()
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
