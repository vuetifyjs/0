import type { DataGridColumn } from '@vuetify/v0'
import type { Stock } from './data'

export const columns: DataGridColumn<Stock>[] = [
  { key: 'ticker', title: 'Ticker', sortable: true, size: 10, minSize: 8, pinned: 'left' },
  { key: 'company', title: 'Company', sortable: true, filterable: true, size: 17, minSize: 12 },
  { key: 'price', title: 'Price', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { key: 'change', title: 'Change', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { key: 'volume', title: 'Volume', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { key: 'cap', title: 'Mkt Cap', sortable: true, size: 10, minSize: 8, sort: (a, b) => Number(a) - Number(b) },
  { key: 'pe', title: 'P/E', sortable: true, size: 8, minSize: 6, sort: (a, b) => Number(a) - Number(b) },
  { key: 'eps', title: 'EPS', sortable: true, size: 8, minSize: 6, sort: (a, b) => Number(a) - Number(b) },
  { key: 'dividend', title: 'Div %', sortable: true, size: 7, minSize: 6, sort: (a, b) => Number(a) - Number(b) },
  { key: 'sector', title: 'Sector', sortable: true, size: 10, minSize: 8, pinned: 'right' },
]
