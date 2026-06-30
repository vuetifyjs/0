---
"@vuetify/v0": patch
---

fix(useTheme): remove the adopted stylesheet on V0 adapter dispose — the browser adapter (`V0StyleSheetThemeAdapter`) appended a `CSSStyleSheet` to `document.adoptedStyleSheets` in `upsert()` but `dispose()` only stopped the Vue watchers, leaking orphaned sheets on repeated mount/unmount (HMR, test suites, micro-frontend teardown). Dispose now filters the sheet out of `adoptedStyleSheets` and clears the ref across all three dispose paths, mirroring the sibling unhead adapter. Follow-up to the leak-safe adapter lifecycle work.
