---
"@vuetify/v0": minor
---

feat(useNotifications): add `persist` option to `createNotificationsPlugin`

Setting `persist: true` serializes the notification registry to storage and restores it on load, so notification lifecycle state — including `snoozedUntil` — survives a page reload. Backed by the existing `createPluginContext` persist/restore hooks and keyed by the plugin namespace.
