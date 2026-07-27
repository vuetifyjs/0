---
"@vuetify/v0": patch
---

fix(Breadcrumbs): collapsed crumbs no longer strand focusable links in the accessibility tree, and the ellipsis can opt into a disclosure toggle (#614)

Truncated crumbs are now marked `inert` rather than relying on `display: none` alone. Renderless consumers who bind `attrs` onto their own markup were shipping links that assistive technology could not see but the keyboard could still reach.

`Breadcrumbs.Ellipsis` accepts a new `interactive` prop that renders a nested disclosure button revealing the collapsed crumbs, with `aria-expanded`, a count-aware label, and a `data-state` hook for styling. The button is nested inside the list item rather than applied to it, so the trail keeps a valid list structure. Disclosure state is readable and controllable as `v-model:expanded` on `Breadcrumbs.Root`.

The default is unchanged — without `interactive` the ellipsis stays hidden from assistive technology, so opt in where the collapsed levels matter.
