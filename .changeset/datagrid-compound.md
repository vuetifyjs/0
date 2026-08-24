---
"@vuetify/v0": minor
---

feat(DataGrid): headless compound with column layout, editing, and spanning

Adds `DataGrid` compound component providing structural shells for building data grids:

- `DataGrid.Root` — context provider wrapping `createDataGrid`. Columns and rows register on mount.
- `DataGrid.Table` — semantic `<table>` with `role="table"` (not an APG Grid widget)
- `DataGrid.Header` / `DataGrid.Body` — section containers; `role="rowgroup"` only when `as` is not the native `thead`/`tbody`
- `DataGrid.Row` — row container with optional `id`/`value` for registration, selection, and expansion
- `DataGrid.Column` — header cell with sorting state, `aria-sort`, and layout (pin/size)
- `DataGrid.Cell` — data cell with `role="cell"`, editing state, and row spanning
- `DataGrid.Handle` — column resize handle (Splitter.Handle) for use inside a resizable row on the `as="div"` chain

Context injection via `useDataGridRoot` / `provideDataGridRoot` and `useDataGridRow` / `provideDataGridRow`.
