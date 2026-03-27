import { createCodexPlugin } from '@paper/codex'

import App from './App.vue'

// Utilities
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './registry'
import 'uno.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./pages/index.vue') },
    { path: '/getting-started', component: () => import('./pages/getting-started.vue') },
    { path: '/:ds', component: () => import('./pages/[ds].vue') },
    { path: '/:ds/tokens', component: () => import('./pages/[ds]/tokens.vue') },
    { path: '/:ds/components', component: () => import('./pages/[ds]/components.vue') },
    { path: '/:ds/components/:component', component: () => import('./pages/[ds]/components/[component].vue') },
    { path: '/:ds/:section', component: () => import('./pages/[ds]/[section].vue') },
  ],
})

const app = createApp(App)
app.use(createCodexPlugin())
app.use(router)
app.mount('#app')
