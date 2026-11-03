---
"@vuetify/v0": patch
---

fix(createRegistry): survivors of a removal carry canonical indexes by the end of the batch or the next tick

Removing a ticket from a registry whose tickets carry explicit values left the remaining tickets' `index` stale until the next position-based call. The registry now reindexes survivors at the end of the enclosing `batch()` and, outside a batch, before the next tick. `createSortable` `move`/`swap`/`reorder` and `createKanban` `transfer` read canonical positions in the same tick as a sibling removal.
