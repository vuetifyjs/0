---
"@vuetify/v0": patch
---

fix(DataGrid): keep column resize working after hide()

`hide()` leaves columns mounted; resize now matches Splitter panel count, not visible-only columns.
