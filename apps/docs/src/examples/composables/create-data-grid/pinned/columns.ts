import type { DataGridColumn } from '@vuetify/v0'
import type { Employee } from './data'

export const columns: DataGridColumn<Employee>[] = [
  { key: 'name', title: 'Name', sortable: true, size: 20, pinned: 'left' },
  { key: 'email', title: 'Email', sortable: true, size: 25 },
  { key: 'department', title: 'Dept', sortable: true, size: 15 },
  { key: 'role', title: 'Role', sortable: true, size: 15 },
  { key: 'salary', title: 'Salary', sortable: true, size: 15, sort: (a, b) => Number(a) - Number(b) },
  { key: 'id', title: 'ID', size: 10, pinned: 'right' },
]
