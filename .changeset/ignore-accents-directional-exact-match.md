---
"@vuetify/v0": patch
---

fix(findMatchRanges): directional `ignoreAccents` now matches an already-accented spelling verbatim

`ignoreAccents: 'query'` and `'target'` fold only one side of the comparison, so a heavily-accented word like `Kraków` could fail to match its own exact spelling — the query got folded to `Krakow` while the target stayed accented, and the two no longer agreed.

Both modes now also check for a literal, unfolded match, so typing the exact accented text always finds it — without changing what they're for: `'query'` still only folds the query (typing `cafe` won't find `café`) and `'target'` still only folds the text (typing `café` won't find `cafe`), so a different accent on either side (`café` vs `cafè`) still doesn't match.
