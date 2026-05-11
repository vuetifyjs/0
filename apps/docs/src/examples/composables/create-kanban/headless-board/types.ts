import type { KanbanColumnTicketInput, SortableTicketInput } from '@vuetify/v0'

export interface Card extends SortableTicketInput {
  value: { title: string, assignee: string }
}

export interface Column extends KanbanColumnTicketInput<Card> {
  value: { title: string, tone: string }
}
