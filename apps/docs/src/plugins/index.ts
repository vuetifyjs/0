// Components
import DocsMarkup from '@/components/docs/DocsMarkup.vue'

// Framework
import { createNotificationsPlugin } from '@vuetify/v0'

// Composables
import { SettingsPlugin } from '@/composables/useSettings'

// Types
import type { App } from 'vue'

import _app from './app'
import zero from './zero'
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
