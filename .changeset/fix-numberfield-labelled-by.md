---
"@vuetify/v0": patch
---

fix(NumberField): add `labelledBy` prop for `aria-labelledby` on the spinbutton (#640)

`NumberField.Control` previously only supported accessible naming via the `label` string prop, rendered as `aria-label`. Consumers who render a visible `<label>` element outside the component had no way to wire it to the spinbutton. `labelledBy` now flows through `NumberField.Root`'s context and renders as `aria-labelledby` on the spinbutton, suppressing `aria-label` when both are set to avoid a conflicting accessible name.
