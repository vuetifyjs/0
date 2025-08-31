import { createPinia } from 'pinia'
import { one } from '@vuetify/one'

const pinia = createPinia()

pinia.use(
  one(
    ['vzero'],
    import.meta.env.VITE_API_SERVER_URL,
  ),
)

export default pinia
