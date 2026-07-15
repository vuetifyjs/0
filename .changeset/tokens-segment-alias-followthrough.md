---
"@vuetify/v0": patch
---

fix(createTokens): follow a `{alias}` reached through a segment path (#566)

`resolve()` now re-resolves an alias that a dotted-segment lookup lands on, instead of returning the raw `'{alias}'` string. This is visible under `flat: true` (where nested groups are stored whole and addressed by segment), so `useTheme` — which resolves theme colors through a `flat: true` token table — no longer drops or leaks an unresolved `{alias}` for a palette entry that is itself an alias. The leaf-value branch already followed terminal aliases; the segment branch now matches it.
