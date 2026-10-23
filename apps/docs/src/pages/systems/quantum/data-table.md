---
title: QuDataTable - Quantum Data Table for Vue
meta:
- name: description
  content: The Material Design 1 data table as a table card, with a title header, sortable columns, selectable rows, a contextual header, inline editing and a pagination footer. Built on Vuetify0's DataTable.
- name: keywords
  content: quantum data table, material design 1 data table, vue data table, sortable table, selectable rows, table pagination, vuetify0 data table, paper quantum
features:
  category: Component
  label: 'C: QuDataTable'
  level: 2
  renderless: false
  group: content
  order: 2
related:
  - /systems/quantum
  - /systems/quantum/card
  - /systems/quantum/button
  - /components/data/data-table
---

# QuDataTable

<DocsPageFeatures :frontmatter />

The Material Design 1 data table: raw data on a card, with a title header, sortable columns, selectable rows, inline editing and a pagination footer.

> [!NOTE]
> Reference: [Data tables, Material Design 1 guidelines](http://web.archive.org/web/20181225002253/https://material.io/archive/guidelines/components/data-tables.html), the archived page Quantum is pinned to. Metrics, colour, sorting, selection and editing. This page is the Vue.

## Usage

`QuDataTable` is a compound. The root is the table card and owns the data pipeline; the parts lay out its regions. Rows register themselves: iterate `rank(rows)` from the `Body` slot so the sorted and paged order drives the `v-for`.

::: ds-example
/systems/quantum/data-table/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuDataTable } from '@paper/quantum'
</script>

<template>
  <QuDataTable>
    <QuDataTable.Header />

    <QuDataTable.Contextual />

    <QuDataTable.Table>
      <QuDataTable.Head>
        <QuDataTable.Column />
      </QuDataTable.Head>

      <QuDataTable.Body>
        <QuDataTable.Row>
          <QuDataTable.Cell />
        </QuDataTable.Row>
      </QuDataTable.Body>
    </QuDataTable.Table>

    <QuDataTable.Footer />
  </QuDataTable>
