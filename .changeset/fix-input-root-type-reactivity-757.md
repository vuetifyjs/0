---
"@vuetify/v0": patch
---

fix(Input): make the `type` prop reactive (#757)

`Input.Root`'s `type` prop was destructured once at setup and assigned as a plain
value onto `InputRootContext` — every sibling field on the context is a ref or
getter, but `type` was not. `Input.Control` read that frozen value, so changing
`:type` on `Input.Root` after mount (the classic password reveal-toggle pattern)
never reached the rendered `<input>`'s DOM `type` attribute.

`type` is now placed on the context as `toRef(() => type)`, and `Input.Control`
reads `root.type.value`, matching how every other reactive context field is
consumed.
