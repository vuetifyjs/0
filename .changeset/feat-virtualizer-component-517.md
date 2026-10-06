---
"@vuetify/v0": minor
---

feat(Virtualizer): add Virtualizer compound component over createVirtual (#788)

Adds `Virtualizer.Root` and `Virtualizer.Item` for rendering large lists. Root
renders a keyboard-focusable scroll container with spacers for off-screen rows
and slots only the visible window (plus `overscan`), typed from `items`. Each
Item measures its own border box, so variable-height rows with padding or
borders need no manual `resize()` call. `@start-reached` / `@end-reached` drive
infinite scroll, and the slot exposes `scrollTo(index, options)` and `reset()`.

Virtualizer imposes no role — pass `role`, `aria-posinset`, and `aria-setsize`
on Root and Item to match your content. `renderless` is not supported; use
`createVirtual` directly for full control over the markup.
