// Framework
import { createContext, isNull, useLogger } from '@vuetify/v0'

// Types
import type { Ref } from 'vue'

/**
 * The pattern page's three types. `temporary` opens above everything over a
 * scrim; `persistent` toggles beside the content at the content's elevation;
 * `permanent` is always open and cannot be closed.
 */
export type Md1NavigationDrawerType = 'temporary' | 'persistent' | 'permanent'

/** `start` is the left nav (right under `dir="rtl"`); `end` is the structure page's right nav. */
export type Md1NavigationDrawerSide = 'start' | 'end'

export interface Md1NavigationDrawerContext {
  /** The drawer element's id: the `<dialog>` (temporary) or the `<nav>` (the others). */
  id: Readonly<Ref<string>>
  type: Readonly<Ref<Md1NavigationDrawerType>>
  isOpen: Readonly<Ref<boolean>>
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Lives beside the parts rather than in `Md1NavigationDrawer.vue`: the root
 * imports `Md1NavigationDrawerActivator` to tell it apart from the drawer's
 * content, so the parts cannot import the root back.
 */
export const [useMd1NavigationDrawer, provideMd1NavigationDrawer] = createContext<Md1NavigationDrawerContext | null>('md1:navigation-drawer', null)

/**
 * Parts read the root through the optional context, so a part placed outside
 * `Md1NavigationDrawer` renders inert instead of throwing; the warning says why
 * nothing happens.
 */
export function orphan (part: string, context: Md1NavigationDrawerContext | null) {
  if (__DEV__ && isNull(context)) {
    useLogger().warn(`[${part}] rendered outside <Md1NavigationDrawer>; its state is inert`)
  }
}
