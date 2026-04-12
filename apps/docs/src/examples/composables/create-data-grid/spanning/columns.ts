import type { DataGridColumn } from '@vuetify/v0'
import type { Employee } from './data'

export const columns: DataGridColumn<Employee>[] = [
  { key: 'department', title: 'Department', size: 30 },
  { key: 'name', title: 'Name', size: 40 },
  { key: 'role', title: 'Role', size: 30 },
]
