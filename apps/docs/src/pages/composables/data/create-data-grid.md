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

Construct a grid, onboard columns through `grid.columns` with `size` percentages, then register rows to get column layout, search, sort, and pagination. Columns are onboarded — not passed as a factory option — so the surface matches [createDataTable](/composables/data/create-data-table) and columns can be added or removed at any time.

```ts collapse
import { createDataGrid } from '@vuetify/v0'

const grid = createDataGrid()

// Onboard columns through the inherited column registry
grid.columns.onboard([
  { id: 'name', title: 'Project', sortable: true, filterable: true, size: 22 },
  { id: 'status', title: 'Status', sortable: true, size: 12 },
  { id: 'assignee', title: 'Assignee', sortable: true, size: 16 },
  { id: 'progress', title: 'Progress', sortable: true, size: 14 },
  { id: 'budget', title: 'Budget', sortable: true, size: 10 },
])

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
grid.layout.hide('budget')    // exclude from the render set
grid.layout.reset()            // restore initial layout
```

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

const grid = createDataGrid()
// ClientDataTableAdapter is the default — no adapter option required

grid.columns.onboard(columns)
grid.onboard(employees.map(value => ({ id: value.id, value })))

// Row ordering — id-based
grid.rows.move(employees[0].id, 3)  // move that row to position 3
grid.rows.reset()                    // clear custom ordering
```

### ServerGridAdapter

Pass-through adapter for API-driven grids — the server owns sort, filter, and pagination. Re-exports the data table's `ServerDataTableAdapter`.

Onboard only the rows the server returns for the current page, and set `total` to the full server-side count. The grid renders that page on every page — onboard page 2's rows, advance `pagination.page`, and the grid surfaces them. Because the page window can sit past the locally-held rows, the grid orders the onboarded page in place rather than re-slicing it into emptiness.

```ts
import { createDataGrid, ServerGridAdapter } from '@vuetify/v0'

const grid = createDataGrid({
  adapter: new ServerGridAdapter({ total: totalCount, loading: isLoading }),
})

grid.columns.onboard(columns)

// On every page change, clear and onboard the rows the server returned for
// that page; keep `total` at the full server count. `grid.clear()` wipes
// the row registry — onboarded columns are untouched.
grid.clear()
grid.onboard(rows.map(value => ({ id: value.id, value })))
```

### Virtual scrolling

For large datasets, use the standard `VirtualDataTableAdapter`. Row ordering still applies; pagination slicing is skipped.

```ts
import { createDataGrid, VirtualDataTableAdapter } from '@vuetify/v0'

const grid = createDataGrid({
  adapter: new VirtualDataTableAdapter(),
})

grid.columns.onboard(columns)
grid.onboard(largeDataset.map(value => ({ id: value.id, value })))
```

## Architecture

`createDataGrid` composes [createDataTable](/composables/data/create-data-table) — which owns the data pipeline (filter, sort, paginate) — with four grid modules: column layout, cell editing, row ordering ([createSortable](/composables/data/create-sortable)), and row spanning. Columns and rows are both onboarded through registries (`grid.columns.onboard(...)`, `grid.onboard(...)`) rather than passed as options, the same shape as createDataTable. Per-column config (`size`, `pinned`, `editable`, `validate`, `span`) rides on each column ticket, so layout, editing, and spanning read it straight off `grid.columns` and pick up columns onboarded at any time.

```mermaid "createDataGrid Architecture"
flowchart TD
  createDataGrid:::primary --> table["createDataTable (pipeline)"]
  createDataGrid --> layout["layout (grid.columns + createGroup)"]
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
| `layout` | `grid.columns` + `createGroup` | Reads column order and config from the column registry; layers tri-region pinning, percentage sizing, delta-based resize, and visibility (`show` / `hide` / `toggle` / `all`) on top |
| `editing` | internal factory | Click-to-edit lifecycle, per-column validation, dirty tracking |
| `rows` | `createSortable` | Post-sort row reordering, layered in the grid's `items` projection over the sorted rows before pagination — not inside the adapter |
| `spans` | computed map | Row span resolution and hidden-cell tracking |

## Reactivity

| Property | Reactive | Notes |
| - | :-: | - |
| `items` | <AppSuccessIcon /> | Final visible items (filter + sort + row order + paginate) |
| `allItems` | <AppSuccessIcon /> | Raw unprocessed items (projected from registered tickets) |
| `filteredItems` | <AppSuccessIcon /> | Items after filtering |
| `sortedItems` | <AppSuccessIcon /> | Items after filter + sort |
| `layout.columns` | <AppSuccessIcon /> | Resolved columns with size/offset (render set — visible only) |
| `layout.all` | <AppSuccessIcon /> | Every column incl. hidden, each with a `visible` flag |
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

## Examples

