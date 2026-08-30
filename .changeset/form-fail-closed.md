---
"@vuetify/v0": patch
---

fix(createValidation): fail unknown rule aliases and honor Form namespace

Unresolved alias strings no longer pass validation. A `Form` with a custom `namespace` still auto-registers `createValidation` / Input children, so isolated forms actually collect their fields.
