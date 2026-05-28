---
title: createDataGrid - Composable Data Grid for Vue 3
meta:
- name: description
  content: Full-featured data grid composable with column layout, cell editing, row ordering, and row spanning. Extends createDataTable with grid-specific features.
- name: keywords
  content: createDataGrid, data grid, column pinning, cell editing, row spanning, row ordering, resizing, composable, Vue 3
features:
  category: Composable
  label: 'E: createDataGrid'
  github: /composables/createDataGrid/
  level: 3
related:
  - /composables/data/create-data-table
  - /composables/data/create-filter
  - /composables/data/create-pagination
  - /composables/data/create-virtual
---

# createDataGrid

A headless data grid with column layout, cell editing, row ordering, and row spanning.

<DocsPageFeatures :frontmatter />

## Usage

Pass `columns` with `size` percentages to construct a grid, then register rows to get column layout, search, sort, and pagination.

```ts collapse
import { createDataGrid } from '@vuetify/v0'

const grid = createDataGrid({
  columns: [
    { id: 'name', title: 'Project', sortable: true, filterable: true, size: 22 },
    { id: 'status', title: 'Status', sortable: true, size: 12 },
    { id: 'assignee', title: 'Assignee', sortable: true, size: 16 },
    { id: 'progress', title: 'Progress', sortable: true, size: 14 },
    { id: 'budget', title: 'Budget', sortable: true, size: 10 },
  ],
})

// Register rows through the inherited registry surface
grid.onboard(projects.map(value => ({ id: value.id, value })))

// Inherited from createDataTable
grid.search('alice')
grid.sort.toggle('name')
grid.pagination.next()

// Grid-specific: column layout
grid.layout.columns.value    // ResolvedColumn[] with size, offset, pinned
grid.layout.pin('name', 'left')
grid.layout.resize('name', 5) // grow by 5%, neighbor shrinks
grid.layout.reorder(0, 2)     // move column 0 to position 2
grid.layout.reset()            // restore initial layout
```

## Architecture

`createDataGrid` is a composition of [createDataTable](/composables/data/create-data-table) plus four grid-specific modules. The table owns the data pipeline (filter, sort, paginate); the grid layers column layout, cell editing, row ordering, and row spanning on top. Row ordering is a [createSortable](/composables/data/create-sortable) instance synced to the table's row registry via `register` / `unregister` events, then applied to `sortedItems` before pagination slicing.

```mermaid "createDataGrid Architecture"
flowchart TD
  createDataGrid:::primary --> table["createDataTable (pipeline)"]
  createDataGrid --> layout["layout (table.columns + createGroup)"]
  createDataGrid --> editing["editing (createCellEditing)"]
  createDataGrid --> ordering["rows (createSortable)"]
  createDataGrid --> spanning["spans (createRowSpanning)"]
  table --> adapter["DataTableAdapter (Client / Server / Virtual)"]
  ordering -. "id sequence" .-> createDataGrid
  layout --> pin["pin / resize / reorder"]
  editing --> edit["edit / commit / cancel + validate"]
  spanning --> span["computed span map (hidden cell tracking)"]
```

| Module | Built on | Purpose |
| - | - | - |
| `table` (spread) | `createDataTable` | Search, sort, filter, paginate, total — all v-modeled through |
| `layout` | `table.columns` + `createGroup` | Reads column order from the table's columns registry; layers tri-region pinning, percentage sizing, and delta-based resize on top |
| `editing` | internal factory | Click-to-edit lifecycle, per-column validation, dirty tracking |
| `rows` | `createSortable` | Post-sort row reordering, applied to `sortedItems` before pagination slicing |
| `spans` | computed map | Row span resolution and hidden-cell tracking |

## Reactivity

| Property | Reactive | Notes |
| - | :-: | - |
| `items` | <AppSuccessIcon /> | Final visible items (paginated) |
| `allItems` | <AppSuccessIcon /> | Raw unprocessed items (projected from registered tickets) |
| `filteredItems` | <AppSuccessIcon /> | Items after filtering |
| `sortedItems` | <AppSuccessIcon /> | Items after filter + sort + order |
| `layout.columns` | <AppSuccessIcon /> | Resolved columns with size/offset |
| `layout.pinned` | <AppSuccessIcon /> | Pin region breakdown |
| `editing.active` | <AppSuccessIcon /> | Currently edited cell |
| `editing.error` | <AppSuccessIcon /> | Validation error string |
| `editing.dirty` | <AppSuccessIcon /> | Uncommitted edits map |
| `rows.order` | <AppSuccessIcon /> | Current row ordering |
| `spans` | <AppSuccessIcon /> | Row span map |
| `headers` | <AppSuccessIcon /> | 2D header grid |
| `sort.columns` | <AppSuccessIcon /> | Current sort entries |
| `pagination.page` | <AppSuccessIcon /> | Current page |
| `total` | <AppSuccessIcon /> | Total row count |

