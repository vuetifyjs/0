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
 * - Selection strategies: single, page, all
 * - Per-column custom sort/filter functions
 * - Row selectability control via itemSelectable
 * - Sort options: mandate, firstSortOrder
 * - Row selection via lightweight Set (not registry-based)
 * - Trinity pattern for dependency injection
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createGroup } from '#v0/composables/createGroup'
import { useLocale } from '#v0/composables/useLocale'

// Adapters
import { ClientAdapter } from './adapters/v0'

// Utilities
import { instanceExists, isNumber, isNullOrUndefined, isString } from '#v0/utilities'
import { computed, shallowReactive, shallowRef } from 'vue'

// Types
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationContext, PaginationOptions } from '#v0/composables/createPagination'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { DataTableAdapterInterface, SortDirection, SortEntry } from './adapters/adapter'
import type { App, ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Re-export adapter types
export { DataTableAdapter } from './adapters'
export type { DataTableAdapterContext, DataTableAdapterInterface, DataTableAdapterResult, SortDirection, SortEntry } from './adapters'
export { ClientAdapter, ServerAdapter, VirtualAdapter } from './adapters'
export type { ServerAdapterOptions } from './adapters'

/** Extract keys of T whose value type extends V */
type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T] & string

export type SelectStrategy = 'single' | 'page' | 'all'

export interface DataTableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly key: keyof T & string
  readonly title?: string
  readonly sortable?: boolean
  readonly filterable?: boolean
  /** Custom sort comparator for this column */
  readonly sort?: (a: unknown, b: unknown) => number
  /** Custom filter function for this column */
  readonly filter?: (value: unknown, query: string) => boolean
}

export interface DataTableSort {
  /** Toggle sort for a column: none → asc → desc → none */
  toggle: (key: string) => void
  /** Current sort columns derived from group state */
  columns: ComputedRef<SortEntry[]>
  /** Order of sort columns (for multi-sort priority) */
  order: readonly string[]
  /** Get sort direction for a specific column key */
  direction: (key: string) => SortDirection
  /** Get ARIA-ready sort value for a column key */
  ariaSort: (key: string) => 'ascending' | 'descending' | 'none'
  /** Get sort priority index (0-based), or -1 if not sorted */
  priority: (key: string) => number
  /** Reset all sort state */
  reset: () => void
}

export interface DataTableSelection {
  /** Currently selected row IDs */
  selectedIds: ReadonlySet<ID>
  /** Select a row by ID */
  select: (id: ID) => void
  /** Unselect a row by ID */
  unselect: (id: ID) => void
  /** Toggle a row's selection */
  toggle: (id: ID) => void
  /** Whether a row is selected */
  isSelected: (id: ID) => boolean
  /** Whether a row can be selected (based on itemSelectable) */
  isSelectable: (id: ID) => boolean
  /** Select all items within strategy scope */
  selectAll: () => void
  /** Unselect all items across all pages */
  unselectAll: () => void
  /** Toggle all items within strategy scope */
  toggleAll: () => void
  /** Whether all items within strategy scope are selected */
  isAllSelected: ComputedRef<boolean>
  /** Whether some but not all items within strategy scope are selected */
  isMixed: ComputedRef<boolean>
}

export interface DataTableGroup<T extends Record<string, unknown>> {
  /** Stringified group identifier */
  key: string
  /** Raw value of the groupBy column for this group */
  value: unknown
  /** Items belonging to this group */
  items: readonly T[]
}

export interface DataTableGrouping<T extends Record<string, unknown>> {
  /** Grouped items derived from sortedItems */
  groups: ComputedRef<DataTableGroup<T>[]>
  /** Toggle a group's open/closed state */
  toggle: (groupKey: string) => void
  /** Whether a group is opened */
  opened: (groupKey: string) => boolean
  /** Open a group */
  open: (groupKey: string) => void
  /** Close a group */
  close: (groupKey: string) => void
  /** Open all groups */
  openAll: () => void
  /** Close all groups */
  closeAll: () => void
}

