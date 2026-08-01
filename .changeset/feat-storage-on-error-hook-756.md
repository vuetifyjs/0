---
"@vuetify/v0": minor
---

feat(useStorage): add an `onError` hook for failed writes (#756)

`createStorage`'s deep-watcher write path caught adapter errors (quota exceeded,
a `SecurityError` in a restricted context, an adapter-level failure) and routed
them only to the internal logger, without rethrowing — writes are fire-and-forget
deep-watcher side effects, so there was no programmatic way for a consumer to
learn a write failed. `storage.set` cannot reject, and no error state was exposed,
so an app could believe a user's change was persisted when it silently was not.

`createStorage()` / `createStoragePlugin()` now accept an opt-in `onError` option:

```ts
createStoragePlugin({
  onError: (error, key) => { /* surface to app state */ },
})
```

Called with the underlying error and the prefixed storage key whenever a write
throws. The existing internal log is unchanged and still fires alongside it.
