import type { DataGridColumn } from '@vuetify/v0'
import type { User } from './data'

export const columns: DataGridColumn<User>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true, size: 30 },
  { key: 'email', title: 'Email', sortable: true, filterable: true, size: 40, editable: true },
  { key: 'role', title: 'Role', sortable: true, size: 15 },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    size: 15,
    sort: (a, b) => Number(a) - Number(b),
  },
]
