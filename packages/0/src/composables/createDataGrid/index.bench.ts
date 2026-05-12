/**
 * createDataGrid Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - lookups, computed access)
 * - MUTATION operations create fresh fixtures per iteration
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

import { createDataGrid } from './index'

// Types
import type { DataGridColumn, DataGridOptions } from './index'

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

const COLUMNS: DataGridColumn<BenchmarkRow>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true, size: 25 },
  { key: 'email', title: 'Email', sortable: true, filterable: true, size: 30 },
  { key: 'department', title: 'Department', sortable: true, size: 15 },
  { key: 'salary', title: 'Salary', sortable: true, size: 15, sort: (a, b) => Number(a) - Number(b) },
  { key: 'active', title: 'Active', size: 15 },
]

const COLUMNS_PINNED: DataGridColumn<BenchmarkRow>[] = [
  { key: 'name', title: 'Name', sortable: true, size: 20, pinned: 'left' },
  { key: 'email', title: 'Email', sortable: true, size: 25 },
  { key: 'department', title: 'Department', sortable: true, size: 15 },
  { key: 'salary', title: 'Salary', sortable: true, size: 15 },
  { key: 'active', title: 'Active', size: 15, pinned: 'right' },
]

const COLUMNS_EDITABLE: DataGridColumn<BenchmarkRow>[] = [
  { key: 'name', title: 'Name', size: 25, editable: true, validate: v => (typeof v === 'string' && v.length > 0) || 'Required' },
  { key: 'email', title: 'Email', size: 25, editable: true, validate: v => (typeof v === 'string' && v.includes('@')) || 'Invalid' },
  { key: 'department', title: 'Department', size: 20 },
  { key: 'salary', title: 'Salary', size: 15 },
  { key: 'active', title: 'Active', size: 15 },
]

const SEARCH_QUERY_1K = 'User 500'
const SEARCH_QUERY_10K = 'User 5000'

function createGrid (overrides: Partial<DataGridOptions<BenchmarkRow>> = {}) {
  return createDataGrid<BenchmarkRow>({
    items: overrides.items ?? ROWS_1K,
    columns: overrides.columns ?? COLUMNS,
    ...overrides,
  })
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
  // Fresh fixture per iteration (required - search() mutates query ref)
  // Comparable: createDataTable search pipeline
  // ===========================================================================
  describe('search pipeline', () => {
    bench('Search then read filtered items (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.search(SEARCH_QUERY_1K)
      void grid.filteredItems.value
    })

    bench('Search then read filtered items (10,000 items)', () => {
      const grid = createGrid({ items: ROWS_10K })
      grid.search(SEARCH_QUERY_10K)
      void grid.filteredItems.value
    })
  })

  // ===========================================================================
  // SORT PIPELINE - Sort stage via inherited createDataTable pipeline
  // Fresh fixture per iteration (required - toggle() mutates sort state)
  // Comparable: createDataTable sort pipeline
  // ===========================================================================
  describe('sort pipeline', () => {
    bench('Sort by string column ascending (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.sort.toggle('name')
      void grid.sortedItems.value
    })

    bench('Sort by string column ascending (10,000 items)', () => {
      const grid = createGrid({ items: ROWS_10K })
      grid.sort.toggle('name')
      void grid.sortedItems.value
    })

    bench('Sort by custom comparator (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.sort.toggle('salary')
      void grid.sortedItems.value
    })

    bench('Sort by custom comparator (10,000 items)', () => {
      const grid = createGrid({ items: ROWS_10K })
      grid.sort.toggle('salary')
      void grid.sortedItems.value
    })
  })

  // ===========================================================================
  // COLUMN LAYOUT - Pin, resize, reorder, distribute, reset
  // Fresh fixture per iteration (required - mutations modify layout state)
  // Grid-specific: no createDataTable equivalent
  // ===========================================================================
  describe('column layout', () => {
    bench('Pin column (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.layout.pin('name', 'left')
      void grid.layout.pinned.value
    })

    bench('Resize column (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.layout.resize('name', 5)
      void grid.layout.columns.value
    })

    bench('Resize column 10 times (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      for (let i = 0; i < 10; i++) {
        grid.layout.resize('name', 1)
      }
      void grid.layout.columns.value
    })

    bench('Reorder column (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.layout.reorder(0, 3)
      void grid.layout.columns.value
    })

    bench('Reset layout (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.layout.pin('name', 'left')
      grid.layout.resize('email', 5)
      grid.layout.reset()
      void grid.layout.columns.value
    })
  })

  // ===========================================================================
  // CELL EDITING - Edit, commit, cancel, validation
  // Fresh fixture per iteration (required - editing mutates active cell state)
  // Grid-specific: no createDataTable equivalent
  // ===========================================================================
  describe('cell editing', () => {
    bench('Edit cell (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, columns: COLUMNS_EDITABLE })
      grid.editing.edit(500, 'name')
    })

    bench('Edit then commit (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, columns: COLUMNS_EDITABLE })
      grid.editing.edit(500, 'name')
      grid.editing.commit('Updated Name')
    })

    bench('Edit then cancel (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, columns: COLUMNS_EDITABLE })
      grid.editing.edit(500, 'name')
      grid.editing.cancel()
    })

    bench('Edit with validation failure (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, columns: COLUMNS_EDITABLE })
      grid.editing.edit(500, 'email')
      grid.editing.commit('no-at-sign')
      void grid.editing.error.value
    })

    bench('Edit 10 cells sequentially (1,000 items)', () => {
      const grid = createGrid({
        items: ROWS_1K,
        columns: COLUMNS_EDITABLE,
        editing: { onEdit: () => {} },
      })
      for (let i = 0; i < 10; i++) {
        grid.editing.edit(i, 'name')
        grid.editing.commit(`Name ${i}`)
      }
    })
  })

  // ===========================================================================
  // ROW ORDERING - Move rows post-sort
  // Fresh fixture per iteration (required - move mutates order state)
  // Grid-specific: no createDataTable equivalent
  // ===========================================================================
  describe('row ordering', () => {
    bench('Move row (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.rows.move(0, 500)
    })

    bench('Move 10 rows (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      for (let i = 0; i < 10; i++) {
        grid.rows.move(i, i + 10)
      }
    })

    bench('Reset row order (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.rows.move(0, 500)
      grid.rows.reset()
    })
  })

  // ===========================================================================
  // ROW SPANNING - Computed span map from visible items
  // Fresh fixture per iteration
  // Grid-specific: no createDataTable equivalent
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
  // Fresh fixture per iteration (required - mutates search and sort state)
  // Comparable: createDataTable full pipeline
  // ===========================================================================
  describe('full pipeline', () => {
    bench('Search + sort + paginate (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
      grid.search('User 5')
      grid.sort.toggle('name')
      void grid.items.value
    })

    bench('Search + sort + paginate (10,000 items)', () => {
      const grid = createGrid({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })
      grid.search('User 5')
      grid.sort.toggle('name')
      void grid.items.value
    })

    bench('Search + sort + paginate + layout (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
      grid.search('User 5')
      grid.sort.toggle('name')
      grid.layout.pin('name', 'left')
      grid.layout.resize('email', 5)
      void grid.items.value
      void grid.layout.pinned.value
    })

    bench('Search + sort + paginate + layout (10,000 items)', () => {
      const grid = createGrid({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })
      grid.search('User 5')
      grid.sort.toggle('name')
      grid.layout.pin('name', 'left')
      grid.layout.resize('email', 5)
      void grid.items.value
      void grid.layout.pinned.value
    })
  })
})
