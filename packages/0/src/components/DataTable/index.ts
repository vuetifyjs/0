/**
 * @module DataTable
 *
 * @see https://0.vuetifyjs.com/components/data/data-table
 *
 * @remarks
 * Headless compound component for rendering tabular data. Built on
 * `createDataTable` composable. Provides semantic table structure
 * with sorting, pagination, selection, and expansion support.
 */

export { default as DataTableBody } from './DataTableBody.vue'
export { default as DataTableCell } from './DataTableCell.vue'
export { default as DataTableEmpty } from './DataTableEmpty.vue'
export { default as DataTableHead } from './DataTableHead.vue'
export { default as DataTableHeaderCell } from './DataTableHeaderCell.vue'
export { default as DataTableHeaderRow } from './DataTableHeaderRow.vue'
export { provideDataTableRoot, useDataTableRoot } from './DataTableRoot.vue'
export { default as DataTableRoot } from './DataTableRoot.vue'
export { default as DataTableRow } from './DataTableRow.vue'
export { default as DataTableTable } from './DataTableTable.vue'

export type { DataTableBodyProps, DataTableBodySlotProps } from './DataTableBody.vue'
export type { DataTableCellProps, DataTableCellSlotProps } from './DataTableCell.vue'
export type { DataTableEmptyProps, DataTableEmptySlotProps } from './DataTableEmpty.vue'
export type { DataTableHeadProps, DataTableHeadSlotProps } from './DataTableHead.vue'
export type { DataTableHeaderCellProps, DataTableHeaderCellSlotProps } from './DataTableHeaderCell.vue'
export type { DataTableHeaderRowProps, DataTableHeaderRowSlotProps } from './DataTableHeaderRow.vue'
export type { DataTableRootProps, DataTableRootSlotProps } from './DataTableRoot.vue'
export type { DataTableRowProps, DataTableRowSlotProps } from './DataTableRow.vue'
export type { DataTableTableProps, DataTableTableSlotProps } from './DataTableTable.vue'

// Context
import Body from './DataTableBody.vue'
import Cell from './DataTableCell.vue'
import Empty from './DataTableEmpty.vue'
import Head from './DataTableHead.vue'
import HeaderCell from './DataTableHeaderCell.vue'
import HeaderRow from './DataTableHeaderRow.vue'
import Root from './DataTableRoot.vue'
import Row from './DataTableRow.vue'
import Table from './DataTableTable.vue'

/**
 * DataTable compound component for rendering tabular data.
 *
 * @see https://0.vuetifyjs.com/components/data/data-table
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { DataTable } from '@vuetify/v0'
 *
 *   const users = [
 *     { id: 1, name: 'Alice', email: 'alice@test.com' },
 *     { id: 2, name: 'Bob', email: 'bob@test.com' },
 *   ]
 * </script>
 *
 * <template>
 *   <DataTable.Root v-slot="{ context }">
 *     <DataTable.Table>
 *       <DataTable.Head>
 *         <DataTable.HeaderRow>
 *           <DataTable.HeaderCell column-id="name">Name</DataTable.HeaderCell>
 *           <DataTable.HeaderCell column-id="email">Email</DataTable.HeaderCell>
 *         </DataTable.HeaderRow>
 *       </DataTable.Head>
 *
 *       <DataTable.Body v-slot="{ items }">
 *         <DataTable.Row v-for="item in items" :key="item.id" :row-id="item.id">
 *           <DataTable.Cell>{{ item.name }}</DataTable.Cell>
 *           <DataTable.Cell>{{ item.email }}</DataTable.Cell>
 *         </DataTable.Row>
 *
 *         <DataTable.Empty>
 *           <DataTable.Cell :colspan="2">No data available</DataTable.Cell>
 *         </DataTable.Empty>
 *       </DataTable.Body>
 *     </DataTable.Table>
 *   </DataTable.Root>
 * </template>
 * ```
 */
export const DataTable = {
  /**
   * Root component that creates and provides the createDataTable context.
   * Pure provider — renders only its slot content.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Root v-slot="{ context }">
   *   <!-- Access context.columns.onboard, context.onboard, etc. -->
   * </DataTable.Root>
   * ```
   */
  Root,
  /**
   * The `<table>` element wrapper with ARIA table role and rowcount.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Table>
   *   <DataTable.Head />
   *   <DataTable.Body />
   * </DataTable.Table>
   * ```
   */
  Table,
  /**
   * The `<thead>` element wrapper. Exposes the 2D header grid.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Head v-slot="{ headers }">
   *   <DataTable.HeaderRow v-for="(row, i) in headers" :key="i">
   *     <DataTable.HeaderCell
   *       v-for="header in row"
   *       :key="header.id"
   *       :column-id="header.id"
   *     >
   *       {{ header.title }}
   *     </DataTable.HeaderCell>
   *   </DataTable.HeaderRow>
   * </DataTable.Head>
   * ```
   */
  Head,
  /**
   * A `<tr>` element for header rows.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   */
  HeaderRow,
  /**
   * A `<th>` element for header cells with sort state and controls.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.HeaderCell
   *   column-id="name"
   *   v-slot="{ isSortable, toggleSort }"
   * >
   *   <button v-if="isSortable" @click="toggleSort">
   *     Name
   *   </button>
   *   <span v-else>Name</span>
   * </DataTable.HeaderCell>
   * ```
   */
  HeaderCell,
  /**
   * The `<tbody>` element wrapper. Exposes paginated items.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Body v-slot="{ items, isEmpty }">
   *   <DataTable.Row v-for="item in items" :key="item.id">
   *     <!-- cells -->
   *   </DataTable.Row>
   * </DataTable.Body>
   * ```
   */
  Body,
  /**
   * A `<tr>` element for data rows with selection and expansion state.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Row
   *   :row-id="item.id"
   *   v-slot="{ isSelected, toggleSelection }"
   * >
   *   <DataTable.Cell>
   *     <input type="checkbox" :checked="isSelected" @change="toggleSelection">
   *   </DataTable.Cell>
   * </DataTable.Row>
   * ```
   */
  Row,
  /**
   * A `<td>` element for data cells.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   */
  Cell,
  /**
   * Empty state row that renders when the table has no items.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Empty>
   *   <DataTable.Cell :colspan="columns.length">
   *     No data available
   *   </DataTable.Cell>
   * </DataTable.Empty>
   * ```
   */
  Empty,
}
