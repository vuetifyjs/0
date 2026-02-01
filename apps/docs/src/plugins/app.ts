// Components
import DocsCodeGroup from '@/components/docs/DocsCodeGroup.vue'
import DocsExample from '@/components/docs/DocsExample.vue'
import DocsNavigator from '@/components/docs/DocsNavigator.vue'
import DocsPageFeatures from '@/components/docs/meta/DocsPageFeatures.vue'

// Utilities
import { defineAsyncComponent } from 'vue'

// Types
import type { App } from 'vue'

export default function app (app: App) {
  app.component('DocsPageFeatures', DocsPageFeatures)
  app.component('DocsNavigator', DocsNavigator)
  app.component('DocsExample', DocsExample)
  app.component('DocsCodeGroup', DocsCodeGroup)
  app.component('DocsMermaid', defineAsyncComponent(() => import('@/components/docs/DocsMermaid.vue')))
}
