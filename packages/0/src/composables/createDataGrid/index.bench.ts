/**
 * createDataGrid Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe - lookups, computed access)
 * - MUTATION operations create fresh fixtures per iteration
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, column layout, cell editing, row ordering,
 *   row spanning, full pipeline, adapter comparison
 */

import { bench, describe } from 'vitest'

// Types
import type { DataGridColumn, DataGridOptions } from './index'

import { createDataGrid, ClientGridAdapter, VirtualGridAdapter } from './index'

// =============================================================================
// FIXTURES
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

    bench('Create grid with row spanning (1,000 items)', () => {
      createGrid({
        items: ROWS_1K,
        rowSpanning: (_, column) => {
          if (column === 'department') return 2
          return 1
        },
      })
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
  // COLUMN LAYOUT - Pin, resize, reorder, distribute, reset
  // Fresh fixture per iteration (required - mutations modify layout state)
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

    bench('Distribute sizes (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.layout.distribute([30, 25, 15, 15, 15])
      void grid.layout.columns.value
    })

    bench('Pin + resize + reorder then read (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K })
      grid.layout.pin('name', 'left')
      grid.layout.resize('email', 5)
      grid.layout.reorder(2, 4)
      void grid.layout.pinned.value
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
  // Fresh fixture per iteration (required - spans depend on items which may change)
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

    bench('Compute spans (1,000 items, all columns)', () => {
      const grid = createGrid({
        items: ROWS_1K,
        rowSpanning: () => 2,
      })
      void grid.spans.value
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - Cached reads of grid-specific derived state
  // Shared fixture (safe - reading .value doesn't mutate state)
  // ===========================================================================
  describe('computed access', () => {
    const grid1k = createGrid({ items: ROWS_1K, columns: COLUMNS_PINNED })

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

    bench('Access items 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void grid1k.items.value
      }
    })
  })

  // ===========================================================================
  // FULL PIPELINE - End-to-end grid operations
  // Fresh fixture per iteration (required - mutates multiple state sources)
  // ===========================================================================
  describe('full pipeline', () => {
    bench('Search + sort + layout + read (1,000 items)', () => {
      const grid = createGrid({ items: ROWS_1K, pagination: { itemsPerPage: 25 } })
      grid.search('User 5')
      grid.sort.toggle('name')
      grid.layout.pin('name', 'left')
      grid.layout.resize('email', 5)
      void grid.items.value
      void grid.layout.pinned.value
    })

    bench('Search + sort + layout + read (10,000 items)', () => {
      const grid = createGrid({ items: ROWS_10K, pagination: { itemsPerPage: 25 } })
      grid.search('User 5')
      grid.sort.toggle('name')
      grid.layout.pin('name', 'left')
      grid.layout.resize('email', 5)
      void grid.items.value
      void grid.layout.pinned.value
    })
  })

  // ===========================================================================
  // ADAPTER COMPARISON - ClientGridAdapter vs VirtualGridAdapter
  // Fresh fixture per iteration (required - sort/search mutations)
  // ===========================================================================
  describe('adapter comparison', () => {
    bench('ClientGridAdapter: sort + paginate (10,000 items)', () => {
      const ordering = { value: [] as number[] }
      const grid = createGrid({
        items: ROWS_10K,
        adapter: new ClientGridAdapter<BenchmarkRow>(ordering as any, 'id'),
        pagination: { itemsPerPage: 25 },
      })
      grid.sort.toggle('name')
      void grid.items.value
    })

    bench('VirtualGridAdapter: sort, no pagination (10,000 items)', () => {
      const ordering = { value: [] as number[] }
      const grid = createGrid({
        items: ROWS_10K,
        adapter: new VirtualGridAdapter<BenchmarkRow>(ordering as any, 'id'),
      })
      grid.sort.toggle('name')
      void grid.items.value
    })
  })
})
