---
"@vuetify/v0": patch
---

fix(Tooltip): expose anchor styles on Tooltip.Activator's renderless slot

`Tooltip.Activator` now surfaces its CSS anchor-positioning styles as a `styles` slot prop (mirroring `Tooltip.Content`). In renderless mode the activator no longer renders its own element, so previously the anchor name was lost and the tooltip content could not position. Consumers can now bind `attrs` and apply `styles` onto their own trigger element — e.g. attaching a tooltip to a native `<button type="submit">` without the activator overriding its `type`.
