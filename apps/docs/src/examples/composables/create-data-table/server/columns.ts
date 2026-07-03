import type { DataTableColumnTicketInput } from '@vuetify/v0'
import type { User } from './api'

export const columns: DataTableColumnTicketInput<User>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'department', title: 'Department', sortable: true },
]
