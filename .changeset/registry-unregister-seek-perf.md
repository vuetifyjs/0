---
"@vuetify/v0": patch
---

perf(createRegistry): use O(1) ticket.index for unregister splice locate (with indexOf fallback); avoid values() allocation/copy in seek first/last; never eagerly drain reindex in unregister to preserve the lazy contract
