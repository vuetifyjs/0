// Framework
import { createContext } from '@vuetify/v0'

// Types
import type { ID, RovingFocusReturn } from '@vuetify/v0'

export interface EmMenuTicket {
  id: ID
  el: () => Element | null | undefined
  disabled: () => boolean
}

export interface EmMenuContext {
  focus: RovingFocusReturn
  register: (ticket: EmMenuTicket) => () => void
}

export const [useMenuContext, provideMenuContext] = createContext<EmMenuContext | null>('emerald:menu', null)
