---
"@vuetify/v0": patch
---

fix(Treeview): expose the active node to assistive technology via `aria-current` (#626)

Navigation trees without checkbox selection now convey the current node — the active `treeitem` emits `aria-current="true"` alongside the existing `aria-selected`, so screen readers can announce the focused node.
