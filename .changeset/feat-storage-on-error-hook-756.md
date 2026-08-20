---
"@vuetify/v0": minor
---

feat(useStorage): add an `onError` hook for failed storage operations (#756)

`createStorage`'s adapter calls are fire-and-forget side effects: a failed
write (quota exceeded, a `SecurityError` in a restricted context) was routed
only to the internal logger, a failed or corrupt read silently fell back to
the default value, and removes had no error handling at all — so consumers
had no programmatic way to learn that persistence failed. `storage.set`
cannot reject, and no error state was exposed, so an app could believe a
user's change was persisted when it silently was not.

`createStorage()` / `createStoragePlugin()` now accept an opt-in `onError`
option:

```ts
createStoragePlugin({
  onError: (error, key) => { /* surface to app state */ },
})
```

Called with the underlying error and the prefixed storage key whenever a
read, write, or remove on the underlying adapter throws (including
unparseable stored JSON). The existing internal log is unchanged and still
fires alongside it.
