---
"@vuetify/v0": patch
---

fix(Progress): emit a number when filling after an indeterminate start

An unbound Progress that later received a fill value used to write `[n]` because scalar-vs-array was frozen at setup. Fill also omits inline width while indeterminate so CSS animations can run.

fix(DataGrid): keep column resize working after hide()

`hide()` leaves columns mounted; resize now matches Splitter panel count, not visible-only columns.

fix(createDataTable): honor the factory `locale` option when a locale plugin is installed
