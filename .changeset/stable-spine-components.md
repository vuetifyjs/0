---
"@vuetify/v0": patch
---

chore(maturity): promote the 1.0 component spine to `stable` — 11 headless components are now API-locked for 1.0: the primitive `Atom`, the providers `Theme`, `Group`, `Selection`, `Single`, and `Step`, the `Tabs` and `Toggle` interaction components, and the `Checkbox`, `Radio`, and `Switch` form controls. Three supporting composables graduate with them — `useProxyModel`, `toElement`, and `toArray` — because every promoted component rests on them, and a stable component cannot sit on a `preview` logic layer. No behavior or signature changes: this is a stability commitment, not a code change, so no consumer action is required. `Collapsible` and `AspectRatio` remain `preview` pending browser-test coverage of their failure modes.
