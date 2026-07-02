---
"@vuetify/v0": patch
---

feat(Popover): dev-mode warning when a display utility overrides native popover hide

In `__DEV__` builds, `Popover.Content` now warns via `useLogger` when a display utility class (`flex`, `grid`, `inline-flex`, etc.) is placed directly on the content element. The check clones the element without its `[popover]` attribute so neither the UA closed-state rule nor the component's own `[popover]:not(:popover-open){display:none!important}` override applies, then reads `getComputedStyle().display` on the off-screen clone. A non-`block`/non-`none` result means author CSS would have made the element visible while closed; the warning names the detected value and points to the fix: wrap layout classes in a child element. The guard is tree-shaken in production and is SSR-safe via `IN_BROWSER`.
