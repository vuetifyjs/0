---
"@vuetify/v0": patch
---

fix(Popover): restore CSS anchoring when Content sets a custom id

A custom Content `id` paired with a matching Activator `target` is the native popover pairing. Positioning now follows that id again instead of the Root-generated one.
