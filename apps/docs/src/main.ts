import { ViteSSG } from 'vite-ssg'

// Components
import App from './App.vue'

import { registerPlugins } from './plugins'
import pinia from './plugins/pinia'
import routerOptions from './plugins/router'
import { useAppStore } from './stores/app'
import 'virtual:uno.css'

export const createApp = ViteSSG(
  App,
  routerOptions,
  async ({ app, router, initialState }) => {
    app.use(pinia)

    registerPlugins(app)

    // Load nav data
    const appStore = useAppStore(pinia)
    await appStore.loadNav()

    if (import.meta.env.SSR)
      initialState.pinia = pinia.state.value
    else
      pinia.state.value = initialState.pinia || {}

    if (!import.meta.env.SSR) {
      // Workaround for https://github.com/vitejs/vite/issues/11804
      router.onError((err, to) => {
        if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
          if (localStorage.getItem('vuetify:dynamic-reload')) {
            console.error('Dynamic import error, reloading page did not fix it', err)
          } else {
            console.log('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
          }
        } else {
          console.error(err)
        }
      })

      router.isReady().then(() => {
        localStorage.removeItem('vuetify:dynamic-reload')
      })
    }
  },
)
