/**
 * @module createDataTable
 *
 * @remarks
 * Headless data table composable that composes existing v0 primitives
 * into a unified table API.
 *
 * Key features:
 * - Vue-first reactivity (not adapted from another framework)
 * - Progressive disclosure (simple by default, powerful when needed)
 * - Composes existing primitives (createRegistry, createGroup, useFilter, etc.)
 * - Single composable supports client, server, and virtual modes
 * - Clean TypeScript generics
 *
 * Design boundaries:
 * - This is a composable, not a component
 * - Provides data management, state, methods, and computed values
 * - Does NOT provide: slots, CSS, density, fixed column positioning
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isFunction } from '#v0/utilities'
import { computed, ref, shallowRef, toValue } from 'vue'

// Types
import type { RegistryTicket } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// ============================================================================
// Column Types
// ============================================================================

export interface DataTableColumnDef<T = unknown> {
  /** Unique column identifier */
  key: string
  /** Display title */
  title?: string

  // Behavior flags
  /** Whether this column can be sorted */
  sortable?: boolean
  /** Whether this column can be filtered */
  filterable?: boolean
  /** Whether this column can be grouped by */
  groupable?: boolean
  /** Whether this column can be resized */
  resizable?: boolean
  /** Whether this column can be reordered */
  reorderable?: boolean
  /** Whether this column can be hidden */
  hideable?: boolean

  // Display (initial values, can be changed at runtime)
  /** Text alignment */
  align?: 'start' | 'center' | 'end'
  /** Initial width in pixels */
  width?: number
  /** Minimum width in pixels */
  minWidth?: number
  /** Maximum width in pixels */
  maxWidth?: number

  // Custom functions
  /** Custom sort comparator for this column */
  sort?: (a: T, b: T) => number
  /** Custom filter function for this column */
  filterFn?: (value: unknown, search: string) => boolean
  /** Value accessor (defaults to item[key]) */
  value?: (item: T) => unknown
}

export interface DataTableColumnTicket<T = unknown> extends RegistryTicket {
  /** Column key */
  key: string
  /** Display title */
  title: string
  /** Column definition */
  def: DataTableColumnDef<T>

  // Runtime state (reactive)
  /** Current width */
  width: Ref<number>
  /** Is column visible */
  visible: Ref<boolean>
  /** Current sort state */
  sortState: ComputedRef<'asc' | 'desc' | null>

  // Methods
  /** Resize column */
  resize: (width: number) => void
  /** Show column */
  show: () => void
  /** Hide column */
  hide: () => void
  /** Toggle visibility */
  toggleVisible: () => void
}

// ============================================================================
// Row Types
// ============================================================================

export interface DataTableRowTicket<T = unknown> extends RegistryTicket<T> {
  /** The raw item data */
  item: T
}

// ============================================================================
// Sort/Group Types
// ============================================================================

export interface SortItem {
  /** Column key to sort by */
  key: string
  /** Sort direction */
  order: 'asc' | 'desc'
}

export interface DataTableGroupItem {
  /** Column key to group by */
  key: string
  /** Sort direction for groups */
  order?: 'asc' | 'desc'
}

// ============================================================================
// Options
// ============================================================================

export interface DataTableOptions<T = unknown> {
  // Core
  /** Array of items to display */
  items: MaybeRefOrGetter<T[]>
  /** Column definitions */
  columns: MaybeRefOrGetter<DataTableColumnDef<T>[]>
  /** Property name or function to extract unique ID from items */
  itemValue?: string | ((item: T) => ID)

  // Mode
  /** Operating mode: client-side or server-side data handling */
  mode?: 'client' | 'server'
  /** Total items count (for server mode pagination) */
  itemsLength?: MaybeRefOrGetter<number>

  // Selection
  /** Enable row selection */
  selectable?: false | 'single' | 'multiple'
  /** What selectAll affects: current page or all items */
  selectStrategy?: 'page' | 'all'
  /** Prevent deselecting last selected item */
  mandatory?: boolean

  // Sorting
  /** Enable sorting */
  sortable?: boolean
  /** Allow sorting by multiple columns */
  multiSort?: boolean
  /** Initial sort configuration */
  sortBy?: SortItem[]
  /** Prevent unsorted state (always have at least one sort) */
  mustSort?: boolean

