---
"@vuetify/v0": patch
---

fix(createFilter): a plain list filters with less repeated work per search

The default matcher prepares the query once per pass. Which edits re-run the filter is unchanged. A deep `ref` still tracks every field, so a large list should be a `shallowRef` or a plain array.
