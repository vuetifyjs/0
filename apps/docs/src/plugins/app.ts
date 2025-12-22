// Types
import type { App } from 'vue'

// Imports
import { defineAsyncComponent } from 'vue'
import DocsCodeGroup from '@/components/docs/DocsCodeGroup.vue'
import DocsExample from '@/components/docs/DocsExample.vue'
// Components
import DocsNavigator from '@/components/docs/DocsNavigator.vue'

import DocsPageFeatures from '@/components/docs/DocsPageFeatures.vue'

export default function app (app: App) {
  app.component('DocsPageFeatures', DocsPageFeatures)
  app.component('DocsNavigator', DocsNavigator)
  app.component('DocsExample', DocsExample)
  app.component('DocsCodeGroup', DocsCodeGroup)
  app.component('DocsMermaid', defineAsyncComponent(() => import('@/components/docs/DocsMermaid.vue')))
}
