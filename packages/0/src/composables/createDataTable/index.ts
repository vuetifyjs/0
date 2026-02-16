/**
 * @module createDataTable
 *
 * @remarks
 * Composable data table that composes existing v0 primitives rather than
 * reimplementing their logic. Uses createGroup's tri-state for sort direction
 * and delegates the data pipeline (filter, sort, paginate) to an adapter.
 *
 * Key features:
 * - Adapter pattern for pipeline strategy (client, server, virtual)
 * - Sort via createGroup tri-state: selected=asc, mixed=desc, unselected=none
 * - Row selection via lightweight Set (not registry-based)
 * - Trinity pattern for dependency injection
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createGroup } from '#v0/composables/createGroup'

// Adapters
import { ClientAdapter } from './adapters/v0'

// Utilities
import { isNumber, isString } from '#v0/utilities'
import { computed, shallowReactive, shallowRef } from 'vue'

// Types
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationContext, PaginationOptions } from '#v0/composables/createPagination'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { DataTableAdapterInterface, SortDirection, SortEntry } from './adapters/adapter'
import type { App, ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

// Re-export adapter types
export { DataTableAdapter } from './adapters'
export type { DataTableAdapterContext, DataTableAdapterInterface, DataTableAdapterResult, SortDirection, SortEntry } from './adapters'
export { ClientAdapter, ServerAdapter, VirtualAdapter } from './adapters'
export type { ServerAdapterOptions } from './adapters'

export interface DataTableColumn {
  key: string
  title?: string
  sortable?: boolean
  filterable?: boolean
}

export interface DataTableSort {
  /** Toggle sort for a column: none → asc → desc → none */
  toggle: (key: string) => void
  /** Current sort entries derived from group state */
  entries: ComputedRef<SortEntry[]>
  /** Order of sort columns (for multi-sort priority) */
  order: readonly string[]
  /** Get sort direction for a specific column key */
  direction: (key: string) => SortDirection
  /** Get sort priority index (0-based), or -1 if not sorted */
  priority: (key: string) => number
  /** Reset all sort state */
  reset: () => void
}

export interface DataTableSelection {
  /** Currently selected row IDs */
  selectedIds: Set<ID>
  /** Select a row by ID */
  select: (id: ID) => void
  /** Unselect a row by ID */
  unselect: (id: ID) => void
  /** Toggle a row's selection */
  toggle: (id: ID) => void
  /** Whether a row is selected */
  isSelected: (id: ID) => boolean
  /** Select all visible items */
  selectAll: () => void
  /** Unselect all items */
  unselectAll: () => void
  /** Toggle all visible items */
  toggleAll: () => void
  /** Whether all visible items are selected */
  isAllSelected: ComputedRef<boolean>
  /** Whether some but not all visible items are selected */
  isMixed: ComputedRef<boolean>
}

export interface DataTableOptions<T extends Record<string, unknown>> {
  /** Source items */
  items: MaybeRefOrGetter<T[]>
  /** Column definitions */
  columns: DataTableColumn[]
  /** Property used as row identifier. @default 'id' */
  itemValue?: string
  /** External search ref for v-model */
  search?: ShallowRef<string>
  /** Filter options (keys derived from columns) */
  filter?: Omit<FilterOptions, 'keys'>
  /** Pagination options (size derived from pipeline) */
  pagination?: Omit<PaginationOptions, 'size'>
  /** Enable multi-column sort. @default false */
  sortMultiple?: boolean
  /** Pipeline adapter. @default ClientAdapter */
  adapter?: DataTableAdapterInterface<T>
}

export interface DataTableContext<T extends Record<string, unknown>> {
  /** Final paginated items for rendering */
  items: ComputedRef<readonly T[]>
  /** Raw unprocessed items */
  allItems: ComputedRef<readonly T[]>
  /** Items after filtering */
  filteredItems: ComputedRef<readonly T[]>
  /** Items after filtering and sorting */
  sortedItems: ComputedRef<readonly T[]>
  /** Column definitions */
  columns: DataTableColumn[]
  /** Search query ref */
  search: ShallowRef<string>
  /** Sort controls */
  sort: DataTableSort
  /** Pagination controls */
  pagination: PaginationContext
  /** Row selection controls */
  selection: DataTableSelection
  /** Total row count for aria-rowcount */
  total: ComputedRef<number>
}

export interface DataTableContextOptions<T extends Record<string, unknown>> extends DataTableOptions<T> {
  namespace?: string
}

/**
 * Creates a data table instance with sort controls, selection, and an
 * adapter-driven data pipeline.
 *
 * @param options Data table options
 * @returns Data table context with pipeline stages and controls
 *
 * @example
 * ```ts
 * import { createDataTable } from '@vuetify/v0'
 *
 * const table = createDataTable({
 *   items: users,
 *   columns: [
 *     { key: 'name', title: 'Name', sortable: true, filterable: true },
 *     { key: 'email', title: 'Email', sortable: true, filterable: true },
 *     { key: 'age', title: 'Age', sortable: true },
 *   ],
 * })
 *
 * // Search
 * table.search.value = 'john'
 *
 * // Sort
 * table.sort.toggle('name')          // asc
 * table.sort.toggle('name')          // desc
 * table.sort.toggle('name')          // none
 * console.log(table.sort.entries.value) // [{ key: 'name', direction: 'asc' }]
 *
 * // Paginate
 * table.pagination.next()
 *
 * // Select rows
 * table.selection.toggle('user-1')
 * ```
 */
