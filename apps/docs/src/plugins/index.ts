// Plugins
import _app from './app'
import zero from './zero'
import pinia from './pinia'
import router from './router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.use(router)
  app.use(pinia)
  app.use(zero)
  app.use(_app)
}
