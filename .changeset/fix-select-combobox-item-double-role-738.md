---
"@vuetify/v0": patch
---

fix(Select, Combobox): correct the documented Item example to avoid double `role="option"` (#738)

`Select.Item` and `Combobox.Item` already bind their full `attrs` bundle (including
`role="option"`) onto their own non-renderless `Atom`. Both components' `@example`
JSDoc then spread that same `attrs` object onto a child `<div>` inside the default
slot — which `.claude/rules/components.md` documents as unsupported outside
`renderless` mode: it renders `role="option"` twice (`listbox > div[role="option"] >
div[role="option"]`, failing axe's `aria-required-parent`) and double-fires every
handler in `attrs`, once on the child and again via bubbling to the Atom.

Added `renderless` to the documented `Select.Item` / `Combobox.Item` usage in both
components' `@example` blocks, so the consumer's own element is the only one
rendered — matching how `packages/0/src/components/fixtures/Select.vue` and
`Combobox.vue` (and every real docs example) already use these components.
