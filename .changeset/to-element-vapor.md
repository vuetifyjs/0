---
"@vuetify/v0": patch
---

`toElement` now resolves a template ref to a Vue 3.6 Vapor component to the first Element it renders, so composables that take an element target work when pointed at one. A Vapor component that calls `expose()` still resolves to `undefined`.
