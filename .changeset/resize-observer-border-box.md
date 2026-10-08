---
"@vuetify/v0": patch
---

fix(useResizeObserver): `borderBoxSize` is typed as optional (#1026)

Browsers without native border-box sizes (Safari < 15.4, Chrome < 84) report it as `undefined`. Code that indexes `entry.borderBoxSize[0]` now needs optional access or a `contentRect` fallback to typecheck.
