/**
 * @module DataGrid
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Headless compound component for data grids with column layout, cell editing,
 * row ordering, and row spanning. Built on the createDataGrid composable.
 */

export { default as DataGridBody } from './DataGridBody.vue'
export { default as DataGridCell } from './DataGridCell.vue'
export { default as DataGridHandle } from './DataGridHandle.vue'
export { default as DataGridHeader } from './DataGridHeader.vue'
export { provideDataGridRow, useDataGridRow } from './DataGridRow.vue'
export { default as DataGridRow } from './DataGridRow.vue'
export { provideDataGridRoot, useDataGridRoot } from './DataGridRoot.vue'
export { default as DataGridRoot } from './DataGridRoot.vue'
export { default as DataGridTable } from './DataGridTable.vue'

export type { DataGridBodyProps, DataGridBodySlotProps } from './DataGridBody.vue'
export type { DataGridCellProps, DataGridCellSlotProps } from './DataGridCell.vue'
export type { DataGridHeaderProps, DataGridHeaderSlotProps } from './DataGridHeader.vue'
export type { DataGridRowContext, DataGridRowProps, DataGridRowSlotProps } from './DataGridRow.vue'
export type { DataGridRootProps, DataGridRootSlotProps } from './DataGridRoot.vue'
export type { DataGridTableProps, DataGridTableSlotProps } from './DataGridTable.vue'

// Re-export Handle types separately (workaround for vue-tsc module resolution)
export type {
  DataGridHandleProps,
  DataGridHandleSlotProps,
  DataGridHandleState,
} from './DataGridHandle.vue'

// Note: DataGridColumn and DataGridColumnProps/DataGridColumnSlotProps are NOT
// exported as named exports to avoid collision with the deprecated DataGridColumn
// type from createDataGrid composable. Access them via DataGrid.Column instead.

// Context
import Body from './DataGridBody.vue'
import Cell from './DataGridCell.vue'
import Column from './DataGridColumn.vue'
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
 *   interface Row { id: number; name: string; email: string }
 *   const items = ref<Row[]>([
 *     { id: 1, name: 'John', email: 'john@example.com' },
 *     { id: 2, name: 'Jane', email: 'jane@example.com' },
 *   ])
 * </script>
 *
 * <template>
 *   <DataGrid.Root v-slot="{ context }">
 *     <DataGrid.Table>
 *       <DataGrid.Header>
 *         <DataGrid.Row>
 *           <DataGrid.Column id="name">Name</DataGrid.Column>
 *           <DataGrid.Column id="email">Email</DataGrid.Column>
 *         </DataGrid.Row>
 *       </DataGrid.Header>
 *       <DataGrid.Body>
 *         <DataGrid.Row v-for="item in context.items.value" :key="item.id" :id="item.id">
 *           <DataGrid.Cell column="name">{{ item.name }}</DataGrid.Cell>
 *           <DataGrid.Cell column="email">{{ item.email }}</DataGrid.Cell>
 *         </DataGrid.Row>
 *       </DataGrid.Body>
 *     </DataGrid.Table>
 *   </DataGrid.Root>
 * </template>
 * ```
 */
export const DataGrid = {
  /**
   * Root provider for the data grid. Creates and provides a DataGridContext.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Root v-slot="{ context }">
   *   {{ context.items.value.length }} rows
   * </DataGrid.Root>
   * ```
   */
  Root,
  /**
   * Table container with `role="grid"` ARIA semantics.
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
   * Header section container with `role="rowgroup"` ARIA semantics.
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
   * Body section container with `role="rowgroup"` ARIA semantics.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Body>
   *   <DataGrid.Row :id="item.id">
   *     <DataGrid.Cell column="name">{{ item.name }}</DataGrid.Cell>
   *   </DataGrid.Row>
   * </DataGrid.Body>
   * ```
   */
  Body,
  /**
   * Row container with `role="row"` ARIA semantics.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Row :id="item.id">
   *   <DataGrid.Cell column="name">{{ item.name }}</DataGrid.Cell>
   * </DataGrid.Row>
   * ```
   */
  Row,
  /**
   * Header cell with `role="columnheader"` and sorting state.
   * Composes `Splitter.Panel` when inside a resizable `DataGridRow`.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Column v-slot="{ isSortable, toggleSort }" id="name">
   *   <button v-if="isSortable" @click="toggleSort">Name</button>
   * </DataGrid.Column>
   * ```
   */
  Column,
  /**
   * Data cell with `role="gridcell"`, editing state, and row spanning.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Cell v-slot="{ isEditing }" column="name">
   *   {{ isEditing ? 'editing' : item.name }}
   * </DataGrid.Cell>
   * ```
   */
  Cell,
  /**
   * Column resize handle. Wraps `Splitter.Handle` for drag interaction.
   * Place between adjacent `DataGridColumn` components in a resizable row.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @example
   * ```vue
   * <DataGrid.Row resizable>
   *   <DataGrid.Column id="name">Name</DataGrid.Column>
   *   <DataGrid.Handle />
   *   <DataGrid.Column id="email">Email</DataGrid.Column>
   * </DataGrid.Row>
   * ```
   */
  Handle,
}
