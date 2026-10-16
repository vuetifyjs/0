---
"@vuetify/v0": minor
---

feat(Virtualizer): add Virtualizer compound component over createVirtual (#788)

Adds `Virtualizer.Root`, `Virtualizer.Item`, and `Virtualizer.Spacer` for
rendering large lists. Root renders a keyboard-focusable scroll container and
slots only the visible window (plus `overscan`), typed from `items`. Place a
`Spacer` before the rows and a `Spacer` with `edge="end"` after them to reserve
the off-screen range; set `as` (for example `li` inside a `ul`) when a `div`
cannot sit there. Each Item measures its own border box, so variable-height
rows with padding or borders need no manual `resize()` call. `@top` / `@bottom`
(with `top-threshold` / `bottom-threshold`) drive infinite scroll.
`scrollTo(index, options)` and `reset()` come from the default slot or a
template ref on Root, which also exposes the container `element` — handy for
scroll controls outside the list or a `useVirtualFocus` cursor.

Virtualizer imposes no role — pass `role` on Root and Item, and
`aria-posinset` / `aria-setsize` on Item, to match your content (for grids,
`aria-rowcount` on Root and `aria-rowindex` on Item). When a focused row
scrolls out of the window, focus moves to the scroll container instead of
falling to the page. `renderless` is not supported; use `createVirtual`
directly for full control over the markup.
