export type { Md1DataTableContext, Md1DataTableProps } from './Md1DataTable.vue'
export type { Md1DataTableBodyProps, Md1DataTableBodySlotProps } from './Md1DataTableBody.vue'
export { default as Md1DataTableBody } from './Md1DataTableBody.vue'
export type { Md1DataTableCellProps, Md1DataTableEditable } from './Md1DataTableCell.vue'
export { default as Md1DataTableCell } from './Md1DataTableCell.vue'
export type { Md1DataTableColumnProps } from './Md1DataTableColumn.vue'
export { default as Md1DataTableColumn } from './Md1DataTableColumn.vue'
export type { Md1DataTableContextualProps } from './Md1DataTableContextual.vue'
export { default as Md1DataTableContextual } from './Md1DataTableContextual.vue'
export type { Md1DataTableFooterProps } from './Md1DataTableFooter.vue'
export { default as Md1DataTableFooter } from './Md1DataTableFooter.vue'
export type { Md1DataTableHeadProps } from './Md1DataTableHead.vue'
export { default as Md1DataTableHead } from './Md1DataTableHead.vue'
export type { Md1DataTableHeaderProps } from './Md1DataTableHeader.vue'
export { default as Md1DataTableHeader } from './Md1DataTableHeader.vue'
export type { Md1DataTableRowProps } from './Md1DataTableRow.vue'
export { default as Md1DataTableRow } from './Md1DataTableRow.vue'
export type { Md1DataTableTableProps } from './Md1DataTableTable.vue'
export { default as Md1DataTableTable } from './Md1DataTableTable.vue'

// Context
import Root from './Md1DataTable.vue'
import Body from './Md1DataTableBody.vue'
import Cell from './Md1DataTableCell.vue'
import Column from './Md1DataTableColumn.vue'
import Contextual from './Md1DataTableContextual.vue'
import Footer from './Md1DataTableFooter.vue'
import Head from './Md1DataTableHead.vue'
import Header from './Md1DataTableHeader.vue'
import Row from './Md1DataTableRow.vue'
import Table from './Md1DataTableTable.vue'

/**
 * The Material Design 1 data table: a table card with a title header, a
 * sortable column header row, selectable 48 dp rows, editable cells and a
 * pagination footer. The root owns the v0 `DataTable` pipeline (one sorted
 * column, page-scoped select-all), `v-model:selected` and `v-model:rows-per-page`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1DataTableColumn`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1DataTable v-model:selected="selected" selectable>
 *   <Md1DataTable.Header title="Nutrition" />
 *
 *   <Md1DataTable.Contextual />
 *
 *   <Md1DataTable.Table>
 *     <Md1DataTable.Head>
 *       <Md1DataTable.Column id="name" sortable>Dessert</Md1DataTable.Column>
 *       <Md1DataTable.Column id="calories" numeric sortable>Calories</Md1DataTable.Column>
 *     </Md1DataTable.Head>
 *
 *     <Md1DataTable.Body v-slot="{ rank }">
 *       <Md1DataTable.Row v-for="row in rank(rows)" :id="row.id" :key="row.id" :value="row">
 *         <Md1DataTable.Cell>{{ row.name }}</Md1DataTable.Cell>
 *         <Md1DataTable.Cell numeric>{{ row.calories }}</Md1DataTable.Cell>
 *       </Md1DataTable.Row>
 *     </Md1DataTable.Body>
 *   </Md1DataTable.Table>
 *
 *   <Md1DataTable.Footer />
 * </Md1DataTable>
 * ```
 */
export const Md1DataTable = Object.assign(Root, {
  /** The 64 dp card title row with the card action icons. */
  Header,
  /** The coloured header that replaces `Header` while rows are selected: the count and the contextual actions. */
  Contextual,
  /** The scroll container and the `<table>`. */
  Table,
  /** The 56 dp column header row; renders the select-all cell when the table is selectable. */
  Head,
  /** A `<th>`: the column name, the sort control and the arrow, an optional definition tooltip. */
  Column,
  /** The `<tbody>`; its slot gives `rank` so rows register in pipeline order. */
  Body,
  /** A 48 dp data row; renders its checkbox cell when the table is selectable. */
  Row,
  /** A `<td>`: text or numbers, optionally editable in a sheet or a dialog. */
  Cell,
  /** The 56 dp pagination footer: rows per page, the range text, previous and next. */
  Footer,
})