  // Filtering
  /** Enable filtering */
  filterable?: boolean
  /** Initial search query */
  search?: MaybeRefOrGetter<string>
  /** Keys to filter on (if not specified, uses filterable columns) */
  filterKeys?: string[]
  /** Filter matching mode */
  filterMode?: 'some' | 'every' | 'union' | 'intersection'

  // Pagination
  /** Enable pagination */
  paginated?: boolean
  /** Initial page (1-indexed) */
  page?: number | ShallowRef<number>
  /** Items per page */
  itemsPerPage?: MaybeRefOrGetter<number>

  // Expansion
  /** Enable row expansion */
  expandable?: boolean
  /** Allow multiple rows expanded at once */
  multiExpand?: boolean
  /** Initially expanded row IDs */
  expanded?: ID[]

  // Grouping
  /** Enable grouping */
  groupable?: boolean
  /** Initial group configuration */
  groupBy?: DataTableGroupItem[]

  // Virtual scrolling
  /** Enable virtual scrolling */
  virtual?: boolean | { itemHeight: number }

  // Loading
  /** Loading state */
  loading?: MaybeRefOrGetter<boolean>

  // Events
  /** Enable event emission */
  events?: boolean
}

export interface DataTableContextOptions<T = unknown> extends DataTableOptions<T> {
  /** Namespace for dependency injection */
  namespace?: string
}

// ============================================================================
// Column Context (returned by columns property)
// ============================================================================

export interface DataTableColumnsContext<T = unknown> {
  /** All column tickets */
  all: ComputedRef<DataTableColumnTicket<T>[]>
  /** Visible columns only */
  visible: ComputedRef<DataTableColumnTicket<T>[]>
  /** Hidden columns */
  hidden: ComputedRef<DataTableColumnTicket<T>[]>
  /** Get column by key */
  get: (key: string) => DataTableColumnTicket<T> | undefined
  /** Reorder column from one index to another */
  reorder: (fromIndex: number, toIndex: number) => void
  /** Reset column order to initial */
  resetOrder: () => void
  /** Reset all column widths to initial */
  resetWidths: () => void
  /** Show all columns */
  showAll: () => void
  /** Hide column by key */
  hide: (key: string) => void
  /** Show column by key */
  show: (key: string) => void
}

// ============================================================================
// Main Context
// ============================================================================

export interface DataTableContext<T = unknown> {
  // === CORE ===

  /** Final items after all transforms (filtered/sorted/paginated) */
  items: ComputedRef<T[]>

  /** All items before transforms */
  allItems: ComputedRef<T[]>

  /** Current mode */
  mode: 'client' | 'server'

  /** Loading state */
  loading: Ref<boolean>

  // === COLUMNS ===

  /** Column management */
  columns: DataTableColumnsContext<T>

  // === SELECTION (if enabled) ===

  selection: {
    selectedIds: Set<ID>
    selectedItems: ComputedRef<Set<T>>
    isSelected: (id: ID) => boolean
    select: (ids: ID | ID[]) => void
    unselect: (ids: ID | ID[]) => void
    toggle: (ids: ID | ID[]) => void
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
    isAllSelected: ComputedRef<boolean>
    isNoneSelected: ComputedRef<boolean>
    isSomeSelected: ComputedRef<boolean>
  } | null

  // === SORTING (if enabled) ===

  sort: {
    sortBy: Ref<SortItem[]>
    toggleSort: (key: string) => void
    setSort: (sortBy: SortItem[]) => void
    clearSort: () => void
    getSortState: (key: string) => 'asc' | 'desc' | null
    isSorted: (key: string) => boolean
  } | null

  // === FILTERING (if enabled) ===

  filter: {
    search: Ref<string>
    setSearch: (query: string) => void
    clearSearch: () => void
    filteredItems: ComputedRef<T[]>
    filteredCount: ComputedRef<number>
  } | null

  // === PAGINATION (if enabled) ===

  pagination: {
    page: ShallowRef<number>
    itemsPerPage: Ref<number>
    pageCount: ComputedRef<number>
    itemsLength: ComputedRef<number>
    pageStart: ComputedRef<number>
    pageStop: ComputedRef<number>
    firstPage: () => void
    lastPage: () => void
    nextPage: () => void
    prevPage: () => void
    setPage: (page: number) => void
    setItemsPerPage: (count: number) => void
    isFirstPage: ComputedRef<boolean>
    isLastPage: ComputedRef<boolean>
  } | null

