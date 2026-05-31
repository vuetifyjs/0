/**
 * @module createDataGrid
 *
 * @see https://0.vuetifyjs.com/composables/data/create-data-grid
 *
 * @remarks
 * Main factory that wires together column layout, cell editing, row ordering,
 * and row spanning on top of a createDataTable pipeline. Row ordering is
 * provided by a createSortable instance synced to the table's row registry
 * via register / unregister events; the ordered ids are applied post-sort,
 * pre-pagination by overriding the `items` projection.
 *
 * Rows are registered through the inherited registry surface (`register`,
 * `onboard`, `unregister`, `clear`) — they are not passed as an `items`
 * option to the factory.
 *
 * Follows the trinity pattern for dependency injection.
 *
 * @example
 * ```ts
 * const grid = createDataGrid({
 *   columns: [
 *     { id: 'name', sortable: true },
 *     { id: 'progress', editable: true },
 *   ],
 * })
 *
 * grid.onboard(rows.map(value => ({ id: value.id, value })))
 * grid.layout.pin('name', 'left')
 * grid.editing.edit(row.id, 'progress')
 * ```
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createDataTable } from '#v0/composables/createDataTable'
import { extractLeaves } from '#v0/composables/createDataTable/columns'
import { createSortable } from '#v0/composables/createSortable'
import { createTrinity } from '#v0/composables/createTrinity'

// Adapters
import { ClientDataTableAdapter } from '#v0/composables/createDataTable/adapters/v0'

// Grid modules
import { createCellEditing } from './editing'
import { createColumnLayout } from './layout'
import { createRowSpanning } from './spanning'

// Utilities
import { isFunction, isUndefined } from '#v0/utilities'
import { computed, shallowRef, toRef, watch } from 'vue'

// Types
import type { DataTableAdapter, DataTableContext } from '#v0/composables/createDataTable'
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationOptions } from '#v0/composables/createPagination'
import type { SortableTicketInput } from '#v0/composables/createSortable'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { CellEditing, CellEditingRegistry } from './editing'
import type { ColumnLayout, GridColumnDef } from './layout'
import type { SpanEntry } from './spanning'
import type { App, ComputedRef, Ref } from 'vue'

export type { ColumnLayout, GridColumnDef, PinnedRegion, PinPosition, ResolvedColumn } from './layout'
export type { ActiveCell, CellEditing, CellEditingOptions, CellEditingRegistry, EditableColumn } from './editing'
export type { RowSpanningOptions, SpanEntry } from './spanning'
export { ServerGridAdapter } from './adapters'
export type { ServerGridAdapterOptions } from './adapters'

export interface DataGridColumn<T extends Record<string, unknown> = Record<string, unknown>> extends GridColumnDef {
  readonly id: string
  readonly title?: string
  readonly sortable?: boolean
  readonly filterable?: boolean
  readonly sort?: (a: unknown, b: unknown) => number
  readonly filter?: (value: unknown, query: string) => boolean
  readonly editable?: boolean | ((item: T) => boolean)
  readonly validate?: (value: unknown, item?: T) => string | true
  readonly children?: readonly DataGridColumn<T>[]
}

export interface DataGridOptions<T extends Record<string, unknown>> {
  columns: readonly DataGridColumn<T>[]
  adapter?: DataTableAdapter<T>
  filter?: Omit<FilterOptions, 'keys'>
  pagination?: Omit<PaginationOptions, 'size'>
  sortMultiple?: boolean
  editing?: {
    onEdit?: (row: ID, column: string, value: unknown, item: T) => void
  }
  preserveRowOrder?: boolean
  rowSpanning?: (item: T, column: string) => number
}

export interface DataGridContext<T extends Record<string, unknown>> extends DataTableContext<T> {
  layout: ColumnLayout
  rows: {
    order: Readonly<Ref<ID[]>>
    move: (id: ID, toIndex: number) => void
    reset: () => void
  }
  editing: CellEditing
  spans: ComputedRef<Map<ID, Map<string, SpanEntry>>>
}

export interface DataGridContextOptions<T extends Record<string, unknown>> extends DataGridOptions<T> {
  namespace?: string
}

/**
 * Creates a data grid instance with layout, editing, row ordering, and spanning
 * layered on top of the createDataTable pipeline.
 *
 * Rows live on the inherited registry surface — register them with
 * `grid.onboard(rows.map(value => ({ id: value.id, value })))` or
 * `grid.register({ id, value })`.
 *
 * @param options Data grid options
 * @returns Data grid context
 *
 * @example
 * ```ts
 * const grid = createDataGrid({
 *   columns: [
 *     { id: 'name', sortable: true },
 *     { id: 'progress', editable: true, validate: v => Number(v) >= 0 || 'must be positive' },
 *   ],
 *   pagination: { initial: 1 },
 * })
 *
 * grid.onboard(rows.map(value => ({ id: value.id, value })))
 * grid.layout.pin('name', 'left')
 * grid.rows.move(rowId, 0)
 * grid.editing.edit(row.id, 'progress')
 * ```
 */
