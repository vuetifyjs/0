---
title: DataGrid - Headless Data Grid with Editing and Row Ordering
meta:
- name: description
  content: Headless Vue 3 data grid with column layout, cell editing, row ordering, and spanning. Semantic table markup, sort, filter, pagination — not an APG Grid widget.
- name: keywords
  content: data grid, table, editing, sorting, filtering, pagination, row ordering, cell editing, Vue 3, headless
features:
  category: Component
  label: 'C: DataGrid'
  github: /components/DataGrid/
  renderless: false
  level: 2
related:
  - /composables/data/create-data-grid
  - /composables/data/create-data-table
  - /components/semantic/pagination
  - /components/semantic/splitter
---

# DataGrid

<DocsPageFeatures :frontmatter />

Headless compound for tabular data with column layout, cell editing, row ordering, and row spanning.

## Usage

`DataGrid.Root` creates the grid. `DataGrid.Column` and `DataGrid.Row` register when they mount and unregister when they unmount — same lifecycle as `Checkbox.Group`. A `resizable` header row composes [Splitter](/components/semantic/splitter) so `DataGrid.Handle` resizes columns. `v-for="user in rank(users)"`. Non-renderless Row `v-show`s off-page rows — don't add a consumer `v-show`. Renderless: `v-show="isVisible"` on your host. The client adapter defaults to **10 rows per page**. Compose [Pagination](/components/semantic/pagination) or pass `:pagination="{ itemsPerPage: n }"` on Root.

::: gn-example
/components/data-grid/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { DataGrid } from '@vuetify/v0'
</script>

<template>
  <DataGrid.Root>
    <DataGrid.Table>
      <DataGrid.Header>
        <DataGrid.Row>
          <DataGrid.Column>
            <DataGrid.Handle />
          </DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body>
        <DataGrid.Row>
          <DataGrid.Cell />
        </DataGrid.Row>

        <DataGrid.Empty>
          <DataGrid.Cell />
        </DataGrid.Empty>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
```

## Architecture

DataGrid extends DataTable with four additional capabilities:

- **Layout** — Column pinning, sizing, resizing, and reordering via `context.layout`
- **Rows** — Manual row ordering via `context.rows.move()` and `context.rows.reset()`. `rank` is on the Body slot, ranks by `orderedItems` so `move()` is visible; Row hides the page.
- **Editing** — Cell editing state via `context.editing`
- **Spans** — Row spanning via `context.spans`

### Layout API

The `context.layout` API provides column sizing primitives:

- `layout.resize(columnId, delta)` — Resize a column by a percentage delta (composable neighbor-delta API; Handle does not call this)
- `layout.distribute(sizes)` — Set visible-column sizes at once in Column DOM/registry order (what a resizable row's Splitter `@layout` calls). Not `layout.columns` pin order.
- `layout.columns` — Reactive array of column layout state including `size`, `minSize`, `maxSize`
- `layout.pin(columnId, 'left' | 'right' | false)` — Pin or unpin at runtime

```mermaid "DataGrid Context"
flowchart TD
  subgraph Root["DataGrid.Root"]
    Context["createDataGrid()"]
  end

  subgraph Table["DataGrid.Table"]
    role["role=table"]
  end

  subgraph Header["DataGrid.Header"]
    HeaderRole["role=rowgroup when as is not thead"]
  end

  subgraph Body["DataGrid.Body"]
    BodyRole["role=rowgroup when as is not tbody"]
  end

  subgraph Row["DataGrid.Row"]
    RowRole["role=row"]
  end

  subgraph Column["DataGrid.Column"]
    ColRole["role=columnheader"]
  end

  subgraph Cell["DataGrid.Cell"]
    CellRole["role=cell"]
  end

  Root --> Table
  Table --> Header
  Table --> Body
  Header --> Row
  Body --> Row
  Row --> Column
  Row --> Cell