  // === EXPANSION (if enabled) ===

  expansion: {
    expandedIds: Set<ID>
    isExpanded: (id: ID) => boolean
    expand: (ids: ID | ID[]) => void
    collapse: (ids: ID | ID[]) => void
    toggleExpand: (ids: ID | ID[]) => void
    expandAll: () => void
    collapseAll: () => void
  } | null

  // === GROUPING (if enabled) ===

  grouping: {
    groupBy: Ref<DataTableGroupItem[]>
    groupedItems: ComputedRef<DataTableGroup<T>[]>
    setGroupBy: (groupBy: DataTableGroupItem[]) => void
    clearGroupBy: () => void
    toggleGroup: (groupKey: string) => void
  } | null

  // === VIRTUAL (if enabled) ===

  virtual: {
    element: Ref<HTMLElement | null>
    visibleItems: ComputedRef<T[]>
    offset: ComputedRef<number>
    scrollToItem: (id: ID) => void
    scrollToIndex: (index: number) => void
  } | null

  // === SERVER MODE ===

  /** Set items (for server mode) */
  setItems: (items: T[]) => void
  /** Set total items length (for server mode) */
  setItemsLength: (length: number) => void

  // === HELPERS ===

  /** Get item by ID */
  getItem: (id: ID) => T | undefined
  /** Extract ID from item */
  getItemId: (item: T) => ID
}

// ============================================================================
// Group Types
// ============================================================================

export interface DataTableGroup<T = unknown> {
  /** Group key (column key) */
  key: string
  /** Group value */
  value: unknown
  /** Items in this group */
  items: T[]
  /** Nested groups (for multi-level grouping) */
  groups?: DataTableGroup<T>[]
  /** Is group expanded */
  isExpanded: boolean
}

// ============================================================================
// Implementation
// ============================================================================

/**
 * Creates a data table instance.
 *
 * @param options The options for the data table.
 * @template T The type of the data items.
 * @returns A data table context with all enabled features.
 *
 * @example
 * ```ts
 * import { createDataTable } from '@vuetify/v0'
 *
 * const table = createDataTable({
 *   items: users,
 *   columns: [
 *     { key: 'name', title: 'Name', sortable: true },
 *     { key: 'email', title: 'Email' },
 *   ],
 * })
 *
 * // Access computed items (after all transforms)
 * table.items.value
 * ```
 */
