// Plugins
import zero from './zero'
import { router } from './router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.use(router)
  app.use(zero)
}