export function createDataTable<T extends Record<string, unknown>> (
  options: DataTableOptions<T>,
): DataTableContext<T> {
  const {
    items: _items,
    columns,
    itemValue = 'id',
    search: _search,
    filter: filterOptions = {},
    pagination: paginationOptions = {},
    sortMultiple = false,
    adapter = new ClientAdapter<T>(),
  } = options

  const search = _search ?? shallowRef('')

  const sortable = columns.filter(col => col.sortable === true)

  const group = createGroup({ multiple: sortMultiple })

  // Register sortable columns as tickets
  group.onboard(
    sortable.map(col => ({ id: col.key, value: col.key })),
  )

  // Track sort order for multi-sort priority
  const order = shallowReactive<string[]>([])

  function toggle (key: string) {
    if (!group.has(key)) return

    const isSelected = group.selectedIds.has(key)
    const isMixed = group.mixed(key)

    if (!isSelected && !isMixed) {
      // none → asc (select)
      if (!sortMultiple) {
        // Clear mixedIds since createGroup's select() only clears selectedIds
        group.mixedIds.clear()
        order.length = 0
      }
      group.select(key)
      order.push(key)
    } else if (isSelected) {
      // asc → desc (selected → mixed)
      group.unselect(key)
      group.mix(key)
    } else {
      // desc → none (mixed → unselected)
      group.unmix(key)
      const idx = order.indexOf(key)
      if (idx !== -1) order.splice(idx, 1)
    }
  }

  const sortBy = computed<SortEntry[]>(() => {
    const result: SortEntry[] = []

    for (const key of order) {
      if (group.selectedIds.has(key)) {
        result.push({ key, direction: 'asc' })
      } else if (group.mixed(key)) {
        result.push({ key, direction: 'desc' })
      }
    }

    return result
  })

  function direction (key: string): SortDirection {
    if (group.selectedIds.has(key)) return 'asc'
    if (group.mixed(key)) return 'desc'
    return 'none'
  }

  function priority (key: string): number {
    return order.indexOf(key)
  }

  function reset () {
    group.unselectAll()
    group.mixedIds.clear()
    order.length = 0
  }

  const sort: DataTableSort = {
    toggle,
    entries: sortBy,
    order: order as readonly string[],
    direction,
    priority,
    reset,
  }

  const filterable = columns
    .filter(col => col.filterable !== false)
    .map(col => col.key)

  const {
    allItems,
    filteredItems,
    sortedItems,
    items: visible,
    pagination,
    total,
  } = adapter.setup({
    items: _items,
    search,
    filterableKeys: filterable,
    sortBy,
    filterOptions,
    paginationOptions,
  })

  const selectedIds = shallowReactive(new Set<ID>())

  function rowId (item: T): ID {
    const value = item[itemValue]
    if (isString(value) || isNumber(value)) return value
    throw new Error(`[v0:data-table] itemValue "${itemValue}" must resolve to a string or number`)
  }

  const selection: DataTableSelection = {
    selectedIds,
    select (id: ID) {
      selectedIds.add(id)
    },
    unselect (id: ID) {
      selectedIds.delete(id)
    },
    toggle (id: ID) {
      if (selectedIds.has(id)) {
        selectedIds.delete(id)
      } else {
        selectedIds.add(id)
      }
    },
    isSelected (id: ID) {
      return selectedIds.has(id)
    },
    selectAll () {
      for (const item of visible.value) {
        selectedIds.add(rowId(item))
      }
    },
    unselectAll () {
      selectedIds.clear()
    },
    toggleAll () {
      if (selection.isAllSelected.value) {
        // Unselect only visible items
        for (const item of visible.value) {
          selectedIds.delete(rowId(item))
        }
      } else {
        selection.selectAll()
      }
    },
    isAllSelected: computed(() => {
      const items = visible.value
      if (items.length === 0) return false
      return items.every(item => selectedIds.has(rowId(item)))
    }),
    isMixed: computed(() => {
      const items = visible.value
      if (items.length === 0) return false
      const some = items.some(item => selectedIds.has(rowId(item)))
      return some && !selection.isAllSelected.value
    }),
  }

  return {
    items: visible,
    allItems,
    filteredItems,
    sortedItems,
    columns,
    search,
    sort,
    pagination,
    selection,
    total,
  }
}

/**
 * Creates a data table context with dependency injection support.
 *
 * @param options Data table context options including namespace
 * @returns A trinity tuple: [useDataTable, provideDataTable, defaultContext]
 *
 * @example
 * ```ts
 * import { createDataTableContext } from '@vuetify/v0'
 *
 * const [useDataTable, provideDataTable, dataTable] = createDataTableContext({
 *   namespace: 'app:users',
 *   items: users,
 *   columns: [
 *     { key: 'name', title: 'Name', sortable: true },
 *   ],
 * })
 *
 * // Parent component
 * provideDataTable()
 *
 * // Child component
 * const table = useDataTable()
 * ```
 */
export function createDataTableContext<T extends Record<string, unknown>> (
  _options: DataTableContextOptions<T>,
): ContextTrinity<DataTableContext<T>> {
  const { namespace = 'v0:data-table', ...options } = _options
  const [useDataTableContext, _provideDataTableContext] = createContext<DataTableContext<T>>(namespace)
  const context = createDataTable(options)

  function provideDataTableContext (_context: DataTableContext<T> = context, app?: App): DataTableContext<T> {
    return _provideDataTableContext(_context, app)
  }

  return createTrinity<DataTableContext<T>>(useDataTableContext, provideDataTableContext, context)
}

/**
 * Returns the current data table context from dependency injection.
 *
 * @param namespace The namespace for the data table context. @default 'v0:data-table'
 * @returns The current data table context
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useDataTable } from '@vuetify/v0'
 *
 *   const table = useDataTable()
 * </script>
 * ```
 */
export function useDataTable<T extends Record<string, unknown>> (
  namespace = 'v0:data-table',
): DataTableContext<T> {
  return useContext<DataTableContext<T>>(namespace)
}
