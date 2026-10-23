// Framework
import { createContext, isNull, useLogger } from '@vuetify/v0'

// Types
import type { ID, SelectionContext, SelectionTicket, SelectionTicketInput } from '@vuetify/v0'
import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * `none` is a plain or navigation list: the tiles are links or buttons and
 * the model, when bound, names the current destination. `single` and
 * `multiple` make the list a listbox of options (the selection pattern).
 */
export type QuListSelect = 'none' | 'single' | 'multiple'

/** The lists page's three tile types: one, two or three lines of text. */
export type QuListLines = 1 | 2 | 3

export interface QuListTicketInput extends SelectionTicketInput {
  /** The tile element: roving focus walks the options in document order. */
  el?: MaybeRefOrGetter<HTMLElement | null | undefined>
}

export type QuListTicket = SelectionTicket<QuListTicketInput>

export interface QuListContext {
  dense: Readonly<Ref<boolean>>
  lines: Readonly<Ref<QuListLines>>
  select: Readonly<Ref<QuListSelect>>
  selection: SelectionContext<QuListTicketInput, QuListTicket>
  /** False until the root has mounted: the tiles present at mount play the staggered entrance, later ones do not. */
  entered: Readonly<Ref<boolean>>
  /** Whether the option is the listbox's one tab stop. */
  tabbable: (id: ID) => boolean
  /** Records the option that took focus, so Tab returns to it. */
  focus: (id: ID) => void
}

export interface QuListItemContext {
  selected: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
}

/**
 * Lives beside the parts rather than in `QuList.vue`: `QuListItem` imports
 * `QuListAction` to render it outside the tile, so the parts cannot import
 * their parents back.
 */
export const [useQuList, provideQuList] = createContext<QuListContext | null>('quantum:list', null)

export const [useQuListItem, provideQuListItem] = createContext<QuListItemContext | null>('quantum:list-item', null)

/**
 * Parts read their parent through an optional context, so a part placed
 * outside it renders inert instead of throwing; the warning says why.
 */
export function orphan (part: string, parent: string, context: unknown) {
  if (__DEV__ && isNull(context)) {
    useLogger().warn(`[${part}] rendered outside <${parent}>; its state is inert`)
  }
}
