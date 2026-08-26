---
'@vuetify/v0': minor
---

feat(usePopover): add createPopoverPlugin and a tooltip adapter default

Set a positioning engine once for the whole app:

`app.use(createPopoverPlugin({ adapter: new FloatingUIPopoverAdapter() }))`

importing the adapter from `@vuetify/v0/popover/adapters/floating-ui`.
Per-instance `adapter` still wins. Tooltips can set their own engine on
`createTooltipPlugin({ adapter })` without leaking it into Popover,
Select, or Combobox. Zero-config is unchanged — no plugin still means
`V0PopoverAdapter` (CSS anchor positioning).
