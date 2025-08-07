import { createContext } from '@vuetify/v0'
import type { ShallowRef } from 'vue'

export const [useAppContext, provideAppContext] = createContext<{
  nav: ShallowRef<boolean>
}>('v0:app')
