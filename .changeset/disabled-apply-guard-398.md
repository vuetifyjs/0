---
"@vuetify/v0": patch
---

fix(createSelection): reject disabled items in multiple-mode `apply()` — the v-model sync path (`apply()`) could select a disabled item even though `select`/`unselect`/`toggle` all reject them, violating the "disabled = all selection ops are no-ops" contract. `createModel.apply()`'s browse-fallback now routes through `select()` (which guards instance- and ticket-level `disabled`), and `createSelection.apply()`'s multiple branch gains an inline per-ticket guard before adding (kept inline rather than routed through `select()` so the single-mode `multiple: true` override still works). The ref-write value-sync path is untouched. Affects multiple-mode `createSelection`/`createGroup`/`createNested` via `useProxyModel`.
