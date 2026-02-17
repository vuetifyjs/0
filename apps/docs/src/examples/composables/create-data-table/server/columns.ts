import type { DataTableColumn } from '@vuetify/v0'

export const columns: DataTableColumn[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true },
  { key: 'email', title: 'Email', sortable: true, filterable: true },
  { key: 'department', title: 'Department', sortable: true },
]
