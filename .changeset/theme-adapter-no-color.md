---
"@vuetify/v0": patch
---

fix(useTheme): stop emitting element-level color on `[data-theme]`

`ThemeAdapter.generate()` still writes custom properties and `:root { color-scheme }`. It no longer sets `color: var(--*-on-background)` on the theme selector — applying tokens is Paper's job. Unstyled hosts that relied on that inherited `color` need to set it themselves.
