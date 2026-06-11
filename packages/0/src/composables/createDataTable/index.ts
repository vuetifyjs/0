/**
 * @module createDataTable
 *
 * @see https://0.vuetifyjs.com/composables/data/create-data-table
 *
 * @remarks
 * Composable data table that composes existing v0 primitives rather than
 * reimplementing their logic. Uses createGroup's tri-state for sort direction
 * and delegates the data pipeline (filter, sort, paginate) to an adapter.
 *
 * Rows and columns are both managed via internal registries. Call
 * `table.columns.onboard([...])` / `table.columns.register({...})` to add
 * columns and `table.onboard([...])` / `table.register({...})` for rows.
 * Row identity is the ticket id (caller-supplied or auto-generated); column
 * identity is the caller-supplied `id` (required — no auto-generation).
 * The row registry is non-reactive: iterate rows via `items` / `allItems`
 * and update a row via `upsert(id, { value })` — never mutate a ticket's
 * value in place or iterate raw `values()` in templates or computeds.
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
 *
 * @example
 * ```ts
 * import { createDataTable } from '@vuetify/v0'
 *
 * const table = createDataTable<User>()
 *
 * table.columns.onboard([
 *   { id: 'name', title: 'Name', sortable: true },
 *   { id: 'email', title: 'Email', filterable: true },
 * ])
 *
 * table.onboard([
 *   { id: 1, value: { id: 1, name: 'Alice', email: 'alice@test.com' } },
 *   { id: 2, value: { id: 2, name: 'Bob', email: 'bob@test.com' } },
 * ])
 *
 * table.sort.toggle('name')
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createGroup } from '#v0/composables/createGroup'
import { createRegistry } from '#v0/composables/createRegistry'
import { createTrinity } from '#v0/composables/createTrinity'
import { useLocale } from '#v0/composables/useLocale'
import { useProxyRegistry } from '#v0/composables/useProxyRegistry'

// Adapters
import { ClientDataTableAdapter } from './adapters/v0'

// Column utilities
import { extractLeaves, resolveHeaders } from './columns'

// Utilities
import { isNullOrUndefined } from '#v0/utilities'
import { computed, shallowReactive, shallowReadonly, shallowRef, toRef, watch } from 'vue'

// Types
import type { FilterOptions } from '#v0/composables/createFilter'
import type { PaginationContext, PaginationOptions } from '#v0/composables/createPagination'
import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { Extensible, ID } from '#v0/types'
import type { DataTableAdapter, SortDirection, SortEntry } from './adapters/adapter'
import type { InternalHeader } from './columns'
import type { Ref, ShallowRef } from 'vue'

// Exports
export { DataTableAdapter } from './adapters'
export type { DataTableAdapterContext, DataTableAdapterResult, SortDirection, SortEntry } from './adapters'
export { ClientDataTableAdapter, ServerDataTableAdapter, VirtualDataTableAdapter } from './adapters'
export type { ServerDataTableAdapterOptions } from './adapters'

// Re-export column utilities
export { computeDepth, extractLeaves, resolveHeaders } from './columns'
export type { ColumnNode, InternalHeader } from './columns'

export type SelectStrategy = 'single' | 'page' | 'all'

/**
 * Input shape passed to `register` / `onboard` on a data table's row registry.
 *
 * @template T Row value type.
 *
 * @example
 * ```ts
 * const table = createDataTable<User>()
 * table.register({ id: user.id, value: user })
 * ```
 */
export type DataTableTicketInput<T extends Record<string, unknown>> = RegistryTicketInput<T>

/**
 * Output ticket returned by row `register` / `onboard` / `get`.
 *
 * @template T Row value type.
 */
export type DataTableTicket<T extends Record<string, unknown>> = RegistryTicket<T> & DataTableTicketInput<T>

/**
 * Input shape passed to `table.columns.register` / `table.columns.onboard`.
 *
 * `id` is required and acts as the column identifier — selection, sort, and
 * filter all key off it. The `Extensible<keyof T & string>` shape preserves
 * autocomplete for the row's own keys while still accepting arbitrary strings
 * for derived columns (computed totals, action columns, etc.).
 *
 * @template T Row value type.
 *
 * @example
 * ```ts
 * import { createDataTable } from '@vuetify/v0'
 *
 * interface User { id: number, name: string, email: string }
 *
 * const table = createDataTable<User>()
 * table.columns.register({ id: 'name', title: 'Name', sortable: true })
 * table.columns.register({
 *   id: 'actions',
 *   title: '',
 *   sortable: false,
 * })
 * ```
 */
