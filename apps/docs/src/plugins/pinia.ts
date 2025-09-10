import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'

const pinia = createPinia()

export function one (id: string[], url: string) {
  return function (context: PiniaPluginContext) {
    const store = context.store

    store.url = url

    if (store.$id !== 'site') {
      return
    }

    store.id = id
  }
}

pinia.use(
  one(
    ['vzero'],
    import.meta.env.VITE_API_SERVER_URL,
  ),
)

export default pinia
