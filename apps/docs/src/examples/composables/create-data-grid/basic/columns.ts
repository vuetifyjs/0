import type { DataGridColumn } from '@vuetify/v0'
import type { Project } from './data'

export const columns: DataGridColumn<Project>[] = [
  { key: 'name', title: 'Project', sortable: true, filterable: true, size: 28, minSize: 18, pinned: 'left', editable: true, validate: v => (typeof v === 'string' && v.length > 0) || 'Required' },
  { key: 'status', title: 'Status', sortable: true, size: 14, minSize: 10 },
  { key: 'assignee', title: 'Assignee', sortable: true, filterable: true, size: 20, minSize: 12 },
  { key: 'progress', title: 'Progress', sortable: true, size: 16, minSize: 10, sort: (a, b) => Number(a) - Number(b) },
  { key: 'budget', title: 'Budget', sortable: true, size: 12, minSize: 8, sort: (a, b) => Number(a) - Number(b), editable: true, validate: v => (Number(v) > 0) || 'Must be positive' },
  { key: 'due', title: 'Due', sortable: true, size: 10, minSize: 7 },
]
