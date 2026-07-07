---
'@vuetify/v0': patch
---

perf(createRegistry): memoize reactive keys/values/entries behind a version signal

Reactive-mode iteration reads previously bypassed the result cache and read the
order array through its shallowReactive proxy — one trap per index and, inside
an effect, one tracked dependency per index. Reads now touch a single version
signal (bumped on every structural mutation) and share the non-reactive cache,
making reactive reads O(1) between mutations and giving subscribing effects one
dependency regardless of collection size. Mid-batch reads now always reflect
mutations already applied instead of a stale pre-batch snapshot.
