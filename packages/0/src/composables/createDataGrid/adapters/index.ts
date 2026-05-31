/**
 * @module createDataGrid/adapters
 *
 * @remarks
 * Barrel for grid adapter exports. The grid reuses the standard DataTable
 * adapters verbatim; only the server re-export carries a grid-specific alias
 * for docs continuity. Row ordering is applied in createDataGrid's items
 * projection (index.ts), not in any adapter.
 */

export type { DataTableAdapter, DataTableAdapterContext, DataTableAdapterResult, SortDirection, SortEntry } from './adapter'
export { ServerGridAdapter } from './server'
export type { ServerGridAdapterOptions } from './server'
