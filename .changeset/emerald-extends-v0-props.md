---
"@paper/emerald": patch
---

fix(emerald): accept rule aliases, schemas, and reactive disabled state

Emerald prop types now extend v0's, so values the runtime always accepted (rule aliases, Standard Schema validators, refs/getters for disabled and readonly) no longer fail typechecking; no prop was added or removed.

`data-disabled`/`data-readonly` on Checkbox, Switch, Radio, Slider, TextField and Textarea now reflect the resolved value when a ref or getter is passed, instead of being permanently set.
