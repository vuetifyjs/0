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
 *   <DataTable.Root>
 *     <DataTable.Table>
 *       <DataTable.Header>
 *         <DataTable.Row>
 *           <DataTable.Column id="name" sortable>Name</DataTable.Column>
 *           <DataTable.Column id="email">Email</DataTable.Column>
 *         </DataTable.Row>
 *       </DataTable.Header>
 *
 *       <DataTable.Body v-slot="{ rank }">
 *         <DataTable.Row
 *           v-for="user in rank(users)"
 *           :id="user.id"
 *           :key="user.id"
 *           :value="user"
 *         >
 *           <DataTable.Cell>{{ user.name }}</DataTable.Cell>
 *           <DataTable.Cell>{{ user.email }}</DataTable.Cell>
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
   * Provider that creates `createDataTable`. Children register when they mount.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { DataTable } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const query = shallowRef('')
   * </script>
   *
   * <template>
   *   <DataTable.Root v-model:search="query" v-slot="{ context }">
   *     <input v-model="query" type="search" aria-label="Search">
   *     <!-- context.items is derived from mounted Row children -->
   *   </DataTable.Root>
   * </template>
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
   * <script setup lang="ts">
   *   import { DataTable } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table aria-label="Users">
   *       <DataTable.Header />
   *       <DataTable.Body />
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
   * ```
   */
  Table,
  /**
   * The `<thead>` element wrapper. Exposes the 2D header grid after columns register.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { DataTable } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table>
   *       <DataTable.Header>
   *         <DataTable.Row>
   *           <DataTable.Column id="name" sortable>Name</DataTable.Column>
   *           <DataTable.Column id="email">Email</DataTable.Column>
   *         </DataTable.Row>
   *       </DataTable.Header>
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
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
   * <script setup lang="ts">
   *   import { Button, DataTable } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table>
   *       <DataTable.Header>
   *         <DataTable.Row>
   *           <DataTable.Column id="name" sortable v-slot="{ isSortable, toggle }">
   *             <Button.Root v-if="isSortable" @click="toggle">Name</Button.Root>
   *             <span v-else>Name</span>
   *           </DataTable.Column>
   *         </DataTable.Row>
   *       </DataTable.Header>
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
   * ```
   */
  Column,
  /**
   * The `<tbody>` element wrapper. Slot exposes `rank`, `items`, and `isEmpty`.
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { DataTable } from '@vuetify/v0'
   *
   *   const users = [
   *     { id: 1, name: 'Alice' },
   *     { id: 2, name: 'Bob' },
   *   ]
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table>
   *       <DataTable.Header>
   *         <DataTable.Row>
   *           <DataTable.Column id="name">Name</DataTable.Column>
   *         </DataTable.Row>
   *       </DataTable.Header>
   *
   *       <DataTable.Body v-slot="{ rank }">
   *         <DataTable.Row
   *           v-for="user in rank(users)"
   *           :id="user.id"
   *           :key="user.id"
   *           :value="user"
   *         >
   *           <DataTable.Cell>{{ user.name }}</DataTable.Cell>
   *         </DataTable.Row>
   *       </DataTable.Body>
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
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
   * <script setup lang="ts">
   *   import { Button, DataTable } from '@vuetify/v0'
   *
   *   const users = [
   *     { id: 1, name: 'Alice' },
   *   ]
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table>
   *       <DataTable.Body v-slot="{ rank }">
   *         <DataTable.Row
   *           v-for="user in rank(users)"
   *           :id="user.id"
   *           :key="user.id"
   *           :value="user"
   *           selectable
   *           v-slot="{ isSelected, toggleSelection }"
   *         >
   *           <DataTable.Cell>
   *             <Button.Root :aria-pressed="isSelected" @click="toggleSelection">
   *               Select
   *             </Button.Root>
   *           </DataTable.Cell>
   *           <DataTable.Cell>{{ user.name }}</DataTable.Cell>
   *         </DataTable.Row>
   *       </DataTable.Body>
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
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
   * <script setup lang="ts">
   *   import { DataTable } from '@vuetify/v0'
   *
   *   const users = [
   *     { id: 1, name: 'Alice' },
   *   ]
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table>
   *       <DataTable.Body v-slot="{ rank }">
   *         <DataTable.Row
   *           v-for="user in rank(users)"
   *           :id="user.id"
   *           :key="user.id"
   *           :value="user"
   *         >
   *           <DataTable.Cell>{{ user.name }}</DataTable.Cell>
   *         </DataTable.Row>
   *       </DataTable.Body>
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
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
   * <script setup lang="ts">
   *   import { DataTable } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <DataTable.Root>
   *     <DataTable.Table>
   *       <DataTable.Body>
   *         <DataTable.Empty v-slot="{ columnCount }">
   *           <DataTable.Cell :colspan="columnCount">
   *             No data available
   *           </DataTable.Cell>
   *         </DataTable.Empty>
   *       </DataTable.Body>
   *     </DataTable.Table>
   *   </DataTable.Root>
   * </template>
   * ```
   */
  Empty,
}
