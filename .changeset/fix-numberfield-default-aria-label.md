---
"@vuetify/v0": patch
---

fix(NumberField): default accessible name on the spinbutton (#772)

`NumberField.Control` rendered no accessible name unless a `label` or `ariaLabelledby` prop was set, failing the axe `label` rule in the documented default shape. The spinbutton now falls back to the locale-driven `NumberField.label` message (default: "Number"), matching the increment/decrement buttons. Providing `label` or `ariaLabelledby` overrides the default as before.
