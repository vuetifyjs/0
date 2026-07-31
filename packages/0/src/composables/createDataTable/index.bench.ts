/**
 * createDataTable Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - lookups, computed access)
 * - WARM operations (search, sort, select, full pipeline, adapters) share a
 *   populated table and reset only the pipeline's own state (search(''),
 *   sort.reset(), selection.unselectAll()) at the top of the timed block, so
 *   the O(n) onboard is paid once at setup, never per iteration. Each reset
 *   dirties the derived computed so the following read recomputes real work.
 * - FRESH fixtures only where the populate IS the op (initialization, create
 *   with openAll) or where a shared read would hit the memo cache (Compute
 *   groups — the `groups` computed only recomputes on input change).
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, search pipeline, sort pipeline, selection operations,
 *   grouping, computed access, adapter comparison
 */

import { bench, describe } from 'vitest'

// Framework
import { createDataTable, ClientDataTableAdapter, VirtualDataTableAdapter } from '@vuetify/v0/composables'

// Types
import type { DataTableColumnTicketInput, DataTableOptions, DataTableTicketInput } from '@vuetify/v0/composables'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkRow extends Record<string, unknown> {
  id: number
  name: string
  email: string
  department: string
  salary: number
  active: boolean
}

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support', 'Finance', 'Legal', 'HR']

function generateRows (count: number): BenchmarkRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `User ${i} ${String(i * 7919).slice(0, 6)}`,
    email: `user${i}@example.com`,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    salary: 50_000 + (i * 137) % 100_000,
    active: i % 5 !== 0,
  }))
}

const ROWS_1K: BenchmarkRow[] = generateRows(1000)
const ROWS_10K: BenchmarkRow[] = generateRows(10_000)

const COLUMNS: DataTableColumnTicketInput<BenchmarkRow>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'department', title: 'Department', sortable: true },
  { id: 'salary', title: 'Salary', sortable: true, sort: (a, b) => Number(a) - Number(b) },
  { id: 'active', title: 'Active' },
]

const COLUMNS_WITH_FILTER: DataTableColumnTicketInput<BenchmarkRow>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true, filter: (v, q) => String(v).toLowerCase().startsWith(q) },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'department', title: 'Department', sortable: true },
  { id: 'salary', title: 'Salary', sortable: true, sort: (a, b) => Number(a) - Number(b) },
  { id: 'active', title: 'Active' },
]

// Lookup targets (middle of dataset)
const SEARCH_QUERY_1K = 'User 500'
const SEARCH_QUERY_10K = 'User 5000'

function toInputs (rows: readonly BenchmarkRow[]): DataTableTicketInput<BenchmarkRow>[] {
  return rows.map(value => ({ id: value.id, value }))
}

