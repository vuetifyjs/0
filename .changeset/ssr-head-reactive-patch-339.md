---
'@vuetify/v0': patch
---

fix(useRtl,useTheme): keep SSR head entries in sync with reactive state (#606)

During server rendering, the `dir` attribute, `data-theme`, and injected theme styles now update via `entry.patch` when RTL or theme state changes after the initial head push — previously the first-rendered values were frozen for the rest of the request. Adapter disposal also cleans up the new watchers alongside the head entry.
