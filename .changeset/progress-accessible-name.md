---
"@vuetify/v0": patch
---

fix(Progress): an unlabeled bar has an accessible name

A bar with no `Progress.Label` and no `ariaLabel` is named "Loading" (locale key `Progress.label`). A visible label or `ariaLabel` still wins.
