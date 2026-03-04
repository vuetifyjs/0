import { createContext, createSelection } from '@vuetify/v0'
import type { ID, SelectionContext, SelectionTicket, SelectionTicketInput } from '@vuetify/v0'
import type { ComputedRef, Reactive } from 'vue'

export interface BookmarkInput extends SelectionTicketInput<string> {
  url: string
  tags: string[]
  disabled?: boolean
}

export type BookmarkTicket = SelectionTicket<BookmarkInput> & BookmarkInput

export interface BookmarkContext extends SelectionContext<BookmarkInput, BookmarkTicket> {
  pinnedIds: Reactive<Set<ID>>
  stats: ComputedRef<{ total: number, selected: number, pinned: number }>
  add: (title: string, url: string, tags?: string[]) => BookmarkTicket
  pin: (id: ID) => void
  unpin: (id: ID) => void
  pinned: (id: ID) => boolean
}

export const [useBookmarks, provideBookmarks] = createContext<BookmarkContext>('v0:bookmarks')

export function createBookmarks () {
  return createSelection<BookmarkInput, BookmarkTicket>({ multiple: true, events: true })
}
