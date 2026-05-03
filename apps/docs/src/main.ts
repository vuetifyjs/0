import { ViteSSG } from 'vite-ssg'
import { handleHotUpdate } from 'vue-router/auto-routes'

// Framework
import { useLogger } from '@vuetify/v0'

// Context
import App from './App.vue'

// Composables
import { useIdleCallback } from './composables/useIdleCallback'

import { registerPlugins } from './plugins'
import pinia from './plugins/pinia'
import routerOptions from './plugins/router'
import './styles/tokens.css'
import './styles/transitions.css'
import 'virtual:uno.css'

export const createApp = ViteSSG(
  App,
  routerOptions,
  async ({ app, router, initialState }) => {
    // Register router for HMR so vue-router/auto-routes doesn't hit the
    // broken invalidate() path (Vite 8 virtual module regression). Force
    // full reload in callback because setupLayouts wraps routes at build
    // time — in-place HMR replacement bypasses layouts, losing contexts.
    if (import.meta.hot) {
      handleHotUpdate(router, () => window.location.reload())
    }

    app.use(pinia)

    registerPlugins(app)

    if (import.meta.env.SSR)
      initialState.pinia = pinia.state.value
    else
      pinia.state.value = initialState.pinia || {}

    if (!import.meta.env.SSR) {
      const { useAuthStore } = await import('@vuetify/auth')
      useAuthStore().verify()

      const logger = useLogger()

      // Reload on chunk load failures (stale cache after deploy)
      window.addEventListener('vite:preloadError', () => {
        window.location.reload()
      })

      // Workaround for https://github.com/vitejs/vite/issues/11804
      router.onError((err, to) => {
        if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
          if (localStorage.getItem('vuetify:dynamic-reload')) {
            logger.error('Dynamic import error, reloading page did not fix it', err)
          } else {
            logger.info('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
          }
        } else {
          logger.error('Router error', err)
        }
      })

      router.isReady().then(() => {
        localStorage.removeItem('vuetify:dynamic-reload')

        // Preload Shiki highlighter on idle to avoid lag on first "Show Code" click
        useIdleCallback(async () => {
          const { useHighlighter } = await import('./composables/useHighlighter')
          useHighlighter().getHighlighter()
        })
      })
    }
  },
)
