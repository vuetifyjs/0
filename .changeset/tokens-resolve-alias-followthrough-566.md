---
"@vuetify/v0": patch
---

fix(createTokens): resolve aliases reached through a segment path, return directly-passed TokenAlias literals, and cache chained resolutions (#566)

`resolve()` now follows a `{alias}` that a dotted-segment lookup lands on — previously it returned the raw `'{alias}'` string (visible under `flat: true`, where nested objects are stored whole and addressed by segment). A `TokenAlias` object passed directly to `resolve()` now returns its `$value` (previously a non-alias `$value` was stringified and looked up as an id, yielding `undefined`), and aliased resolutions cache the outer key rather than only the terminal hop. `resolve<T = unknown>()` also accepts an optional return-type parameter.
