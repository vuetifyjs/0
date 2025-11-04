// Imports
import { defineAsyncComponent } from 'vue'

// Components
import DocsNavigator from '@/components/docs/DocsNavigator.vue'
import DocsPageFeatures from '@/components/docs/DocsPageFeatures.vue'
import DocsExample from '@/components/docs/DocsExample.vue'

// Types
import type { App } from 'vue'

export default function app (app: App) {
  app.component('DocsPageFeatures', DocsPageFeatures)
  app.component('DocsNavigator', DocsNavigator)
  app.component('DocsExample', DocsExample)
  app.component('Mermaid', defineAsyncComponent(() => import('@/components/Mermaid.vue')))
}
