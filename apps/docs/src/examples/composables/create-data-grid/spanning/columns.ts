import type { DataGridColumn } from '@vuetify/v0'
import type { Schedule } from './data'

export const columns: DataGridColumn<Schedule>[] = [
  { id: 'department', title: 'Department', size: 18, minSize: 12 },
  { id: 'member', title: 'Team Member', size: 22, minSize: 14 },
  { id: 'mon', title: 'Mon', size: 12, minSize: 9 },
  { id: 'tue', title: 'Tue', size: 12, minSize: 9 },
  { id: 'wed', title: 'Wed', size: 12, minSize: 9 },
  { id: 'thu', title: 'Thu', size: 12, minSize: 9 },
  { id: 'fri', title: 'Fri', size: 12, minSize: 9 },
]
