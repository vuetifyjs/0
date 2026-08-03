---
"@vuetify/v0": patch
---

fix(Input): make the `type` prop reactive (#757)

`Input.Root`'s `type` prop was captured once at setup, so binding `:type` to a ref and toggling it after mount (e.g. `'password'` ↔ `'text'`) never updated the rendered `<input>`'s type. The prop now flows reactively through the root context, and `Input.Control` reflects post-mount changes.
