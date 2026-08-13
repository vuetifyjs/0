---
title: DataGrid - Headless Data Grid with Editing and Row Ordering
meta:
- name: description
  content: Headless data grid component with column layout, cell editing, row ordering, and row spanning. Built on createDataGrid for Vue 3.
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
---

# DataGrid

Headless data grid compound with column layout, cell editing, row ordering, and row spanning. Built on createDataGrid.

<DocsPageFeatures :frontmatter />

## Usage

DataGrid provides a structural shell over the `createDataGrid` composable. It exposes layout, cell editing, row ordering, and row spanning capabilities on top of the inherited DataTable pipeline.

::: gn-example
/components/data-grid/basic
:::

## Resizable Columns

Add `DataGrid.ResizeHandle` between header columns to enable column resizing. The handle uses the same pointer drag interaction as `Splitter.Handle` and maps resize deltas to the grid's layout.

::: gn-example
/components/data-grid/resizable
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { DataGrid } from '@vuetify/v0'
</script>

<template>
  <DataGrid.Root v-slot="{ context }">
    <DataGrid.Table>
      <DataGrid.Header>
        <DataGrid.Row>
          <DataGrid.Column column="name">Name</DataGrid.Column>
          <DataGrid.ResizeHandle column="name" />
          <DataGrid.Column column="email">Email</DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body>
        <DataGrid.Row v-for="item in context.items.value" :key="item.id" :id="item.id">
          <DataGrid.Cell column="name">{{ item.name }}</DataGrid.Cell>
          <DataGrid.Cell column="email">{{ item.email }}</DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
```

## Architecture

DataGrid extends DataTable with four additional capabilities:

- **Layout** — Column pinning, sizing, resizing, and reordering via `context.layout`
- **Rows** — Manual row ordering via `context.rows.move()` and `context.rows.reset()`
- **Editing** — Cell editing state via `context.editing`
- **Spans** — Row spanning via `context.spans`

### Resize Handle

`DataGrid.ResizeHandle` composes the same drag interaction as `Splitter.Handle`:

- Pointer drag translates to `context.layout.resize(column, delta)`
- Keyboard support: Arrow keys (1% step), Page Up/Down (10% step), Home/End (min/max)
- Respects column `resizable`, `minSize`, and `maxSize` from the column registration
- WAI-ARIA `role="separator"` with `aria-valuenow/min/max` for screen readers

```mermaid "DataGrid Context"
flowchart TD
  subgraph Root["DataGrid.Root"]
    Context["createDataGrid()"]
  end

  subgraph Table["DataGrid.Table"]
    role["role=grid"]
  end

  subgraph Header["DataGrid.Header"]
    HeaderRole["role=rowgroup"]
  end

  subgraph Body["DataGrid.Body"]
    BodyRole["role=rowgroup"]
  end

  subgraph Row["DataGrid.Row"]
    RowRole["role=row"]
  end

  subgraph Column["DataGrid.Column"]
    ColRole["role=columnheader"]
  end

  subgraph ResizeHandle["DataGrid.ResizeHandle"]
    HandleRole["role=separator"]
  end

  subgraph Cell["DataGrid.Cell"]
    CellRole["role=gridcell"]
  end

  Root --> Table
  Table --> Header
  Table --> Body
  Header --> Row
  Body --> Row
  Row --> Column
  Row --> ResizeHandle
  Row --> Cell
```

## Accessibility

DataGrid implements the [WAI-ARIA Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/):

- `DataGrid.Table` renders with `role="grid"`
- `DataGrid.Header` and `DataGrid.Body` render with `role="rowgroup"`
- `DataGrid.Row` renders with `role="row"`
- `DataGrid.Column` renders with `role="columnheader"` and `aria-sort` for sorted columns
- `DataGrid.Cell` renders with `role="gridcell"` and appropriate `rowspan` for spanned cells
- `DataGrid.ResizeHandle` renders with `role="separator"` following the [Window Splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/):
  - `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for the current column size
  - `aria-orientation="vertical"` (separator is visually vertical, columns are horizontal)
  - Keyboard navigation: Arrow keys, Page Up/Down, Home/End

## FAQ

::: faq

??? When should I use DataGrid vs DataTable?

DataGrid adds column layout (pinning, sizing), cell editing, row ordering, and row spanning on top of DataTable. Use DataGrid when you need spreadsheet-like editing or row reordering; use DataTable for read-only tabular data.

??? How do I enable cell editing?

Pass an `editing` option to `DataGrid.Root` with an `onEdit` callback, then mark columns as `editable: true` when registering them with `context.columns.onboard()`.

??? How does row spanning work?

Pass a `rowSpanning` function to `DataGrid.Root` that returns the span count for each cell. Spanned cells are automatically hidden via `v-if` in `DataGrid.Cell`.

??? How do I pin columns?

Use `context.layout.pin(columnId, 'left' | 'right')` to pin columns, or set `pinned: 'left' | 'right'` when registering columns.

??? How do I enable column resizing?

Place `DataGrid.ResizeHandle` between `DataGrid.Column` elements in the header row. Register columns with `resizable: true` (the default). The handle calls `context.layout.resize(columnId, delta)` on drag, respecting `minSize` and `maxSize` constraints.

:::

<DocsApi />