export function createDataGrid<T extends Record<string, unknown>> (
  options: DataGridOptions<T>,
): DataGridContext<T> {
  const {
    columns,
    adapter = new ClientDataTableAdapter<T>(),
    filter,
    pagination,
    sortMultiple,
    editing: editingOptions,
    preserveRowOrder = false,
    rowSpanning,
  } = options

  const leaves = extractLeaves(columns)

  const table = createDataTable<T>({
    filter,
    pagination,
    sortMultiple,
    adapter,
  })

  const sortable = createSortable<SortableTicketInput<ID>>()

  // Tracks whether the consumer has explicitly reordered rows. While false the
  // grid passes the table's own sorted+paginated projection through untouched,
  // so it stays correct for every adapter — including the server adapter, which
  // has already paginated its result.
  const dirty = shallowRef(false)

  // `createSortable` is non-reactive, so `sortable.keys()` registers no
  // reactive dependency. `revision` is the signal that the manual order
  // changed; folding it into `order` makes the ordered projection recompute on
  // every move/reset, not only the first.
  const revision = shallowRef(0)

  table.on('register:ticket', ticket => {
    sortable.register({ id: ticket.id, value: ticket.id })
  })

  table.on('unregister:ticket', ticket => {
    sortable.unregister(ticket.id)
  })

  table.on('clear:registry', () => {
    sortable.clear()
    dirty.value = false
    revision.value++
  })

  // Onboard columns into the inherited table column registry so leaves,
  // headers, sort, and filter all key off the same set of ids.
  table.columns.onboard(columns.map(col => ({
    id: col.id,
    title: col.title,
    sortable: col.sortable,
    filterable: col.filterable,
    sort: col.sort,
    filter: col.filter,
    children: col.children,
  })))

  const order = toRef(() => {
    void revision.value
    return sortable.keys() as ID[]
  })

  // Sorted ticket ids parallel to `table.sortedItems`, resolved by reference
  // identity from value back to ticket — never assumes `value.id` exists or
  // equals the registry id.
  const sortedIds = computed<ID[]>(() => {
    const byValue = new Map<T, ID>()
    for (const ticket of table.values()) byValue.set(ticket.value as T, ticket.id)

    const ids: ID[] = []
    for (const value of table.sortedItems.value) {
      const id = byValue.get(value as T)
      if (!isUndefined(id)) ids.push(id)
    }
    return ids
  })

  function move (id: ID, toIndex: number) {
    // Anchor the manual order to the currently-visible sorted order the first
    // time the consumer reorders, so a drag preserves the active sort instead
    // of snapping back to registration order. Filtered-out ids trail behind.
    if (!dirty.value) {
      const sorted = sortedIds.value
      const seen = new Set<ID>(sorted)
      const rest = (sortable.keys() as ID[]).filter(key => !seen.has(key))
      sortable.reorder([...sorted, ...rest])
    }
    sortable.move(id, toIndex)
    dirty.value = true
    revision.value++
  }

  function reset () {
    if (sortable.size > 0) {
      sortable.reorder(table.keys() as ID[])
    }
    dirty.value = false
    revision.value++
  }

  if (!preserveRowOrder) {
    watch(table.sort.columns, reset, { flush: 'sync' })
  }

  const pageOrderedItems = computed<readonly T[]>(() => {
    // No manual order: defer to the adapter's own page projection, correct for
    // client (sliced), server (pre-paged), and virtual (single page) alike.
    if (!dirty.value) return table.items.value

    const sorted = table.sortedItems.value
    const ids = sortedIds.value

    const byId = new Map<ID, T>()
    for (let i = 0; i < sorted.length; i++) byId.set(ids[i]!, sorted[i] as T)

    const seen = new Set<ID>(order.value)
    const ordered: T[] = []
    for (const id of order.value) {
      const value = byId.get(id)
      if (!isUndefined(value)) ordered.push(value)
    }
    for (const [i, element] of sorted.entries()) {
      if (!seen.has(ids[i]!)) ordered.push(element as T)
    }

    // When the adapter has already paginated (server: total exceeds the local
    // sorted slice), the global page window starts past `sorted`, so order the
    // page in place rather than re-slicing into emptiness. Client/virtual keep
    // the full set and slice to the page.
    return table.total.value > sorted.length
      ? ordered
      : ordered.slice(table.pagination.pageStart.value, table.pagination.pageStop.value)
  })

  const layout = createColumnLayout(table.columns, columns)

  const editable = leaves
    .filter(col => col.editable === true || isFunction(col.editable))
    .map(col => ({
      id: col.id,
      editable: col.editable as boolean | ((item: unknown) => boolean),
      validate: col.validate as ((value: unknown, item?: unknown) => string | true) | undefined,
    }))

  function lookup (row: ID): T | undefined {
    return table.get(row)?.value
  }

  const editing = createCellEditing({
    columns: editable,
    lookup,
    // The registry's `on` is generic per event name; createCellEditing only
    // needs the structural surface and narrows the payload inside its handler.
    registry: table as unknown as CellEditingRegistry,
    onEdit: editingOptions?.onEdit
      ? (row, column, value) => {
          const item = lookup(row)
          if (!isUndefined(item)) editingOptions.onEdit!(row, column, value, item)
        }
      : undefined,
  })

  const spans = createRowSpanning<T>({
    items: pageOrderedItems as Ref<readonly T[]>,
    columns: () => table.leaves.value.map(col => col.id),
    rowSpanning,
  })
  return {
    ...table,
    items: pageOrderedItems,
    layout,
    rows: {
      order,
      move,
      reset,
    },
    editing,
    spans,
    get size () {
      return table.size
    },
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
 * const [useDataGrid, provideDataGrid, grid] = createDataGridContext({
 *   columns,
 *   namespace: 'v0:projects',
 * })
 *
 * grid.onboard(rows.map(value => ({ id: value.id, value })))
 * provideDataGrid()
 * const ctx = useDataGrid()
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
