---
'@vuetify/v0': patch
---

fix(Slider,Rating): omit aria-label when ariaLabelledby is provided

When both `ariaLabel` and `ariaLabelledby` are provided, `aria-labelledby` now consistently wins across Slider, Rating, and NumberField — `aria-label` is omitted from the DOM. Assistive technology output is unchanged (the ARIA accessible-name algorithm already prefers `aria-labelledby`); only the emitted attributes are now consistent.
