---
"@vuetify/v0": minor
---

feat(DataTable): introduce compound component over createDataTable

Headless compound component for rendering tabular data with semantic table markup and ARIA support:

- **DataTable.Root** — provider that wraps `createDataTable` and exposes context
- **DataTable.Table** — `<table>` with `role="table"` and `aria-rowcount`
- **DataTable.Head** — `<thead>` exposing the 2D header grid
- **DataTable.HeaderRow** — `<tr>` for header rows
- **DataTable.HeaderCell** — `<th>` with `aria-sort` and sort controls
- **DataTable.Body** — `<tbody>` exposing paginated items
- **DataTable.Row** — `<tr>` with selection and expansion state
- **DataTable.Cell** — `<td>` with colspan support
- **DataTable.Empty** — conditional empty state row

The component shell delegates all data pipeline logic (sorting, filtering, pagination, selection, expansion, grouping) to the existing `createDataTable` composable — no behavior reimplementation.
