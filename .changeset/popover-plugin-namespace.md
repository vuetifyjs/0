---
"@vuetify/v0": patch
---

fix(usePopover): name the plugin namespace `v0:popover`

`createPopoverPlugin` now provides at `v0:popover`, matching every other plugin. Compound `Popover.Root` context moved to `v0:popover:root` so the two keys do not collide. If you passed `namespace: 'v0:popover-plugin'` explicitly, drop it or switch to `v0:popover`.
