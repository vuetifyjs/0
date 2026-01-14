// v0 plugins
// Framework
import {
  createBreakpointsPlugin,
  createHydrationPlugin,
  createThemePlugin,
} from '@vuetify/v0'

// Components
import MyAccordion from './components/MyAccordion.vue'
import MyButton from './components/MyButton.vue'
import MyTabs from './components/MyTabs.vue'

// Types
import type { App } from 'vue'

export interface MyUIPluginOptions {
  theme?: {
    default?: string
    themes?: Record<string, { colors: Record<string, string> }>
  }
}

export function MyUIPlugin (options: MyUIPluginOptions = {}) {
  return {
    install (app: App) {
      // Install v0 plugins
      app.use(createHydrationPlugin())
      app.use(createBreakpointsPlugin())
      app.use(createThemePlugin({
        default: options.theme?.default ?? 'light',
        themes: options.theme?.themes ?? {
          light: {
            colors: {
              'primary': '#6366f1',
              'on-primary': '#ffffff',
              'surface': '#ffffff',
              'surface-variant': '#f4f4f5',
              'on-surface': '#18181b',
              'on-surface-variant': '#71717a',
              'divider': '#e4e4e7',
            },
          },
          dark: {
            colors: {
              'primary': '#818cf8',
              'on-primary': '#ffffff',
              'surface': '#18181b',
              'surface-variant': '#27272a',
              'on-surface': '#fafafa',
              'on-surface-variant': '#a1a1aa',
              'divider': '#3f3f46',
            },
          },
        },
      }))

      // Register components globally
      app.component('MyButton', MyButton)
      app.component('MyTabs', MyTabs)
      app.component('MyAccordion', MyAccordion)
    },
  }
}
