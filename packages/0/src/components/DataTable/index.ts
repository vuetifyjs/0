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
export { default as DataTableColumn } from './DataTableColumn.vue'
export { default as DataTableEmpty } from './DataTableEmpty.vue'
export { default as DataTableHeader } from './DataTableHeader.vue'
export { provideDataTableRoot, useDataTableRoot } from './DataTableRoot.vue'
export { default as DataTableRoot } from './DataTableRoot.vue'
export { default as DataTableRow } from './DataTableRow.vue'
export { default as DataTableTable } from './DataTableTable.vue'

export type { DataTableBodyProps, DataTableBodySlotProps } from './DataTableBody.vue'
export type { DataTableCellProps, DataTableCellSlotProps } from './DataTableCell.vue'
export type { DataTableColumnProps, DataTableColumnSlotProps } from './DataTableColumn.vue'
export type { DataTableEmptyProps, DataTableEmptySlotProps } from './DataTableEmpty.vue'
export type { DataTableHeaderProps, DataTableHeaderSlotProps } from './DataTableHeader.vue'
export type { DataTableRootProps, DataTableRootSlotProps } from './DataTableRoot.vue'
export type { DataTableRowProps, DataTableRowSlotProps } from './DataTableRow.vue'
export type { DataTableTableProps, DataTableTableSlotProps } from './DataTableTable.vue'

// Context
import Body from './DataTableBody.vue'
import Cell from './DataTableCell.vue'
import Column from './DataTableColumn.vue'
import Empty from './DataTableEmpty.vue'
import Header from './DataTableHeader.vue'
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
 *       <DataTable.Header>
 *         <DataTable.Row>
 *           <DataTable.Column id="name">Name</DataTable.Column>
 *           <DataTable.Column id="email">Email</DataTable.Column>
 *         </DataTable.Row>
 *       </DataTable.Header>
 *
 *       <DataTable.Body v-slot="{ items }">
 *         <DataTable.Row v-for="item in items" :key="item.id" :id="item.id">
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
   *   <DataTable.Header />
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
   * <DataTable.Header v-slot="{ headers }">
   *   <DataTable.Row v-for="(row, i) in headers" :key="i">
   *     <DataTable.Column
   *       v-for="header in row"
   *       :key="header.id"
   *       :id="header.id"
   *     >
   *       {{ header.title }}
   *     </DataTable.Column>
   *   </DataTable.Row>
   * </DataTable.Header>
   * ```
   */
  Header,
  /**
   * A `<th>` element for header cells with sort state and controls.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Column
   *   id="name"
   *   v-slot="{ isSortable, toggleSort }"
   * >
   *   <button v-if="isSortable" @click="toggleSort">
   *     Name
   *   </button>
   *   <span v-else>Name</span>
   * </DataTable.Column>
   * ```
   */
  Column,
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
   *   :id="item.id"
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
