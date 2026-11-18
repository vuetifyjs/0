---
'@vuetify/v0': minor
---

feat(useDate): default to a plain JavaScript Date

`createDate()` and `useDate()` inside a component work without an adapter. Pass `V0DateAdapter` when you want Temporal. `useDate()` outside a component still throws.
