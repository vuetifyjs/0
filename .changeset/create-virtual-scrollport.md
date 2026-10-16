---
"@vuetify/v0": minor
---

feat(createVirtual): keep the window aligned when the scroll parent is not the list

`marker` drops content above the list out of the scroll position. `itemKey` keeps a measured height on the item when the array is prepended, filtered, or reordered. `scrollTo` places the window before it writes the scroll position, retries when the browser clamps that write, and runs a call made before the scroll element exists. Pass `ownElement: false` to leave an externally owned scroll element unstyled.
