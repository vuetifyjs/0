---
"@vuetify/v0": patch
---

fix(components): treat bare boolean attributes like `<Menu.Item disabled>` as `true` on the `disabled`, `readonly`, and `indeterminate` props that also accept refs and getters. Previously they arrived as `''` and the component stayed enabled.
