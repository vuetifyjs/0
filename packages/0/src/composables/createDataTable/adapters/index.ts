/**
 * @module createDataTable/adapters
 *
 * @remarks
 * Barrel for data table adapter exports. Provides the abstract base
 * class and concrete client, server, and virtual adapter strategies.
 */

export { DataTableAdapter } from './adapter'
export type { DataTableAdapterContext, DataTableAdapterResult, SortDirection, SortEntry } from './adapter'
export { ServerDataTableAdapter } from './server'
export type { ServerDataTableAdapterOptions } from './server'
export { ClientDataTableAdapter } from './v0'
export { VirtualDataTableAdapter } from './virtual'
