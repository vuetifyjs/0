/**
 * @module createDataGrid/adapters
 *
 * @remarks
 * Barrel for grid adapter exports. Each grid adapter extends the
 * corresponding DataTable adapter to insert row ordering between
 * sort and pagination.
 */

export type { DataTableAdapterContext, DataTableAdapterInterface, DataTableAdapterResult, SortDirection, SortEntry } from './adapter'
export { ClientGridAdapter } from './client'
export { ServerGridAdapter } from './server'
export type { ServerGridAdapterOptions } from './server'
export { VirtualGridAdapter } from './virtual'
