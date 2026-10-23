// Framework
import { createContext, isNull, useLogger } from '@vuetify/v0'

// Types
import type { Ref } from 'vue'

/** `list` lays `Item` children out as 48 dp rows; `grid` as 48 dp icon tiles with labels. */
export type Md1BottomSheetLayout = 'list' | 'grid'

export interface Md1BottomSheetContext {
  /** The sheet element's id: the `<dialog>` (modal) or the `<aside>` (persistent). */
  id: Readonly<Ref<string>>
  /** The id the `Title` part renders, so a persistent sheet can name its landmark. */
  titleId: Readonly<Ref<string>>
  persistent: Readonly<Ref<boolean>>
  layout: Readonly<Ref<Md1BottomSheetLayout>>
  isOpen: Readonly<Ref<boolean>>
  isExpanded: Readonly<Ref<boolean>>
  open: () => void
  close: () => void
  toggle: () => void
  /** A `Title` announces itself; the returned function withdraws it. */
  label: () => () => void
}

/**
 * Lives beside the parts rather than in `Md1BottomSheet.vue`: the root imports
 * `Md1BottomSheetActivator` to tell it apart from the sheet's content, so the
 * parts cannot import the root back.
 */
export const [useMd1BottomSheet, provideMd1BottomSheet] = createContext<Md1BottomSheetContext | null>('md1:bottom-sheet', null)

/**
 * Parts read the root through the optional context, so a part placed outside
 * `Md1BottomSheet` renders inert instead of throwing; the warning says why
 * nothing happens.
 */
export function orphan (part: string, context: Md1BottomSheetContext | null) {
  if (__DEV__ && isNull(context)) {
    useLogger().warn(`[${part}] rendered outside <Md1BottomSheet>; its state is inert`)
  }
}
