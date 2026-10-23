export type { QuDataTableContext, QuDataTableProps } from './QuDataTable.vue'
export type { QuDataTableBodyProps, QuDataTableBodySlotProps } from './QuDataTableBody.vue'
export { default as QuDataTableBody } from './QuDataTableBody.vue'
export type { QuDataTableCellProps, QuDataTableEditable } from './QuDataTableCell.vue'
export { default as QuDataTableCell } from './QuDataTableCell.vue'
export type { QuDataTableColumnProps } from './QuDataTableColumn.vue'
export { default as QuDataTableColumn } from './QuDataTableColumn.vue'
export type { QuDataTableContextualProps } from './QuDataTableContextual.vue'
export { default as QuDataTableContextual } from './QuDataTableContextual.vue'
export type { QuDataTableFooterProps } from './QuDataTableFooter.vue'
export { default as QuDataTableFooter } from './QuDataTableFooter.vue'
export type { QuDataTableHeadProps } from './QuDataTableHead.vue'
export { default as QuDataTableHead } from './QuDataTableHead.vue'
export type { QuDataTableHeaderProps } from './QuDataTableHeader.vue'
export { default as QuDataTableHeader } from './QuDataTableHeader.vue'
export type { QuDataTableRowProps } from './QuDataTableRow.vue'
export { default as QuDataTableRow } from './QuDataTableRow.vue'
export type { QuDataTableTableProps } from './QuDataTableTable.vue'
export { default as QuDataTableTable } from './QuDataTableTable.vue'

// Context
import Root from './QuDataTable.vue'
import Body from './QuDataTableBody.vue'
import Cell from './QuDataTableCell.vue'
import Column from './QuDataTableColumn.vue'
import Contextual from './QuDataTableContextual.vue'
import Footer from './QuDataTableFooter.vue'
import Head from './QuDataTableHead.vue'
import Header from './QuDataTableHeader.vue'
import Row from './QuDataTableRow.vue'
import Table from './QuDataTableTable.vue'

/**
 * The Material Design 1 data table: a table card with a title header, a
 * sortable column header row, selectable 48 dp rows, editable cells and a
 * pagination footer. The root owns the v0 `DataTable` pipeline (one sorted
 * column, page-scoped select-all), `v-model:selected` and `v-model:rows-per-page`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuDataTableColumn`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuDataTable v-model:selected="selected" selectable>
 *   <QuDataTable.Header title="Nutrition" />
 *
 *   <QuDataTable.Contextual />
 *
 *   <QuDataTable.Table>
 *     <QuDataTable.Head>
 *       <QuDataTable.Column id="name" sortable>Dessert</QuDataTable.Column>
 *       <QuDataTable.Column id="calories" numeric sortable>Calories</QuDataTable.Column>
 *     </QuDataTable.Head>
 *
 *     <QuDataTable.Body v-slot="{ rank }">
 *       <QuDataTable.Row v-for="row in rank(rows)" :id="row.id" :key="row.id" :value="row">
 *         <QuDataTable.Cell>{{ row.name }}</QuDataTable.Cell>
 *         <QuDataTable.Cell numeric>{{ row.calories }}</QuDataTable.Cell>
 *       </QuDataTable.Row>
 *     </QuDataTable.Body>
 *   </QuDataTable.Table>
 *
 *   <QuDataTable.Footer />
 * </QuDataTable>
 * ```
 */
export const QuDataTable = Object.assign(Root, {
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
