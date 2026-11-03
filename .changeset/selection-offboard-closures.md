---
"@vuetify/v0": patch
---

fix(createSelection): tickets moved between registries act on the registry that onboards them

A ticket moved with `destination.onboard(source.offboard(ids))` now selects, unselects and toggles in the destination. Patching an existing ticket with `upsert` keeps its `unregister` bound to the registry that holds it.
