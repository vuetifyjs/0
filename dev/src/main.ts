import { ViteSSG } from 'vite-ssg'

// Context
import App from './App.vue'
import CreateOverflowDemo from './CreateOverflowDemo.vue'
import EmeraldContact from './EmeraldContact.vue'
import EmeraldDashboard from './EmeraldDashboard.vue'
import EmeraldFaqs from './EmeraldFaqs.vue'
import EmeraldFeatures from './EmeraldFeatures.vue'
import EmeraldKitchenSink from './EmeraldKitchenSink.vue'
import EmeraldSignIn from './EmeraldSignIn.vue'
import Playground from './Playground.vue'

import 'virtual:uno.css'

import { registerPlugins } from './plugins'

export const createApp = ViteSSG(
  App,
  {
    routes: [
      { path: '/', component: Playground },
      { path: '/create-overflow', component: CreateOverflowDemo },
      { path: '/emerald', component: EmeraldDashboard },
      { path: '/emerald/contact', component: EmeraldContact },
      { path: '/emerald/sign-in', component: EmeraldSignIn },
      { path: '/emerald/faqs', component: EmeraldFaqs },
      { path: '/emerald/features', component: EmeraldFeatures },
      { path: '/emerald/sink', component: EmeraldKitchenSink },
    ],
  },
  async ({ app }) => {
    registerPlugins(app)
  })
