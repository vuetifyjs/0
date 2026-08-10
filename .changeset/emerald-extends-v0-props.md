---
'@paper/emerald': patch
---

fix(EmTextField): accept rule aliases, schemas, and reactive disabled state across the library

Emerald prop types now extend v0's, so values the runtime always accepted (rule aliases, Standard Schema validators, refs/getters for disabled and readonly) no longer fail typechecking; no prop was added or removed.
