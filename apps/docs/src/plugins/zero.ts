import { createHydrationPlugin, createMarkdownPlugin } from '@vuetify/0'
import type { App } from 'vue'

export default function zero (app: App) {
  app.use(createHydrationPlugin())
  app.use(createMarkdownPlugin())
}