export interface DataTableExpansion {
  /** Currently expanded row IDs */
  expandedIds: ReadonlySet<ID>
  /** Expand a row by ID */
  expand: (id: ID) => void
  /** Collapse a row by ID */
  collapse: (id: ID) => void
  /** Toggle a row's expanded state */
  toggle: (id: ID) => void
  /** Whether a row is expanded */
  isExpanded: (id: ID) => boolean
  /** Expand all visible (paginated) items. Requires expandMultiple=true. */
  expandAll: () => void
  /** Collapse all expanded items across all pages (not page-scoped like expandAll) */
  collapseAll: () => void
}

export interface DataTableOptions<T extends Record<string, unknown>> {
  /** Source items */
  items: MaybeRefOrGetter<T[]>
  /** Column definitions */
  columns: readonly DataTableColumn<T>[]
  /** Property used as row identifier. Must resolve to a string or number value. @default 'id' */
  itemValue?: KeysOfType<T, ID>
  /** Filter options (keys derived from columns) */
  filter?: Omit<FilterOptions, 'keys'>
  /** Pagination options (size derived from pipeline) */
  pagination?: Omit<PaginationOptions, 'size'>
  /** Enable multi-column sort. @default false */
  sortMultiple?: boolean
  /** Prevent clearing sort (asc → desc → asc cycle). @default false */
  mandate?: boolean
  /** Direction for first sort click. @default 'asc' */
  firstSortOrder?: 'asc' | 'desc'
  /** Selection strategy: 'single' selects one row, 'page' operates on visible items, 'all' operates on all filtered items. @default 'page' */
  selectStrategy?: SelectStrategy
  /** Property that controls per-row selectability */
  itemSelectable?: keyof T & string
  /** Column key to group rows by */
  groupBy?: keyof T & string
  /** Allow multiple rows expanded simultaneously. @default true */
  expandMultiple?: boolean
  /** Locale for sorting (defaults to useLocale's selected locale or browser default) */
  locale?: string
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
  columns: readonly DataTableColumn<T>[]
  /** Set the search query */
  search: (value: string) => void
  /** Current search query (readonly) */
  query: Readonly<ShallowRef<string>>
  /** Sort controls */
  sort: DataTableSort
  /** Pagination controls */
  pagination: PaginationContext
  /** Row selection controls */
  selection: DataTableSelection
  /** Row expansion controls */
  expansion: DataTableExpansion
  /** Row grouping controls (only present when groupBy is set) */
  grouping: DataTableGrouping<T>
  /** Total row count for aria-rowcount */
  total: ComputedRef<number>
  /** Loading state (managed by adapter) */
  loading: ComputedRef<boolean>
  /** Error state (managed by adapter) */
  error: ComputedRef<Error | null>
}

export interface DataTableContextOptions<T extends Record<string, unknown>> extends DataTableOptions<T> {
  namespace?: string
}

