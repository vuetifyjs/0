import { ViteSSG } from 'vite-ssg'

// Components
import App from './App.vue'
import EmeraldKitchenSink from './EmeraldKitchenSink.vue'
import Playground from './Playground.vue'

import 'virtual:uno.css'

import { registerPlugins } from './plugins'

export const createApp = ViteSSG(
  App,
  {
    routes: [
      { path: '/', component: Playground },
      { path: '/emerald', component: EmeraldKitchenSink },
    ],
  },
  async ({ app }) => {
    registerPlugins(app)
  })
