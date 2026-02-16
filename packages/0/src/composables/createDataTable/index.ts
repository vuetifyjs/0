/**
 * @module createDataTable
 *
 * @remarks
 * Composable data table that composes existing v0 primitives rather than
 * reimplementing their logic. Uses createFilter for search, createGroup's
 * tri-state for sort direction, and createPagination for page navigation.
 *
 * Key features:
 * - Pipeline: rawItems → filter → sort → paginate → visible items
 * - Sort via createGroup tri-state: selected=asc, mixed=desc, unselected=none
 * - Row selection via lightweight Set (not registry-based)
 * - Auto page reset on filter/sort changes
 * - Trinity pattern for dependency injection
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createFilter } from '#v0/composables/createFilter'
import { createGroup } from '#v0/composables/createGroup'
import { createPagination } from '#v0/composables/createPagination'

// Utilities
import { isNumber, isString, isUndefined } from '#v0/utilities'
import { computed, shallowReactive, shallowRef, toValue, watch } from 'vue'

// Types
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationContext, PaginationOptions } from '#v0/composables/createPagination'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

// ---- Types ----

export type SortDirection = 'asc' | 'desc' | 'none'

export interface DataTableColumn {
  key: string
  title?: string
  sortable?: boolean
  filterable?: boolean
}

export interface DataTableSort {
  /** Toggle sort for a column: none → asc → desc → none */
  toggle: (key: string) => void
  /** Current sort-by entries derived from group state */
  sortBy: ComputedRef<Array<{ key: string, direction: SortDirection }>>
  /** Order of sort columns (for multi-sort priority) */
  order: readonly string[]
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
}

export interface DataTableContext<T extends Record<string, unknown>> {
  /** Final paginated items for rendering */
  items: ComputedRef<T[]>
  /** Raw unprocessed items */
  allItems: ComputedRef<T[]>
  /** Items after filtering */
  filteredItems: ComputedRef<T[]>
  /** Items after filtering and sorting */
  sortedItems: ComputedRef<T[]>
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
}

export interface DataTableContextOptions<T extends Record<string, unknown>> extends DataTableOptions<T> {
  namespace?: string
}

// ---- Helpers ----

function getNestedValue (obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.')
  let result: unknown = obj
  for (const k of keys) {
    if (isUndefined(result) || result === null) return undefined
    result = (result as Record<string, unknown>)[k]
  }
  return result
}

function compareValues (a: unknown, b: unknown): number {
  if (a === b) return 0
  if (isUndefined(a) || a === null) return 1
  if (isUndefined(b) || b === null) return -1

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a).localeCompare(String(b))
}

// ---- Factory ----

/**
 * Creates a data table instance composing filter, sort, and pagination primitives.
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
 * table.sort.toggle('name') // asc
 * table.sort.toggle('name') // desc
 * table.sort.toggle('name') // none
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
  } = options

  // ---- Search / Filter ----

  const search = _search ?? shallowRef('')

  const filterableKeys = columns
    .filter(col => col.filterable !== false)
    .map(col => col.key)

  const filter = createFilter({
    ...filterOptions,
    keys: filterableKeys,
  })

  const allItems = computed(() => toValue(_items))
  const { items: filteredItems } = filter.apply(search, allItems)

  // ---- Sort via createGroup ----

  const sortableColumns = columns.filter(col => col.sortable === true)

  const sortGroup = createGroup({ multiple: sortMultiple })

  // Register sortable columns as tickets
  sortGroup.onboard(
    sortableColumns.map(col => ({ id: col.key, value: col.key })),
  )

  // Track sort order for multi-sort priority
  const sortOrder = shallowReactive<string[]>([])

  function toggleSort (key: string) {
    if (!sortGroup.has(key)) return

    const isSelected = sortGroup.selectedIds.has(key)
    const isMixed = sortGroup.mixed(key)

    if (!isSelected && !isMixed) {
      // none → asc (select)
      if (!sortMultiple) {
        // Clear mixedIds since createGroup's select() only clears selectedIds
        sortGroup.mixedIds.clear()
        sortOrder.length = 0
      }
      sortGroup.select(key)
      sortOrder.push(key)
    } else if (isSelected) {
      // asc → desc (selected → mixed)
      sortGroup.unselect(key)
      sortGroup.mix(key)
    } else {
      // desc → none (mixed → unselected)
      sortGroup.unmix(key)
      const idx = sortOrder.indexOf(key)
      if (idx !== -1) sortOrder.splice(idx, 1)
    }
  }

  const sortBy = computed(() => {
    const entries: Array<{ key: string, direction: SortDirection }> = []

    for (const key of sortOrder) {
      if (sortGroup.selectedIds.has(key)) {
        entries.push({ key, direction: 'asc' })
      } else if (sortGroup.mixed(key)) {
        entries.push({ key, direction: 'desc' })
      }
    }

    return entries
  })

  function resetSort () {
    sortGroup.unselectAll()
    sortGroup.mixedIds.clear()
    sortOrder.length = 0
  }

  const sort: DataTableSort = {
    toggle: toggleSort,
    sortBy,
    order: sortOrder,
    reset: resetSort,
  }

  // ---- Sort pipeline ----

  const sortedItems = computed(() => {
    const entries = sortBy.value
    if (entries.length === 0) return filteredItems.value

    const items = [...filteredItems.value]

    items.sort((a, b) => {
      for (const { key, direction } of entries) {
        const aVal = getNestedValue(a, key)
        const bVal = getNestedValue(b, key)
        const cmp = compareValues(aVal, bVal)
        if (cmp !== 0) return direction === 'desc' ? -cmp : cmp
      }
      return 0
    })

    return items
  })

  // ---- Pagination ----

  const pagination = createPagination({
    ...paginationOptions,
    size: computed(() => sortedItems.value.length),
  })

  const paginatedItems = computed(() => {
    return sortedItems.value.slice(pagination.pageStart.value, pagination.pageStop.value)
  })

  // ---- Page reset on filter/sort changes ----

  watch([search, sortBy], () => {
    pagination.first()
  })

  // ---- Row selection ----

  const selectedIds = shallowReactive(new Set<ID>())

  function getRowId (item: T): ID {
    const value = item[itemValue]
    if (!isString(value) && !isNumber(value)) {
      throw new Error(`[v0:data-table] itemValue "${itemValue}" must resolve to a string or number`)
    }
    return value
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
      for (const item of paginatedItems.value) {
        selectedIds.add(getRowId(item))
      }
    },
    unselectAll () {
      selectedIds.clear()
    },
    toggleAll () {
      if (selection.isAllSelected.value) {
        // Unselect only visible items
        for (const item of paginatedItems.value) {
          selectedIds.delete(getRowId(item))
        }
      } else {
        selection.selectAll()
      }
    },
    isAllSelected: computed(() => {
      const visible = paginatedItems.value
      if (visible.length === 0) return false
      return visible.every(item => selectedIds.has(getRowId(item)))
    }),
    isMixed: computed(() => {
      const visible = paginatedItems.value
      if (visible.length === 0) return false
      const some = visible.some(item => selectedIds.has(getRowId(item)))
      return some && !selection.isAllSelected.value
    }),
  }

  return {
    items: paginatedItems,
    allItems,
    filteredItems,
    sortedItems,
    columns,
    search,
    sort,
    pagination,
    selection,
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
