---
'@vuetify/v0': patch
---

fix(Rating): name the slider and drop focusable stars from examples (#773)

`Rating.Root` now exposes `ariaLabel` and `ariaLabelledby` props and always emits an accessible name on the `role="slider"` element — a locale-driven "Rating" default applies when neither is set. Documented examples no longer render `Rating.Item` as `<button>`, so the slider contains no focusable descendants; items stay non-focusable spans and click-to-select is unchanged.
