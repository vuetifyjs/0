// Framework
import { createContext, isNull, useLogger } from '@vuetify/v0'

// Types
import type { Ref } from 'vue'

/** `list` lays `Item` children out as 48 dp rows; `grid` as 48 dp icon tiles with labels. */
export type QuBottomSheetLayout = 'list' | 'grid'

export interface QuBottomSheetContext {
  /** The sheet element's id: the `<dialog>` (modal) or the `<aside>` (persistent). */
  id: Readonly<Ref<string>>
  /** The id the `Title` part renders, so a persistent sheet can name its landmark. */
  titleId: Readonly<Ref<string>>
  persistent: Readonly<Ref<boolean>>
  layout: Readonly<Ref<QuBottomSheetLayout>>
  isOpen: Readonly<Ref<boolean>>
  isExpanded: Readonly<Ref<boolean>>
  open: () => void
  close: () => void
  toggle: () => void
  /** A `Title` announces itself; the returned function withdraws it. */
  label: () => () => void
}

/**
 * Lives beside the parts rather than in `QuBottomSheet.vue`: the root imports
 * `QuBottomSheetActivator` to tell it apart from the sheet's content, so the
 * parts cannot import the root back.
 */
export const [useQuBottomSheet, provideQuBottomSheet] = createContext<QuBottomSheetContext | null>('quantum:bottom-sheet', null)

/**
 * Parts read the root through the optional context, so a part placed outside
 * `QuBottomSheet` renders inert instead of throwing; the warning says why
 * nothing happens.
 */
export function orphan (part: string, context: QuBottomSheetContext | null) {
  if (__DEV__ && isNull(context)) {
    useLogger().warn(`[${part}] rendered outside <QuBottomSheet>; its state is inert`)
  }
}
