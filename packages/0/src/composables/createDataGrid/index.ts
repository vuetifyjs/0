/**
 * @module createDataGrid
 *
 * @see https://0.vuetifyjs.com/composables/data/create-data-grid
 *
 * @remarks
 * Headless data grid built on top of `createDataTable`. Adds:
 *
 * - Column layout: percentage-based sizing, pinning (left/right), delta-based
 *   resizing, and reordering.
 * - Cell editing: edit/commit/cancel lifecycle with per-column validation and
 *   dirty tracking. Source data is never mutated; consumers handle persistence
 *   via `editing.onEdit`.
 * - Row ordering: ID-based order applied post-sort, pre-pagination by the
 *   default `ClientGridAdapter`. Auto-resets when the underlying sort changes
 *   unless `preserveRowOrder` is set.
 * - Row spanning: derived `Map<rowId, Map<columnKey, SpanEntry>>` from a
 *   per-cell `rowSpanning` callback. Spans never cross page boundaries.
 *
 * Composes existing primitives via the spread/aggregation pattern; the entire
 * createDataTable API (sort, filter, pagination, selection, expansion,
 * grouping) is inherited unchanged.
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createDataTable } from '#v0/composables/createDataTable'
import { extractLeaves } from '#v0/composables/createDataTable/columns'
import { createTrinity } from '#v0/composables/createTrinity'

// Adapters
import { ClientGridAdapter } from './adapters'

// Utilities
import { watch } from 'vue'

// Types
import type { DataTableAdapterInterface, DataTableContext } from '#v0/composables/createDataTable'
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationOptions } from '#v0/composables/createPagination'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { CellEditing } from './editing'
import type { ColumnLayout, GridColumnDef } from './layout'
import type { SpanEntry } from './spanning'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Grid modules
import { createCellEditing } from './editing'
import { createColumnLayout } from './layout'
import { createRowOrdering } from './ordering'
import { createRowSpanning } from './spanning'

// Re-exports
export type { ColumnLayout, GridColumnDef, PinnedRegion, PinPosition, ResolvedColumn } from './layout'
export type { ActiveCell, CellEditing, CellEditingOptions, EditableColumn } from './editing'
export type { RowOrdering } from './ordering'
export type { RowSpanningOptions, SpanEntry } from './spanning'
export { ClientGridAdapter, ServerGridAdapter, VirtualGridAdapter } from './adapters'
export type { ServerGridAdapterOptions } from './adapters'

export interface DataGridColumn<T extends Record<string, unknown> = Record<string, unknown>> extends GridColumnDef {
  readonly key: string
  readonly title?: string
  readonly sortable?: boolean
  readonly filterable?: boolean
  readonly sort?: (a: unknown, b: unknown) => number
  readonly filter?: (value: unknown, query: string) => boolean
  /** Cell is editable. May be a predicate per row. */
  readonly editable?: boolean | ((item: T) => boolean)
  /** Editor hint for the rendering layer. */
  readonly editor?: 'text' | 'number' | 'boolean'
  /** Validate a committed value. Return `true` to accept or a string error message. */
  readonly validate?: (value: unknown, item?: T) => boolean | string
  /** Per-cell row span. */
  readonly span?: (item: T) => number
  readonly children?: readonly DataGridColumn<T>[]
}

export interface DataGridOptions<T extends Record<string, unknown>> {
  items: MaybeRefOrGetter<T[]>
  columns: readonly DataGridColumn<T>[]
  /** Property used as row identifier. @default 'id' */
  itemValue?: string
  /** Pipeline adapter. @default ClientGridAdapter */
  adapter?: DataTableAdapterInterface<T>
  /** Filter options forwarded to createDataTable. */
  filter?: Omit<FilterOptions, 'keys'>
  /** Pagination options forwarded to createDataTable. */
  pagination?: Omit<PaginationOptions, 'size'>
  /** Enable multi-column sort. @default false */
  sortMultiple?: boolean
  /** Cell editing configuration. */
  editing?: {
    /** Called when an edited cell is committed. */
    onEdit?: (row: ID, column: string, value: unknown, item: T) => void
  }
  /** Keep manual row order across sort changes. @default false */
  preserveRowOrder?: boolean
  /** Per-cell row span function. */
  rowSpanning?: (item: T, column: string) => number
}

export interface DataGridContext<T extends Record<string, unknown>> extends DataTableContext<T> {
  /** Column layout: sizing, pinning, resizing, reordering */
  layout: ColumnLayout
  /** Row ordering state and mutation methods */
  rows: {
    order: Readonly<ShallowRef<ID[]>>
    move: (fromIndex: number, toIndex: number) => void
    reset: () => void
  }
  /** Cell editing state and lifecycle methods */
  editing: CellEditing
  /** Row span map for the current page */
  spans: Readonly<Ref<Map<ID, Map<string, SpanEntry>>>>
}

