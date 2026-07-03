import type { DataTableColumnTicketInput } from '@vuetify/v0'
import type { User } from './data'

export const columns: DataTableColumnTicketInput<User>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'role', title: 'Role', sortable: true },
]
