import App from './App.vue'
import { registerPlugins } from './plugins'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import { ViteSSG } from 'vite-ssg'
import routerOptions from './plugins/router'
import pinia from './plugins/pinia'

export const createApp = ViteSSG(
  App,
  routerOptions,
  ({ app, router, initialState }) => {
    registerPlugins(app)

    app.use(pinia)

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
  {
    hydration: !import.meta.env.DEV,
    transformState (state) {
      if (import.meta.env.DEV || import.meta.env.SSR) {
        return JSON.stringify({})
      }

      return state
    },
  },
)
