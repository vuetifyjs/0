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

Virtualizer imposes no role — pass `role` on Root and Item, and
`aria-posinset` / `aria-setsize` on Item, to match your content (for grids,
`aria-rowcount` on Root and `aria-rowindex` on Item). When a focused row
scrolls out of the window, focus moves to the scroll container instead of
falling to the page. `renderless` is not supported; use `createVirtual`
directly for full control over the markup.
