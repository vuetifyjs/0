import { ViteSSG } from 'vite-ssg'

// Context
import App from './App.vue'
import CreateOverflowDemo from './CreateOverflowDemo.vue'
import Playground from './Playground.vue'

import 'virtual:uno.css'
// Onyx redesign (direction-a.md §4.1) — display/body/utility faces.
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/instrument-sans/index.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import { registerPlugins } from './plugins'

export const createApp = ViteSSG(
  App,
  {
    routes: [
      { path: '/', component: Playground },
      { path: '/create-overflow', component: CreateOverflowDemo },
      { path: '/onyx/:page?', component: () => import('./onyx/OnyxDocs.vue') },
    ],
  },
  async ({ app }) => {
    registerPlugins(app)
  })
