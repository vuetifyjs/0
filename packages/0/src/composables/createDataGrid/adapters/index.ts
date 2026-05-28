/**
 * @module createDataGrid/adapters
 *
 * @remarks
 * Barrel for grid adapter exports. The grid uses the standard data table
 * adapters; only the server re-export carries a grid-specific alias for
 * docs continuity.
 */

export type { DataTableAdapter, DataTableAdapterContext, DataTableAdapterResult, SortDirection, SortEntry } from './adapter'
export { ServerGridAdapter } from './server'
export type { ServerGridAdapterOptions } from './server'
