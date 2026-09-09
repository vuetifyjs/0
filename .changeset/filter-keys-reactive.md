---
"@vuetify/v0": patch
---

fix(createFilter): track reactive `keys`

`keys` now accepts a ref or getter (`MaybeRefOrGetter<readonly string[]>`), so changing which fields are searched re-runs the filter. Passing a plain `string[]` is unchanged.
