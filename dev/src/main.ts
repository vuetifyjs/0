import { ViteSSG } from 'vite-ssg'

// Context
import App from './App.vue'
import CreateOverflowDemo from './CreateOverflowDemo.vue'
import EmeraldKitchenSink from './EmeraldKitchenSink.vue'
import Playground from './Playground.vue'

import 'virtual:uno.css'

import { registerPlugins } from './plugins'

export const createApp = ViteSSG(
  App,
  {
    routes: [
      { path: '/', component: Playground },
      { path: '/create-overflow', component: CreateOverflowDemo },
      { path: '/emerald', component: EmeraldKitchenSink },
    ],
  },
  async ({ app }) => {
    registerPlugins(app)
  })
