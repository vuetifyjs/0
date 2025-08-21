// Plugins
import zero from './zero'
import router from './router'

// Components
import DocsPageFeatures from '@/components/docs/DocsPageFeatures.vue'
import Mermaid from '@/components/Mermaid.vue'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.use(router)
  app.use(zero)
  app.component('DocsPageFeatures', DocsPageFeatures)
  app.component('Mermaid', Mermaid)
}
