---
"@vuetify/v0": patch
---

perf(createDataGrid): stop mirroring rows into a per-ticket-reactive sortable, and skip the row-order reorder on sort when no manual order is in effect.

The grid mirrors every row into a parallel `createSortable` to track manual drag-reorder. Two costs came out of that:

- It constructed the sortable with `reactive: true`, allocating a `shallowReactive` proxy per row — but the grid only ever reads the sortable's key *order*, never a per-ticket field. Row order now derives from `useProxyRegistry(sortable)` (event-driven, `reorder`/`move` emit `reindex:registry`), so `order` stays reactive with zero per-ticket proxies. ~2x faster construction and ~6.5x faster drag-reorder at 10k rows.
- The `flush: 'sync'` sort-columns watch called `rows.reset()` on every sort, which unconditionally reordered every ticket even when the consumer had never dragged a row. `reset()` now early-returns while `dirty` is false (the sortable already matches registration order and isn't read for the page projection). Warm 10k-row sort drops from ~48ms to ~1.7ms per sort (~28x).

Behavior is unchanged: a sort still discards an active manual reorder (when `dirty`, `reset()` still reorders and clears the flag), and `rows.order` reactivity is preserved.
