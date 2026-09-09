---
"@vuetify/v0": patch
---

fix(InputControl): keep wrapper attrs when Root leaves them unset

Wrappers can set a control attr the ambient Input.Root left unset (`readonly`, `disabled`, `required`, `name`, `form`). Root-set values still win.