// eslint-disable-next-line complexity -- Data table composable requires high complexity due to feature composition
export function createDataTable<T = unknown> (
  options: DataTableOptions<T>,
): DataTableContext<T> {
  const {
    items: _items,
    columns: _columns,
    itemValue = 'id',
    mode = 'client',
    itemsLength: _itemsLength,
    loading: _loading = false,
    // Feature flags
    sortable = false,
    multiSort = false,
    sortBy: _sortBy = [],
    mustSort = false,
    filterable = false,
    search: _search = '',
    filterKeys,
    filterMode: _filterMode = 'some',
    paginated = false,
    page: _page = 1,
    itemsPerPage: _itemsPerPage = 10,
    selectable = false,
    selectStrategy: _selectStrategy = 'page',
    mandatory: _mandatory = false,
    expandable = false,
    multiExpand: _multiExpand = true,
    expanded: _expanded = [],
    groupable = false,
    groupBy: _groupBy = [],
    virtual = false,
    events = false,
  } = options

  // Suppress unused variable warnings for features not yet implemented
  void _filterMode
  void _selectStrategy
  void _mandatory
  void _multiExpand
  void _expanded
  void _groupBy

  // ---------------------------------------------------------------------------
  // Core: ID extraction
  // ---------------------------------------------------------------------------

  const getItemId = isFunction(itemValue)
    ? itemValue
    : (item: T) => (item as Record<string, unknown>)[itemValue as string] as ID

  // ---------------------------------------------------------------------------
  // Core: Items
  // ---------------------------------------------------------------------------

  const allItems = computed(() => toValue(_items))
  const serverItemsLength = ref(toValue(_itemsLength) ?? 0)

  // ---------------------------------------------------------------------------
  // Core: Loading
  // ---------------------------------------------------------------------------

  const loading = ref(toValue(_loading))

  // ---------------------------------------------------------------------------
  // Columns: Registry
  // ---------------------------------------------------------------------------

  const columnRegistry = createRegistry<DataTableColumnTicket<T>>({ events })
  const columnOrder = ref<string[]>([])
  const initialColumnOrder = ref<string[]>([])

  // Sort state (shared for column tickets to reference)
  const sortBy = ref<SortItem[]>([..._sortBy])

  // Create a column ticket from definition
  function createColumnTicket (def: DataTableColumnDef<T>): DataTableColumnTicket<T> {
    const key = def.key
    const width = ref(def.width ?? 100)
    const visible = ref(true)

    const sortState = computed(() => {
      const sort = sortBy.value.find(s => s.key === key)
      return sort?.order ?? null
    })

    return {
      id: key,
      key,
      title: def.title ?? key,
      def,
      width,
      visible,
      sortState,
      resize: (w: number) => {
        const min = def.minWidth ?? 0
        const max = def.maxWidth ?? Infinity
        width.value = Math.max(min, Math.min(max, w))
      },
      show: () => {
        visible.value = true
      },
      hide: () => {
        visible.value = false
      },
      toggleVisible: () => {
        visible.value = !visible.value
      },
    } as DataTableColumnTicket<T>
  }

  // Initialize columns from definitions
  function initializeColumns () {
    const defs = toValue(_columns)
    const order: string[] = []

    columnRegistry.batch(() => {
      columnRegistry.clear()
      for (const def of defs) {
        order.push(def.key)
        columnRegistry.register(createColumnTicket(def))
      }
    })

    columnOrder.value = order
    initialColumnOrder.value = [...order]
  }

  // Initialize columns immediately
  initializeColumns()

  // Computed column arrays
  const columnsAll = computed(() => {
    return columnOrder.value
      .map(key => columnRegistry.get(key))
      .filter((c): c is DataTableColumnTicket<T> => c !== undefined)
  })

  const columnsVisible = computed(() => columnsAll.value.filter(c => c.visible.value))
  const columnsHidden = computed(() => columnsAll.value.filter(c => !c.visible.value))

  // Column management helpers
  function reorderColumn (fromIndex: number, toIndex: number) {
    const order = [...columnOrder.value]
    const [removed] = order.splice(fromIndex, 1)
    if (removed) {
      order.splice(toIndex, 0, removed)
      columnOrder.value = order
    }
  }

  function resetColumnWidths () {
    const defs = toValue(_columns)
    for (const def of defs) {
      const col = columnRegistry.get(def.key)
      if (col) col.width.value = def.width ?? 100
    }
  }

  function showAllColumns () {
    for (const col of columnRegistry.values()) {
      col.visible.value = true
    }
  }

  function resetColumnOrder () {
    columnOrder.value = [...initialColumnOrder.value]
  }

  function hideColumn (key: string) {
    const col = columnRegistry.get(key)
    if (col) col.visible.value = false
  }

  function showColumn (key: string) {
    const col = columnRegistry.get(key)
    if (col) col.visible.value = true
  }

  const columns: DataTableColumnsContext<T> = {
    all: columnsAll,
    visible: columnsVisible,
    hidden: columnsHidden,
    get: (key: string) => columnRegistry.get(key),
    reorder: reorderColumn,
    resetOrder: resetColumnOrder,
    resetWidths: resetColumnWidths,
    showAll: showAllColumns,
    hide: hideColumn,
    show: showColumn,
  }

  // ---------------------------------------------------------------------------
  // Sort Feature
  // ---------------------------------------------------------------------------

  function toggleSortByKey (key: string) {
    const existing = sortBy.value.findIndex(s => s.key === key)

    if (existing === -1) {
      // Add new sort
      sortBy.value = multiSort
        ? [...sortBy.value, { key, order: 'asc' }]
        : [{ key, order: 'asc' }]
      return
    }

    const current = sortBy.value[existing]!
    if (current.order === 'asc') {
      // asc → desc
      sortBy.value = multiSort
        ? sortBy.value.map((s, i) => i === existing ? { ...s, order: 'desc' as const } : s)
        : [{ key, order: 'desc' }]
    } else if (mustSort) {
      // desc → asc (when mustSort)
      sortBy.value = multiSort
        ? sortBy.value.map((s, i) => i === existing ? { ...s, order: 'asc' as const } : s)
        : [{ key, order: 'asc' }]
    } else {
      // desc → none
      sortBy.value = multiSort
        ? sortBy.value.filter((_, i) => i !== existing)
        : []
    }
  }

  const sort = sortable
    ? {
        sortBy,
        toggleSort: toggleSortByKey,
        setSort: (newSortBy: SortItem[]) => {
          sortBy.value = newSortBy
        },
        clearSort: () => {
          sortBy.value = []
        },
        getSortState: (key: string) => {
          return sortBy.value.find(s => s.key === key)?.order ?? null
        },
        isSorted: (key: string) => {
          return sortBy.value.some(s => s.key === key)
        },
      }
    : null

  // ---------------------------------------------------------------------------
  // Filter Feature
  // ---------------------------------------------------------------------------

  const search = ref(toValue(_search))

  // Compute filtered items separately to avoid self-reference in filter object
  function matchesFilter (item: T, query: string, keys: string[]): boolean {
    return keys.some(key => {
      const col = columnRegistry.get(key)
      const getValue = col?.def.value ?? ((i: T) => (i as Record<string, unknown>)[key])
      const value = getValue(item)
      const str = String(value ?? '').toLowerCase()

      if (col?.def.filterFn) {
        return col.def.filterFn(value, query)
      }

      return str.includes(query)
    })
  }

  const filteredItems = computed(() => {
    if (!filterable) return allItems.value
    if (mode === 'server') return allItems.value

    const query = search.value.toLowerCase().trim()
    if (!query) return allItems.value

    const keys = filterKeys ?? columnsAll.value
      .filter(c => c.def.filterable !== false)
      .map(c => c.key)

    return allItems.value.filter(item => matchesFilter(item, query, keys))
  })

  const filteredCount = computed(() => {
    if (mode === 'server') return serverItemsLength.value
    return filteredItems.value.length
  })

  const filter = filterable
    ? {
        search,
        setSearch: (query: string) => {
          search.value = query
        },
        clearSearch: () => {
          search.value = ''
        },
        filteredItems,
        filteredCount,
      }
    : null

  // ---------------------------------------------------------------------------
  // Sort Transform (client mode)
  // ---------------------------------------------------------------------------

  function compareItems (a: T, b: T): number {
    for (const { key, order } of sortBy.value) {
      const col = columnRegistry.get(key)
      const getValue = col?.def.value ?? ((i: T) => (i as Record<string, unknown>)[key])
      const aVal = getValue(a)
      const bVal = getValue(b)

      let result = 0

      if (col?.def.sort) {
        result = col.def.sort(a, b)
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        result = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal
      } else {
        result = String(aVal ?? '').localeCompare(String(bVal ?? ''))
      }

      if (result !== 0) {
        return order === 'desc' ? -result : result
      }
    }
    return 0
  }

  const sortedItems = computed(() => {
    if (mode === 'server') return filteredItems.value
    if (!sortable || sortBy.value.length === 0) return filteredItems.value

    return filteredItems.value.toSorted(compareItems)
  })

  // ---------------------------------------------------------------------------
  // Pagination Feature
  // ---------------------------------------------------------------------------

  const page = shallowRef(toValue(_page))
  const itemsPerPage = ref(toValue(_itemsPerPage))

  const paginatedItemsLength = computed(() => {
    if (mode === 'server') return serverItemsLength.value
    return sortedItems.value.length
  })

  const pageCount = computed(() => {
    const total = paginatedItemsLength.value
    const perPage = itemsPerPage.value
    return total <= 0 ? 0 : Math.ceil(total / perPage)
  })

  const pageStart = computed(() => (page.value - 1) * itemsPerPage.value)
  const pageStop = computed(() => Math.min(pageStart.value + itemsPerPage.value, paginatedItemsLength.value))

  // Pagination navigation helpers
  function goToFirstPage () {
    page.value = 1
  }
  function goToLastPage () {
    page.value = Math.max(1, pageCount.value)
  }
  function goToNextPage () {
    if (page.value < pageCount.value) page.value++
  }
  function goToPrevPage () {
    if (page.value > 1) page.value--
  }
  function goToPage (p: number) {
    page.value = Math.max(1, Math.min(p, pageCount.value || 1))
  }
  function changeItemsPerPage (count: number) {
    itemsPerPage.value = count
    page.value = 1
  }

  const pagination = paginated
    ? {
        page,
        itemsPerPage,
        pageCount,
        itemsLength: paginatedItemsLength,
        pageStart,
        pageStop,
        firstPage: goToFirstPage,
        lastPage: goToLastPage,
        nextPage: goToNextPage,
        prevPage: goToPrevPage,
        setPage: goToPage,
        setItemsPerPage: changeItemsPerPage,
        isFirstPage: computed(() => page.value <= 1),
        isLastPage: computed(() => page.value >= pageCount.value),
      }
    : null

  // ---------------------------------------------------------------------------
  // Final Items (after all transforms)
  // ---------------------------------------------------------------------------

  const items = computed(() => {
    if (mode === 'server') return allItems.value

    const sorted = sortedItems.value

    if (paginated) {
      return sorted.slice(pageStart.value, pageStop.value)
    }

    return sorted
  })

  // ---------------------------------------------------------------------------
  // Selection Feature (placeholder for Phase 2)
  // ---------------------------------------------------------------------------

  const selection = selectable ? null : null // TODO: Phase 2

  // ---------------------------------------------------------------------------
  // Expansion Feature (placeholder for Phase 6)
  // ---------------------------------------------------------------------------

  const expansion = expandable ? null : null // TODO: Phase 6

  // ---------------------------------------------------------------------------
  // Grouping Feature (placeholder for Phase 7)
  // ---------------------------------------------------------------------------

  const grouping = groupable ? null : null // TODO: Phase 7

  // ---------------------------------------------------------------------------
  // Virtual Feature (placeholder for Phase 8)
  // ---------------------------------------------------------------------------

  const virtualCtx = virtual ? null : null // TODO: Phase 8

  // ---------------------------------------------------------------------------
  // Server Mode Helpers
  // ---------------------------------------------------------------------------

  function setItems (_newItems: T[]) {
    // In server mode, items come from outside
    // This is handled by the reactive _items prop
    // This function is a placeholder for imperative updates if needed
    // TODO: Phase 9 - implement server mode item management
  }

  function setItemsLength (length: number) {
    serverItemsLength.value = length
  }

  // ---------------------------------------------------------------------------
  // Item Helpers
  // ---------------------------------------------------------------------------

  function getItem (id: ID): T | undefined {
    return allItems.value.find(item => getItemId(item) === id)
  }

  // ---------------------------------------------------------------------------
  // Return Context
  // ---------------------------------------------------------------------------

  return {
    // Core
    items,
    allItems,
    mode,
    loading,

    // Columns
    columns,

    // Features (null if disabled)
    selection,
    sort,
    filter,
    pagination,
    expansion,
    grouping,
    virtual: virtualCtx,

    // Server mode
    setItems,
    setItemsLength,

    // Helpers
    getItem,
    getItemId,
  }
}

