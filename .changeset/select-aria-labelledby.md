---
"@vuetify/v0": minor
---

feat(Select): name the activator from a visible label

`Select.Activator` accepts `ariaLabelledby` and renders it as `aria-labelledby`. Pass the id of an existing label element when the control's text is the selected value. If `label` and `ariaLabelledby` are both set, `aria-labelledby` is used and `aria-label` is omitted.
