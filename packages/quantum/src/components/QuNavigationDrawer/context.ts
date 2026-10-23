// Framework
import { createContext, isNull, useLogger } from '@vuetify/v0'

// Types
import type { Ref } from 'vue'

/**
 * The pattern page's three types. `temporary` opens above everything over a
 * scrim; `persistent` toggles beside the content at the content's elevation;
 * `permanent` is always open and cannot be closed.
 */
export type QuNavigationDrawerType = 'temporary' | 'persistent' | 'permanent'

/** `start` is the left nav (right under `dir="rtl"`); `end` is the structure page's right nav. */
export type QuNavigationDrawerSide = 'start' | 'end'

export interface QuNavigationDrawerContext {
  /** The drawer element's id: the `<dialog>` (temporary) or the `<nav>` (the others). */
  id: Readonly<Ref<string>>
  type: Readonly<Ref<QuNavigationDrawerType>>
  isOpen: Readonly<Ref<boolean>>
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Lives beside the parts rather than in `QuNavigationDrawer.vue`: the root
 * imports `QuNavigationDrawerActivator` to tell it apart from the drawer's
 * content, so the parts cannot import the root back.
 */
export const [useQuNavigationDrawer, provideQuNavigationDrawer] = createContext<QuNavigationDrawerContext | null>('quantum:navigation-drawer', null)

/**
 * Parts read the root through the optional context, so a part placed outside
 * `QuNavigationDrawer` renders inert instead of throwing; the warning says why
 * nothing happens.
 */
export function orphan (part: string, context: QuNavigationDrawerContext | null) {
  if (__DEV__ && isNull(context)) {
    useLogger().warn(`[${part}] rendered outside <QuNavigationDrawer>; its state is inert`)
  }
}
