import type { DataGridColumn } from '@vuetify/v0'
import type { Employee } from './data'

export const columns: DataGridColumn<Employee>[] = [
  { key: 'name', title: 'Name', size: 25, editable: true, validate: v => (typeof v === 'string' && v.length > 0) || 'Name is required' },
  { key: 'email', title: 'Email', size: 30, editable: true, validate: v => (typeof v === 'string' && v.includes('@')) || 'Invalid email' },
  { key: 'department', title: 'Dept', size: 20 },
  { key: 'role', title: 'Role', size: 15 },
  { key: 'salary', title: 'Salary', size: 10 },
]
