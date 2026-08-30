---
"@vuetify/v0": patch
---

fix(selection): make ticket.unregister() clear selection and tree state

`ticket.unregister()` now drops the id from selection, mixed, and nested maps — the same cleanup `unregister(id)` already did. `clear()` / `dispose()` on a group or tree wipe mixed and open state too. Stepping after an earlier item unmounts, Progress percent after a segment unmounts, and mandatory `unselectAll` on a tree no longer leave ghost ids or re-select a disabled node.
