// Framework
import { createContext } from '@vuetify/v0'

// Types
import type {
  DragDropContext,
  ID,
  KanbanColumnTicketInput,
  KanbanContext,
  SortableTicket,
  SortableTicketInput,
} from '@vuetify/v0'
import type { Ref } from 'vue'

export type EmKanbanTone = 'neutral' | 'primary' | 'secondary' | 'info' | 'alert' | 'danger'

export type EmKanbanCardTicketInput<T = unknown> = SortableTicketInput<T>

export type EmKanbanCardTicket<T = unknown> = SortableTicket<EmKanbanCardTicketInput<T>>

export interface EmKanbanColumnValue {
  title: string
  note?: string
  tone?: EmKanbanTone
}

export type EmKanbanColumnTicketInput = KanbanColumnTicketInput<EmKanbanCardTicketInput, EmKanbanColumnValue>

export type EmKanbanKanbanContext = KanbanContext<EmKanbanCardTicketInput, EmKanbanColumnTicketInput>

export interface EmKanbanDrag {
  type: 'card'
  value: unknown
}

export interface EmKanbanMovePayload {
  id: ID
  from: ID
  to: ID
  fromIndex: number
  toIndex: number
}

/** Board-wide seam shared by the root, its columns, and the internal cards. */
export interface EmKanbanContext {
  kanban: EmKanbanKanbanContext
  dnd: DragDropContext<EmKanbanDrag>
  disabled: Readonly<Ref<boolean>>
  /** Id of the root's visually hidden keyboard-instructions node. */
  instructions: string
  /** Card id that a keyboard drop just landed, so its remounted surface can take focus back. */
  dropped: Ref<ID | null>
  announce: (message: string) => void
  move: (payload: EmKanbanMovePayload) => void
  /** Column id and index a card currently sits at, or `null` when the board has no such card. */
  locate: (id: ID) => { column: ID, index: number } | null
}

export const EM_KANBAN_NAMESPACE = 'emerald:kanban'

export const [useEmKanbanContext, provideEmKanbanContext] = createContext<EmKanbanContext>()
