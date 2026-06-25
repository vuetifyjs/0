---
"@vuetify/v0": minor
---

feat(useFeatures): add `persist` option to `createFeaturesPlugin`

Setting `persist: true` saves the set of enabled feature flags to storage and reconciles them against the registered flags on load, so a user's feature toggles survive a page reload. Backed by the existing `createPluginContext` persist/restore hooks and keyed by the plugin namespace.