export interface DataTableColumnTicketInput<T extends Record<string, unknown> = Record<string, unknown>>
  extends RegistryTicketInput {
  /** Column identifier. Required — selection / sort / filter all key off it. */
  id: Extensible<keyof T & string>
  /** Display title rendered in the header cell. */
  title?: string
  /** Allow this column to participate in the sort pipeline. */
  sortable?: boolean
  /** Allow this column to participate in the filter pipeline. */
  filterable?: boolean
  /** Custom per-column sort comparator. */
  sort?: (a: unknown, b: unknown) => number
  /** Custom per-column filter predicate. */
  filter?: (value: unknown, query: string) => boolean
  /** Header-group children (recursive). Children are NOT separately registered. */
  children?: readonly DataTableColumnTicketInput<T>[]
}

/**
 * Output ticket returned by `table.columns.register` / `table.columns.onboard`.
 *
 * Combines the standard registry ticket fields (`index`, `valueIsIndex`,
 * `unregister`) with the column-shape fields from {@link DataTableColumnTicketInput}.
 *
 * @template T Row value type.
 */
export type DataTableColumnTicket<T extends Record<string, unknown> = Record<string, unknown>>
  = RegistryTicket<DataTableColumnTicketInput<T>['value']> & DataTableColumnTicketInput<T>

export interface DataTableSort {
  /** Toggle sort for a column: none → asc → desc → none */
  toggle: (id: string) => void
  /** Current sort columns derived from group state */
  columns: Readonly<Ref<SortEntry[]>>
  /** Order of sort columns (for multi-sort priority) */
  order: readonly string[]
  /** Get sort direction for a specific column id */
  direction: (id: string) => SortDirection
  /** Get sort priority index (0-based), or -1 if not sorted */
  priority: (id: string) => number
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
  isAllSelected: Readonly<Ref<boolean>>
  /** Whether some but not all items within strategy scope are selected */
  isMixed: Readonly<Ref<boolean>>
}

export interface DataTableGroup<T extends Record<string, unknown>> {
  /** Stringified group identifier */
  key: string
  /** Raw value of the groupBy column for this group */
  value: T[keyof T & string]
  /** Items belonging to this group */
  items: readonly T[]
}

export interface DataTableGrouping<T extends Record<string, unknown>> {
  /** Grouped items derived from sortedItems */
  groups: Readonly<Ref<DataTableGroup<T>[]>>
  /** Toggle a group's open/closed state */
  toggle: (groupKey: string) => void
  /** Whether a group is open */
  isOpen: (groupKey: string) => boolean
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
  /** Column id to group rows by */
  groupBy?: keyof T & string
  /** Auto-open all groups on creation. @default false */
  openAll?: boolean
  /** Allow multiple rows expanded simultaneously. @default true */
  expandMultiple?: boolean
  /** Locale for sorting (defaults to useLocale's selected locale or browser default) */
  locale?: string
  /** Pipeline adapter. @default ClientDataTableAdapter */
  adapter?: DataTableAdapter<T>
}

export interface DataTableContext<T extends Record<string, unknown>>
  extends RegistryContext<DataTableTicketInput<T>, DataTableTicket<T>> {
  /** Final paginated items for rendering */
  items: Readonly<Ref<readonly T[]>>
  /** Raw unprocessed items */
  allItems: Readonly<Ref<readonly T[]>>
  /** Items after filtering */
  filteredItems: Readonly<Ref<readonly T[]>>
  /** Items after filtering and sorting */
  sortedItems: Readonly<Ref<readonly T[]>>
  /**
   * Column registry. Use `columns.register({...})`, `columns.onboard([...])`,
   * `columns.unregister(id)`, and `columns.clear()` to manage columns. The
   * registry is reactive — `leaves` and `headers` recompute when it mutates.
   */
  columns: RegistryContext<DataTableColumnTicketInput<T>, DataTableColumnTicket<T>>
  /** Leaf columns (no children) used by the data pipeline. Reactive. */
  leaves: Readonly<Ref<readonly DataTableColumnTicket<T>[]>>
  /** 2D header grid with colspan/rowspan for rendering thead. Reactive. */
  headers: Readonly<Ref<InternalHeader[][]>>
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
  /** Row grouping controls. When groupBy is not set, `groups` returns an empty array. */
  grouping: DataTableGrouping<T>
  /** Total row count for aria-rowcount */
  total: Readonly<Ref<number>>
  /** Loading state (managed by adapter) */
  loading: Readonly<Ref<boolean>>
  /** Error state (managed by adapter) */
  error: Readonly<Ref<Error | null>>
}