</template>
```

## Composed on Vuetify0

The root creates one v0 [createDataTable](/composables/data/create-data-table) and provides it to v0's [DataTable](/components/data/data-table) parts, which render the native `<table>`, `<thead>`, `<th>`, `<tbody>`, `<tr>` and `<td>` with their roles, `aria-sort` and `aria-rowindex`. The root fixes two options the guidelines decide: one sorted column at a time (`sortMultiple: false`, "If the user clicks on a column that is already sorted, reverse the sort order and rotate the sort icon"), and select-all scoped to the visible page (`selectStrategy: 'page'`). The footer pages through the table's own [createPagination](/composables/data/create-pagination) instance.

Each sortable column's control is a v0 [Button](/components/actions/button) that calls the column's `toggle`; the column definition is a v0 [Tooltip](/components/disclosure/tooltip). The row and select-all checkboxes are v0 [Checkbox](/components/forms/checkbox) roots. The rows-per-page selector is a v0 [Select](/components/forms/select), whose list is a native popover anchored to the selector. The small edit sheet is a v0 [Popover](/components/disclosure/popover) around a v0 [Input](/components/forms/input); the large edit dialog is a v0 [Dialog](/components/disclosure/dialog) on the native `<dialog>`. Every interactive root hosts a [QuRipple](/systems/quantum/ripple) as its first child.

`data-direction` on a column and `data-selected` on a row come from v0; `data-numeric`, `data-editable`, `data-editing`, `data-selectable` and `data-contextual` are Quantum's own.

## Examples

::: ds-example
/systems/quantum/data-table/sorting

### Sorting

A sortable column shows a 16 dp arrow beside its name. At rest the arrow is hidden; hovering the column name reveals it at 38% as the affordance; once the column is sorted the arrow and the name both read at 87%. Clicking the sorted column reverses the order and rotates the arrow half a turn. Only one column is sorted at a time, the guidelines' single sorted column, so sorting another column clears the first.

Numeric columns are right-aligned and put the arrow ahead of the name, on the inner side, as the sorted-column figure draws it. Text columns are left-aligned. The column header row is 56 dp in Medium 12 sp at 54%; data rows are 48 dp in Regular 13 sp at 87%, with a 1 dp divider at 12% between them.

The guidelines ask for the most important data to be sorted by default. The table starts unsorted; sort the source array you pass to `rank` to give it a meaningful initial order.
:::

::: ds-example
/systems/quantum/data-table/tooltips

### Column definitions

`tooltip` gives a column a definition, shown on hover and on keyboard focus: the guidelines' answer to column names that need explaining. The tooltip follows the tooltips page: a 22 dp tile in Medium 10 sp under a mouse and a 32 dp tile in Medium 14 sp on touch, Grey 700 at 90% with white text.

A tooltip is a supplement, not a label. Keep the column name meaningful on its own, because a touch user never hovers and a screen reader announces the definition only as a description of the focused sort control.
:::

::: ds-example
/systems/quantum/data-table/selection

### Selection

`selectable` adds the checkbox column: a select-all checkbox in the header row and one per data row, 18 dp boxes in 24 dp containers, 24 dp from the card edge and 24 dp from the first column's text, inked in the secondary colour. Under a mouse they draw no radial reaction, as the selection controls page asks; from the keyboard a focused checkbox shows the 48 dp halo. A selected row turns Grey 100; a hovered row Grey 200. `v-model:selected` carries the row records. Select-all covers the visible page and goes mixed when only some of the page is selected.

`Contextual` is the alternative header that replaces `Header` while rows are selected: the count ("2 items selected") on the secondary colour's light value, with the actions that apply to the selection. Escape inside it clears the selection, the keyboard counterpart of the navigation page's Back. The guidelines' figures keep the checkbox column visible at all times, and Quantum follows them rather than the selection pattern's hover-revealed checkbox.

A row with `selectable` set to `false` keeps its place in the checkbox column but draws no checkbox, and select-all skips it.

The guidelines' other alternative header, persistent actions, needs no part of its own: leave `title` off the `Header` and put labelled flat `QuButton`s in its slot, disabled until `selected` has rows. Labelled buttons keep the button's own accent ink; only icon-only card actions take the 54% icon tier.
:::

::: ds-example
/systems/quantum/data-table/editing

### Inline editing

`editable="small"` makes a cell editable in place. The page denotes editable fields by placeholder text, 13 sp at 38% with no line beneath it, so `placeholder` is what an empty cell shows. Activating the cell raises a sheet the width of the cell, over it, with 24 dp of padding on each side and a single text field. Enter saves; Escape or a click outside reverts.

The cell takes `v-model` for its value and emits `update:modelValue` only on a save. The table never writes your data: bind the model to the row field, or handle the event, and the row updates. `counter` adds the character counter the figure shows and refuses to save past it; `icon` draws the optional 18 dp edit icon at the cell edge opposite the content.
:::

::: ds-example
/systems/quantum/data-table/edit-dialog

### Edit dialog

`editable="large"` opens the large edit dialog instead, for longer text: a modal dialog that follows the dialogs page, titled by `label`, with the text field, its counter and Cancel and Save actions. Only Save writes the value, as the guidelines confirm the large dialog with its button; Enter in the field does not save, and Cancel and Escape revert. Use it when the edit needs more room than the cell, or when saving should be a deliberate act rather than a keystroke.
:::

::: ds-example
/systems/quantum/data-table/pagination

### Pagination

The footer is a 56 dp row of Caption 12 sp at 54%, aligned to the end of the card: "Rows per page:" with its selector 40 dp away, the range text "1-10 of 32" 32 dp further, then the previous and next chevrons, 24 dp glyphs 24 dp apart and 14 dp from the card edge, each in a 48 dp touch target. Previous and next disable at their ends.

`v-model:rows-per-page` holds the page size, 10 by default, the figure's own value. The guidelines show the selector without listing its choices; `options` on the footer sets them. The range text is a polite live region, so paging is announced.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the QuDataTable SFCs until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Adds the checkbox column: select-all in the header row, one checkbox per data row |
| `selected` | `T[]` | `[]` | `v-model:selected`. The selected row records |
| `rowsPerPage` | `number` | `10` | `v-model:rows-per-page`. Rows on a page; the footer writes it |
| `namespace` | `string` | `'v0:data-table'` | The v0 `DataTable` context key. Change it only to nest two tables whose parts must not collide |

The default slot holds the parts. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Header` | `title?: string` | The 64 dp card header. The title, Regular 20 sp at the 24 dp keyline, also names the table. The slot holds the card actions: icon-only `QuButton`s draw at 54%, labelled flat buttons (the persistent-actions header) keep the accent |
| `Contextual` | `count?: number` | Replaces `Header` while rows are selected: the "N selected" label on `--quantum-accent-light`, the contextual actions in the slot. `count` overrides the number in the label; the part still shows only while rows are selected. Escape clears the selection |
| `Table` | `namespace?: string` | The horizontal scroll container and the `<table>` |
| `Head` | `namespace?: string` | The 56 dp column header row; renders the select-all cell when the table is selectable |
| `Column` | `id`, `sortable?: boolean`, `numeric?: boolean`, `tooltip?: string`, `namespace?: string` | A `<th>`. `id` is the record field it sorts by. `numeric` right-aligns it. `tooltip` is the column definition |
| `Body` | `namespace?: string` | The `<tbody>`. Slot props: `rank(source)`, `items`, `isEmpty` |
| `Row` | `id`, `value`, `selectable?: boolean` (`true`), `namespace?: string` | A 48 dp data row. `value` is the row record. `selectable: false` draws no checkbox and leaves the row out of select-all |
| `Cell` | `numeric?: boolean`, `editable?: 'small' \| 'large'`, `placeholder?: string`, `label?: string`, `counter?: number`, `icon?: boolean`, `v-model?: string` | A `<td>`. `editable` opens the edit sheet (Enter saves) or the dialog (only Save saves); `label` names the field and titles the dialog (default "Edit"); `counter` caps the length; `icon` draws the edit icon |
| `Footer` | `options?: number[]` (`[5, 10, 25, 50]`) | The 56 dp pagination footer: rows per page, the range text, previous and next |

