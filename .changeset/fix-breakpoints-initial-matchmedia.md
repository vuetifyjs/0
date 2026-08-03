---
"@vuetify/v0": patch
---

fix(useBreakpoints): resolve initial state through matchMedia like update() (#730)

`createBreakpoints()` previously derived its initial breakpoint name, band flags, and `isMobile` from an `innerWidth` comparison, while `update()` used `matchMedia`. At fractional zoom or with classic scrollbars the two can disagree, so bare `createBreakpoints()` consumers could get a wrong first paint that silently flipped band on the first resize. Initial state now resolves through the same matchMedia-based logic as `update()`. SSR and no-matchMedia environments keep the width-comparison fallback.
