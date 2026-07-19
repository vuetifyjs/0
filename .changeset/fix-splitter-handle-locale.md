---
"@vuetify/v0": patch
---

fix(Splitter): give the resize handle a default localized `aria-label` (#627)

A `Splitter.Handle` without an explicit `label` now falls back to the localized `Splitter.handle` string ("Resize"), so `role="separator"` always exposes an accessible name to assistive technology (WCAG 4.1.2, Name/Role/Value).
