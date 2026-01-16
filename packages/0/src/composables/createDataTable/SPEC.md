# createDataTable Spec

> Headless data table composable for Vue. Composes existing v0 primitives into a unified table API.

## Design Goals

1. **Vue-first** - Built for Vue's reactivity, not adapted to it
2. **Zero boilerplate** - Works with minimal config, progressive complexity
3. **Composable** - Uses existing v0 primitives, doesn't reinvent them
4. **Flexible** - One composable supports client, server, and virtual modes
5. **Type-safe** - Generics flow through cleanly, no `any` escape hatches

## Core Architecture

### Layered Composition

```
createRegistry (rows)
  └─ createGroup (selection)
      └─ createGroup (expansion)
          └─ useFilter (filtering)
              └─ sorting (createSingle + createStep)
                  └─ usePagination (pagination)
                      └─ useVirtual (virtualization)
```

Each layer is **opt-in** via options. Disabled features have zero overhead.

### The Data Pipeline

```
items (raw)
  → filtered (useFilter)
  → sorted (computed)
  → grouped (computed)
  → paginated (usePagination slice)
  → virtualized (useVirtual visible)
```

In **server mode**, the pipeline is bypassed - composable tracks state only, emits events for server to handle.

---

## API Design

### Basic Usage

```ts
import { createDataTable } from '@vuetify/v0'

const table = createDataTable({
  items: data,
  columns: [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email' },
    { key: 'status', title: 'Status', filterable: true },
  ],
})

// Computed final items (after all transforms)
table.items // ComputedRef<T[]>
```

### With Features

```ts
const table = createDataTable({
  items: data,
  columns: columnDefs,
  itemValue: 'id', // unique key field

  // Selection
  selectable: 'multiple', // false | 'single' | 'multiple'

  // Sorting
  sortable: true,
  multiSort: false,

  // Filtering
  filterable: true,
  filterKeys: ['name', 'email'], // or per-column

  // Pagination
  paginated: true,
  itemsPerPage: 10,

  // Expansion
  expandable: true,
  multiExpand: false,

  // Grouping
  groupable: true,
})
```

### Server Mode

```ts
const table = createDataTable({
  items: [], // server provides
  columns: columnDefs,
  mode: 'server',
  itemsLength: 1000, // total server count

  // Same feature flags, but state-only (no client transforms)
  sortable: true,
  filterable: true,
  paginated: true,
})

// React to state changes
watch(table.state, async (state) => {
  const response = await fetchData({
    page: state.page,
    itemsPerPage: state.itemsPerPage,
    sortBy: state.sortBy,
    search: state.search,
  })
  table.setItems(response.items)
  table.setItemsLength(response.total)
})

// Or use events
table.on('update:options', async (options) => {
  // fetch and update
})
```

### Virtual Mode

```ts
const table = createDataTable({
  items: largeDataset, // 100k rows
  columns: columnDefs,
  virtual: true,
  itemHeight: 48,
})

// table.items returns only visible rows
// table.virtual.element - ref to bind to container
// table.virtual.offset - scroll offset for positioning
```

---

## Interfaces

### Options

```ts
interface DataTableOptions<T = unknown> {
  // Core
  items: MaybeRefOrGetter<T[]>
  columns: MaybeRefOrGetter<DataTableColumn[]>
  itemValue?: string | ((item: T) => ID)

  // Mode
  mode?: 'client' | 'server'
  itemsLength?: MaybeRefOrGetter<number> // server mode total

  // Selection
  selectable?: false | 'single' | 'multiple'
  selectStrategy?: 'page' | 'all' // what selectAll affects
  mandatory?: boolean // prevent deselecting last

  // Sorting
  sortable?: boolean
  multiSort?: boolean
  sortBy?: SortItem[]
  mustSort?: boolean // prevent unsorted state
  customSort?: SortFunction<T>

  // Filtering
  filterable?: boolean
  search?: MaybeRefOrGetter<string>
  filterKeys?: string[]
  filterMode?: 'some' | 'every' | 'union' | 'intersection'
  customFilter?: FilterFunction

  // Pagination
  paginated?: boolean
  page?: number | ShallowRef<number>
  itemsPerPage?: MaybeRefOrGetter<number>

  // Expansion
  expandable?: boolean
  multiExpand?: boolean
  expanded?: ID[]

  // Grouping
  groupable?: boolean
  groupBy?: GroupItem[]

  // Virtual scrolling
  virtual?: boolean | VirtualOptions

  // Loading state
  loading?: MaybeRefOrGetter<boolean>

  // Events (for server mode reactivity)
  events?: boolean
}
```

### Column Definition

```ts
interface DataTableColumn<T = unknown> {
  key: string
  title?: string

  // Behavior
  sortable?: boolean
  filterable?: boolean
  groupable?: boolean

  // Display
  align?: 'start' | 'center' | 'end'
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  fixed?: 'left' | 'right'

  // Custom rendering (slot names derived from key)
  // Slots: `header.${key}`, `item.${key}`

  // Custom sort/filter for this column
  sort?: (a: T, b: T) => number
  filter?: (value: unknown, search: string) => boolean

  // Value accessor (defaults to item[key])
  value?: (item: T) => unknown
}
```

