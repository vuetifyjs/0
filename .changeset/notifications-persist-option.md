---
"@vuetify/v0": minor
---

feat(useNotifications): add `persist` option to `createNotificationsPlugin`

Setting `persist: true` saves each notification's interaction state — `readAt`, `seenAt`, `archivedAt`, and `snoozedUntil` — to storage as a map keyed by notification id, and merges it back onto the notifications the app registers, whether they exist at restore time or register later (adapters, runtime sends). Notification content is never stored: code stays the source of truth for subject, body, and data. Expired snoozes are dropped on restore, and state for notifications that no longer register is pruned from the next write. Backed by the existing `createPluginContext` persist/restore hooks and keyed by the plugin namespace.
