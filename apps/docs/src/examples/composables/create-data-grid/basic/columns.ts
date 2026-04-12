import type { DataGridColumn } from '@vuetify/v0'
import type { Project } from './data'

export const columns: DataGridColumn<Project>[] = [
  { key: 'name', title: 'Project', sortable: true, filterable: true, size: 22 },
  { key: 'status', title: 'Status', sortable: true, size: 12 },
  { key: 'priority', title: 'Priority', sortable: true, size: 12 },
  { key: 'assignee', title: 'Assignee', sortable: true, filterable: true, size: 16 },
  { key: 'progress', title: 'Progress', sortable: true, size: 14, sort: (a, b) => Number(a) - Number(b) },
  { key: 'due', title: 'Due Date', sortable: true, size: 14 },
  { key: 'budget', title: 'Budget', sortable: true, size: 10, sort: (a, b) => Number(a) - Number(b) },
]
