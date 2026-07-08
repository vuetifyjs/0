---
"@vuetify/v0": patch
---

perf(createDataGrid): skip the row-order reorder on sort changes when no manual order is in effect. The sort-columns watch called `rows.reset()` on every sort, which unconditionally reordered every sortable ticket — an O(n) pass across all rows on each header sort even when the consumer had never dragged a row. `reset()` now early-returns while `dirty` is false (the sortable already matches registration order and isn't read for the page projection), leaving the "sort change discards a manual reorder" behavior untouched. Warm 10k-row sort drops from ~48ms to ~1.7ms per sort (~28x).
