---
"@vuetify/v0": minor
---

feat(DataGrid): headless compound with column layout, editing, and spanning

Adds `DataGrid` compound component providing structural shells for building data grids:

- `DataGrid.Root` — context provider wrapping `createDataGrid`
- `DataGrid.Table` — semantic `<table>` with `role="grid"`
- `DataGrid.Header` / `DataGrid.Body` — section containers with `role="rowgroup"`
- `DataGrid.Row` — row container with optional id for ordering/selection
- `DataGrid.Column` — header cell with sorting state and `aria-sort`
- `DataGrid.Cell` — data cell with editing state and row spanning

Context injection via `useDataGridRoot` / `provideDataGridRoot` and `useDataGridRow` / `provideDataGridRow`.
