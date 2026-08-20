---
title: DataTable - Headless Table Component with Sorting and Pagination
meta:
- name: description
  content: Headless data table component built on createDataTable composable. Supports sorting, filtering, pagination, selection, and expansion for Vue 3.
- name: keywords
  content: data table, table, sorting, pagination, filtering, selection, Vue 3, headless
features:
  category: Component
  label: 'C: DataTable'
  github: /components/DataTable/
  renderless: false
  level: 2
related:
  - /composables/data/create-data-table
  - /components/semantic/pagination
---

# DataTable

Headless compound component for rendering tabular data with sorting, pagination, selection, and expansion support.

<DocsPageFeatures :frontmatter />

## Usage

The DataTable component provides a semantic table structure that wraps the `createDataTable` composable. It exposes all table state and controls through slot props for maximum flexibility.

::: gn-example
/components/data-table/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { DataTable } from '@vuetify/v0'
</script>

<template>
  <DataTable.Root>
    <DataTable.Table>
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.Column />
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body>
        <DataTable.Row>
          <DataTable.Cell />
        </DataTable.Row>

        <DataTable.Empty>
          <DataTable.Cell />
        </DataTable.Empty>
      </DataTable.Body>
    </DataTable.Table>
  </DataTable.Root>
</template>
```

## Architecture

The DataTable compound is a thin shell over the `createDataTable` composable. The Root creates and provides the context; child components consume it for rendering.

```mermaid "Component Flow"
flowchart TD
  subgraph Root["DataTable.Root"]
    Context["createDataTable()"]
    Provide["provideDataTableRoot()"]
  end

  subgraph Table["DataTable.Table"]
    TableEl["<table>"]
  end

  subgraph Header["DataTable.Header"]
    Headers["headers 2D grid"]
    Column["DataTable.Column"]
  end

  subgraph Body["DataTable.Body"]
    Items["paginated items"]
    Row["DataTable.Row"]
    Cell["DataTable.Cell"]
  end

  Root --> Table
  Table --> Header
  Table --> Body
  Header --> Row --> Column
  Body --> Row --> Cell
```

### Data Loading

Register columns and rows once via the `useDataTableRoot` composable in a child component:

```vue
<script setup lang="ts">
  import { defineComponent } from 'vue'
  import { DataTable, useDataTableRoot } from '@vuetify/v0'

  const columns = [
    { id: 'name', title: 'Name', sortable: true },
    { id: 'email', title: 'Email', filterable: true },
  ]
  const users = [/* your data */]

  // One-shot initialization component
  const DataTableInit = defineComponent({
    setup () {
      const context = useDataTableRoot('v0:data-table')
      context.columns.onboard(columns)
      context.onboard(users.map(u => ({ id: u.id, value: u })))
      return () => null
    },
  })
</script>

<template>
  <DataTable.Root>
    <DataTableInit />
    <!-- Table structure -->
  </DataTable.Root>
</template>
```

> [!TIP]
> For full control over the data pipeline without the component layer, use [createDataTable](/composables/data/create-data-table) directly.

## Recipes

### Sorting

`DataTable.Column` exposes sort state when given an `id`:

| Slot prop | Type | Description |
|-----------|------|-------------|
| `isSortable` | `boolean` | Whether the column is sortable |
| `sortDirection` | `'asc' \| 'desc' \| 'none'` | Current sort direction |
| `sortPriority` | `number` | Sort priority for multi-sort (-1 if not sorted) |
| `toggleSort` | `() => void` | Toggle sort on this column |

### Selection

`DataTable.Row` exposes selection state when given an `id`:

| Slot prop | Type | Description |
|-----------|------|-------------|
| `isSelected` | `boolean` | Whether the row is selected |
| `isSelectable` | `boolean` | Whether the row can be selected |
| `toggleSelection` | `() => void` | Toggle row selection |

### Expansion

`DataTable.Row` also exposes expansion state:

| Slot prop | Type | Description |
|-----------|------|-------------|
| `isExpanded` | `boolean` | Whether the row is expanded |
| `toggleExpansion` | `() => void` | Toggle row expansion |

## Accessibility

DataTable renders semantic table markup with ARIA attributes:

- `DataTable.Table` renders `<table role="table">` with `aria-rowcount`
- `DataTable.Column` renders `<th role="columnheader">` with `aria-sort` for sortable columns
- `DataTable.Row` renders `<tr role="row">` with `aria-selected` when selection is enabled
- `DataTable.Cell` renders `<td role="cell">`

Use `renderless` mode to customize the underlying elements while preserving the ARIA attributes via slot props:

```vue
<template>
  <DataTable.Column
    id="name"
    v-slot="{ attrs, toggleSort }"
    renderless
  >
    <th v-bind="attrs" @click="toggleSort">
      Name
    </th>
  </DataTable.Column>
</template>
```

## FAQ

::: faq

??? When should I use DataTable vs createDataTable?

Use DataTable when you want a semantic table structure with built-in ARIA. Use `createDataTable` directly when you need custom rendering (cards, virtual lists) or want full control over the DOM.

??? How do I enable multi-column sorting?

Pass `sort-multiple` to the Root:

```vue
<template>
  <DataTable.Root :sort-multiple="true" />
</template>
```

??? How do I handle server-side data?

Pass a `ServerDataTableAdapter` to the Root:

```vue
<template>
  <DataTable.Root :adapter="new ServerDataTableAdapter({ fetch: fetchData })" />
</template>
```

:::

<DocsApi />
