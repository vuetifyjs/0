/**
 * @module createDataGrid
 *
 * @remarks
 * Main factory that wires together column layout, cell editing, row ordering,
 * and row spanning on top of a createDataTable pipeline. Uses a ClientGridAdapter
 * so row ordering is applied post-sort, pre-pagination.
 *
 * Follows the trinity pattern for dependency injection.
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createDataTable } from '#v0/composables/createDataTable'
import { extractLeaves, resolveHeaders } from '#v0/composables/createDataTable/columns'
import { createTrinity } from '#v0/composables/createTrinity'

// Adapters
import { ClientGridAdapter } from './adapters'

// Utilities
import { toRef, watch } from 'vue'

// Types
import type { DataTableAdapterInterface, DataTableContext } from '#v0/composables/createDataTable'
import type { InternalHeader } from '#v0/composables/createDataTable/columns'
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationOptions } from '#v0/composables/createPagination'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { VirtualOptions } from '#v0/composables/createVirtual'
import type { ID } from '#v0/types'
import type { CellEditing } from './editing'
import type { ColumnLayout, GridColumnDef } from './layout'
import type { RowSpanningOptions, SpanEntry } from './spanning'
import type { App, ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Grid modules
import { createCellEditing } from './editing'
import { createColumnLayout } from './layout'
import { createRowOrdering } from './ordering'
import { createRowSpanning } from './spanning'

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
  readonly validate?: (value: unknown, item?: T) => boolean | string
  readonly span?: (item: T) => number
  readonly children?: readonly DataGridColumn<T>[]
}

export interface DataGridOptions<T extends Record<string, unknown>> {
  items: MaybeRefOrGetter<T[]>
  columns: readonly DataGridColumn<T>[]
  itemValue?: string
  adapter?: DataTableAdapterInterface<T>
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
  headers: Readonly<Ref<InternalHeader[][]>>
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

  // 1. Extract leaves from possibly nested column definitions
  const leaves = extractLeaves(columns)

  // 2. Create row ordering state
  const ordering = createRowOrdering()

  // 3. Create adapter: use ClientGridAdapter (closes over ordering) unless custom provided
  const adapter = customAdapter ?? new ClientGridAdapter<T>(ordering.order, itemValue)

  // 4. Create the data table with the grid adapter
  const table = createDataTable<T>({
    items,
    columns,
    itemValue: itemValue as never,
    filter,
    pagination,
    sortMultiple,
    adapter,
  })

  // 5. Watch sort changes to reset row order (unless preserveRowOrder)
  if (!preserveRowOrder) {
    watch(table.sort.columns, () => {
      ordering.reset()
    })
  }

  // 6. Create column layout
  const layout = createColumnLayout(columns)

  // 7. Resolve headers (toRef wrapping resolveHeaders)
  const headers = toRef(() => resolveHeaders(columns))

  // 8. Create cell editing
  const editableColumns = leaves
    .filter(col => col.editable !== undefined || col.validate !== undefined)
    .map(col => ({
      key: col.key,
      editable: col.editable as boolean | ((item: unknown) => boolean) | undefined,
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

  // 9. Create row spanning
  const columnKeys = leaves.map(col => col.key)

  const spanOptions: RowSpanningOptions<T> = {
    items: table.items as Ref<readonly T[]>,
    columns: columnKeys,
    itemKey: itemValue,
    rowSpanning,
  }

  const spans = createRowSpanning<T>(spanOptions)

  // 10. Return merged context (table + grid features)
  return {
    ...table,
    layout,
    rows: {
      order: ordering.order,
      move: ordering.move,
      reset: ordering.reset,
    },
    editing,
    headers,
    spans,
    virtual: null,
  }
}

/**
 * Creates a data grid context with dependency injection support.
 *
 * @param options Data grid context options including namespace
 * @returns A trinity tuple: [useDataGrid, provideDataGrid, defaultContext]
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
 */
export function useDataGrid<T extends Record<string, unknown>> (
  namespace = 'v0:data-grid',
): DataGridContext<T> {
  return useContext<DataGridContext<T>>(namespace)
}
