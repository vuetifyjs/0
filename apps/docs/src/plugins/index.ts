// Plugins
import './analytics'
import _app from './app'
import zero from './zero'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.use(zero)
  app.use(_app)
}