export interface DataGridContextOptions<T extends Record<string, unknown>> extends DataGridOptions<T> {
  namespace?: string
}

/**
 * Creates a data grid instance with column layout, cell editing, row ordering,
 * and row spanning layered on top of a `createDataTable` pipeline.
 *
 * The default `ClientGridAdapter` inserts row ordering between sort and
 * pagination, so manual row order survives sorting (cleared automatically when
 * the sort itself changes unless `preserveRowOrder` is set).
 *
 * @param options Data grid options
 * @returns Data grid context with the full DataTable API plus grid extensions
 *
 * @example
 * ```ts
 * import { createDataGrid } from '@vuetify/v0'
 *
 * const grid = createDataGrid({
 *   items: users,
 *   columns: [
 *     { key: 'name', title: 'Name', sortable: true, filterable: true, size: 30 },
 *     { key: 'email', title: 'Email', filterable: true, size: 40, editable: true },
 *     { key: 'age', title: 'Age', sortable: true, size: 30, sort: (a, b) => Number(a) - Number(b) },
 *   ],
 * })
 *
 * grid.search('alice')
 * grid.sort.toggle('age')
 * grid.layout.pin('name', 'left')
 * grid.editing.edit(1, 'email')
 * grid.editing.commit('alice@new.com')
 * ```
 */
export function createDataGrid<T extends Record<string, unknown>> (
  options: DataGridOptions<T>,
): DataGridContext<T> {
  const {
    items,
    columns,
    itemValue = 'id',
    adapter: customAdapter,
    filter,
    pagination,
    sortMultiple,
    editing: editingOptions,
    preserveRowOrder = false,
    rowSpanning,
  } = options

  const leaves = extractLeaves(columns)
  const ordering = createRowOrdering()
  const adapter = customAdapter ?? new ClientGridAdapter<T>(ordering.order, itemValue)

  const table = createDataTable<T>({
    items,
    columns,
    itemValue: itemValue as never,
    filter,
    pagination,
    sortMultiple,
    adapter,
  })

  if (!preserveRowOrder) {
    watch(table.sort.columns, () => {
      ordering.reset()
    })
  }

  const layout = createColumnLayout(columns)

  const editableColumns = leaves
    .filter(col => col.editable === true || typeof col.editable === 'function')
    .map(col => ({
      key: col.key,
      editable: col.editable as boolean | ((item: unknown) => boolean),
      validate: col.validate as ((value: unknown, item?: unknown) => boolean | string) | undefined,
    }))

  const editing = createCellEditing({
    columns: editableColumns,
    onEdit: editingOptions?.onEdit
      ? (row, column, value) => {
          const item = table.allItems.value.find(
            i => (i[itemValue] as ID) === row,
          ) as T | undefined
          editingOptions.onEdit!(row, column, value, item as T)
        }
      : undefined,
  })

  const spans = createRowSpanning<T>({
    items: table.items as Ref<readonly T[]>,
    columns: leaves.map(col => col.key),
    itemKey: itemValue,
    rowSpanning,
  })

  return {
    ...table,
    layout,
    rows: {
      order: ordering.order,
      move: ordering.move,
      reset: ordering.reset,
    },
    editing,
    spans,
  }
}

/**
 * Creates a data grid context with dependency injection support.
 *
 * @param options Data grid context options including namespace
 * @returns A trinity tuple: `[useDataGrid, provideDataGrid, defaultContext]`
 *
 * @example
 * ```ts
 * import { createDataGridContext } from '@vuetify/v0'
 *
 * const [useUsersGrid, provideUsersGrid] = createDataGridContext({
 *   namespace: 'app:users-grid',
 *   items: users,
 *   columns,
 * })
 *
 * provideUsersGrid()
 * ```
 */
export function createDataGridContext<T extends Record<string, unknown>> (
  _options: DataGridContextOptions<T>,
): ContextTrinity<DataGridContext<T>> {
  const { namespace = 'v0:data-grid', ...options } = _options
  const context = createDataGrid(options)

  return createTrinity<DataGridContext<T>>(namespace, context)
}

/**
 * Returns the current data grid context from dependency injection.
 *
 * @typeParam T - Must be provided explicitly; cannot be inferred from namespace.
 *   Prefer the `useX` function from {@link createDataGridContext} for type-safe
 *   injection.
 *
 * @param namespace The namespace for the data grid context. @default 'v0:data-grid'
 * @returns The current data grid context
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useDataGrid } from '@vuetify/v0'
 *
 *   const grid = useDataGrid<User>()
 * </script>
 * ```
 */
export function useDataGrid<T extends Record<string, unknown>> (
  namespace = 'v0:data-grid',
): DataGridContext<T> {
  return useContext<DataGridContext<T>>(namespace)
}
