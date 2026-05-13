import type { DataTableColumnTicketInput } from '@vuetify/v0'
import type { Employee } from './data'

export const columns: DataTableColumnTicketInput<Employee>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true },
  { id: 'department', title: 'Department', sortable: true },
  {
    id: 'salary',
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
  { id: 'active', title: 'Status', sortable: true },
]
