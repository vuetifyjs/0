/**
 * @module createDataGrid/adapters/server
 *
 * @remarks
 * `ServerGridAdapter` is an alias of `ServerDataTableAdapter`, re-exported for
 * grid import and docs continuity. The server is responsible for sort, filter,
 * and pagination.
 */

export { ServerDataTableAdapter as ServerGridAdapter, type ServerDataTableAdapterOptions as ServerGridAdapterOptions } from '#v0/composables/createDataTable'
