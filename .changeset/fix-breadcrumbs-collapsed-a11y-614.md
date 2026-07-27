---
"@vuetify/v0": patch
---

fix(Breadcrumbs): collapsed crumbs no longer strand focusable links in the accessibility tree, and the ellipsis can opt into a disclosure toggle (#614)

Truncated crumbs are now marked `inert` rather than relying on `display: none` alone. Renderless consumers who bind `attrs` onto their own markup were shipping links that assistive technology could not see but the keyboard could still reach.

A new `Breadcrumbs.Activator` reveals the collapsed crumbs. Place one inside `Breadcrumbs.Ellipsis` and the ellipsis becomes a disclosure — the ellipsis stays the list item and the Activator is the control, so the trail keeps a valid list structure. It ships `aria-expanded`, a count-aware label, and a `data-state` hook for styling.

The default is unchanged — an ellipsis with no Activator stays hidden from assistive technology, so opt in where the collapsed levels matter.
