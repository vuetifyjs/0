---
"@vuetify/v0": patch
---

fix(useResizeObserver): `borderBoxSize` and `contentBoxSize` are typed as optional (#1026)

Browsers without native box sizes (Safari < 15.4, Chrome < 84) report both as `undefined`. Code that indexes `entry.borderBoxSize[0]` or `entry.contentBoxSize[0]` now needs optional access or a `contentRect` fallback to typecheck.
