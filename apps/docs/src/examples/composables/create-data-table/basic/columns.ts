import type { DataTableColumn } from '@vuetify/v0'
import type { User } from './data'

export const columns: DataTableColumn<User>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true },
  { key: 'email', title: 'Email', sortable: true, filterable: true },
  { key: 'role', title: 'Role', sortable: true },
]
