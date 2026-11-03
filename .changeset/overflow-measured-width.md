---
"@vuetify/v0": minor
---

feat(createOverflow): record widths by number so re-keyed hidden items keep their size

`measure(index, source)` now also accepts a number and returns the width it recorded, so an item whose index shifts can re-key its entry without reading a hidden element. Breadcrumbs and Overflow use it: removing a crumb or item no longer leaves departed widths in the pool or records zero for collapsed siblings, so the ellipsis and the indicator match a fresh mount of the same trail.
