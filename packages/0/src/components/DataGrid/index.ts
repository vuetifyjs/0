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

// Note: DataGridColumn and DataGridColumnProps/DataGridColumnSlotProps are NOT
// exported as named exports to avoid collision with the deprecated DataGridColumn
// type from createDataGrid composable. Access them via DataGrid.Column instead.

// Context
import Body from './DataGridBody.vue'
import Cell from './DataGridCell.vue'
import Column from './DataGridColumn.vue'
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
 *           <DataGrid.Column column="name">Name</DataGrid.Column>
 *           <DataGrid.Column column="email">Email</DataGrid.Column>
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
   */
  Table,
  /**
   * Header section container with `role="rowgroup"` ARIA semantics.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   */
  Header,
  /**
   * Body section container with `role="rowgroup"` ARIA semantics.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   */
  Body,
  /**
   * Row container with `role="row"` ARIA semantics.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   */
  Row,
  /**
   * Header cell with `role="columnheader"` and sorting state.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   */
  Column,
  /**
   * Data cell with `role="gridcell"`, editing state, and row spanning.
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   */
  Cell,
}
