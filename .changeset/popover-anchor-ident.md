---
"@vuetify/v0": patch
---

fix(usePopover): coerce the synthesized `anchor-name` / `position-anchor` custom-ident to a valid charset

A consumer-supplied `id` (or activator `target` / content `_id`) containing non-ident characters produced an invalid `--${id}` custom-property name. The browser rejects it on the client (`style.setProperty` drops the whole inline value), so anchor positioning silently broke. The interpolated identifier is now coerced to `[a-zA-Z0-9_-]`, mirroring the `SAFE_IDENT` guard `ThemeAdapter` already applies. The raw `id` is still used verbatim for the DOM element id and the `popovertarget` linkage — only the CSS custom-ident is coerced, so the native popover wiring is unchanged.
