---
"@vuetify/v0": minor
---

feat(useFeatures): add `persist` option to `createFeaturesPlugin`

Setting `persist: true` saves the user's feature-flag overrides to storage as a delta relative to each flag's registration default (`{ enabled, disabled }`) and reapplies them on load. Flags the user never touched are not stored, so they keep following code and adapter defaults across releases; toggling a flag back to its default drops it from the delta. Overrides for flags that register late (adapters, runtime registrations) apply at registration time, and entries for flags that no longer exist are pruned from the next write. Backed by the existing `createPluginContext` persist/restore hooks and keyed by the plugin namespace.
