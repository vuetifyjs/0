---
"@vuetify/v0": patch
---

fix(a11y): complete non-button host polyfill for default-button controls

Controls that default to `as="button"` now apply a consistent host contract when the element is not a native button: `role="button"`, `tabindex` 0/−1, and Enter/Space activation (gated so native buttons keep browser handling only). Covers Carousel Next/Previous, Dialog and AlertDialog activators/actions/close, Pagination First/Prev/Next/Last, Popover Activator, Snackbar Close, plus gating on Collapsible/ExpansionPanel activators and Toggle.
