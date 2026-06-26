import type { DataTableColumnTicketInput } from '@vuetify/v0'
import type { User } from './data'

export const columns: DataTableColumnTicketInput<User>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'score', title: 'Score', sortable: true, sort: (a: unknown, b: unknown) => Number(a) - Number(b) },
]
