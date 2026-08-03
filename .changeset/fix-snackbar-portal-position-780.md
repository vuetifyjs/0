---
'@vuetify/v0': patch
---

fix(Snackbar): stop inline position:relative from overriding portal positioning (#781)

Your positioning classes on `Snackbar.Portal` (`absolute`, `fixed`, …) work again — the slot style now carries only `zIndex`. A wrapper that is still `position: static` after mount gets `position: relative` applied automatically, so the stacking-context guarantee from #602 is preserved. In renderless mode, make sure the wrapper you render is positioned for the z-index to take effect.