## Adapters

The grid uses the standard data table adapters — row ordering is layered above the pipeline, not inside it, so any [DataTableAdapter](/composables/data/create-data-table#adapters) works without modification.

| Adapter | Pipeline | Use Case |
| - | - | - |
| `ClientDataTableAdapter` (default) | filter → sort → paginate | All processing client-side |
| [ServerGridAdapter](#servergridadapter) | pass-through | API-driven. Server handles everything |
| `VirtualDataTableAdapter` | filter → sort → (no paginate) | Large lists with createVirtual |

```mermaid
graph LR
  A[Raw Items] --> B[Filter] --> C[Sort] --> D[Row Order] --> E[Paginate] --> F[Visible Items]
```

```ts
import { createDataGrid } from '@vuetify/v0'

const grid = createDataGrid({
  columns,
  // ClientDataTableAdapter is the default — not required
})

grid.onboard(employees.map(value => ({ id: value.id, value })))

// Row ordering — id-based
grid.rows.move(employees[0].id, 3)  // move that row to position 3
grid.rows.reset()                    // clear custom ordering
```

### ServerGridAdapter

Pass-through adapter for API-driven grids. Re-exports the data table's `ServerDataTableAdapter`.

```ts
import { createDataGrid, ServerGridAdapter } from '@vuetify/v0'

const grid = createDataGrid({
  columns,
  adapter: new ServerGridAdapter({ total: totalCount, loading: isLoading }),
})

// Push server-returned rows into the grid as they arrive
grid.onboard(serverItems.map(value => ({ id: value.id, value })))
```

### Virtual scrolling

For large datasets, use the standard `VirtualDataTableAdapter`. Row ordering still applies; pagination slicing is skipped.

```ts
import { createDataGrid, VirtualDataTableAdapter } from '@vuetify/v0'

const grid = createDataGrid({
  columns,
  adapter: new VirtualDataTableAdapter(),
})

grid.onboard(largeDataset.map(value => ({ id: value.id, value })))
```

## Examples

::: example
/composables/create-data-grid/pinned/PinnedGrid.vue
/composables/create-data-grid/pinned/columns.ts
/composables/create-data-grid/pinned/data.ts

### Column Pinning & Resizing

A financial data grid with 10 columns that requires horizontal scrolling. Ticker is pinned left, sector pinned right — the center columns scroll independently with drag-to-resize handles.

**File breakdown:**

| File | Role |
|------|------|
| `PinnedGrid.vue` | Financial spreadsheet with sticky pinned columns, resize handles, and formatted numbers |
| `columns.ts` | 10 columns with ticker pinned left, sector pinned right |
| `data.ts` | 12 stocks across Tech, Healthcare, Finance, Energy, and Consumer sectors |

**Key patterns:**

- `layout.pinned` splits columns into `left`, `scrollable`, and `right` regions with independent offsets
- `layout.resize(id, delta)` adjusts a column and its neighbor to maintain total width
- `layout.pin(id, position)` moves columns between regions dynamically
- `layout.reset()` restores initial sizes, order, and pins

:::

::: example
/composables/create-data-grid/editing/EditableGrid.vue
/composables/create-data-grid/editing/columns.ts
/composables/create-data-grid/editing/data.ts

### Cell Editing

An inventory management grid where editing is the primary workflow. Product name, price, and quantity are editable — invalid values show inline errors and block commit.

**File breakdown:**

| File | Role |
|------|------|
| `EditableGrid.vue` | Click-to-edit cells with focus ring, Enter/Escape keyboard handling, and edit history log |
| `columns.ts` | Columns with `editable: true` and `validate` functions for name, price, and quantity |
| `data.ts` | 8 products across electronics, accessories, and peripherals |

**Key patterns:**

- `editing.edit(row, column)` activates a cell for editing
- `editing.commit(value)` validates first — only `true` from the validator allows the edit through
- `editing.error` persists until the value passes validation or the user cancels
- `onEdit` callback receives the full item for context-aware updates

:::

::: example
/composables/create-data-grid/spanning/SpanningGrid.vue
/composables/create-data-grid/spanning/columns.ts
/composables/create-data-grid/spanning/data.ts

### Row Spanning

A team schedule grid where department cells span all members in that department. Day columns show availability status with color-coded indicators.

**File breakdown:**

| File | Role |
|------|------|
| `SpanningGrid.vue` | Schedule grid with department spanning and color-coded day cells |
| `columns.ts` | Department, member, and Mon–Fri day columns |
| `data.ts` | 10 team members across 3 departments with weekly availability |

**Key patterns:**

- `rowSpanning(item, column)` returns the number of rows a cell should span
- `spans.value` provides a Map of `rowID → column → { rowSpan, hidden }`
- Cells with `hidden: true` are skipped in rendering — the cell above covers them
- Spans are clamped to remaining visible rows and never cross page boundaries

:::

## Recipes

### Column Layout

Columns are sized as percentages (0–100) and can be pinned, resized, and reordered.

```ts
const grid = createDataGrid({
  columns: [
    { id: 'name', size: 30, pinned: 'left', minSize: 15, maxSize: 50 },
    { id: 'email', size: 40 },
    { id: 'status', size: 30, pinned: 'right' },
  ],
})

grid.onboard(rows.map(value => ({ id: value.id, value })))

// Pin regions
grid.layout.pinned.value      // { left: [...], scrollable: [...], right: [...] }

// Resize — delta-based, neighbor absorbs inverse
grid.layout.resize('name', 5)  // name grows 5%, email shrinks 5%

// Reorder by display index
grid.layout.reorder(0, 2)

// Replace all sizes at once
grid.layout.distribute([40, 35, 25])

// Restore initial state
grid.layout.reset()
```

### Cell Editing

Click-to-edit with validation. Does not mutate source data — commit fires a callback.

```ts
const grid = createDataGrid({
  columns: [
    {
      id: 'email',
      editable: true,
      validate: (value, item) => {
        if (typeof value !== 'string' || !value.includes('@')) return 'Invalid email'
        return true
      },
    },
  ],
  editing: {
    onEdit: (row, column, value, item) => {
      console.log(`Updated ${column} on row ${row} to ${value}`)
    },
  },
})

grid.onboard(rows.map(value => ({ id: value.id, value })))

grid.editing.edit(1, 'email')     // Activate cell
grid.editing.commit('new@email')  // Validate and save
grid.editing.cancel()             // Discard
grid.editing.active.value         // { row: 1, column: 'email' } | null
grid.editing.error.value          // 'Invalid email' | null
grid.editing.dirty.value          // Map of uncommitted edits
```

### Row Ordering

Post-sort row ordering for drag-and-drop reordering. Backed by [createSortable](/composables/data/create-sortable), keyed by row id — index-based addressing was dropped because it drifts under reactive churn.

```ts
const grid = createDataGrid({ columns })

grid.onboard(rows.map(value => ({ id: value.id, value })))

grid.rows.move(rowId, 3)       // Move the row with this id to position 3
grid.rows.order.value          // Current id sequence
grid.rows.reset()              // Clear custom ordering

// Ordering resets on sort change by default
// Set preserveRowOrder: true to keep ordering across sorts
```

### Row Spanning

Merge cells vertically using a spanning function.

```ts
const grid = createDataGrid({
  columns,
  rowSpanning: (item, column) => {
    if (column === 'department') return 3  // span 3 rows
    return 1
  },
})

grid.onboard(rows.map(value => ({ id: value.id, value })))

// Span map: item ID → column id → { rowSpan, hidden }
grid.spans.value.get(1)?.get('department')
// { rowSpan: 3, hidden: false }  — render with rowspan="3"

grid.spans.value.get(2)?.get('department')
// { rowSpan: 1, hidden: true }   — skip rendering (covered by row above)
```

### Nested Columns

Column definitions support nesting for grouped headers. Layout and data pipeline use leaf columns only.

```ts
const grid = createDataGrid({
  columns: [
    { id: 'name', title: 'Name', size: 30 },
    {
      id: 'contact',
      title: 'Contact',
      children: [
        { id: 'email', title: 'Email', size: 40 },
        { id: 'phone', title: 'Phone', size: 30 },
      ],
    },
  ],
})

grid.onboard(rows.map(value => ({ id: value.id, value })))

// headers: 2D array with colspan/rowspan for <thead> rendering
grid.headers.value
// [[{ id: 'name', rowspan: 2 }, { id: 'contact', colspan: 2 }],
//  [{ id: 'email' }, { id: 'phone' }]]
```

<DocsApi />
