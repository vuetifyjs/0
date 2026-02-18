/**
 * createDataTable Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - lookups, computed access)
 * - MUTATION operations create fresh fixtures per iteration (sort toggle, search, selection)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, search pipeline, sort pipeline, selection operations,
 *   grouping, computed access, adapter comparison
 */

import { bench, describe } from 'vitest'

// Types
import type { DataTableColumn, DataTableOptions } from './index'

import { createDataTable, ClientAdapter, VirtualAdapter } from './index'

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
    name: `User ${i} ${Math.random().toString(36).slice(2, 8)}`,
    email: `user${i}@example.com`,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    salary: 50_000 + Math.floor(Math.random() * 100_000),
    active: i % 5 !== 0,
  }))
}

const ROWS_1K: BenchmarkRow[] = generateRows(1000)
const ROWS_10K: BenchmarkRow[] = generateRows(10_000)

const COLUMNS: DataTableColumn<BenchmarkRow>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true },
  { key: 'email', title: 'Email', sortable: true, filterable: true },
  { key: 'department', title: 'Department', sortable: true },
  { key: 'salary', title: 'Salary', sortable: true, sort: (a, b) => Number(a) - Number(b) },
  { key: 'active', title: 'Active' },
]

const COLUMNS_WITH_FILTER: DataTableColumn<BenchmarkRow>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true, filter: (v, q) => String(v).toLowerCase().startsWith(q) },
  { key: 'email', title: 'Email', sortable: true, filterable: true },
  { key: 'department', title: 'Department', sortable: true },
  { key: 'salary', title: 'Salary', sortable: true, sort: (a, b) => Number(a) - Number(b) },
  { key: 'active', title: 'Active' },
]

// Lookup targets (middle of dataset)
const SEARCH_QUERY_1K = 'User 500'
const SEARCH_QUERY_10K = 'User 5000'

