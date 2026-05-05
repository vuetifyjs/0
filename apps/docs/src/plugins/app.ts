// Utilities
import { defineAsyncComponent } from 'vue'

// Types
import type { App } from 'vue'

export default function app (app: App) {
  app.component('DocsPageFeatures', defineAsyncComponent(() => import('@/components/docs/meta/DocsPageFeatures.vue')))
  app.component('DocsNavigator', defineAsyncComponent(() => import('@/components/docs/DocsNavigator.vue')))
  app.component('DocsExample', defineAsyncComponent(() => import('@/components/docs/DocsExample.vue')))
  app.component('DocsCodeGroup', defineAsyncComponent(() => import('@/components/docs/DocsCodeGroup.vue')))
  app.component('DocsMermaid', defineAsyncComponent(() => import('@/components/docs/DocsMermaid.vue')))
}
