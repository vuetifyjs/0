/**
 * createDataGrid Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - lookups, computed access)
 * - WARM operations (search, sort, layout, editing, row ordering, full
 *   pipeline) share a populated grid and reset only the touched state
 *   (search(''), sort.reset(), layout.reset(), rows.reset(), editing.cancel())
 *   at the top of the timed block, so the O(n) construction+onboard is paid
 *   once at setup, never per iteration.
 * - FRESH fixtures only where construction IS the op (initialization) or where
 *   a shared read would hit the memo cache (row spanning — the `spans` computed
 *   only recomputes when its visible-items / span-fn inputs change).
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, search pipeline, sort pipeline, column layout,
 *   cell editing, row ordering, row spanning, computed access, full pipeline
 *
 * Comparable operations with createDataTable benchmarks:
 * - initialization: Create grid vs Create table
 * - search pipeline: Same operations, measures grid overhead
 * - sort pipeline: Same operations, measures grid overhead
 * - full pipeline: Search + sort + paginate at both sizes
 * - computed access: Cached reads at both sizes
 */

import { bench, describe } from 'vitest'

// Framework
import { createDataGrid } from '@vuetify/v0/composables'

// Types
import type { DataGridColumnTicketInput, DataGridOptions } from '@vuetify/v0/composables'

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

const COLUMNS: DataGridColumnTicketInput<BenchmarkRow>[] = [
  { id: 'name', title: 'Name', sortable: true, filterable: true, size: 25 },
  { id: 'email', title: 'Email', sortable: true, filterable: true, size: 30 },
  { id: 'department', title: 'Department', sortable: true, size: 15 },
  { id: 'salary', title: 'Salary', sortable: true, size: 15, sort: (a, b) => Number(a) - Number(b) },
  { id: 'active', title: 'Active', size: 15 },
]

const COLUMNS_PINNED: DataGridColumnTicketInput<BenchmarkRow>[] = [
  { id: 'name', title: 'Name', sortable: true, size: 20, pinned: 'left' },
  { id: 'email', title: 'Email', sortable: true, size: 25 },
  { id: 'department', title: 'Department', sortable: true, size: 15 },
  { id: 'salary', title: 'Salary', sortable: true, size: 15 },
  { id: 'active', title: 'Active', size: 15, pinned: 'right' },
]

const COLUMNS_EDITABLE: DataGridColumnTicketInput<BenchmarkRow>[] = [
  { id: 'name', title: 'Name', size: 25, editable: true, validate: v => (typeof v === 'string' && v.length > 0) || 'Required' },
  { id: 'email', title: 'Email', size: 25, editable: true, validate: v => (typeof v === 'string' && v.includes('@')) || 'Invalid' },
  { id: 'department', title: 'Department', size: 20 },
  { id: 'salary', title: 'Salary', size: 15 },
  { id: 'active', title: 'Active', size: 15 },
]

const SEARCH_QUERY_1K = 'User 500'
const SEARCH_QUERY_10K = 'User 5000'

