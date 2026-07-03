---
"@vuetify/v0": patch
---

fix(useStack): don't share the fallback stack across SSR requests — `useStack()` fell back to a module-scoped singleton when no provider existed, so in a long-lived Node SSR process overlay tickets persisted across requests (z-index bleed + unbounded memory growth). Under SSR (`!IN_BROWSER`), `getStackFallback()` now returns a fresh ephemeral `createStack()` per call instead of the shared global; the browser singleton is unchanged. For coordinated per-app SSR z-index, use `createStackPlugin` (as the docs already advise).
