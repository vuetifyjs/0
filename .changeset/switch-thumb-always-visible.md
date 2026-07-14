---
"@vuetify/v0": patch
---

fix(Switch): keep `Switch.Thumb` visible in every state — it no longer forces an inline `visibility: hidden` when the switch is off. The thumb had inherited the "present-when-on" indicator template from `Checkbox`/`Radio`/`Toggle`, but a switch knob is always visible and slides between positions. The inline style also sat at the top of the cascade, forcing consumers to override it with `visibility: visible !important`. Drive the off/on appearance from the `data-state` attribute (`checked` / `unchecked` / `indeterminate`) — e.g. `translate-x-1 data-[state=checked]:translate-x-6` — which now animates directly from the off position. `Switch.Thumb`'s slot `attrs` no longer includes a `style` key.
