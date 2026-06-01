import type { DataGridColumnTicketInput } from '@vuetify/v0'
import type { Holding } from './data'

export const columns: DataGridColumnTicketInput<Holding>[] = [
  { id: 'account', title: 'Account', size: 20, minSize: 14 },
  { id: 'assetClass', title: 'Asset Class', size: 16, minSize: 10 },
  { id: 'ticker', title: 'Ticker', size: 10, minSize: 8 },
  { id: 'name', title: 'Holding', size: 26, minSize: 14 },
  { id: 'value', title: 'Value', size: 16, minSize: 10 },
  { id: 'change', title: 'Today', size: 12, minSize: 8 },
]
