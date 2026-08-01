---
"@vuetify/v0": patch
---

fix(useBreakpoints): resolve the initial breakpoint via matchMedia, not innerWidth (#730)

`createBreakpoints`'s initial state was resolved by comparing `window.innerWidth` against
the breakpoint thresholds, while `update()` resolved the same state through `matchMedia`.
At non-100% zoom or with a non-overlay scrollbar the two can disagree, so a direct
`createBreakpoints()` consumer (e.g. Vuetify's `display` composable outside SSR mode)
could render one breakpoint band on first paint and silently flip to another on the
first resize event, with no real viewport change in between.

`createBreakpoints()` now runs `update()` once synchronously when `IN_BROWSER && !ssr`,
so the initial band is resolved the same way as every subsequent one. The SSR path is
unchanged and still seeds from `ssr.clientWidth` to keep hydration markup matching.
