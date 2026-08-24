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
 *   import { defineComponent } from 'vue'
 *   import { DataTable, useDataTableRoot } from '@vuetify/v0'
 *
 *   const users = [
 *     { id: 1, name: 'Alice', email: 'alice@test.com' },
 *     { id: 2, name: 'Bob', email: 'bob@test.com' },
 *   ]
 *
 *   const columns = [
 *     { id: 'name', title: 'Name', sortable: true },
 *     { id: 'email', title: 'Email' },
 *   ]
 *
 *   const DataTableInit = defineComponent({
 *     name: 'DataTableInit',
 *     setup () {
 *       const context = useDataTableRoot('v0:data-table')
 *       context.columns.onboard(columns)
 *       context.onboard(users.map(u => ({ id: u.id, value: u })))
 *       return () => null
 *     },
 *   })
 * </script>
 *
 * <template>
 *   <DataTable.Root>
 *     <DataTableInit />
 *
 *     <DataTable.Table>
 *       <DataTable.Header>
 *         <DataTable.Row>
 *           <DataTable.Column id="name">Name</DataTable.Column>
 *           <DataTable.Column id="email">Email</DataTable.Column>
 *         </DataTable.Row>
 *       </DataTable.Header>
 *
 *       <DataTable.Body v-slot="{ items, rowStart }">
 *         <DataTable.Row
 *           v-for="(item, i) in items"
 *           :id="item.id"
 *           :index="rowStart + i"
 *           :key="item.id"
 *         >
 *           <DataTable.Cell>{{ item.name }}</DataTable.Cell>
 *           <DataTable.Cell>{{ item.email }}</DataTable.Cell>
 *         </DataTable.Row>
 *
 *         <DataTable.Empty v-slot="{ columnCount }">
 *           <DataTable.Cell :colspan="columnCount">No data available</DataTable.Cell>
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
   * The `<table>` element wrapper with ARIA table role. `aria-rowcount` is
   * set only when the current page is a subset of total.
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
   *       :id="header.id"
   *       :key="header.id"
   *       :colspan="header.colspan"
   *       :rowspan="header.rowspan"
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
   * <DataTable.Body v-slot="{ items, isEmpty, rowStart }">
   *   <DataTable.Row
   *     v-for="(item, i) in items"
   *     :id="item.id"
   *     :key="item.id"
   *     :index="rowStart + i"
   *   >
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
   *
   * @example
   * ```vue
   * <DataTable.Cell>{{ item.name }}</DataTable.Cell>
   *
   * <DataTable.Empty v-slot="{ columnCount }">
   *   <DataTable.Cell :colspan="columnCount">No data available</DataTable.Cell>
   * </DataTable.Empty>
   * ```
   */
  Cell,
  /**
   * Empty state row that renders when the table has no items.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <DataTable.Empty v-slot="{ columnCount }">
   *   <DataTable.Cell :colspan="columnCount">
   *     No data available
   *   </DataTable.Cell>
   * </DataTable.Empty>
   * ```
   */
  Empty,
}
