---
"@vuetify/v0": patch
---

perf(createDataGrid): dramatically faster sorting, drag-reordering, and initialization on large grids (#555)

Grids with thousands of rows are far faster to sort, drag-reorder, and build — a 10k-row sort is ~28× faster, drag-reordering ~6.5×, and initial construction ~2×. No API change and no migration: existing grids get the speedup on upgrade.
