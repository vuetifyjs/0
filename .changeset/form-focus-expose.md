---
"@vuetify/v0": minor
---

feat(forms): expose AtomExpose on control roots and focus() on groups

`Checkbox.Root`, `Radio.Root`, `Switch.Root`, `Toggle.Root`, and `Button.Root` now expose the rendered host via `AtomExpose.element`, so a template ref can call `.focus()`. `Radio.Group`, `Checkbox.Group`, `Switch.Group`, `Toggle.Group`, and `Button.Group` expose `focus(options?: FocusOptions)` which focuses the selected item, or the first if none is selected.
