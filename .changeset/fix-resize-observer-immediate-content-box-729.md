---
"@vuetify/v0": patch
---

fix(useResizeObserver): report the content box on the immediate entry's contentRect (#729)

The `immediate` option synthesized its first entry from `getBoundingClientRect()`,
which reports the border box in viewport coordinates. Every entry the real observer
delivers afterwards reports the content box, positioned relative to the padding edge —
contradicting `contentRect`'s own documented contract ("always describes the content
box, regardless of the `box` option"). A consumer reading `contentRect` on mount (for
example `useElementSize`, which hardcodes `immediate: true`) could see one set of
numbers on mount and a different set on the first real resize, with no size change in
between.

`measure()` now derives `contentRect` from the same computed-style values it already
uses for `contentBoxSize`/`borderBoxSize`, so the immediate and observed paths agree.