::: gn-example
/composables/create-data-grid/pinned/data.ts
/composables/create-data-grid/pinned/columns.ts
/composables/create-data-grid/pinned/usePinnedGrid.ts
/composables/create-data-grid/pinned/PinnedToolbar.vue
/composables/create-data-grid/pinned/PinnedFooter.vue
/composables/create-data-grid/pinned/PinnedGrid.vue

### Column Pinning & Resizing

A financial data grid with 10 columns that requires horizontal scrolling. Ticker is pinned left, sector pinned right — the center columns scroll independently with drag-to-resize handles.

`layout.pinned` splits columns into `left`, `scrollable`, and `right` regions with independent sticky offsets so each region scrolls correctly without overlapping. `layout.resize(id, delta)` adjusts a column and its neighbor inversely to maintain the 100% total width. `layout.pin(id, position)` moves a column between regions at runtime — the ticker-filter toolbar button demonstrates this. `layout.reset()` restores the initial sizes, order, and pins declared in `columns.ts`.

| File | Role |
|------|------|
| `data.ts` | 12 stocks across Tech, Healthcare, Finance, Energy, and Consumer sectors |
| `columns.ts` | 10 columns with ticker pinned left, sector pinned right |
| `usePinnedGrid.ts` | Layout logic — pin/unpin, drag-resize, pixel sticky offsets, and the up/down/volume stats |
| `PinnedToolbar.vue` | Market-overview header with the ticker filter and reset |
| `PinnedFooter.vue` | Row count plus the left / scrollable / right pin-region summary |
| `PinnedGrid.vue` | The spreadsheet table — sticky pinned columns, resize handles, formatted numbers |

:::

::: gn-example
/composables/create-data-grid/editing/data.ts
/composables/create-data-grid/editing/columns.ts
/composables/create-data-grid/editing/useEditableGrid.ts
/composables/create-data-grid/editing/EditToolbar.vue
/composables/create-data-grid/editing/EditHistory.vue
/composables/create-data-grid/editing/EditableGrid.vue

### Cell Editing

An inventory management grid where editing is the primary workflow. Product name, price, and quantity are editable; invalid values show inline errors and block commit. Every committed edit pushes a `{ from, to }` entry onto a [createTimeline](/composables/registration/create-timeline), which powers the Undo / Redo buttons and the history log.

`editing.edit(row, column)` activates a cell — the active cell is highlighted so the edit target is unmistakable. `editing.commit(value)` runs the column's `validate` function first; the commit only lands when the validator returns `true`, and `editing.error` holds the rejection string until the value passes or the user cancels. The `onEdit` callback fires after each successful commit and is where `useEditableGrid.ts` pushes `{ row, column, from, to }` to a `createTimeline({ size: 50 })` for history. `timeline.undo()` and `timeline.redo()` walk the bounded stack; the handler applies the recovered `from` (undo) or `to` (redo) back to the row via `grid.upsert`.

| File | Role |
|------|------|
| `data.ts` | 8 products across electronics, accessories, and peripherals |
| `columns.ts` | All columns `editable` + `sortable`, with `validate` functions |
| `useEditableGrid.ts` | Editing state — grid + createTimeline, edit / commit / cancel and undo / redo handlers |
| `EditToolbar.vue` | Inventory stats, edited-count chip, and Undo / Redo / Clear controls |
| `EditHistory.vue` | The timeline-backed edit history log |
| `EditableGrid.vue` | The editable table — click-to-edit cells with Enter / Escape / Ctrl+Z keyboard handling |

:::

::: gn-example
/composables/create-data-grid/spanning/data.ts
/composables/create-data-grid/spanning/columns.ts
/composables/create-data-grid/spanning/useSpanningGrid.ts
/composables/create-data-grid/spanning/SpanningGrid.vue

### Row Spanning

A portfolio holdings grid with two levels of row spanning — `account` spans every holding under an account, and `assetClass` spans every holding within an account-and-class pair. Spanned cells double as aggregation rows by showing the account or asset-class subtotal alongside the label.

One `rowSpanning(item, column)` callback in `useSpanningGrid.ts` resolves both span levels by checking whether the next consecutive row shares the same `account` (and, for `assetClass`, the same account-and-class pair). The resulting span map is consumed in the template via `spans.value.get(rowId)?.get(columnId)`, which returns `{ rowSpan, hidden }`. The template skips `<td>` entirely when `hidden` is true — the spanning cell above covers it — and sets `:rowspan="rowSpan"` otherwise. Spans are clamped to remaining visible rows and never cross page boundaries.

| File | Role |
|------|------|
| `data.ts` | 11 holdings across 3 accounts (Wealth, Retirement, Trust) and 4 asset classes (Equities, Bonds, Real Estate, Cash) |
| `columns.ts` | 6 columns: account, asset class, ticker, holding, value, change (pinned right) |
| `useSpanningGrid.ts` | Spanning logic — the `rowSpanning` callback and account / asset-class aggregation helpers |
| `SpanningGrid.vue` | The table — multi-level row spans, subtotals in spanned cells, the pinned Today column |