### Sort/Group Items

```ts
interface SortItem {
  key: string
  order: 'asc' | 'desc'
}

interface GroupItem {
  key: string
  order?: 'asc' | 'desc'
}
```

### Context (Returned Object)

```ts
interface DataTableContext<T = unknown> {
  // === CORE ===

  /** Final items after all transforms (filtered/sorted/paginated) */
  items: ComputedRef<T[]>

  /** All items before transforms */
  allItems: ComputedRef<T[]>

  /** Column definitions */
  columns: ComputedRef<DataTableColumn[]>

  /** Current mode */
  mode: 'client' | 'server'

  /** Loading state */
  loading: Ref<boolean>

  // === SELECTION (if enabled) ===

  selection: {
    /** Selected row IDs */
    selectedIds: Reactive<Set<ID>>
    /** Selected row items */
    selectedItems: ComputedRef<Set<T>>
    /** Check if row is selected */
    isSelected: (id: ID) => boolean
    /** Select row(s) */
    select: (ids: ID | ID[]) => void
    /** Unselect row(s) */
    unselect: (ids: ID | ID[]) => void
    /** Toggle row(s) */
    toggle: (ids: ID | ID[]) => void
    /** Select all (respects selectStrategy) */
    selectAll: () => void
    /** Unselect all */
    unselectAll: () => void
    /** Toggle all */
    toggleAll: () => void
    /** All selected? */
    isAllSelected: ComputedRef<boolean>
    /** None selected? */
    isNoneSelected: ComputedRef<boolean>
    /** Some selected? (indeterminate) */
    isSomeSelected: ComputedRef<boolean>
  } | null

  // === SORTING (if enabled) ===

  sort: {
    /** Current sort configuration */
    sortBy: Ref<SortItem[]>
    /** Sort by column (cycles: none → asc → desc → none) */
    toggleSort: (key: string) => void
    /** Set sort directly */
    setSort: (sortBy: SortItem[]) => void
    /** Clear all sorting */
    clearSort: () => void
    /** Get sort state for column */
    getSortState: (key: string) => 'asc' | 'desc' | null
    /** Is column sorted? */
    isSorted: (key: string) => boolean
  } | null

  // === FILTERING (if enabled) ===

  filter: {
    /** Current search query */
    search: Ref<string>
    /** Set search */
    setSearch: (query: string) => void
    /** Clear search */
    clearSearch: () => void
    /** Filtered items (before sort/paginate) */
    filteredItems: ComputedRef<T[]>
    /** Number of filtered items */
    filteredCount: ComputedRef<number>
  } | null

  // === PAGINATION (if enabled) ===

  pagination: {
    /** Current page (1-indexed) */
    page: ShallowRef<number>
    /** Items per page */
    itemsPerPage: Ref<number>
    /** Total pages */
    pageCount: ComputedRef<number>
    /** Total items (filtered count or server itemsLength) */
    itemsLength: ComputedRef<number>
    /** Page start index (0-indexed) */
    pageStart: ComputedRef<number>
    /** Page stop index (exclusive) */
    pageStop: ComputedRef<number>
    /** Navigation */
    firstPage: () => void
    lastPage: () => void
    nextPage: () => void
    prevPage: () => void
    setPage: (page: number) => void
    setItemsPerPage: (count: number) => void
    /** Boundary checks */
    isFirstPage: ComputedRef<boolean>
    isLastPage: ComputedRef<boolean>
  } | null

  // === EXPANSION (if enabled) ===

  expansion: {
    /** Expanded row IDs */
    expandedIds: Reactive<Set<ID>>
    /** Check if row is expanded */
    isExpanded: (id: ID) => boolean
    /** Expand row(s) */
    expand: (ids: ID | ID[]) => void
    /** Collapse row(s) */
    collapse: (ids: ID | ID[]) => void
    /** Toggle row(s) */
    toggleExpand: (ids: ID | ID[]) => void
    /** Expand all */
    expandAll: () => void
    /** Collapse all */
    collapseAll: () => void
  } | null

  // === GROUPING (if enabled) ===

  grouping: {
    /** Current group configuration */
    groupBy: Ref<GroupItem[]>
    /** Grouped items structure */
    groupedItems: ComputedRef<DataTableGroup<T>[]>
    /** Set grouping */
    setGroupBy: (groupBy: GroupItem[]) => void
    /** Clear grouping */
    clearGroupBy: () => void
    /** Toggle group expanded state */
    toggleGroup: (groupKey: string) => void
  } | null

  // === VIRTUAL (if enabled) ===

  virtual: {
    /** Container element ref (bind to scrollable element) */
    element: Ref<HTMLElement | null>
    /** Visible items (subset of paginated items) */
    visibleItems: ComputedRef<T[]>
    /** Scroll offset for positioning */
    offset: ComputedRef<number>
    /** Scroll to specific item */
    scrollToItem: (id: ID, options?: ScrollToOptions) => void
    /** Scroll to index */
    scrollToIndex: (index: number, options?: ScrollToOptions) => void
  } | null

  // === SERVER MODE ===

  /** Set items (for server mode) */
  setItems: (items: T[]) => void

  /** Set total items length (for server mode) */
  setItemsLength: (length: number) => void

  /** Combined state for server requests */
  state: ComputedRef<DataTableState>

  // === EVENTS (if enabled) ===

  on: <K extends DataTableEvent>(event: K, handler: DataTableEventHandler<K>) => void
  off: <K extends DataTableEvent>(event: K, handler: DataTableEventHandler<K>) => void

  // === ROW HELPERS ===

  /** Get item by ID */
  getItem: (id: ID) => T | undefined

  /** Get row ticket with all computed state */
  getRow: (id: ID) => DataTableRow<T> | undefined
}
```