function createGrid (
  overrides: Partial<DataGridOptions<BenchmarkRow>> & {
    items?: BenchmarkRow[]
    columns?: DataGridColumnTicketInput<BenchmarkRow>[]
  } = {},
) {
  const { items: _items, columns: _columns, ...rest } = overrides
  const items = _items ?? ROWS_1K
  const columns = _columns ?? COLUMNS
  const grid = createDataGrid<BenchmarkRow>(rest)
  grid.columns.onboard(columns)
  grid.onboard(items.map(value => ({ id: value.id, value })))
  return grid
}

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createDataGrid benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures grid creation cost including layout, editing, etc.
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // Comparable: createDataTable initialization
  // ===========================================================================
  describe('initialization', () => {
    bench('Create grid (1,000 items)', () => {
      createGrid({ items: ROWS_1K })
    })

    bench('Create grid (10,000 items)', () => {
      createGrid({ items: ROWS_10K })
    })

    bench('Create grid with pinned columns (1,000 items)', () => {
      createGrid({ items: ROWS_1K, columns: COLUMNS_PINNED })
    })

    bench('Create grid with editable columns (1,000 items)', () => {
      createGrid({ items: ROWS_1K, columns: COLUMNS_EDITABLE })
    })

    bench('Create grid with all options (1,000 items)', () => {
      createGrid({
        items: ROWS_1K,
        columns: COLUMNS_PINNED,
        sortMultiple: true,
        editing: { onEdit: () => {} },
        rowSpanning: (_, col) => col === 'department' ? 2 : 1,
      })
    })
  })

  // ===========================================================================
  // SEARCH PIPELINE - Filter stage via inherited createDataTable pipeline
  // WARM: shared populated grid; search('') resets the query, then the search
  // re-filters — the read times a real filter pass, never the onboard.
  // Comparable: createDataTable search pipeline
  // ===========================================================================
  describe('search pipeline', () => {
    const search1k = createGrid({ items: ROWS_1K })
    const search10k = createGrid({ items: ROWS_10K })

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
  })

  // ===========================================================================
  // SORT PIPELINE - Sort stage via inherited createDataTable pipeline
  // WARM: shared populated grid; sort.reset() clears sort (dirtying sortedItems)
  // then toggle() re-sorts, so the read times a real sort. Note this also fires
  // the grid's sort-columns watch → rows.reset(), so the measured cost is the
  // full grid sort interaction (see datagrid-sort-reorder-perf follow-up).
  // Comparable: createDataTable sort pipeline
  // ===========================================================================
  describe('sort pipeline', () => {
    const sort1k = createGrid({ items: ROWS_1K })
    const sort10k = createGrid({ items: ROWS_10K })

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
  })

  // ===========================================================================
  // COLUMN LAYOUT - Pin, resize, reorder, distribute, reset
  // WARM: shared grid; layout.reset() returns columns to their default layout
  // (dirtying layout.columns / layout.pinned) before each op, so the read times
  // the layout mutation only. Grid-specific: no createDataTable equivalent.
  // ===========================================================================
  describe('column layout', () => {
    const layout1k = createGrid({ items: ROWS_1K })

    bench('Pin column (1,000 items)', () => {
      layout1k.layout.reset()
      layout1k.layout.pin('name', 'left')
      void layout1k.layout.pinned.value
    })

    bench('Resize column (1,000 items)', () => {
      layout1k.layout.reset()
      layout1k.layout.resize('name', 5)
      void layout1k.layout.columns.value
    })

    bench('Resize column 10 times (1,000 items)', () => {
      layout1k.layout.reset()
      for (let i = 0; i < 10; i++) {
        layout1k.layout.resize('name', 1)
      }
      void layout1k.layout.columns.value
    })

    bench('Reorder column (1,000 items)', () => {
      layout1k.layout.reset()
      layout1k.layout.reorder(0, 3)
      void layout1k.layout.columns.value
    })

    bench('Reset layout (1,000 items)', () => {
      layout1k.layout.pin('name', 'left')
      layout1k.layout.resize('email', 5)
      layout1k.layout.reset()
      void layout1k.layout.columns.value
    })
  })

  // ===========================================================================
  // CELL EDITING - Edit, commit, cancel, validation
  // WARM: shared editable grid; editing.cancel() clears the active-cell state
  // before each op, so every iteration measures the same edit/commit machinery.
  // A commit writes the same value each time, so there is no cumulative drift.
  // Grid-specific: no createDataTable equivalent.
  // ===========================================================================
  describe('cell editing', () => {
    const editGrid = createGrid({ items: ROWS_1K, columns: COLUMNS_EDITABLE })
    const editGridSeq = createGrid({
      items: ROWS_1K,
      columns: COLUMNS_EDITABLE,
      editing: { onEdit: () => {} },
    })

    bench('Edit cell (1,000 items)', () => {
      editGrid.editing.cancel()
      editGrid.editing.edit(500, 'name')
    })

    bench('Edit then commit (1,000 items)', () => {
      editGrid.editing.cancel()
      editGrid.editing.edit(500, 'name')
      editGrid.editing.commit('Updated Name')
    })

    bench('Edit then cancel (1,000 items)', () => {
      editGrid.editing.edit(500, 'name')
      editGrid.editing.cancel()
    })

    bench('Edit with validation failure (1,000 items)', () => {
      editGrid.editing.cancel()
      editGrid.editing.edit(500, 'email')
      editGrid.editing.commit('no-at-sign')
      void editGrid.editing.error.value
    })

    bench('Edit 10 cells sequentially (1,000 items)', () => {
      editGridSeq.editing.cancel()
      for (let i = 0; i < 10; i++) {
        editGridSeq.editing.edit(i, 'name')
        editGridSeq.editing.commit(`Name ${i}`)
      }
    })
  })

  // ===========================================================================
  // ROW ORDERING - Move rows post-sort
  // WARM: shared grid; rows.reset() returns the manual order to registration
  // order before each op, so every iteration measures the same move work.
  // Grid-specific: no createDataTable equivalent.
  // ===========================================================================
  describe('row ordering', () => {
    const order1k = createGrid({ items: ROWS_1K })

    bench('Move row (1,000 items)', () => {
      order1k.rows.reset()
      order1k.rows.move(ROWS_1K[0]!.id, 500)
    })

    bench('Move 10 rows (1,000 items)', () => {
      order1k.rows.reset()
      for (let i = 0; i < 10; i++) {
        order1k.rows.move(ROWS_1K[i]!.id, i + 10)
      }
    })

    bench('Reset row order (1,000 items)', () => {
      order1k.rows.move(ROWS_1K[0]!.id, 500)
      order1k.rows.reset()
    })
  })

  // ===========================================================================
  // ROW SPANNING - Computed span map from visible items
  // FRESH (kept): the `spans` computed only recomputes when its visible-items /
  // span-fn inputs change. A shared fixture would read a memo cache hit (~0)
  // and hide the span computation being benchmarked, so fresh construction is
  // the only honest recompute trigger. Grid-specific: no createDataTable equiv.
  // ===========================================================================
  describe('row spanning', () => {
    bench('Compute spans (1,000 items, 1 column)', () => {
      const grid = createGrid({
        items: ROWS_1K,
        rowSpanning: (_, col) => col === 'department' ? 2 : 1,
      })
      void grid.spans.value
    })

    bench('Compute spans (10,000 items, 1 column)', () => {
      const grid = createGrid({
        items: ROWS_10K,
        rowSpanning: (_, col) => col === 'department' ? 2 : 1,
      })
      void grid.spans.value
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - Cached reads of derived pipeline stages
  // Shared fixture (safe - reading .value doesn't mutate state)
  // Comparable: createDataTable computed access
  // ===========================================================================
  describe('computed access', () => {
    const grid1k = createGrid({ items: ROWS_1K, columns: COLUMNS_PINNED })
    const grid10k = createGrid({ items: ROWS_10K, columns: COLUMNS_PINNED })

    bench('Access items 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void grid1k.items.value
      }
    })

    bench('Access items 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void grid10k.items.value
      }
    })

    bench('Access sortedItems 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void grid1k.sortedItems.value
      }
    })

    bench('Access layout.columns 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void grid1k.layout.columns.value
      }
    })

    bench('Access layout.pinned 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void grid1k.layout.pinned.value
      }
    })
  })

  // ===========================================================================
  // FULL PIPELINE - End-to-end search → sort → paginate
  // WARM: shared paginated grid; reset search + sort (+ layout) at the top so
  // each iteration runs the whole pipeline from the same clean state and the
  // read recomputes real work. Comparable: createDataTable full pipeline.
  // ===========================================================================
  describe('full pipeline', () => {
    const full1k = createGrid({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
    const full10k = createGrid({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })
    const fullLayout1k = createGrid({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
    const fullLayout10k = createGrid({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })

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

    bench('Search + sort + paginate + layout (1,000 items)', () => {
      fullLayout1k.search('')
      fullLayout1k.sort.reset()
      fullLayout1k.layout.reset()
      fullLayout1k.search('User 5')
      fullLayout1k.sort.toggle('name')
      fullLayout1k.layout.pin('name', 'left')
      fullLayout1k.layout.resize('email', 5)
      void fullLayout1k.items.value
      void fullLayout1k.layout.pinned.value
    })

    bench('Search + sort + paginate + layout (10,000 items)', () => {
      fullLayout10k.search('')
      fullLayout10k.sort.reset()
      fullLayout10k.layout.reset()
      fullLayout10k.search('User 5')
      fullLayout10k.sort.toggle('name')
      fullLayout10k.layout.pin('name', 'left')
      fullLayout10k.layout.resize('email', 5)
      void fullLayout10k.items.value
      void fullLayout10k.layout.pinned.value
    })
  })
})
