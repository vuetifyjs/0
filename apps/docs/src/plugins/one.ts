// Styles
import '@vuetify/one/styles'

// Plugins
import { createOne } from '@vuetify/one'

// Types
import type { App } from 'vue'

export default function one (app: App) {
  return app.use(createOne())
}
