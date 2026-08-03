---
"@vuetify/v0": patch
---

fix(Slider): default accessible name via locale when unlabeled (#771)

`Slider.Thumb` rendered `role="slider"` with no accessible name unless `ariaLabel` or `ariaLabelledby` was passed, failing axe's `aria-input-field-name` rule (serious) out of the box. The thumb now defaults its `aria-label` to the localized `Slider.label` message, falling back to "Slider", and skips the default when `ariaLabelledby` is provided so the referenced label wins.
