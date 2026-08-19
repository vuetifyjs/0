---
"@vuetify/v0": minor
---

feat(toHighlight): add `ignoreAccents` so a plain query matches accented text

`toHighlight(text, query, { ignoreCase: true, ignoreAccents: true })` folds diacritics before matching and maps the ranges back onto the source, so `zurich` highlights *Zürich* with its umlaut intact. It is directional — `'target'` folds only the text, `'query'` only the search term, `true` both sides — and covers common letters NFD leaves alone (`ł`, `ø`, `ß`, `æ`, …).

With `ignoreCase`, Greek final sigma folds to `σ` so `ΣΟΦΟΣ` and `σοφος` match each other.

The matcher behind it ships as `findMatchRanges(text, query, { ignoreCase, ignoreAccents, matchAll })` for filters that need the same ranges without the chunking.
