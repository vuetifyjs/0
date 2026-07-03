import type { DataGridColumnTicketInput } from '@vuetify/v0'
import type { Stock } from './data'

export const columns: DataGridColumnTicketInput<Stock>[] = [
  { id: 'ticker', title: 'Ticker', sortable: true, size: 10, minSize: 8, pinned: 'left' },
  { id: 'company', title: 'Company', sortable: true, filterable: true, size: 17, minSize: 12 },
  { id: 'price', title: 'Price', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { id: 'change', title: 'Change', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { id: 'volume', title: 'Volume', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { id: 'cap', title: 'Mkt Cap', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { id: 'pe', title: 'P/E', sortable: true, size: 8, minSize: 6, sort: (a, b) => Number(a) - Number(b) },
  { id: 'eps', title: 'EPS', sortable: true, size: 8, minSize: 6, sort: (a, b) => Number(a) - Number(b) },
  { id: 'dividend', title: 'Div %', sortable: true, size: 7, minSize: 6, sort: (a, b) => Number(a) - Number(b) },
  { id: 'sector', title: 'Sector', sortable: true, size: 10, minSize: 8, pinned: 'right' },
]
