---
"@vuetify/v0": patch
---

fix(NumberField): default the spinbutton's accessible name (#741)

`NumberField`'s `label` and `ariaLabelledby` props both collapsed to `undefined`
when a consumer supplied neither — including the shape `NumberField`'s own
`@example` documents — so the `role="spinbutton"` input shipped with no
accessible name at all (axe `label`, critical).

`NumberField.Control` now falls back to a locale-driven default (`locale.ti('NumberField.label') ?? 'Number'`)
when no `label` or `ariaLabelledby` is provided, matching the precedent already
set by the increment/decrement buttons (`NumberField.increment`/`NumberField.decrement`).
A consumer-supplied `label` still takes priority, and `ariaLabelledby` still
suppresses `aria-label` entirely.