:::

## Recipes

### Column Layout

Columns are onboarded through `grid.columns`, sized as percentages (0–100), and can be pinned, resized, reordered, and hidden.

```ts collapse
const grid = createDataGrid()

grid.columns.onboard([
  { id: 'name', size: 30, pinned: 'left', minSize: 15, maxSize: 50 },
  { id: 'email', size: 40 },
  { id: 'status', size: 30, pinned: 'right' },
])

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

### Column Visibility

Hide and show columns without redistributing the remaining widths — headless, so the consumer rebalances via `distribute()` or CSS. `all` surfaces every column (including hidden ones) each carrying a `visible` flag, which is exactly the shape a column chooser needs.

```ts collapse
const grid = createDataGrid()

grid.columns.onboard(columns)
grid.onboard(rows.map(value => ({ id: value.id, value })))

grid.layout.hide('email')          // exclude from the render set
grid.layout.show('email')          // restore it
grid.layout.toggle('email') // flip current visibility

grid.layout.columns.value     // render set — visible columns only
grid.layout.all.value  // every column, each with a `visible` flag
```

### Cell Editing

Click-to-edit with validation. Does not mutate source data — commit fires a callback.

```ts collapse
const grid = createDataGrid({
  editing: {
    onEdit: (row, column, value, item) => {
      console.log(`Updated ${column} on row ${row} to ${value}`)
    },
  },
})

grid.columns.register({
  id: 'email',
  editable: true,
  validate: (value, item) => {
    if (typeof value !== 'string' || !value.includes('@')) return 'Invalid email'
    return true
  },
})

grid.onboard(rows.map(value => ({ id: value.id, value })))

grid.editing.edit(1, 'email')     // Activate cell
grid.editing.commit('new@email')  // Validate and save
grid.editing.cancel()             // Discard
grid.editing.active.value         // { row: 1, column: 'email' } | null
grid.editing.error.value          // 'Invalid email' | null
grid.editing.dirty                // Map of uncommitted edits (ShallowReactive, no .value)
```

### Row Ordering

Post-sort row ordering for drag-and-drop reordering. Backed by [createSortable](/composables/data/create-sortable), keyed by row id — index-based addressing was dropped because it drifts under reactive churn.

```ts collapse
const grid = createDataGrid()

grid.columns.onboard(columns)
grid.onboard(rows.map(value => ({ id: value.id, value })))

grid.rows.move(rowId, 3)       // Move the row with this id to position 3
grid.rows.order.value          // Current id sequence
grid.rows.reset()              // Clear custom ordering

// Ordering resets on sort change by default
// Set preserveRowOrder: true to keep ordering across sorts
```

### Row Spanning

Merge cells vertically using a spanning function.

```ts collapse
const grid = createDataGrid({
  rowSpanning: (item, column) => {
    if (column === 'department') return 3  // span 3 rows
    return 1
  },
})

grid.columns.onboard(columns)
grid.onboard(rows.map(value => ({ id: value.id, value })))

// Span map: item ID → column id → { rowSpan, hidden }
grid.spans.value.get(1)?.get('department')
// { rowSpan: 3, hidden: false }  — render with rowspan="3"

grid.spans.value.get(2)?.get('department')
// { rowSpan: 1, hidden: true }   — skip rendering (covered by row above)
```

### Nested Columns

Column definitions support nesting for grouped headers. Layout and data pipeline use leaf columns only.

```ts collapse
const grid = createDataGrid()

grid.columns.onboard([
  { id: 'name', title: 'Name', size: 30 },
  {
    id: 'contact',
    title: 'Contact',
    children: [
      { id: 'email', title: 'Email', size: 40 },
      { id: 'phone', title: 'Phone', size: 30 },
    ],
  },
])

grid.onboard(rows.map(value => ({ id: value.id, value })))

// headers: 2D array with colspan/rowspan for <thead> rendering
grid.headers.value
// [[{ id: 'name', rowspan: 2 }, { id: 'contact', colspan: 2 }],
//  [{ id: 'email' }, { id: 'phone' }]]
```

## FAQ

::: faq

??? When should I use createDataGrid vs createDataTable?

createDataGrid composes [createDataTable](/composables/data/create-data-table) and layers on column `layout` (pin, resize, reorder, hide), cell `editing`, row `ordering`, and row `spanning`. Use the table when you only need the data pipeline; reach for the grid when you need spreadsheet-style column manipulation or editable cells.

??? Why does my manual row order reset when I sort a column?

Row ordering resets on sort change by default. Pass `preserveRowOrder: true` to keep the custom `rows.order` across sort changes.

??? How do I resize one column without breaking the layout?

Call `grid.layout.resize(id, delta)` — it grows that column by a percentage and shrinks its neighbor inversely so the columns always total 100%. `grid.layout.reset()` restores the initial sizes, order, and pins.

:::

<DocsApi />
