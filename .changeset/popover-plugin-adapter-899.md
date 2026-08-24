---
'@vuetify/v0': minor
---

feat(usePopover): app-wide positioning-adapter default via createPopoverPlugin

The #846 adapter seam made the positioning engine pluggable, but only
per instance - swapping every popover-derived surface (Popover, Tooltip,
Select, Combobox) onto a JS engine meant passing `adapter` at every call
site. `createPopoverPlugin({ adapter })` now provides the app-wide
default in one line; `usePopover` consults it through optional
injection, so no plugin installed still means `V0PopoverAdapter` and
unchanged zero-config output.

`createTooltipPlugin` also accepts an `adapter`, a tooltip-scoped
override so tooltips can run a different engine or middleware than the
rest of the app's popovers. Precedence, most-specific wins: per-instance
`adapter` -> tooltip plugin `adapter` (tooltip surfaces only) -> popover
plugin `adapter` -> `V0PopoverAdapter`.
