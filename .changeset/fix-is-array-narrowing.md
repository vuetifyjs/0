---
"@vuetify/v0": patch
---

fix(utilities): `isArray` now preserves element types, tuples and `readonly` when narrowing (#744)

`isArray` narrowed everything to `unknown[]`, which erased the element type of arrays whose elements involve `any`, turned `readonly` array unions into an intersection that is not an array of anything, and left the array constituent in place in the `else` branch. Guarding a `readonly string[] | string` gave you neither `readonly string[]` in the `if` nor `string` in the `else`.

Narrowing is now exact: element types, tuple arity and `readonly` survive the guard, and the `else` branch drops exactly the array constituents. `unknown` and `any` inputs narrow as before (`unknown[]` and `any[]`), so mutation and assignment to `unknown[]` keep compiling.

Not breaking — runtime is unchanged, and every input either narrows identically or more precisely than before.