export interface DataTableContextOptions<T extends Record<string, unknown>> extends DataTableOptions<T> {
  namespace?: string
}

/**
 * Creates a data table instance with sort controls, selection, and an
 * adapter-driven data pipeline.
 *
 * Rows and columns are both managed via internal registries. Use
 * `table.columns.register({ id, ... })` / `table.columns.onboard([...])` to
 * add columns and `table.register({ id, value })` / `table.onboard([...])`
 * for rows. Removing entries from the column registry reactively updates
 * `leaves`, `headers`, the sort group, and the filter pipeline.
 *
 * Must be called inside a component `setup()` or a Vue effect scope.
 * Calling at module scope in SSR environments causes request state leakage.
 *
 * @param options Data table options (all optional)
 * @returns Data table context with pipeline stages, controls, and registry surface
 *
 * @example
 * ```ts
 * import { createDataTable } from '@vuetify/v0'
 *
 * const table = createDataTable<User>()
 *
 * table.columns.onboard([
 *   { id: 'name', title: 'Name', sortable: true, filterable: true },
 *   { id: 'email', title: 'Email', sortable: true, filterable: true },
 *   { id: 'age', title: 'Age', sortable: true },
 * ])
 *
 * table.onboard(users.map(value => ({ id: value.id, value })))
 *
 * table.search('john')
 *
 * table.sort.toggle('name')
 * table.sort.toggle('name')
 * table.sort.toggle('name')
 *
 * table.pagination.next()
 *
 * table.selection.toggle(1)
 * ```
 */