function createTable (
  options: Partial<DataTableOptions<BenchmarkRow>> & {
    items?: readonly BenchmarkRow[]
    columns?: DataTableColumnTicketInput<BenchmarkRow>[]
  } = {},
) {
  const { items: rows = ROWS_1K, columns: cols = COLUMNS, ...rest } = options
  const table = createDataTable<BenchmarkRow>({ ...rest })
  table.columns.onboard(cols)
  table.onboard(toInputs(rows))
  return table
}

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createDataTable benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures table creation cost including internal composables
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create table (1,000 items)', () => {
      createTable({ items: ROWS_1K })
    })

    bench('Create table (10,000 items)', () => {
      createTable({ items: ROWS_10K })
    })

    bench('Create table with groupBy (1,000 items)', () => {
      createTable({ items: ROWS_1K, groupBy: 'department' })
    })

    bench('Create table with all options (1,000 items)', () => {
      createTable({
        items: ROWS_1K,
        sortMultiple: true,
        mandate: true,
        selectStrategy: 'all',
        itemSelectable: 'active',
        groupBy: 'department',
        openAll: true,
      })
    })
  })

  // ===========================================================================
  // SEARCH PIPELINE - Filter stage of the data pipeline
  // WARM: shared populated table; reset the query with search('') then run the
  // search. filteredItems recomputes because the query changed, so the read
  // times a real filter pass over all items — never the onboard.
  // ===========================================================================
  describe('search pipeline', () => {
    const search1k = createTable({ items: ROWS_1K })
    const search10k = createTable({ items: ROWS_10K })
    const searchFilter1k = createTable({ items: ROWS_1K, columns: COLUMNS_WITH_FILTER })
    const searchFilter10k = createTable({ items: ROWS_10K, columns: COLUMNS_WITH_FILTER })

    bench('Search then read filtered items (1,000 items)', () => {
      search1k.search('')
      search1k.search(SEARCH_QUERY_1K)
      void search1k.filteredItems.value
    })

    bench('Search then read filtered items (10,000 items)', () => {
      search10k.search('')
      search10k.search(SEARCH_QUERY_10K)
      void search10k.filteredItems.value
    })

    bench('Search with custom column filter (1,000 items)', () => {
      searchFilter1k.search('')
      searchFilter1k.search('user 5')
      void searchFilter1k.filteredItems.value
    })

    bench('Search with custom column filter (10,000 items)', () => {
      searchFilter10k.search('')
      searchFilter10k.search('user 5')
      void searchFilter10k.filteredItems.value
    })

    bench('Update search 10 times (1,000 items)', () => {
      search1k.search('')
      for (let i = 0; i < 10; i++) {
        search1k.search(`User ${500 + i}`)
        void search1k.items.value
      }
    })
  })

  // ===========================================================================
  // SORT PIPELINE - Sort stage including localeCompare and custom comparators
  // WARM: shared populated table; sort.reset() clears the sort group (dirtying
  // sortedItems), then toggle() re-sorts, so the read times a real sort pass.
  // Empty query on these fixtures means the full N rows are sorted every time.
  // ===========================================================================
  describe('sort pipeline', () => {
    const sort1k = createTable({ items: ROWS_1K })
    const sort10k = createTable({ items: ROWS_10K })
    const sortMulti1k = createTable({ items: ROWS_1K, sortMultiple: true })
    const sortMulti10k = createTable({ items: ROWS_10K, sortMultiple: true })

    bench('Sort by string column ascending (1,000 items)', () => {
      sort1k.sort.reset()
      sort1k.sort.toggle('name')
      void sort1k.sortedItems.value
    })

    bench('Sort by string column ascending (10,000 items)', () => {
      sort10k.sort.reset()
      sort10k.sort.toggle('name')
      void sort10k.sortedItems.value
    })

    bench('Sort by custom comparator (1,000 items)', () => {
      sort1k.sort.reset()
      sort1k.sort.toggle('salary')
      void sort1k.sortedItems.value
    })

    bench('Sort by custom comparator (10,000 items)', () => {
      sort10k.sort.reset()
      sort10k.sort.toggle('salary')
      void sort10k.sortedItems.value
    })

    bench('Multi-sort two columns (1,000 items)', () => {
      sortMulti1k.sort.reset()
      sortMulti1k.sort.toggle('department')
      sortMulti1k.sort.toggle('name')
      void sortMulti1k.sortedItems.value
    })

    bench('Multi-sort two columns (10,000 items)', () => {
      sortMulti10k.sort.reset()
      sortMulti10k.sort.toggle('department')
      sortMulti10k.sort.toggle('name')
      void sortMulti10k.sortedItems.value
    })

    bench('Toggle sort cycle 3 times (1,000 items)', () => {
      sort1k.sort.reset()
      sort1k.sort.toggle('name') // asc
      void sort1k.sortedItems.value
      sort1k.sort.toggle('name') // desc
      void sort1k.sortedItems.value
      sort1k.sort.toggle('name') // none
      void sort1k.sortedItems.value
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Set-based selection with strategy scoping
  // WARM: shared populated table; unselectAll() returns the Set to empty before
  // each op, so every iteration measures the same selection work (no drift).
  // ===========================================================================
  describe('selection operations', () => {
    const selSingle1k = createTable({ items: ROWS_1K })
    const selAll1k = createTable({ items: ROWS_1K, selectStrategy: 'all' })
    const selAll10k = createTable({ items: ROWS_10K, selectStrategy: 'all' })
    const selActive1k = createTable({ items: ROWS_1K, selectStrategy: 'all', itemSelectable: 'active' })

    bench('Select single item (1,000 items)', () => {
      selSingle1k.selection.unselectAll()
      selSingle1k.selection.select(500)
    })

    bench('Select all items (1,000 items)', () => {
      selAll1k.selection.unselectAll()
      selAll1k.selection.selectAll()
    })

    bench('Select all items (10,000 items)', () => {
      selAll10k.selection.unselectAll()
      selAll10k.selection.selectAll()
    })

    bench('Select all with itemSelectable (1,000 items)', () => {
      selActive1k.selection.unselectAll()
      selActive1k.selection.selectAll()
    })

    bench('Toggle all then check isAllSelected (1,000 items)', () => {
      selAll1k.selection.unselectAll()
      selAll1k.selection.toggleAll()
      void selAll1k.selection.isAllSelected.value
      void selAll1k.selection.isMixed.value
    })

    bench('Toggle 100 individual rows (1,000 items)', () => {
      selAll1k.selection.unselectAll()
      for (let i = 0; i < 100; i++) {
        selAll1k.selection.toggle(i)
      }
    })
  })

  // ===========================================================================
  // GROUPING - Computed group derivation from sorted items
  // Compute groups stays FRESH: the `groups` computed only recomputes when its
  // inputs (sorted items / groupBy) change, so a shared fixture would read a
  // cache hit (~0) and hide the very derivation being benchmarked — fresh
  // construction is the only honest recompute trigger. Open/close is WARM
  // (self-inverting on a shared fixture); Create-with-openAll is FRESH because
  // the eager group expansion at construction IS the measured op.
  // ===========================================================================
  describe('grouping', () => {
    bench('Compute groups (1,000 items, 8 groups)', () => {
      const table = createTable({ items: ROWS_1K, groupBy: 'department' })
      void table.grouping.groups.value
    })

    bench('Compute groups (10,000 items, 8 groups)', () => {
      const table = createTable({ items: ROWS_10K, groupBy: 'department' })
      void table.grouping.groups.value
    })

    const group1k = createTable({ items: ROWS_1K, groupBy: 'department' })

    bench('Open all then close all groups (1,000 items)', () => {
      void group1k.grouping.groups.value
      group1k.grouping.openAll()
      group1k.grouping.closeAll()
    })

    bench('Create with openAll (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, groupBy: 'department', openAll: true })
      void table.grouping.groups.value
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - Cached reads of derived pipeline stages
  // Shared fixture (safe - reading .value doesn't mutate state)
  // Measures: Vue computed caching effectiveness
  // ===========================================================================
  describe('computed access', () => {
    const table1k = createTable({ items: ROWS_1K })
    const table10k = createTable({ items: ROWS_10K })

    bench('Access items 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table1k.items.value
      }
    })

    bench('Access items 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table10k.items.value
      }
    })

    bench('Access sortedItems 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table1k.sortedItems.value
      }
    })

    bench('Access total 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table1k.total.value
      }
    })
  })

  // ===========================================================================
  // FULL PIPELINE - End-to-end search → sort → paginate
  // WARM: shared paginated table; reset search + sort at the top so each
  // iteration runs the whole pipeline from the same clean state and the read
  // recomputes real work. Onboard is paid once at setup.
  // ===========================================================================
  describe('full pipeline', () => {
    const full1k = createTable({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
    const full10k = createTable({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })
    const fullMulti1k = createTable({ items: ROWS_1K, sortMultiple: true, pagination: { itemsPerPage: 25 } })

    bench('Search + sort + paginate (1,000 items)', () => {
      full1k.search('')
      full1k.sort.reset()
      full1k.search('User 5')
      full1k.sort.toggle('name')
      void full1k.items.value
    })

    bench('Search + sort + paginate (10,000 items)', () => {
      full10k.search('')
      full10k.sort.reset()
      full10k.search('User 5')
      full10k.sort.toggle('name')
      void full10k.items.value
    })

    bench('Search + multi-sort + paginate (1,000 items)', () => {
      fullMulti1k.search('')
      fullMulti1k.sort.reset()
      fullMulti1k.search('User')
      fullMulti1k.sort.toggle('department')
      fullMulti1k.sort.toggle('salary')
      void fullMulti1k.items.value
    })
  })

  // ===========================================================================
  // ADAPTER COMPARISON - ClientDataTableAdapter vs VirtualDataTableAdapter pipeline cost
  // WARM: one shared table per adapter; reset search + sort at the top so the
  // measured cost is the adapter's pipeline work, not the onboard.
  // ===========================================================================
  describe('adapter comparison', () => {
    const client10k = createTable({
      items: ROWS_10K,
      adapter: new ClientDataTableAdapter<BenchmarkRow>(),
      pagination: { itemsPerPage: 25 },
    })
    const virtual10k = createTable({
      items: ROWS_10K,
      adapter: new VirtualDataTableAdapter<BenchmarkRow>(),
    })

    bench('ClientDataTableAdapter: sort + paginate (10,000 items)', () => {
      client10k.search('')
      client10k.sort.reset()
      client10k.sort.toggle('name')
      void client10k.items.value
    })

    bench('VirtualDataTableAdapter: sort, no pagination (10,000 items)', () => {
      virtual10k.search('')
      virtual10k.sort.reset()
      virtual10k.sort.toggle('name')
      void virtual10k.items.value
    })

    bench('ClientDataTableAdapter: full pipeline (10,000 items)', () => {
      client10k.search('')
      client10k.sort.reset()
      client10k.search('User 5')
      client10k.sort.toggle('name')
      void client10k.items.value
    })

    bench('VirtualDataTableAdapter: full pipeline (10,000 items)', () => {
      virtual10k.search('')
      virtual10k.sort.reset()
      virtual10k.search('User 5')
      virtual10k.sort.toggle('name')
      void virtual10k.items.value
    })
  })
})
