---
'@vuetify/v0': patch
---

fix(createKanban): contexts can now be disposed — `kanban.dispose()` tears down every column's inner sortable, the internal id → column lookup, and the transfer event bus, so boards no longer leak listeners and stale lookup entries
