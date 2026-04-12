import type { DataGridColumn } from '@vuetify/v0'
import type { Product } from './data'

export const columns: DataGridColumn<Product>[] = [
  { key: 'name', title: 'Product', size: 28, editable: true, validate: v => (typeof v === 'string' && v.length > 0) || 'Required' },
  { key: 'sku', title: 'SKU', size: 15 },
  { key: 'price', title: 'Price', size: 15, editable: true, validate: v => (Number(v) > 0) || 'Must be positive', sort: (a, b) => Number(a) - Number(b) },
  { key: 'quantity', title: 'Qty', size: 12, editable: true, validate: v => (Number.isInteger(Number(v)) && Number(v) >= 0) || 'Must be 0+', sort: (a, b) => Number(a) - Number(b) },
  { key: 'category', title: 'Category', size: 30, sortable: true },
]
