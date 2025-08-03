import { createContext } from '@vuetify/0'
import type { ShallowRef } from 'vue'

export const [useAppContext, provideAppContext] = createContext<{
  nav: ShallowRef<boolean>
}>('v0:app')
