/**
 * @module DataGrid
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Headless compound component for data grids with column layout, cell editing,
 * row ordering, and row spanning. Built on the createDataGrid composable.
 * Renders semantic table roles — not an APG Grid widget.
 */

export { default as DataGridBody } from './DataGridBody.vue'
export { default as DataGridCell } from './DataGridCell.vue'
export { default as DataGridColumn } from './DataGridColumn.vue'
export { default as DataGridEmpty } from './DataGridEmpty.vue'
export { default as DataGridHandle } from './DataGridHandle.vue'
export { default as DataGridHeader } from './DataGridHeader.vue'
export { provideDataGridRoot, useDataGridRoot } from './DataGridRoot.vue'
export { default as DataGridRoot } from './DataGridRoot.vue'
export { provideDataGridRow, useDataGridRow } from './DataGridRow.vue'
export { default as DataGridRow } from './DataGridRow.vue'
export { default as DataGridTable } from './DataGridTable.vue'

export type { DataGridBodyProps, DataGridBodySlotProps } from './DataGridBody.vue'
export type { DataGridCellProps, DataGridCellSlotProps } from './DataGridCell.vue'
export type { DataGridColumnProps, DataGridColumnSlotProps } from './DataGridColumn.vue'
export type { DataGridEmptyProps, DataGridEmptySlotProps } from './DataGridEmpty.vue'
export type { DataGridHeaderProps, DataGridHeaderSlotProps } from './DataGridHeader.vue'
export type { DataGridRootProps, DataGridRootSlotProps } from './DataGridRoot.vue'
export type { DataGridRowContext, DataGridRowProps, DataGridRowSlotProps } from './DataGridRow.vue'
export type { DataGridTableProps, DataGridTableSlotProps } from './DataGridTable.vue'

// Re-export Handle types separately (workaround for vue-tsc module resolution)
export type {
  DataGridHandleProps,
  DataGridHandleSlotProps,
  DataGridHandleState,
} from './DataGridHandle.vue'

// Context
import Body from './DataGridBody.vue'
import Cell from './DataGridCell.vue'
import Column from './DataGridColumn.vue'
import Empty from './DataGridEmpty.vue'
import Handle from './DataGridHandle.vue'
import Header from './DataGridHeader.vue'
import Root from './DataGridRoot.vue'
import Row from './DataGridRow.vue'
import Table from './DataGridTable.vue'

/**
 * DataGrid compound component for building data grids.
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { DataGrid } from '@vuetify/v0'
 *
 *   const users = [
 *     { id: 1, name: 'John', email: 'john@example.com' },
 *     { id: 2, name: 'Jane', email: 'jane@example.com' },
 *   ]
 *
 * </script>
 *
 * <template>
 *   <DataGrid.Root>
 *     <DataGrid.Table>
 *       <DataGrid.Header>
 *         <DataGrid.Row>
 *           <DataGrid.Column id="name">Name</DataGrid.Column>
 *           <DataGrid.Column id="email">Email</DataGrid.Column>
 *         </DataGrid.Row>
 *       </DataGrid.Header>
 *
 *       <DataGrid.Body v-slot="{ rank }">
 *         <DataGrid.Row
 *           v-for="user in rank(users)"
 *           :id="user.id"
 *           :value="user"
 *           :key="user.id"
 *         >
 *           <DataGrid.Cell column="name">{{ user.name }}</DataGrid.Cell>
 *           <DataGrid.Cell column="email">{{ user.email }}</DataGrid.Cell>
 *         </DataGrid.Row>
 *
 *         <DataGrid.Empty v-slot="{ columnCount }">
 *           <DataGrid.Cell :colspan="columnCount">No data available</DataGrid.Cell>
 *         </DataGrid.Empty>
 *       </DataGrid.Body>
 *     </DataGrid.Table>
 *   </DataGrid.Root>
 * </template>
 * ```
 */
export const DataGrid = {
  /**
   * Provider that creates `createDataGrid`. Children register when they mount.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Root v-model:search="query" v-slot="{ context }">
   *   <!-- context.items is derived from mounted Row children -->
   * </DataGrid.Root>
   * ```
   */
  Root,
  /**
   * The `<table>` element wrapper with ARIA table role. `aria-rowcount` is
   * set only when the current page is a subset of total.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Table>
   *   <DataGrid.Header />
   *   <DataGrid.Body />
   * </DataGrid.Table>
   * ```
   */
  Table,
  /**
   * The `<thead>` element wrapper. Exposes the 2D header grid after columns register.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Header>
   *   <DataGrid.Row>
   *     <DataGrid.Column id="name">Name</DataGrid.Column>
   *   </DataGrid.Row>
   * </DataGrid.Header>
   * ```
   */
  Header,
  /**
   * A `<th>` element for header cells with sort state, pin, and layout.
   * Composes `Splitter.Panel` when inside a resizable `DataGridRow`.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Column
   *   id="name"
   *   v-slot="{ isSortable, toggle }"
   * >
   *   <Button.Root v-if="isSortable" @click="toggle">
   *     Name
   *   </Button.Root>
   *   <span v-else>Name</span>
   * </DataGrid.Column>
   * ```
   */
  Column,
  /**
   * The `<tbody>` element wrapper. Exposes paginated items.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Body v-slot="{ rank }">
   *   <DataGrid.Row
   *     v-for="user in rank(users)"
   *     :id="user.id"
   *     :key="user.id"
   *     :value="user"
   *   >
   *     <!-- cells -->
   *   </DataGrid.Row>
   * </DataGrid.Body>
   * ```
   */
  Body,
  /**
   * A `<tr>` element for data rows with selection and expansion state.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Row
   *   :id="item.id"
   *   :value="item"
   *   v-slot="{ isSelected, toggleSelection }"
   * >
   *   <DataGrid.Cell column="name">
   *     <Button.Root :aria-pressed="isSelected" @click="toggleSelection">
   *       Select
   *     </Button.Root>
   *   </DataGrid.Cell>
   * </DataGrid.Row>
   * ```
   */
  Row,
  /**
   * A `<td>` element for data cells with editing state and row spanning.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Cell v-slot="{ isEditing }" column="name">
   *   {{ isEditing ? 'editing' : item.name }}
   * </DataGrid.Cell>
   *
   * <DataGrid.Empty v-slot="{ columnCount }">
   *   <DataGrid.Cell :colspan="columnCount">No data available</DataGrid.Cell>
   * </DataGrid.Empty>
   * ```
   */
  Cell,
  /**
   * Empty state row that renders when the grid has no items.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Empty v-slot="{ columnCount }">
   *   <DataGrid.Cell :colspan="columnCount">
   *     No data available
   *   </DataGrid.Cell>
   * </DataGrid.Empty>
   * ```
   */
  Empty,
  /**
   * Column resize handle. Wraps `Splitter.Handle` for drag interaction.
   * Nest inside a `DataGridColumn` (except the last) in a resizable row
   * that uses the full `as="div"` chain.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Table as="div">
   *   <DataGrid.Header as="div">
   *     <DataGrid.Row as="div" resizable>
   *       <DataGrid.Column as="div" id="name">
   *         Name
   *         <DataGrid.Handle />
   *       </DataGrid.Column>
   *       <DataGrid.Column as="div" id="email">Email</DataGrid.Column>
   *     </DataGrid.Row>
   *   </DataGrid.Header>
   * </DataGrid.Table>
   * ```
   */
  Handle,
}
