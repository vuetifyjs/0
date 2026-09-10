---
"@vuetify/v0": patch
---

fix(Toggle): emit native `disabled` on the default button host

Disabled `Toggle.Root` now sets the HTML `disabled` attribute when `as` is `"button"` (the default) and omits `aria-disabled` on that path. Non-button hosts still get `aria-disabled`.
