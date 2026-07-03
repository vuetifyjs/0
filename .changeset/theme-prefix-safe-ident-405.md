---
"@vuetify/v0": patch
---

fix(useTheme): validate the theme adapter `prefix` against `SAFE_IDENT` — `ThemeAdapter.generate()` sanitized theme names, color keys, and values, but interpolated the adapter `prefix` into the generated CSS (`--${prefix}-…`, `var(--${prefix}-on-background)`) unvalidated, so a malformed prefix (e.g. containing `}`) could break out of the declaration block and inject arbitrary CSS rules. The constructor now rejects any prefix that doesn't match `SAFE_IDENT` (`/^[a-zA-Z0-9_-]+$/`) with a `V0Error` (`V0_THEME_INVALID_PREFIX`), mirroring the guard already applied to adjacent inputs and the `V0_PALETTE_INVALID_SEED` precedent. Both `V0StyleSheetThemeAdapter` and the unhead adapter inherit it. Non-breaking — valid prefixes already match.
