---
'@vuetify/play': minor
'@vuetify/v0': minor
---

feat(play): share the v0play hash protocol as `@vuetify/play`

Docs, the playground, and (later) genesis / the builder encode and sanitize the same `{ files, theme, themes }` payload. `ThemeAdapter.SAFE_IDENT` and `UNSAFE_CSS` are public so color values cannot drift from the stylesheet generator; CSS comments are rejected in theme tokens.
