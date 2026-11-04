# BNavOverflow

Matches the pinned `.nav-overflow` examples, with these deltas:

- No `data-bs-toggle="nav-overflow"`. Measurement is `createOverflow`.
- `.nav-overflow-initialized` is set after the first measure. The pin hides `.nav` until that class is present.
- Items are slotted (`BNavOverflow.Item`). There is no `items` array.
- `.nav-overflow-keep` (or the `keep` prop) is not measured as collapsible and stays in the row. Its width is reserved.
- The More control is not in the static docs markup. It is inserted only when the row overflows: `button.nav-link` + `span.nav-overflow-text` + `div.menu`.
- The menu is not `BMenu`. That trigger is forced to `btn-solid theme-primary`. This one uses `usePopover` and does not set the native `popover` attribute, same as `BMenu`, so `.menu` can position itself.
- Overflowed links are copied into the menu as `menu-item` (the `nav-link` class stays on the hidden row copy). A `nav-link` that is a direct child of `.menu.show` matches `.nav-pills .show > .nav-link` and paints as the active pill.
- `data-bs-placement="bottom-start"` is the menu stylesheet hook, not a behavior attribute.