```

## Examples

::: gn-example
/components/data-grid/useProjects.ts 1
/components/data-grid/ProjectGrid.vue 2
/components/data-grid/pinned-columns.vue 3

### Pinned columns

This is the compound surface [DataTable](/components/data/data-table) does not have: left/right pinned columns with sticky offsets from `layout.columns`. Name starts pinned left, status right. The table is wider than the card — scroll sideways and those two stay put. `L` / `R` / `·` on a header cycles `layout.pin(id, 'left' | 'right' | false)`. Body cells `v-for` the same display order so a newly pinned column actually moves, not just paints `position: sticky` in the middle of the row.

Sticky `left`/`right` must be pixels. Layout offsets are percentages of the table; a percentage inset resolves against the scrollport and pinned columns after the first drift. This grid is a fixed `1100px` wide so `offset% × 1100` is the inset — same math as the [createDataGrid pinned example](/composables/data/create-data-grid#examples), which measures live table width instead.

Reach for this when a wide grid has columns the user must not lose while scanning. Resize with Splitter is a different path (`as="div"`); pinning uses the native table and sticky cells. Related: `layout.pinned` for the left/scrollable/right regions, and [createDataGrid](/composables/data/create-data-grid) if you already own the table markup.

| File | Role |
|------|------|
| `useProjects.ts` | Composable — project seed and column defs (including initial pins) |
| `ProjectGrid.vue` | Reusable grid — sticky pins, pin cycle, horizontal scroll |
| `pinned-columns.vue` | Entry — wires the seed to the grid |
:::

## Accessibility

DataGrid ships structural table roles. It is not a WAI-ARIA Grid APG widget — there is no roving tabindex, `aria-activedescendant`, or keyboard cell navigation. Name it with `aria-label` or a `<caption>` — Root is a fragment and cannot be named.

- `DataGrid.Table` renders `<table role="table">`. `aria-rowcount` is set only when the current page is a subset of total (count includes header rows). `DataGrid.Row` sets `aria-rowindex` from its position in `orderedItems` unless `:index` is passed. Header rows auto-number from Header child order; `:index` overrides.
- `DataGrid.Header` and `DataGrid.Body` omit `role` on native `thead`/`tbody`; `as="div"` gets `role="rowgroup"`.
- `DataGrid.Row` renders with `role="row"` and `aria-selected` when `selectable` is set
- `DataGrid.Column` renders with `role="columnheader"`, `scope="col"`, and `aria-sort` on sortable columns
- `DataGrid.Cell` renders with `role="cell"` and `rowspan` (or `aria-rowspan` when `as` is not `td`) for spanned cells

Put a `Button.Root` inside sortable header cells — do not make the `<th>` itself the control:

```vue
<template>
  <DataGrid.Column
    id="name"
    v-slot="{ isSortable, toggle }"
  >
    <Button.Root v-if="isSortable" @click="toggle">
      Name
    </Button.Root>
    <span v-else>Name</span>
  </DataGrid.Column>
</template>
```

`DataGrid.Handle` (inside a `resizable` row) inherits Splitter's `role="separator"` semantics. Nest it inside `DataGrid.Column` so the separator is a descendant of `columnheader`, not a sibling under `role="row"` — a row may only own cell, columnheader, rowheader, or gridcell.

## FAQ

::: faq

??? When should I use DataGrid vs DataTable?

DataGrid adds column layout (pinning, sizing), cell editing, row ordering, and row spanning on top of DataTable. Use DataGrid when you need spreadsheet-like editing or row reordering; use DataTable for read-only tabular data.

??? How do I enable cell editing?

Call `editing.edit(rowId, columnId)`, then `commit(value)` or `cancel()`. `onEdit` is 4-arg `(row, column, value, item)` and runs after a successful commit. `DataGrid.Cell` is display-only — it exposes an `isEditing` flag, not an editor. `DataGrid.Row` must use the same `id` as the ticket. See the [composable editing example](/composables/data/create-data-grid#examples).

??? How do I use a server adapter?

Pass `new ServerGridAdapter({ total, loading?, error? })` — there is no `fetch`. Onboard the current page of rows; the server owns sort, filter, and pagination.

??? How do I pin columns?

Runtime pin is `layout.pin(columnId, 'left' | 'right')`. Unpin with `false`. `ticket.pinned` is a registration snapshot; slot `pinPosition` / `isPinned` read `layout.columns`.

??? How does row spanning work?

A per-column `span(item)` function on the column ticket wins over Root `rowSpanning`. Spanned cells are hidden via `v-if` in `DataGrid.Cell`.

??? How do I enable column resizing?

Set `resizable` on the header row and nest `DataGrid.Handle` inside each column except the last. Handle → Splitter `@layout` → `layout.distribute`. `layout.resize(id, delta)` is the composable neighbor-delta API, not what Handle calls. Splitter cannot live in a native table — use the full `as="div"` chain. See the usage example.

:::

<DocsApi />
