---
"@vuetify/v0": patch
---

fix(useResizeObserver): entries always include `borderBoxSize` and `contentBoxSize` (#1026)

Browsers that omit them from native entries (Safari < 15.4, Chrome < 84) previously passed `undefined` through despite the types; they are now measured from the element's computed style.