### Row Ticket (Per-Row State)

```ts
interface DataTableRow<T = unknown> {
  /** Unique identifier */
  id: ID
  /** Index in current view */
  index: number
  /** Raw item data */
  item: T

  // Selection (if enabled)
  isSelected: ComputedRef<boolean>
  select: () => void
  unselect: () => void
  toggleSelect: () => void

  // Expansion (if enabled)
  isExpanded: ComputedRef<boolean>
  expand: () => void
  collapse: () => void
  toggleExpand: () => void
}
```

### Events

```ts
type DataTableEvent =
  | 'update:sortBy'
  | 'update:search'
  | 'update:page'
  | 'update:itemsPerPage'
  | 'update:groupBy'
  | 'update:expanded'
  | 'update:selected'
  | 'update:options' // combined state change
  | 'click:row'
  | 'dblclick:row'
  | 'contextmenu:row'

interface DataTableState {
  page: number
  itemsPerPage: number
  sortBy: SortItem[]
  groupBy: GroupItem[]
  search: string
}
```

---

## Trinity Pattern Support

```ts
// Standalone
const table = createDataTable({ ... })

// Context injection
const [useDataTable, provideDataTable] = createDataTableContext({ ... })

// In root component
provideDataTable('my-table')

// In child components
const table = useDataTable('my-table')
```

---

## Implementation Strategy

### Phase 1: Core
- [ ] `DataTableOptions` interface
- [ ] `DataTableColumn` interface
- [ ] Basic item/column management
- [ ] `itemValue` extraction
- [ ] Trinity pattern setup

### Phase 2: Selection
- [ ] Integrate `createGroup` for row selection
- [ ] `selectStrategy` (page vs all)
- [ ] v-model support via `useProxyModel`

### Phase 3: Sorting
- [ ] `createSingle` for active column
- [ ] `createStep` for sort direction cycling
- [ ] Multi-sort support
- [ ] Custom sort functions
- [ ] `mustSort` option

### Phase 4: Filtering
- [ ] Integrate `useFilter`
- [ ] Per-column filter functions
- [ ] `filterKeys` support
- [ ] Custom filter functions

### Phase 5: Pagination
- [ ] Integrate `usePagination`
- [ ] Computed slice of sorted/filtered items
- [ ] Server mode support

### Phase 6: Expansion
- [ ] Second `createGroup` for expansion state
- [ ] `multiExpand` option

### Phase 7: Grouping
- [ ] Group computation
- [ ] Nested group support
- [ ] Group collapse state

### Phase 8: Virtual
- [ ] Integrate `useVirtual`
- [ ] Dynamic item heights
- [ ] Scroll anchoring

### Phase 9: Server Mode
- [ ] State-only tracking
- [ ] Event emission
- [ ] `setItems`/`setItemsLength`

### Phase 10: Polish
- [ ] Loading state
- [ ] Error handling
- [ ] Performance optimization
- [ ] Documentation

---

## Comparison: v0 vs TanStack

| Aspect | TanStack Table | v0 createDataTable |
|--------|----------------|-------------------|
| Setup | 50+ lines boilerplate | 5-10 lines |
| Reactivity | Manual sync, bugs | Native Vue reactivity |
| Types | Complex, many `any` | Clean generics |
| Server mode | Separate mental model | Same API, different mode |
| Virtual | Separate package | Built-in option |
| Selection | Manual wiring | `selectable: 'multiple'` |
| Learning curve | Steep, "too complex" | Progressive disclosure |

---

## Open Questions

1. **Column registry**: Should columns use `createRegistry` or just be a reactive array?
2. **Slot names**: Follow Vuetify 3 conventions (`header.${key}`, `item.${key}`)?
3. **Density**: Handle in composable or leave to components?
4. **Fixed columns**: CSS-only or composable support?
5. **Drag/resize**: Separate composable or built-in?
