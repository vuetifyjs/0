---
"@vuetify/v0": patch
---

fix(Dialog,AlertDialog): omit aria-labelledby/describedby when Title/Description absent (#608)

Dialog.Content and AlertDialog.Content now presence-track their Title and
Description sub-components. The `aria-labelledby` and `aria-describedby`
attributes are only emitted when the corresponding element is actually mounted,
avoiding dangling IDREF warnings from assistive technologies. Follows the same
pattern as Progress (`hasLabel`) and Combobox (`hasDescription`).
