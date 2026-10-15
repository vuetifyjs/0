---
"@vuetify/v0": patch
---

fix(createContext): let Rolldown (Vite 8) drop unused contexts

Importing anything from v0 no longer pulls every context in the same chunk into Rolldown builds. In a Vite 8 app that uses Vuetify's `VSelect`, `VAutocomplete`, `VCombobox` or `VDataTable`, this saves about 23 kB of gzipped JS on Vue 3.5 and about 73 kB on Vue 3.6, independent of app size.
