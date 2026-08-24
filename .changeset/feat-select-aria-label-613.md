---
"@vuetify/v0": minor
---

feat(Select): add `label` prop to `SelectActivator` (#635)

`SelectActivator` had no way to carry an accessible name when the visible label lives in a sibling element. A new `label` prop renders as `aria-label` on the activator (and is exposed through the slot attrs), so screen readers announce the select's purpose without requiring a wired-up `<label>` element.
