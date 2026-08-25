---
"@vuetify/v0": minor
---

feat(DataTable): introduce compound component over createDataTable

Headless compound component for rendering tabular data with semantic table markup and ARIA support:

- **DataTable.Root** — provider that creates `createDataTable`; rows and columns register when they mount
- **DataTable.Table** — `<table>` with `role="table"`; `aria-rowcount` only when the page is a subset of total
- **DataTable.Header** — `<thead>` exposing the 2D header grid
- **DataTable.Column** — `<th>` with `aria-sort` and sort controls
- **DataTable.Body** — `<tbody>` exposing paginated items
- **DataTable.Row** — `<tr>` shared by header and body, with selection and expansion state
- **DataTable.Cell** — `<td>` with colspan and rowspan support
- **DataTable.Empty** — conditional empty state row

The component shell delegates all data pipeline logic (sorting, filtering, pagination, selection, expansion, grouping) to the existing `createDataTable` composable — no behavior reimplementation.
