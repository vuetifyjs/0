---
"@vuetify/v0": patch
---

fix(Button,Toggle,Pagination): activate non-native `as` elements on Enter/Space (#645)

`ButtonRoot`, `ToggleRoot`, and `PaginationItem` expose `role="button"` and `tabindex` when rendered with a non-native `as` element (e.g. `as="div"`), but browsers only synthesize a click from Enter/Space for native `<button>` elements — for everything else those were dead keys. All three now wire an `onKeydown` handler (only when `as !== 'button'`) so keyboard users can activate them.
