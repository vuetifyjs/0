import App from './App.vue'

// Utilities
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createHelixPlugin } from '../src'
import 'virtual:uno.css'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: App }],
})

const app = createApp(App)
app.use(createHelixPlugin())
app.use(router)
app.mount('#app')
