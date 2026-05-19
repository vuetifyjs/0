import { createGenesisPlugin } from '@paper/genesis'
import { ViteSSG } from 'vite-ssg'

// Context
import App from './App.vue'
import Playground from './Playground.vue'

import 'virtual:uno.css'

import { registerPlugins } from './plugins'

export const createApp = ViteSSG(
  App,
  { routes: [{ path: '/', component: Playground }] },
  async ({ app }) => {
    registerPlugins(app)
    app.use(createGenesisPlugin({
      theme: { target: 'body', default: 'genesis-dark' },
    }))
  })
