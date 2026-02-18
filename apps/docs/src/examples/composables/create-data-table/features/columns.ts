import type { DataTableColumn } from '@vuetify/v0'
import type { Employee } from './data'

export const columns: DataTableColumn<Employee>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true },
  { key: 'department', title: 'Department', sortable: true },
  {
    key: 'salary',
    title: 'Salary',
    sortable: true,
    filterable: true,
    sort: (a: unknown, b: unknown) => Number(a) - Number(b),
    filter: (value: unknown, query: string) => {
      const num = Number(value)
      if (query.startsWith('>')) return num > Number(query.slice(1))
      if (query.startsWith('<')) return num < Number(query.slice(1))
      return String(value).includes(query)
    },
  },
  { key: 'active', title: 'Status', sortable: true },
]
