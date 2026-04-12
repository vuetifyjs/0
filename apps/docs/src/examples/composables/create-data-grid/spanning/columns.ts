import type { DataGridColumn } from '@vuetify/v0'
import type { Schedule } from './data'

export const columns: DataGridColumn<Schedule>[] = [
  { key: 'department', title: 'Department', size: 18 },
  { key: 'member', title: 'Team Member', size: 22 },
  { key: 'mon', title: 'Mon', size: 12 },
  { key: 'tue', title: 'Tue', size: 12 },
  { key: 'wed', title: 'Wed', size: 12 },
  { key: 'thu', title: 'Thu', size: 12 },
  { key: 'fri', title: 'Fri', size: 12 },
]
