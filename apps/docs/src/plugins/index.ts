// Framework
import { createNotificationsPlugin } from '@vuetify/v0'

// Components
import DocsMarkup from '@/components/docs/DocsMarkup.vue'

// Composables
import { SettingsPlugin } from '@/composables/useSettings'

import _app from './app'
import zero from './zero'

// Types
import type { App } from 'vue'
// Plugins
import './analytics'

export function registerPlugins (app: App) {
  app.use(zero)
  app.use(createNotificationsPlugin())
  app.use(_app)
  app.use(SettingsPlugin)

  // Global components for markdown
  app.component('DocsMarkup', DocsMarkup)
}
