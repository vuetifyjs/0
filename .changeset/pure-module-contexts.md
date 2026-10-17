---
"@vuetify/v0": patch
---

fix: smaller Vite 8 bundles when only part of v0 is used (#1043)

A Vite 8 production build no longer pulls unused v0 contexts into the bundle. In an app that uses Vuetify's `VSelect`, `VAutocomplete`, `VCombobox` or `VDataTable`, this saves about 23 kB of gzipped JS on Vue 3.5 and about 73 kB on Vue 3.6, independent of app size.
