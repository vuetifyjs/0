---
"@vuetify/v0": patch
---

fix(createTokens): `resolve()` no longer returns inherited prototype members — the alias-path walk used `segment in current`, which traverses the prototype chain, so resolving a path whose final segment named an `Object.prototype` member (`constructor`, `toString`, `hasOwnProperty`, `__proto__`, …) returned that builtin instead of `undefined` + the "Path not found" warning. `resolve()` now mirrors `flatten()`'s guard (`UNSAFE_KEYS` + `Object.prototype.hasOwnProperty.call`). Correctness/defense-in-depth — config and the resolve argument are developer-authored, so this is a consistency fix, not a security fix.
