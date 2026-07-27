---
"@vuetify/v0": minor
---

feat(utilities): add `pxToNumber` for reading CSS lengths off `getComputedStyle`

`pxToNumber(value, fallback?)` parses a resolved CSS length — `'16px'` becomes `16` — and returns `fallback` (default `0`) when the length does not parse, which is what `getComputedStyle` reports for a property that does not apply (`''`, `'auto'`).

Unlike the `Number.parseFloat(value) || 0` idiom it replaces, a length that legitimately resolves to `0` stays `0` instead of collapsing onto the fallback, so a non-zero fallback is usable: `pxToNumber(style.width, rect.width)` falls back to the client rect only when the resolved width really is unreadable.
