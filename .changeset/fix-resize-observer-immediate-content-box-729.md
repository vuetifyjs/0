---
"@vuetify/v0": patch
---

fix(useResizeObserver): report the content box from `immediate` entries (#729)

With `immediate: true`, the first synthesized entry's `contentRect` carried border-box dimensions in viewport coordinates, scaled by CSS transforms — every later entry from the observer reports the content box with padding offsets. The immediate entry now matches native semantics: `width`/`height` are the content box and `top`/`left` are the computed padding offsets, so `useElementSize` reports content-box dimensions from mount instead of jumping on the first resize.
