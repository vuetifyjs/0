---
"@vuetify/v0": minor
---

feat(DataTable): introduce compound component over createDataTable

Headless table with semantic markup. Root creates `createDataTable`; Column and Row register when they mount (same lifecycle as Checkbox.Group). `v-for="user in rank(users)"` — `rank` is on the Body slot and orders the source by the pipeline. Row hides off-page rows itself so they stay registered.

- **DataTable.Root** — factory + provider; `v-model:search`
- **DataTable.Table** — `<table>`; `aria-rowcount` only when the page is a subset of total
- **DataTable.Header** — `<thead>` exposing the 2D header grid
- **DataTable.Column** — `<th>` with `aria-sort`; `toggle` / `direction` on the slot
- **DataTable.Body** — `<tbody>`; slot `rank`, `items`, `isEmpty`
- **DataTable.Row** — `<tr>` for header or body; owns visibility and `aria-rowindex`
- **DataTable.Cell** — `<td>`
- **DataTable.Empty** — empty-state row when the page has no items

Sorting, filtering, pagination, selection, and expansion stay on `createDataTable`. Large lists use `VirtualDataTableAdapter` + `createVirtual`, not this compound.
