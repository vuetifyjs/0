---
'@vuetify/v0': minor
---

feat(useTheme): follow a registered light/dark pair until an explicit select (#872)

Pass `system: { light, dark }` on `createTheme` / `createThemePlugin`. The plugin
tracks `prefers-color-scheme` while `isSystem` is true. `persist: true` stores a
theme id only after `select`; `reset()` returns to the pair. Both ids must already
be registered.
