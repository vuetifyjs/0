---
"@vuetify/v0": patch
---

fix(Input): required fields fail Form submit under novalidate

`required` on Input and NumberField now registers a presence rule, so empty required fields fail `submit()` even though Form defaults to `novalidate`.
