---
"@vuetify/v0": patch
---

fix(v0): accept Vue 3.6 prereleases and surface npm discovery metadata

`@vuetify/v0` now installs cleanly alongside `vue@3.6.0-rc.x`. The previous `vue` peer range of `>=3.5.0` excluded prereleases per semver, so any project on a 3.6 release candidate hit `ERESOLVE`; the range is now `>=3.5.0 || >=3.6.0-0`. No change for projects on stable Vue.

The package also publishes `keywords`, `homepage`, and `bugs` for the first time, and the `description` now leads with what the package is — headless, unstyled, accessible Vue 3 primitives and composables.
