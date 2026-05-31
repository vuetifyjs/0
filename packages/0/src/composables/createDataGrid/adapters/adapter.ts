/**
 * @module createDataGrid/adapters
 *
 * @remarks
 * Grid adapter types. The grid reuses the DataTable adapter types verbatim;
 * row ordering is applied in createDataGrid's items projection (index.ts),
 * not in the adapter.
 */

export type {
  DataTableAdapter,
  DataTableAdapterContext,
  DataTableAdapterResult,
  SortDirection,
  SortEntry,
} from '#v0/composables/createDataTable'
