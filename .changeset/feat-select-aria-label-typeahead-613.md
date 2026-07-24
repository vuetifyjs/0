---
"@vuetify/v0": minor
---

feat(Select): add `aria-label` prop and printable-char typeahead to `SelectActivator` (#635)

`SelectActivator` had no way to carry an accessible label when the visible label lives in a sibling element, and no typeahead for keyboard users. A new `label` prop renders as `aria-label` on the activator, and pressing a printable character while the listbox is open now jumps virtual focus to the first non-disabled item whose text starts with that character, per the ARIA Authoring Practices Listbox pattern.
