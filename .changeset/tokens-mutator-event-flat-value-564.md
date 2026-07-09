---
"@vuetify/v0": patch
---

fix(createTokens): mutators now forward their `event` argument and `ticket.value` is typed accurately under `flat: true` (#564)

`upsert` (and the other registry mutators) silently dropped the optional `event` argument, so custom events never emitted for token registries; the wrappers now forward it and match the inherited `RegistryContext` signatures. `TokenValue` also widens to include `TokenCollection` so `ticket.value` reflects the nested objects stored under `flat: true` — the mode `useTheme`/`useFeatures` rely on — instead of claiming leaf/alias only.
