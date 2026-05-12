import type { DataGridColumn } from '@vuetify/v0'
import type { Schedule } from './data'

export const columns: DataGridColumn<Schedule>[] = [
  { key: 'department', title: 'Department', size: 18, minSize: 12 },
  { key: 'member', title: 'Team Member', size: 22, minSize: 14 },
  { key: 'mon', title: 'Mon', size: 12, minSize: 9 },
  { key: 'tue', title: 'Tue', size: 12, minSize: 9 },
  { key: 'wed', title: 'Wed', size: 12, minSize: 9 },
  { key: 'thu', title: 'Thu', size: 12, minSize: 9 },
  { key: 'fri', title: 'Fri', size: 12, minSize: 9 },
]
