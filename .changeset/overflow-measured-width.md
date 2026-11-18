---
"@vuetify/v0": minor
---

feat(createOverflow): measure() takes a width in pixels and returns the recorded width

`measure(index, source)` accepts a number as well as an element and returns the width it recorded, so an item that moves to another index can keep the width it had while visible. Breadcrumbs and Overflow do this now: removing a crumb or item no longer leaves its width behind or records a collapsed sibling as zero, so the ellipsis and the indicator match a fresh mount of the remaining items.
