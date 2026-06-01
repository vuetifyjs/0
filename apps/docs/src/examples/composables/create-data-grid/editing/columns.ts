import type { DataGridColumnTicketInput } from '@vuetify/v0'
import type { Product } from './data'

export const columns: DataGridColumnTicketInput<Product>[] = [
  { id: 'name', title: 'Product', size: 28, minSize: 18, editable: true, validate: v => (typeof v === 'string' && v.length > 0) || 'Required' },
  { id: 'sku', title: 'SKU', size: 15, minSize: 10 },
  { id: 'price', title: 'Price', size: 15, minSize: 10, editable: true, validate: v => (Number(v) > 0) || 'Must be positive', sort: (a, b) => Number(a) - Number(b) },
  { id: 'quantity', title: 'Qty', size: 12, minSize: 8, editable: true, validate: v => (Number.isInteger(Number(v)) && Number(v) >= 0) || 'Must be 0+', sort: (a, b) => Number(a) - Number(b) },
  { id: 'category', title: 'Category', size: 30, minSize: 14, sortable: true },
]
