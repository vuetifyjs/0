---
"@vuetify/v0": patch
---

fix(Dialog,AlertDialog): omit `aria-labelledby`/`aria-describedby` when title/description are absent (#631)

`DialogContent` and `AlertDialogContent` unconditionally emitted `aria-labelledby`/`aria-describedby` pointing at ids even when no `Title`/`Description` sub-component was rendered, producing a dangling IDREF — invalid per the ARIA spec and liable to make screen readers announce empty text or skip the dialog's accessible name. Both attributes are now gated on the referenced sub-component actually being mounted.
