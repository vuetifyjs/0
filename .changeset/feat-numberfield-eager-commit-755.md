---
"@vuetify/v0": minor
---

feat(NumberField): add opt-in eager commit via `commitOn: 'input'` (#755)

`NumberField` only wrote the typed value into the model on blur/Enter — any consumer
wanting live feedback per keystroke (previews, running calculations) had no way to get
model updates without bypassing the field's parse/clamp logic entirely.

Added a `commitOn` option (`'change'` default, matching today's behavior; `'input'`
opts in to writing on every keystroke) to `createNumberField` and `NumberField.Root`.
Eager writes go through a new `commitDraft()` on the context, which parses but does
**not** clamp or snap — clamping mid-type would jump a value like `1` to `min` before
the user finishes typing `15`. Clamping/snapping still happens on the next `commit()`
(blur/Enter), unchanged.

Also fixes a real bug found while adding coverage for the above: `NumberFieldRoot`'s
`clamp` prop is optional and boolean-typed with no explicit default, so when unset,
Vue's boolean-prop casting resolved it to `false` rather than `undefined` — silently
disabling the documented default-`true` clamping behavior for every consumer who
didn't explicitly pass `clamp={true}`. A component-level default now matches the
composable's own `clamp: shouldClamp = true` default.