// ============================================================================
// Context (Trinity Pattern)
// ============================================================================

/**
 * Creates a data table context with dependency injection support.
 *
 * @param options The options including namespace.
 * @template T The type of the data items.
 * @returns A trinity: [useDataTable, provideDataTable, defaultContext]
 *
 * @example
 * ```ts
 * const [useDataTable, provideDataTable] = createDataTableContext({
 *   items: users,
 *   columns: columnDefs,
 *   namespace: 'my-table',
 * })
 *
 * // Parent component
 * provideDataTable()
 *
 * // Child component
 * const table = useDataTable()
 * ```
 */
export function createDataTableContext<T = unknown> (
  _options: DataTableContextOptions<T>,
): ContextTrinity<DataTableContext<T>> {
  const { namespace = 'v0:data-table', ...options } = _options
  const [useDataTableContext, _provideDataTableContext] = createContext<DataTableContext<T>>(namespace)
  const context = createDataTable<T>(options)

  function provideDataTableContext (
    _context: DataTableContext<T> = context,
    app?: App,
  ): DataTableContext<T> {
    return _provideDataTableContext(_context, app)
  }

  return createTrinity<DataTableContext<T>>(useDataTableContext, provideDataTableContext, context)
}

/**
 * Returns the current data table context from dependency injection.
 *
 * @param namespace The namespace. @default 'v0:data-table'
 * @returns The data table context.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useDataTable } from '@vuetify/v0'
 *
 * const table = useDataTable()
 * </script>
 * ```
 */
export function useDataTable<T = unknown> (namespace = 'v0:data-table'): DataTableContext<T> {
  return useContext<DataTableContext<T>>(namespace)
}
