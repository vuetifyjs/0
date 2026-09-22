---
'@vuetify/v0': patch
---

useStorage no longer throws when the browser refuses localStorage; it falls back to memory and reads tolerate a throwing adapter.