function createTable (overrides: Partial<DataTableOptions<BenchmarkRow>> = {}) {
  return createDataTable<BenchmarkRow>({
    items: overrides.items ?? ROWS_1K,
    columns: overrides.columns ?? COLUMNS,
    ...overrides,
  })
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
    bench('Create table with 1,000 items', () => {
      createTable({ items: ROWS_1K })
    })

    bench('Create table with 10,000 items', () => {
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
        enroll: true,
      })
    })
  })

  // ===========================================================================
  // SEARCH PIPELINE - Filter stage of the data pipeline
  // Fresh fixture per iteration (required - search() mutates query ref)
  // Measures: filter computation triggered by search query change
  // ===========================================================================
  describe('search pipeline', () => {
    bench('Search then read filtered items (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K })
      table.search(SEARCH_QUERY_1K)
      void table.filteredItems.value
    })

    bench('Search then read filtered items (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K })
      table.search(SEARCH_QUERY_10K)
      void table.filteredItems.value
    })

    bench('Search with custom column filter (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, columns: COLUMNS_WITH_FILTER })
      table.search('user 5')
      void table.filteredItems.value
    })

    bench('Search with custom column filter (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K, columns: COLUMNS_WITH_FILTER })
      table.search('user 5')
      void table.filteredItems.value
    })

    bench('Update search 10 times (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K })
      for (let i = 0; i < 10; i++) {
        table.search(`User ${500 + i}`)
        void table.items.value
      }
    })
  })

  // ===========================================================================
  // SORT PIPELINE - Sort stage including localeCompare and custom comparators
  // Fresh fixture per iteration (required - toggle() mutates sort state)
  // Measures: sort computation triggered by column toggle
  // ===========================================================================
  describe('sort pipeline', () => {
    bench('Sort by string column ascending (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K })
      table.sort.toggle('name')
      void table.sortedItems.value
    })

    bench('Sort by string column ascending (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K })
      table.sort.toggle('name')
      void table.sortedItems.value
    })

    bench('Sort by custom comparator (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K })
      table.sort.toggle('salary')
      void table.sortedItems.value
    })

    bench('Sort by custom comparator (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K })
      table.sort.toggle('salary')
      void table.sortedItems.value
    })

    bench('Multi-sort two columns (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, sortMultiple: true })
      table.sort.toggle('department')
      table.sort.toggle('name')
      void table.sortedItems.value
    })

    bench('Multi-sort two columns (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K, sortMultiple: true })
      table.sort.toggle('department')
      table.sort.toggle('name')
      void table.sortedItems.value
    })

    bench('Toggle sort cycle 3 times (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K })
      table.sort.toggle('name') // asc
      void table.sortedItems.value
      table.sort.toggle('name') // desc
      void table.sortedItems.value
      table.sort.toggle('name') // none
      void table.sortedItems.value
    })
  })

  // ===========================================================================
  // SELECTION OPERATIONS - Set-based selection with strategy scoping
  // Fresh fixture per iteration (required - selection mutates Set state)
  // Measures: selection operations including itemSelectable checks
  // ===========================================================================
  describe('selection operations', () => {
    bench('Select single item (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K })
      table.selection.select(500)
    })

    bench('Select all items (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, selectStrategy: 'all' })
      table.selection.selectAll()
    })

    bench('Select all items (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K, selectStrategy: 'all' })
      table.selection.selectAll()
    })

    bench('Select all with itemSelectable (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, selectStrategy: 'all', itemSelectable: 'active' })
      table.selection.selectAll()
    })

    bench('Toggle all then check isAllSelected (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, selectStrategy: 'all' })
      table.selection.toggleAll()
      void table.selection.isAllSelected.value
      void table.selection.isMixed.value
    })

    bench('Toggle 100 individual rows (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, selectStrategy: 'all' })
      for (let i = 0; i < 100; i++) {
        table.selection.toggle(i)
      }
    })
  })

  // ===========================================================================
  // GROUPING - Computed group derivation from sorted items
  // Shared fixture for read-only group access, fresh for open/close mutations
  // Measures: group computation cost and open/close state management
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

    bench('Open all then close all groups (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, groupBy: 'department' })
      void table.grouping.groups.value
      table.grouping.openAll()
      table.grouping.closeAll()
    })

    bench('Create with enroll (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, groupBy: 'department', enroll: true })
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

    bench('Read items 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table1k.items.value
      }
    })

    bench('Read items 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table10k.items.value
      }
    })

    bench('Read sortedItems 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table1k.sortedItems.value
      }
    })

    bench('Read total 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void table1k.total.value
      }
    })
  })

  // ===========================================================================
  // FULL PIPELINE - End-to-end search → sort → paginate
  // Fresh fixture per iteration (required - mutates search and sort state)
  // Measures: combined pipeline cost for realistic usage
  // ===========================================================================
  describe('full pipeline', () => {
    bench('Search + sort + paginate (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
      table.search('User 5')
      table.sort.toggle('name')
      void table.items.value
    })

    bench('Search + sort + paginate (10,000 items)', () => {
      const table = createTable({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })
      table.search('User 5')
      table.sort.toggle('name')
      void table.items.value
    })

    bench('Search + multi-sort + paginate (1,000 items)', () => {
      const table = createTable({ items: ROWS_1K, sortMultiple: true, pagination: { itemsPerPage: 25 } })
      table.search('User')
      table.sort.toggle('department')
      table.sort.toggle('salary')
      void table.items.value
    })
  })

  // ===========================================================================
  // ADAPTER COMPARISON - ClientAdapter vs VirtualAdapter pipeline cost
  // Fresh fixture per iteration (required - sort/search mutations)
  // Measures: adapter-specific overhead for same dataset
  // ===========================================================================
  describe('adapter comparison', () => {
    bench('ClientAdapter: sort + paginate (10,000 items)', () => {
      const table = createTable({
        items: ROWS_10K,
        adapter: new ClientAdapter<BenchmarkRow>(),
        pagination: { itemsPerPage: 25 },
      })
      table.sort.toggle('name')
      void table.items.value
    })

    bench('VirtualAdapter: sort, no pagination (10,000 items)', () => {
      const table = createTable({
        items: ROWS_10K,
        adapter: new VirtualAdapter<BenchmarkRow>(),
      })
      table.sort.toggle('name')
      void table.items.value
    })

    bench('ClientAdapter: full pipeline (10,000 items)', () => {
      const table = createTable({
        items: ROWS_10K,
        adapter: new ClientAdapter<BenchmarkRow>(),
        pagination: { itemsPerPage: 25 },
      })
      table.search('User 5')
      table.sort.toggle('name')
      void table.items.value
    })

    bench('VirtualAdapter: full pipeline (10,000 items)', () => {
      const table = createTable({
        items: ROWS_10K,
        adapter: new VirtualAdapter<BenchmarkRow>(),
      })
      table.search('User 5')
      table.sort.toggle('name')
      void table.items.value
    })
  })
})
