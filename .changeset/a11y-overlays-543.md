---
'@vuetify/v0': patch
---

fix(Avatar,Scrim,Popover,Tooltip,Select,Toggle): restore dropped alt text and complete missing ARIA wiring (#543)

- `Avatar.Image` now accepts an `alt` prop and passes consumer attributes (`alt`, `aria-label`, ...) through to the rendered element — previously they were silently dropped
- `Scrim` backdrops are hidden from assistive technology with `aria-hidden="true"`
- `Popover.Activator` explicitly exposes `aria-expanded` and `aria-controls` instead of relying on inconsistent native `popovertarget` mapping
- `Tooltip.Content` closes on Escape when focus is inside interactive tooltip content
- `Select.Activator` reflects the disabled state (`aria-disabled` + native `disabled`) and stays keyboard-focusable when rendered as a non-button element; `Select.Content` names its listbox via `aria-labelledby`
- `Toggle.Group` gains `label`, `ariaLabelledby`, and `ariaDescribedby` props so the group can be named
