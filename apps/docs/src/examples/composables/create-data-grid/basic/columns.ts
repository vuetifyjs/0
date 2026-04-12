import type { DataGridColumn } from '@vuetify/v0'
import type { Employee } from './data'

export const columns: DataGridColumn<Employee>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true, size: 25 },
  { key: 'email', title: 'Email', sortable: true, filterable: true, size: 30 },
  { key: 'department', title: 'Department', sortable: true, size: 20 },
  { key: 'role', title: 'Role', sortable: true, size: 15 },
  { key: 'salary', title: 'Salary', sortable: true, size: 10, sort: (a, b) => Number(a) - Number(b) },
]
