---
"@vuetify/v0": patch
---

fix(NumberField): pass parsed value directly to commit() so typed values correctly propagate to the parent v-model on blur and Enter — avoids reading the stale model before Vue's reactivity round-trip completes