## Accessibility

The table is a native `<table>` with `role="table"`, `<th scope="col">` column headers and `aria-rowindex` on each row. While a `Header` with a `title` is mounted the table is named by it through `aria-labelledby`, and keeps that name while the contextual header hides the title. Without a title, pass `aria-label` to the `Table` part.

### Sorting

A sortable column carries `aria-sort` (`none`, `ascending` or `descending`) and holds a native button, so the sort control is reached with Tab and activated with Enter or Space. Columns that do not sort carry no `aria-sort` and no button.

### Selection

The checkboxes are `role="checkbox"` buttons named "Select all" and "Select row". Select-all reports `aria-checked="mixed"` when part of the page is selected. The contextual header is a `role="toolbar"` named by its count, and the count is a polite live region.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves through the header actions, sort controls, checkboxes, editable cells and footer controls in document order |
| Enter, Space | Sorts a focused column; activates a focused editable cell, footer button or action |
| Space | Toggles a focused checkbox |
| Enter (in the edit sheet) | Saves the edit and closes the sheet |
| Escape (in the edit sheet or dialog) | Reverts and closes |
| Escape (in the contextual header) | Clears the selection |
| Arrow keys (rows-per-page list) | Moves through the choices; Enter picks one |

### Paging

Previous and next are icon buttons named "Previous page" and "Next page", disabled at the first and last page. The range text announces itself politely when the page changes.
