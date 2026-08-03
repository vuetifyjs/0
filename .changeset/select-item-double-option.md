---
'@vuetify/v0': patch
---

docs(Select): fix double role=option in Item examples (#775)

The documented `Select.Item` and `Combobox.Item` usage spread the slot `attrs` onto an inner element inside a non-renderless Item, so following it produced a nested duplicate `role="option"` (axe `aria-required-parent`, critical) and click handlers that fired twice. The Treeview `Cue`/`Checkbox`/`Indicator`/`SelectAll` and Radio `Root`/`Group` examples had the same shape. If you copied any of these, remove the inner `v-bind="attrs"` spread and put your content directly in the slot — or add `renderless` so your element is the only one rendered.
