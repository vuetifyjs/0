---
"@vuetify/v0": patch
---

fix(createValidation): fail unknown rule aliases; join Form via formNamespace

Unresolved alias strings no longer pass validation. Fields join a Form through `formNamespace` (default `'v0:form'`), matching `groupNamespace` — a custom Form `namespace` only collects children that set the same key.
