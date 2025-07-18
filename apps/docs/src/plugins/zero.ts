import { createBreakpointsPlugin, createHydrationPlugin, createMarkdownPlugin, createThemePlugin } from '@vuetify/0'
import type { App } from 'vue'

export default function zero (app: App) {
  app.use(createHydrationPlugin())
  app.use(createMarkdownPlugin())
  app.use(createBreakpointsPlugin())
  app.use(
    createThemePlugin({
      default: 'slate',
      themes: {
        slate: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#6366f1',
          error: '#ef4444',
          info: '#0ea5e9',
          success: '#22c55e',
          warning: '#f59e0b',
          background: '#f9fafb',
          surface: '#f3f4f6',
          surfaceVariant: '#212121',
        },
      },
    }),
  )
}
