/**
 * @module createDataGrid
 *
 * @see https://0.vuetifyjs.com/composables/data/create-data-grid
 *
 * @remarks
 * Main factory that wires together column layout, cell editing, row ordering,
 * and row spanning on top of a createDataTable pipeline. Uses a ClientGridAdapter
 * so row ordering is applied post-sort, pre-pagination.
 *
 * Follows the trinity pattern for dependency injection.
 *
 * @example
 * ```ts
 * const grid = createDataGrid({
 *   items: rows,
 *   columns: [
 *     { key: 'name', sortable: true },
 *     { key: 'progress', editable: true },
 *   ],
 * })
 *
 * grid.layout.pin('name', 'left')
 * grid.editing.edit(row.id, 'progress')
 * ```
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createDataTable } from '#v0/composables/createDataTable'
import { extractLeaves } from '#v0/composables/createDataTable/columns'
import { createTrinity } from '#v0/composables/createTrinity'

// Adapters
import { ClientGridAdapter } from './adapters'

// Grid modules
import { createCellEditing } from './editing'
import { createColumnLayout } from './layout'
import { createRowOrdering } from './ordering'
import { createRowSpanning } from './spanning'

// Utilities
import { isFunction, isUndefined } from '#v0/utilities'
import { watch } from 'vue'

// Types
import type { DataTableAdapter, DataTableContext, KeysOfType } from '#v0/composables/createDataTable'
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationOptions } from '#v0/composables/createPagination'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { VirtualOptions } from '#v0/composables/createVirtual'
import type { ID } from '#v0/types'
import type { CellEditing } from './editing'
import type { ColumnLayout, GridColumnDef } from './layout'
import type { SpanEntry } from './spanning'
import type { App, ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

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
  readonly editable?: boolean | ((item: T) => boolean)
  readonly editor?: 'text' | 'number' | 'boolean'
  readonly validate?: (value: unknown, item?: T) => string | true
  readonly span?: (item: T) => number
  readonly children?: readonly DataGridColumn<T>[]
}

export interface DataGridOptions<T extends Record<string, unknown>> {
  items: MaybeRefOrGetter<T[]>
  columns: readonly DataGridColumn<T>[]
  itemValue?: KeysOfType<T, ID>
  adapter?: DataTableAdapter<T>
  filter?: Omit<FilterOptions, 'keys'>
  pagination?: Omit<PaginationOptions, 'size'>
  sortMultiple?: boolean
  pinning?: { left?: string[], right?: string[] }
  resizing?: boolean | { min?: number, max?: number }
  reordering?: boolean
  editing?: {
    columns?: string[]
    onEdit?: (row: ID, column: string, value: unknown, item: T) => void
  }
  rowReordering?: boolean
  preserveRowOrder?: boolean
  rowSpanning?: (item: T, column: string) => number
  virtualization?: VirtualOptions
}

export interface DataGridContext<T extends Record<string, unknown>> extends DataTableContext<T> {
  layout: ColumnLayout
  rows: {
    order: Readonly<ShallowRef<ID[]>>
    move: (fromIndex: number, toIndex: number) => void
    reset: () => void
  }
  editing: CellEditing
  spans: ComputedRef<Map<ID, Map<string, SpanEntry>>>
  virtual: null
}

export interface DataGridContextOptions<T extends Record<string, unknown>> extends DataGridOptions<T> {
  namespace?: string
}

/**
 * Creates a data grid instance with layout, editing, row ordering, and spanning
 * layered on top of the createDataTable pipeline.
 *
 * @param options Data grid options
 * @returns Data grid context
 *
 * @example
 * ```ts
 * const grid = createDataGrid({
 *   items: rows,
 *   columns: [
 *     { key: 'name', sortable: true },
 *     { key: 'progress', editable: true, validate: v => Number(v) >= 0 || 'must be positive' },
 *   ],
 *   pagination: { initial: 1 },
 * })
 *
 * grid.layout.pin('name', 'left')
 * grid.rows.move(2, 0)
 * grid.editing.edit(row.id, 'progress')
 * ```
 */
export function createDataGrid<T extends Record<string, unknown>> (
  options: DataGridOptions<T>,
): DataGridContext<T> {
  const {
    items,
    columns,
    itemValue = 'id' as KeysOfType<T, ID>,
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
    itemValue,
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

  const editable = leaves
    .filter(col => col.editable === true || isFunction(col.editable))
    .map(col => ({
      key: col.key,
      editable: col.editable as boolean | ((item: unknown) => boolean),
      validate: col.validate as ((value: unknown, item?: unknown) => string | true) | undefined,
    }))

  function lookup (row: ID): T | undefined {
    return table.allItems.value.find(
      i => (i[itemValue] as ID) === row,
    )
  }

  const editing = createCellEditing({
    columns: editable,
    lookup,
    onEdit: editingOptions?.onEdit
      ? (row, column, value) => {
          const item = lookup(row)
          if (!isUndefined(item)) editingOptions.onEdit!(row, column, value, item)
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
    virtual: null,
  }
}

/**
 * Creates a data grid context with dependency injection support.
 *
 * @param options Data grid context options including namespace
 * @returns A trinity tuple: [useDataGridContext, provideDataGridContext, defaultContext]
 *
 * @example
 * ```ts
 * const [useDataGrid, provideDataGrid] = createDataGridContext({
 *   items: rows,
 *   columns,
 *   namespace: 'v0:projects',
 * })
 *
 * provideDataGrid()
 * const grid = useDataGrid()
 * ```
 */
export function createDataGridContext<T extends Record<string, unknown>> (
  _options: DataGridContextOptions<T>,
): ContextTrinity<DataGridContext<T>> {
  const { namespace = 'v0:data-grid', ...options } = _options
  const [useDataGridContext, _provideDataGridContext] = createContext<DataGridContext<T>>(namespace)
  const context = createDataGrid(options)

  function provideDataGridContext (
    _context: DataGridContext<T> = context,
    app?: App,
  ): DataGridContext<T> {
    return _provideDataGridContext(_context, app)
  }

  return createTrinity<DataGridContext<T>>(useDataGridContext, provideDataGridContext, context)
}

/**
 * Returns the current data grid context from dependency injection.
 *
 * @param namespace The namespace for the data grid context. @default 'v0:data-grid'
 * @returns The current data grid context
 *
 * @example
 * ```ts
 * const grid = useDataGrid<Project>()
 *
 * grid.layout.pin('id', 'left')
 * grid.rows.reset()
 * ```
 */
export function useDataGrid<T extends Record<string, unknown>> (
  namespace = 'v0:data-grid',
): DataGridContext<T> {
  return useContext<DataGridContext<T>>(namespace)
}