/**
 * Creates a data table instance with sort controls, selection, and an
 * adapter-driven data pipeline.
 *
 * Must be called inside a component `setup()` or a Vue effect scope.
 * Calling at module scope in SSR environments causes request state leakage.
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
 * table.search('john')
 *
 * // Sort
 * table.sort.toggle('name')          // asc
 * table.sort.toggle('name')          // desc
 * table.sort.toggle('name')          // none
 * console.log(table.sort.columns.value) // [{ key: 'name', direction: 'asc' }]
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
    itemValue = 'id' as KeysOfType<T, ID>,
    filter: filterOptions = {},
    pagination: paginationOptions = {},
    sortMultiple = false,
    mandate = false,
    firstSortOrder = 'asc',
    selectStrategy = 'page',
    itemSelectable,
    groupBy,
    expandMultiple = true,
    locale: initialLocale,
    adapter = new ClientAdapter<T>(),
  } = options

  const _query = shallowRef('')

  function search (value: string) {
    _query.value = value
  }

  // Resolve locale: useLocale selection > initial option > undefined (browser default)
  let selectedLocaleId: Ref<ID | undefined> | undefined

  try {
    if (instanceExists()) {
      selectedLocaleId = useLocale().selectedId
    }
  } catch {
    // useLocale not available, use default
  }

  const locale = computed(() => {
    const selected = selectedLocaleId?.value

    if (!isNullOrUndefined(selected)) return String(selected)

    return initialLocale
  })

  const sortable = columns.filter(col => col.sortable === true)

  const group = createGroup({ multiple: sortMultiple })

  // Register sortable columns as tickets
  group.onboard(
    sortable.map(col => ({ id: col.key, value: col.key })),
  )

  // Track sort order for multi-sort priority
  const order = shallowReactive<string[]>([])

  // Sort cycle depends on firstSortOrder and mandate:
  // firstSortOrder='asc':  none → asc → desc → none  (or → asc with mandate)
  // firstSortOrder='desc': none → desc → asc → none  (or → desc with mandate)
  function toggle (key: string) {
    if (!group.has(key)) return

    const isAsc = group.selectedIds.has(key)
    const isDesc = group.mixed(key)

    function clearOthers () {
      if (!sortMultiple) {
        group.mixedIds.clear()
        order.length = 0
      }
    }

    function setAsc () {
      group.unmix(key)
      group.select(key)
    }
    function setDesc () {
      group.unselect(key)
      group.mix(key)
    }
    function setNone () {
      group.unselect(key)
      group.unmix(key)
      const idx = order.indexOf(key)
      if (idx !== -1) order.splice(idx, 1)
    }

    if (!isAsc && !isDesc) {
      // none → first direction
      clearOthers()
      if (firstSortOrder === 'desc') setDesc()
      else setAsc()
      order.push(key)
    } else if (isAsc) {
      // asc is last step when firstSortOrder='desc'
      if (firstSortOrder === 'desc' && !mandate) setNone()
      else setDesc()
    } else {
      // desc is last step when firstSortOrder='asc'
      if (firstSortOrder === 'asc' && !mandate) setNone()
      else setAsc()
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

  function ariaSort (key: string): 'ascending' | 'descending' | 'none' {
    const dir = direction(key)
    if (dir === 'asc') return 'ascending'
    if (dir === 'desc') return 'descending'
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
    columns: sortBy,
    order: order as readonly string[],
    direction,
    ariaSort,
    priority,
    reset,
  }

  const filterable = columns
    .filter(col => col.filterable === true)
    .map(col => col.key)

  // Build per-column custom sort comparators
  const customSorts: Record<string, (a: unknown, b: unknown) => number> = {}
  for (const col of columns) {
    if (col.sort) customSorts[col.key] = col.sort
  }

  // Build per-column custom filter functions
  const customColumnFilters: Record<string, (value: unknown, query: string) => boolean> = {}
  for (const col of columns) {
    if (col.filter) customColumnFilters[col.key] = col.filter
  }

  const {
    allItems,
    filteredItems,
    sortedItems,
    items: visible,
    pagination,
    total,
    loading = computed(() => false),
    error = computed(() => null),
  } = adapter.setup({
    items: _items,
    search: _query,
    filterableKeys: filterable,
    sortBy,
    locale,
    filterOptions,
    paginationOptions,
    customSorts,
    customColumnFilters,
  })

  const selectedIds = shallowReactive(new Set<ID>())

  function rowId (item: T): ID {
    const value = item[itemValue]
    if (isString(value) || isNumber(value)) return value
    throw new Error(`[v0:data-table] itemValue "${itemValue}" must resolve to a string or number`)
  }

  function isSelectable (id: ID): boolean {
    if (!itemSelectable) return true
    for (const item of allItems.value) {
      if (rowId(item) === id) return !!item[itemSelectable]
    }
    return false
  }

  // Strategy-scoped items for selectAll/toggleAll/isAllSelected
  // 'single': no bulk ops, 'page': visible items, 'all': all sorted (filtered) items
  const scopeItems = computed(() => {
    if (selectStrategy === 'single') return []
    return selectStrategy === 'all' ? sortedItems.value : visible.value
  })

  const selectableScope = computed(() => {
    if (!itemSelectable) return scopeItems.value
    return scopeItems.value.filter(item => !!item[itemSelectable])
  })

  const selection: DataTableSelection = {
    selectedIds: selectedIds as ReadonlySet<ID>,
    select (id: ID) {
      if (!isSelectable(id)) return
      if (selectStrategy === 'single') selectedIds.clear()
      selectedIds.add(id)
    },
    unselect (id: ID) {
      selectedIds.delete(id)
    },
    toggle (id: ID) {
      if (selectedIds.has(id)) {
        selectedIds.delete(id)
      } else {
        selection.select(id)
      }
    },
    isSelected (id: ID) {
      return selectedIds.has(id)
    },
    isSelectable,
    selectAll () {
      for (const item of selectableScope.value) {
        selectedIds.add(rowId(item))
      }
    },
    unselectAll () {
      selectedIds.clear()
    },
    toggleAll () {
      if (selectStrategy === 'single') return
      if (selection.isAllSelected.value) {
        for (const item of selectableScope.value) {
          selectedIds.delete(rowId(item))
        }
      } else {
        selection.selectAll()
      }
    },
    isAllSelected: computed(() => {
      const items = selectableScope.value
      if (items.length === 0) return false
      return items.every(item => selectedIds.has(rowId(item)))
    }),
    isMixed: computed(() => {
      const items = selectableScope.value
      if (items.length === 0) return false
      const some = items.some(item => selectedIds.has(rowId(item)))
      return some && !selection.isAllSelected.value
    }),
  }

  const expandedIds = shallowReactive(new Set<ID>())

  const expansion: DataTableExpansion = {
    expandedIds: expandedIds as ReadonlySet<ID>,
    expand (id: ID) {
      if (!expandMultiple) expandedIds.clear()
      expandedIds.add(id)
    },
    collapse (id: ID) {
      expandedIds.delete(id)
    },
    toggle (id: ID) {
      if (expandedIds.has(id)) {
        expandedIds.delete(id)
      } else {
        expansion.expand(id)
      }
    },
    isExpanded (id: ID) {
      return expandedIds.has(id)
    },
    expandAll () {
      if (!expandMultiple) return
      for (const item of visible.value) {
        expandedIds.add(rowId(item))
      }
    },
    collapseAll () {
      expandedIds.clear()
    },
  }

  // ---- Grouping ----

  const openGroupKeys = shallowReactive(new Set<string>())

  const groups = computed<DataTableGroup<T>[]>(() => {
    if (!groupBy) return []

    const map = new Map<string, { value: unknown, items: T[] }>()

    for (const item of sortedItems.value) {
      const raw = item[groupBy]
      const key = String(raw ?? '')

      let entry = map.get(key)
      if (!entry) {
        entry = { value: raw, items: [] }
        map.set(key, entry)
      }
      entry.items.push(item)
    }

    const result: DataTableGroup<T>[] = []
    for (const [key, entry] of map) {
      result.push({ key, value: entry.value, items: entry.items })
    }
    return result
  })

  const grouping: DataTableGrouping<T> = {
    groups,
    toggle (groupKey: string) {
      if (openGroupKeys.has(groupKey)) {
        openGroupKeys.delete(groupKey)
      } else {
        openGroupKeys.add(groupKey)
      }
    },
    opened (groupKey: string) {
      return openGroupKeys.has(groupKey)
    },
    open (groupKey: string) {
      openGroupKeys.add(groupKey)
    },
    close (groupKey: string) {
      openGroupKeys.delete(groupKey)
    },
    openAll () {
      for (const group of groups.value) {
        openGroupKeys.add(group.key)
      }
    },
    closeAll () {
      openGroupKeys.clear()
    },
  }

  return {
    items: visible,
    allItems,
    filteredItems,
    sortedItems,
    columns,
    search,
    query: _query as Readonly<ShallowRef<string>>,
    sort,
    pagination,
    selection,
    expansion,
    grouping,
    total,
    loading,
    error,
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
 * const [useDataTable, provideDataTable, context] = createDataTableContext({
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
