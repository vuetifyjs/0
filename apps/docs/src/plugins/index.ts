// Types
import type { App } from 'vue'
// Components
import DocsMarkup from '@/components/docs/DocsMarkup.vue'
import _app from './app'

import zero from './zero'

// Plugins
import './analytics'

export function registerPlugins (app: App) {
  app.use(zero)
  app.use(_app)

  // Global components for markdown
  app.component('DocsMarkup', DocsMarkup)
}
