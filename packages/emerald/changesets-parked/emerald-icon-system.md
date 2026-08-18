---
'@paper/emerald': minor
---

feat(emerald): add EmIcon and a role-based icon system

Emerald now ships its own icons. `EmIcon` draws a named role — `<EmIcon name="chevron-down" />` — from a set of 48 glyphs covering objects, people, charts, chrome, direction, and marks. Roles are named for what the glyph draws, so a further 24 aliases carry the product vocabulary — `finance` and `payments` both point at `card`, `dashboard` at `layout` — and either name resolves. Sizes map to the `--emerald-icon-*` scale (`s`/`m`/`l`/`xl`), and icons are hidden from assistive tech unless you give them a `label`, which promotes them to a named image.

Icons are their own plugin. `createEmeraldPlugin` installs it for you, so the happy path is unchanged, and roles resolve through v0's `createTokens` — the set is yours to reshape from either entry:

```ts
// composed — the usual way
app.use(createEmeraldPlugin({
  icons: {
    icons: { star: ['M12 2 …'] },      // replace a glyph, or add a new role
    aliases: { expand: 'chevron-down' }, // point a name at an existing one
  },
}))

// or on its own, for icons without Emerald theming
app.use(createEmeraldIconsPlugin({ aliases: { expand: 'chevron-down' } }))
```

Overriding a role at registration updates every alias and every component that draws it, so restyling the system's chrome is a one-line change. `EmIcon` also works with no plugin installed — it falls back to the built-in set.

Pass `{ icons: false }` to skip the install when you provide the registry yourself. It is a registration switch, not a bundle switch: the glyph map ships with the package either way.

Components that previously drew their own artwork now render it through the icon system, so their glyphs follow your overrides: `EmCheckbox` (check and indeterminate marks), `EmExpansionPanelCue`, `EmDialogClose`, `EmSnackbarClose`, and `EmCalendarPrev` / `EmCalendarNext`. Their slots remain overridable and their markup semantics are unchanged.

`EmSelectActivator` now renders its own chevron. Previously the caret was left to the consumer while the styling for it shipped unused, which meant the open-state rotation never ran; existing default-slot content is unaffected and still supplies the label. If you were supplying your own caret in the activator slot, remove it: the activator now draws one.
