// Components
import DocsNavigator from '@/components/docs/DocsNavigator.vue'
import DocsPageFeatures from '@/components/docs/DocsPageFeatures.vue'
import Mermaid from '@/components/Mermaid.vue'

// Types
import type { App } from 'vue'

export default function app (app: App) {
  app.component('DocsPageFeatures', DocsPageFeatures)
  app.component('DocsNavigator', DocsNavigator)
  app.component('Mermaid', Mermaid)
}