export function createDataTable<T extends Record<string, unknown>> (
  options: DataTableOptions<T> = {},
): DataTableContext<T> {
  const {
    filter: filterOptions = {},
    pagination: paginationOptions = {},
    sortMultiple = false,
    mandate = false,
    firstSortOrder = 'asc',
    selectStrategy = 'page',
    itemSelectable,
    groupBy,
    openAll = false,
    expandMultiple = true,
    locale: initialLocale,
    adapter = new ClientDataTableAdapter<T>(),
  } = options

  const registry = createRegistry<DataTableTicketInput<T>, DataTableTicket<T>>({
    events: true,
    reactive: false,
  })

  const proxy = useProxyRegistry<DataTableTicketInput<T>, DataTableTicket<T>>(registry)

  const columns = createRegistry<DataTableColumnTicketInput<T>, DataTableColumnTicket<T>>({
    events: true,
    reactive: true,
  })

  const _query = shallowRef('')

  function search (value: string) {
    _query.value = value
  }

  const { selectedId: selectedLocale } = useLocale()

  const locale = toRef(() => {
    const selected = selectedLocale?.value

    if (!isNullOrUndefined(selected)) return String(selected)

    return initialLocale
  })

  const leaves = computed(() => extractLeaves(columns.values()))
  const headers = computed(() => resolveHeaders(columns.values()))

  const sortable = computed(() => leaves.value.filter(col => col.sortable === true))

  const group = createGroup({ multiple: sortMultiple })

  // Track sort order for multi-sort priority
  const order = shallowReactive<string[]>([])

  // Reconcile the sort group with the live set of sortable columns. New
  // columns get onboarded; removed columns get unregistered and any sort
  // state keyed to them is dropped from the order/mixed sets.
  watch(sortable, next => {
    const ids = new Set<string>()
    for (const col of next) ids.add(String(col.id))

    for (const id of group.keys()) {
      const key = String(id)
      if (!ids.has(key)) {
        group.unregister(id)
        const index = order.indexOf(key)
        if (index !== -1) order.splice(index, 1)
      }
    }

    for (const id of ids) {
      if (!group.has(id)) group.register({ id, value: id })
    }
  }, { flush: 'sync', immediate: true })

  // Sort cycle depends on firstSortOrder and mandate:
  // firstSortOrder='asc':  none → asc → desc → none  (or → asc with mandate)
  // firstSortOrder='desc': none → desc → asc → none  (or → desc with mandate)
  function toggle (id: string) {
    if (!group.has(id)) return

    const isAsc = group.selectedIds.has(id)
    const isDesc = group.mixed(id)

    function clearOthers () {
      if (!sortMultiple) {
        group.unselectAll()
        group.mixedIds.clear()
        order.length = 0
      }
    }

    function setAsc () {
      group.unmix(id)
      group.select(id)
    }
    function setDesc () {
      group.unselect(id)
      group.mix(id)
    }
    function setNone () {
      group.unselect(id)
      group.unmix(id)
      const index = order.indexOf(id)
      if (index !== -1) order.splice(index, 1)
    }

    if (!isAsc && !isDesc) {
      clearOthers()
      if (firstSortOrder === 'desc') setDesc()
      else setAsc()
      order.push(id)
    } else if (isAsc) {
      // asc → desc (or → none when firstSortOrder='desc' && !mandate ends the cycle)
      if (firstSortOrder === 'desc' && !mandate) setNone()
      else setDesc()
    } else {
      // desc → asc (or → none when firstSortOrder='asc' && !mandate ends the cycle)
      if (firstSortOrder === 'asc' && !mandate) setNone()
      else setAsc()
    }
  }

  const sortBy = computed<SortEntry[]>(() => {
    const result: SortEntry[] = []

    for (const id of order) {
      if (group.selectedIds.has(id)) {
        result.push({ key: id, direction: 'asc' })
      } else if (group.mixed(id)) {
        result.push({ key: id, direction: 'desc' })
      }
    }

    return result
  })

  function direction (id: string): SortDirection {
    if (group.selectedIds.has(id)) return 'asc'
    if (group.mixed(id)) return 'desc'
    return 'none'
  }

  function priority (id: string): number {
    return order.indexOf(id)
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
    priority,
    reset,
  }

  const filterable = computed(() => {
    const ids: string[] = []
    for (const col of leaves.value) {
      if (col.filterable === true) ids.push(String(col.id))
    }
    return ids
  })

  const customSorts = computed(() => {
    const sorts: Partial<Record<string, (a: unknown, b: unknown) => number>> = {}
    for (const col of leaves.value) {
      if (col.sort) sorts[String(col.id)] = col.sort
    }
    return sorts
  })

  const customColumnFilters = computed(() => {
    const filters: Partial<Record<string, (value: unknown, query: string) => boolean>> = {}
    for (const col of leaves.value) {
      if (col.filter) filters[String(col.id)] = col.filter
    }
    return filters
  })

  // Row values projected from registry tickets in registration order — the
  // adapter consumes this as its `items` input and runs the filter → sort →
  // paginate pipeline against it.
  const source = computed(() => proxy.values.map(t => t.value as T))

  const {
    allItems,
    filteredItems,
    sortedItems,
    items: visible,
    pagination,
    total,
    loading = toRef(() => false) as Readonly<Ref<boolean>>,
    error = toRef(() => null) as Readonly<Ref<Error | null>>,
  } = adapter.setup({
    items: source,
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

  const selectableIds = computed(() => {
    if (!itemSelectable) return null
    const ids = new Set<ID>()
    for (const ticket of proxy.values) {
      const value = ticket.value
      if (!isNullOrUndefined(value) && (value as T)[itemSelectable]) ids.add(ticket.id)
    }
    return ids
  })

  function isSelectable (id: ID): boolean {
    return !selectableIds.value || selectableIds.value.has(id)
  }

  // Strategy-scoped items for selectAll/toggleAll/isAllSelected
  // 'single': no bulk ops, 'page': visible items, 'all': all sorted (filtered) items
  const scopeItems = toRef(() => {
    if (selectStrategy === 'single') return []
    return selectStrategy === 'all' ? sortedItems.value : visible.value
  })

  // Tickets whose value is currently in the active scope. Iterating tickets
  // directly preserves ticket-id uniqueness even when two tickets share the
  // same row value reference — going through `browse(item)` collapses both
  // onto the first matching id.
  const scopedTickets = computed(() => {
    const scope = scopeItems.value
    if (scope.length === 0) return []
    const set = new Set<T>(scope)
    const result: DataTableTicket<T>[] = []
    for (const ticket of proxy.values) {
      const value = ticket.value
      if (isNullOrUndefined(value) || !set.has(value as T)) continue
      if (itemSelectable && !(value as T)[itemSelectable]) continue
      result.push(ticket)
    }
    return result
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
      for (const ticket of scopedTickets.value) {
        selectedIds.add(ticket.id)
      }
    },
    unselectAll () {
      selectedIds.clear()
    },
    toggleAll () {
      if (selectStrategy === 'single') return
      if (selection.isAllSelected.value) {
        for (const ticket of scopedTickets.value) {
          selectedIds.delete(ticket.id)
        }
      } else {
        selection.selectAll()
      }
    },
    isAllSelected: computed(() => {
      const tickets = scopedTickets.value
      if (tickets.length === 0) return false
      return tickets.every(ticket => selectedIds.has(ticket.id))
    }),
    isMixed: computed(() => {
      const tickets = scopedTickets.value
      if (tickets.length === 0) return false
      const some = tickets.some(ticket => selectedIds.has(ticket.id))
      return some && !selection.isAllSelected.value
    }),
  }

  const expandedIds = shallowReactive(new Set<ID>())

  // Visible-scoped tickets for expandAll — visible (paginated) only.
  const visibleTickets = computed(() => {
    const scope = visible.value
    if (scope.length === 0) return []
    const set = new Set<T>(scope)
    const result: DataTableTicket<T>[] = []
    for (const ticket of proxy.values) {
      const value = ticket.value
      if (!isNullOrUndefined(value) && set.has(value as T)) result.push(ticket)
    }
    return result
  })

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
      for (const ticket of visibleTickets.value) {
        expandedIds.add(ticket.id)
      }
    },
    collapseAll () {
      expandedIds.clear()
    },
  }

  // Prune stale selection/expansion ids when their backing ticket disappears
  // so consumers can never observe ghost state diverging from the registry.
  registry.on('unregister:ticket', ticket => {
    selectedIds.delete(ticket.id)
    expandedIds.delete(ticket.id)
  })
  registry.on('clear:registry', () => {
    selectedIds.clear()
    expandedIds.clear()
  })

  const opened = shallowReactive(new Set<string>())

  const groups = computed<DataTableGroup<T>[]>(() => {
    if (!groupBy) return []

    const map = new Map<string, { value: T[keyof T & string], items: T[] }>()

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

  if (openAll) {
    // Track which keys we've already auto-opened so the watcher only opens
    // *new* groups, never reopening a group the user explicitly closed.
    const autoOpened = new Set<string>()

    for (const group of groups.value) {
      opened.add(group.key)
      autoOpened.add(group.key)
    }

    watch(groups, newGroups => {
      for (const group of newGroups) {
        if (autoOpened.has(group.key)) continue
        opened.add(group.key)
        autoOpened.add(group.key)
      }
    }, { flush: 'sync' })
  }

  const grouping: DataTableGrouping<T> = {
    groups,
    toggle (groupKey: string) {
      if (opened.has(groupKey)) {
        opened.delete(groupKey)
      } else {
        opened.add(groupKey)
      }
    },
    isOpen (groupKey: string) {
      return opened.has(groupKey)
    },
    open (groupKey: string) {
      opened.add(groupKey)
    },
    close (groupKey: string) {
      opened.delete(groupKey)
    },
    openAll () {
      for (const group of groups.value) {
        opened.add(group.key)
      }
    },
    closeAll () {
      opened.clear()
    },
  }

  return {
    ...registry,
    items: visible,
    allItems,
    filteredItems,
    sortedItems,
    columns,
    leaves,
    headers,
    search,
    query: shallowReadonly(_query),
    sort,
    pagination,
    selection,
    expansion,
    grouping,
    total,
    loading,
    error,
    get size () {
      return proxy.size
    },
  }
}

/**
 * Creates a data table context with dependency injection support.
 *
 * The returned context exposes both row and column registries. Columns must
 * be onboarded after construction — pass them via `context.columns.onboard`,
 * not in the factory options.
 *
 * @param options Data table context options including namespace
 * @returns A trinity tuple: [useDataTable, provideDataTable, defaultContext]
 *
 * @example
 * ```ts
 * import { createDataTableContext } from '@vuetify/v0'
 *
 * const [useDataTable, provideDataTable, context] = createDataTableContext<User>({
 *   namespace: 'app:users',
 * })
 *
 * context.columns.onboard([
 *   { id: 'name', title: 'Name', sortable: true },
 * ])
 *
 * // Parent component
 * provideDataTable()
 * context.onboard(users.map(value => ({ id: value.id, value })))
 *
 * // Child component
 * const table = useDataTable()
 * ```
 */
export function createDataTableContext<T extends Record<string, unknown>> (
  _options: DataTableContextOptions<T> = {},
): ContextTrinity<DataTableContext<T>> {
  const { namespace = 'v0:data-table', ...options } = _options
  const context = createDataTable<T>(options)

  return createTrinity<DataTableContext<T>>(namespace, context)
}

/**
 * Returns the current data table context from dependency injection.
 *
 * @typeParam T - Must be provided explicitly; cannot be inferred from namespace.
 *   Prefer the `useX` function from {@link createDataTableContext} for type-safe injection.
 *
 * @param namespace The namespace for the data table context. @default 'v0:data-table'
 * @returns The current data table context
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useDataTable } from '@vuetify/v0'
 *
 *   const table = useDataTable<User>()
 * </script>
 * ```
 */
export function useDataTable<T extends Record<string, unknown>> (
  namespace = 'v0:data-table',
): DataTableContext<T> {
  return useContext<DataTableContext<T>>(namespace)
}
