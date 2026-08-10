---
'@paper/emerald': minor
---

feat(emerald): add EmIcon and a role-based icon system

Emerald now ships its own icons. `EmIcon` draws a named role — `<EmIcon name="chevron-down" />` — from a set of 49 glyphs covering navigation, domain marks, direction, and controls, plus 4 aliases. Sizes map to the `--emerald-icon-*` scale (`s`/`m`/`l`/`xl`), and icons are hidden from assistive tech unless you give them a `label`, which promotes them to a named image.

Roles resolve through v0's `createTokens`, so the set is yours to reshape from the plugin:

```ts
app.use(createEmeraldPlugin({
  icons: {
    icons: { star: ['M12 2 …'] },      // replace a glyph, or add a new role
    aliases: { expand: 'chevron-down' }, // point a name at an existing one
  },
}))
```

Overriding a role updates every alias and every component that draws it, so restyling the system's chrome is a one-line change. `EmIcon` also works with no plugin installed — it falls back to the built-in set.

Components that previously drew their own artwork now render it through the icon system, so their glyphs follow your overrides: `EmCheckbox` (check and indeterminate marks), `EmExpansionPanelCue`, `EmDialogClose`, `EmSnackbarClose`, and `EmCalendarPrev` / `EmCalendarNext`. Their slots remain overridable and their markup semantics are unchanged.

`EmSelectActivator` now renders its own chevron. Previously the caret was left to the consumer while the styling for it shipped unused, which meant the open-state rotation never ran; existing default-slot content is unaffected and still supplies the label.
