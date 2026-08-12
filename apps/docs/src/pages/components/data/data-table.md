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
  <DataTable.Root v-slot="{ context }">
    <DataTable.Table>
      <DataTable.Head v-slot="{ headers }">
        <DataTable.HeaderRow>
          <DataTable.HeaderCell column-id="name">Name</DataTable.HeaderCell>
          <DataTable.HeaderCell column-id="email">Email</DataTable.HeaderCell>
        </DataTable.HeaderRow>
      </DataTable.Head>

      <DataTable.Body v-slot="{ items }">
        <DataTable.Row v-for="item in items" :key="item.id" :row-id="item.id">
          <DataTable.Cell>{{ item.name }}</DataTable.Cell>
          <DataTable.Cell>{{ item.email }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty>
          <DataTable.Cell :colspan="2">No data available</DataTable.Cell>
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

  subgraph Head["DataTable.Head"]
    Headers["headers 2D grid"]
    HeaderRow["DataTable.HeaderRow"]
    HeaderCell["DataTable.HeaderCell"]
  end

  subgraph Body["DataTable.Body"]
    Items["paginated items"]
    Row["DataTable.Row"]
    Cell["DataTable.Cell"]
  end

  Root --> Table
  Table --> Head
  Table --> Body
  Head --> HeaderRow --> HeaderCell
  Body --> Row --> Cell
```

### Data Loading

Register columns and rows via the context exposed in the Root's slot:

```vue
<DataTable.Root v-slot="{ context }">
  <!-- Register columns once -->
  <div v-once>
    {{ void context.columns.onboard([
      { id: 'name', title: 'Name', sortable: true },
      { id: 'email', title: 'Email', filterable: true },
    ]) }}
    {{ void context.onboard(users.map(u => ({ id: u.id, value: u }))) }}
  </div>

  <!-- Table structure -->
</DataTable.Root>
```

> [!TIP]
> For full control over the data pipeline without the component layer, use [createDataTable](/composables/data/create-data-table) directly.

## Features

### Sorting

`DataTable.HeaderCell` exposes sort state when given a `column-id`:

| Slot prop | Type | Description |
|-----------|------|-------------|
| `isSortable` | `boolean` | Whether the column is sortable |
| `sortDirection` | `'asc' \| 'desc' \| 'none'` | Current sort direction |
| `sortPriority` | `number` | Sort priority for multi-sort (-1 if not sorted) |
| `toggleSort` | `() => void` | Toggle sort on this column |

### Selection

`DataTable.Row` exposes selection state when given a `row-id`:

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
- `DataTable.HeaderCell` renders `<th role="columnheader">` with `aria-sort` for sortable columns
- `DataTable.Row` renders `<tr role="row">` with `aria-selected` when selection is enabled
- `DataTable.Cell` renders `<td role="cell">`

Use `renderless` mode to customize the underlying elements while preserving the ARIA attributes via slot props:

```vue
<DataTable.HeaderCell
  column-id="name"
  v-slot="{ attrs, toggleSort }"
  renderless
>
  <th v-bind="attrs" @click="toggleSort">
    Name
  </th>
</DataTable.HeaderCell>
```

## FAQ

::: faq

??? When should I use DataTable vs createDataTable?

Use DataTable when you want a semantic table structure with built-in ARIA. Use `createDataTable` directly when you need custom rendering (cards, virtual lists) or want full control over the DOM.

??? How do I enable multi-column sorting?

Pass `sort-multiple` to the Root:

```vue
<DataTable.Root :sort-multiple="true">
```

??? How do I handle server-side data?

Pass a `ServerDataTableAdapter` to the Root:

```vue
<DataTable.Root :adapter="new ServerDataTableAdapter({ fetch: fetchData })">
```

:::

<DocsApi />
