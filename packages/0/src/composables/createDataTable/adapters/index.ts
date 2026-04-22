/**
 * @module createDataTable/adapters
 *
 * @remarks
 * Barrel for data table adapter exports. Provides the abstract base
 * class and concrete client, server, and virtual adapter strategies.
 */

export { DataTableAdapter } from './adapter'
export type { DataTableAdapterContext, DataTableAdapterInterface, DataTableAdapterResult, SortDirection, SortEntry } from './adapter'
export { ServerAdapter } from './server'
export type { ServerAdapterOptions } from './server'
export { ClientAdapter } from './v0'
export { VirtualAdapter } from './virtual'
