---
"@vuetify/v0": minor
---

feat(useStack): add app-wide `default` teleport option to `createStackPlugin` (#603)

Previously the only way to teleport all Portals to a non-default target was per-component (`<SnackbarPortal to="top-layer" />` on every instance) — there was no single place to configure the fallback for the whole app. `createStackPlugin({ default: 'top-layer' })` now sets that fallback once; `Portal` resolves its target through `to` prop → `stack.default` → `'body'`.
