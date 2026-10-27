# @vuetify/v0

## 1.3.1

### Patch Changes

- [#1106](https://github.com/vuetifyjs/0/pull/1106) [`d6e34fd`](https://github.com/vuetifyjs/0/commit/d6e34fdb4cbf4be72181dbec6a709a7caf56491b) Thanks [@johnleider](https://github.com/johnleider)! - fix(components): treat bare boolean attributes like `<Menu.Item disabled>` as `true` on the `disabled`, `readonly`, and `indeterminate` props that also accept refs and getters. Previously they arrived as `''` and the component stayed enabled.

- [#1095](https://github.com/vuetifyjs/0/pull/1095) [`adf806d`](https://github.com/vuetifyjs/0/commit/adf806d705939cc9aecdae42273eb710fbc11bb2) Thanks [@johnleider](https://github.com/johnleider)! - fix(utilities): stop pulling Vue's Vapor runtime into apps that do not use Vapor

- [#1105](https://github.com/vuetifyjs/0/pull/1105) [`c741cef`](https://github.com/vuetifyjs/0/commit/c741cef0df94770d389a405b9da4f087fc03c319) Thanks [@johnleider](https://github.com/johnleider)! - fix(Tabs): reverse Arrow Left/Right for horizontal tabs and carousel indicators in right-to-left layouts

  Under `dir="rtl"` on the document or an ancestor, Arrow Right now moves to the previous tab or indicator dot and Arrow Left to the next, matching the visual order. Vertical orientation is unchanged.

- [#1104](https://github.com/vuetifyjs/0/pull/1104) [`8602c04`](https://github.com/vuetifyjs/0/commit/8602c04be761638f62c06487a4ea406e28841cf4) Thanks [@johnleider](https://github.com/johnleider)! - fix(toElement): resolve a component with a fragment root (several root nodes, or leading text or comments) to its first root Element instead of returning a text anchor, and return `undefined` for comment or text roots

## 1.3.0

### Minor Changes

- [#383](https://github.com/vuetifyjs/0/pull/383) [`ff80dd2`](https://github.com/vuetifyjs/0/commit/ff80dd2d5ae05e9b3c3452c2ee4c4ff6a4c77d4c) Thanks [@johnleider](https://github.com/johnleider)! - feat(createCombobox): commit free-text values in non-strict mode

  A non-strict combobox (the default) now accepts typed text that matches no registered option. Confirming with **Enter**, **Tab**, click-outside, or blur mints a ticket for the typed value, selects it, and emits it through `v-model`; `strict` keeps the constrained behaviour and discards unmatched text on confirm. Adds a `commit()` action to the combobox context. **Escape** still cancels. Virtual focus reads the option element from the registered ticket (`el`), not `document.querySelector`.

- [#948](https://github.com/vuetifyjs/0/pull/948) [`0184058`](https://github.com/vuetifyjs/0/commit/018405893e702bba2eb6d30e390b2008ee49506a) Thanks [@johnleider](https://github.com/johnleider)! - feat(createPlugin): opt plugins into Vue DevTools with `devtools: true`

  Inspector snapshots unwrap refs and class getters. Logger and storage supply an `inspect` hook so method-only contexts still show state. Storage gains `keys()`.

- [#178](https://github.com/vuetifyjs/0/pull/178) [`8302695`](https://github.com/vuetifyjs/0/commit/830269534d890fb56d05e10fcec27bbe91063235) Thanks [@johnleider](https://github.com/johnleider)! - feat(Tour): add createTour and Tour compound for guided walkthroughs

  Headless step sequencer with activator targeting, form-gated next, and enter/leave/completed handlers. The Tour compound adds highlight, anchored content, and keyboard chrome on top. createTourPlugin provides one app-level tour. The app owns the catalog and loads one tour at a time.

- [#1046](https://github.com/vuetifyjs/0/pull/1046) [`1a5cbce`](https://github.com/vuetifyjs/0/commit/1a5cbce149ca1b08301ce3f76b8783af70c8c106) Thanks [@johnleider](https://github.com/johnleider)! - feat(createVirtual): keep the window aligned when the scroll parent is not the list

  `marker` drops content above the list out of the scroll position. `itemKey` keeps a measured height on the item when the array is prepended, filtered, or reordered. `scrollTo` places the window before it writes the scroll position, retries when the browser clamps that write, and runs a call made before the scroll element exists. Pass `ownElement: false` to leave an externally owned scroll element unstyled.

- [#961](https://github.com/vuetifyjs/0/pull/961) [`3b3734e`](https://github.com/vuetifyjs/0/commit/3b3734e3572d24bfcdc5d45af9358254b5574f80) Thanks [@johnleider](https://github.com/johnleider)! - feat(Dialog): opt a dialog out of the global Scrim with `scrim`

  `Dialog.Content` and `AlertDialog.Content` accept `scrim` (default `true`). Pass `false` when you own the backdrop so an app-level `<Scrim>` does not double-dim the overlay.

- [#1012](https://github.com/vuetifyjs/0/pull/1012) [`bec776d`](https://github.com/vuetifyjs/0/commit/bec776dee57cbb0812278b6c9cd5e5953942c2b2) Thanks [@johnleider](https://github.com/johnleider)! - feat(Kanban): add Kanban compound component over createKanban ([#1012](https://github.com/vuetifyjs/0/issues/1012))

  Adds `Kanban.Root`, `Kanban.Column`, `Kanban.List`, `Kanban.Item`,
  `Kanban.Instructions`, and `Kanban.LiveRegion` for boards of movable items in
  columns. Each Column binds its item array with `v-model`; a drop writes the new
  order back and Root emits `move` once with `{ value, from, to, fromIndex, toIndex }`.
  Items move by pointer drag or by keyboard: Space / Enter picks up, arrow keys
  and Home / End move a previewed drop target (RTL-aware, skipping columns that
  are disabled or whose `accept` refuses the item), Space / Enter drops, and
  Escape cancels without touching the board. The pending target is exposed as
  `data-target` on the column and list and `data-drop="before" | "after"` on the
  neighbouring item; every step is announced through the live region. Columns
  gate incoming moves with `accept(value, from, index)` and freeze with
  `disabled`.

- [#787](https://github.com/vuetifyjs/0/pull/787) [`18eb798`](https://github.com/vuetifyjs/0/commit/18eb7981f29613afebb968573abc8556abceabee) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(Otp): add Otp compound component over createOtp ([#519](https://github.com/vuetifyjs/0/issues/519))

  Adds `Otp.Root`, `Otp.Item`, and `Otp.HiddenInput` for one-time-password /
  verification-code entry. Root bridges v-model, exposes a `role="group"` with a
  locale-driven default accessible name, and auto-renders a hidden input when
  `name` is set. Each Item is a single character box (`autocomplete="one-time-code"`)
  that auto-advances on input, moves back on Backspace of an empty box, supports
  arrow-key movement, and distributes pasted or autofilled text across boxes.
  `@complete` fires when the code fills. Reject-and-retry lives on `createOtp`'s
  `onComplete` option.
  Root slots an `items` array derived from `length` (same pattern as Rating) so
  boxes are iterated once instead of repeating the count in `v-for`.

- [#788](https://github.com/vuetifyjs/0/pull/788) [`f990bbb`](https://github.com/vuetifyjs/0/commit/f990bbbb14e3b87122f77be021cac400e55704cb) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(Virtualizer): add Virtualizer compound component over createVirtual ([#788](https://github.com/vuetifyjs/0/issues/788))

  Adds `Virtualizer.Root`, `Virtualizer.Item`, and `Virtualizer.Spacer` for
  rendering large lists. Root renders a keyboard-focusable scroll container and
  slots only the visible window (plus `overscan`), typed from `items`. Place a
  `Spacer` before the rows and a `Spacer` with `edge="end"` after them to reserve
  the off-screen range; set `as` (for example `li` inside a `ul`) when a `div`
  cannot sit there. Each Item measures its own border box, so variable-height
  rows with padding or borders need no manual `resize()` call. `@top` / `@bottom`
  (with `top-threshold` / `bottom-threshold`) drive infinite scroll.
  `scrollTo(index, options)` and `reset()` come from the default slot or a
  template ref on Root, which also exposes the container `element` — handy for
  scroll controls outside the list or a `useVirtualFocus` cursor.

  Virtualizer imposes no role — pass `role` on Root and Item, and
  `aria-posinset` / `aria-setsize` on Item, to match your content (for grids,
  `aria-rowcount` on Root and `aria-rowindex` on Item). When a focused row
  scrolls out of the window, focus moves to the scroll container instead of
  falling to the page. `renderless` is not supported; use `createVirtual`
  directly for full control over the markup.

- [#935](https://github.com/vuetifyjs/0/pull/935) [`8670f30`](https://github.com/vuetifyjs/0/commit/8670f30730b9a4404e2fe5430e8e530767178a14) Thanks [@johnleider](https://github.com/johnleider)! - feat(forms): expose AtomExpose on control roots and focus() on groups

  `Checkbox.Root`, `Radio.Root`, `Switch.Root`, `Toggle.Root`, and `Button.Root` now expose the rendered host via `AtomExpose.element`, so a template ref can call `.focus()`. `Radio.Group`, `Checkbox.Group`, `Switch.Group`, `Toggle.Group`, and `Button.Group` expose `focus(options?: FocusOptions)` which focuses the selected item, or the first if none is selected.

- [#1037](https://github.com/vuetifyjs/0/pull/1037) [`edf2af9`](https://github.com/vuetifyjs/0/commit/edf2af977bcc852f52f0084268421048b74c9e09) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(Input): export parseValidateOn from the Input barrel

  `parseValidateOn` and its `ParsedValidateOn` return type are now public, so wrappers that re-implement the `validateOn` surface can reuse the parser instead of copying it. NumberField and `@paper/bulma` now use the shared parser.

- [#1038](https://github.com/vuetifyjs/0/pull/1038) [`0621413`](https://github.com/vuetifyjs/0/commit/06214134009198669346b5ad16f127d3c73fe25d) Thanks [@johnleider](https://github.com/johnleider)! - feat(Menu): add a headless menu for a button, a right-click, or a menubar, including submenus

- [#1040](https://github.com/vuetifyjs/0/pull/1040) [`4047a65`](https://github.com/vuetifyjs/0/commit/4047a65d354f9e11e93584194d8009d1ce343509) Thanks [@johnleider](https://github.com/johnleider)! - feat(Pagination): fit uneven buttons to the container and grow when it widens

  Page buttons can have different widths. The row shrinks when the rendered buttons overflow and grows back when the container widens or the current page is shorter. `createOverflow` accepts `probe: true` when the count that fits is not mounted yet. Render `capacity`, measure that row, and call `settle()`.

- [#1055](https://github.com/vuetifyjs/0/pull/1055) [`1f5719c`](https://github.com/vuetifyjs/0/commit/1f5719ccf8af9bc8cb0c2afd4dc25c63b5ecbb20) Thanks [@johnleider](https://github.com/johnleider)! - feat(Select): name the activator from a visible label

  `Select.Activator` accepts `ariaLabelledby` and renders it as `aria-labelledby`. Pass the id of an existing label element when the control's text is the selected value. If `label` and `ariaLabelledby` are both set, `aria-labelledby` is used and `aria-label` is omitted.

- [#1058](https://github.com/vuetifyjs/0/pull/1058) [`2f59b6b`](https://github.com/vuetifyjs/0/commit/2f59b6be45ace1dc7f1551fdbd5144526be6eaf4) Thanks [@johnleider](https://github.com/johnleider)! - feat(Select): select an option by typing its text

  Printable characters match option text. Characters typed within one second accumulate, and a repeated letter cycles. A single select updates the value and leaves the list open or closed as it was. The matcher is `useTypeahead`.

- [#939](https://github.com/vuetifyjs/0/pull/939) [`3cf3360`](https://github.com/vuetifyjs/0/commit/3cf3360603d4c30fef16da5fc00527c51e08d35e) Thanks [@Haviles04](https://github.com/Haviles04)! - feat(useFocusTrap): confine Tab and Shift+Tab to a root element

  A `<dialog>` opened with `showModal()` is trapped by the browser. Anything else — a `Dialog.Content` rendered `as="div"`, a drawer, a command palette — had to hand-roll containment. `useFocusTrap` is that loop, once:

  ```ts
  const panel = useTemplateRef<HTMLElement>("panel");

  useFocusTrap(panel, { active: isOpen });
  ```

  Tab and Shift+Tab wrap at the first and last tabbable descendant, focus moves into the root on activate, and the previously focused element gets it back on deactivate. Pass `initial` to choose where focus lands (or `false` to skip autofocus), `restore: false` to leave focus alone on release, and `onEscape` to opt into Escape handling — the trap never closes anything itself. Nested traps: the last connected trap owns Tab; the last connected trap that has `onEscape` owns Escape.

  The boundary is computed the way the browser computes tab order, not by element identity: a radio group counts as one stop (the checked member if it is otherwise tabbable, otherwise the first otherwise-tabbable member), and focus parked on a script-focusable `tabindex="-1"` descendant past the last stop still wraps rather than walking out. `aria-disabled` controls stay in the tab order per APG, so they remain real boundaries.

  The keydown listener is bound to `document` in the capture phase rather than to the root, so focus that escaped the subtree — a backdrop click that blurred to `<body>`, a stray programmatic `focus()` — is recovered on the next Tab instead of leaving the trap permanently dead. Only the boundaries are intercepted, so a nested widget keeps its own Tab handling. Containment pierces open shadow roots; discovery does not, which is documented along with the `<iframe>` limitation.

  Give the root `tabindex="-1"` if it can ever hold zero tabbable descendants — the trap focuses the root as a fallback, and v0 does not write attributes onto elements it did not render.

### Patch Changes

- [#1056](https://github.com/vuetifyjs/0/pull/1056) [`ede941e`](https://github.com/vuetifyjs/0/commit/ede941eb9fbb91228838a2b539cc1ad3fefd585d) Thanks [@johnleider](https://github.com/johnleider)! - fix(Menu): a repeated typeahead letter still accepts the next character

  Repeating a letter moves to the next match. A different letter before the pause searches from that one letter.

  A click listener on a menu item runs before the item's own action, including when the item is disabled.

- [#1011](https://github.com/vuetifyjs/0/pull/1011) [`09e971d`](https://github.com/vuetifyjs/0/commit/09e971d4a017ecacd3eeed3b67c79a29ad4da7df) Thanks [@johnleider](https://github.com/johnleider)! - fix(Otp): accept a full autofilled one-time code ([#1011](https://github.com/vuetifyjs/0/issues/1011))

  A code the browser inserts in one edit (SMS autofill, a password manager) fills every box. Dropping text onto a filled box replaces from that box instead of shifting the digits already there.

- [#948](https://github.com/vuetifyjs/0/pull/948) [`0184058`](https://github.com/vuetifyjs/0/commit/018405893e702bba2eb6d30e390b2008ee49506a) Thanks [@johnleider](https://github.com/johnleider)! - fix(components): declare missing update:model-value emits so Vue DevTools can track Root v-models

## 1.2.4

### Patch Changes

- [#1052](https://github.com/vuetifyjs/0/pull/1052) [`8a29058`](https://github.com/vuetifyjs/0/commit/8a290585b4f4f77f386cd8ecaff277ecc9c3f071) Thanks [@johnleider](https://github.com/johnleider)! - fix(AlertDialog): clear the cancel element before the dialog unmounts

- [#1053](https://github.com/vuetifyjs/0/pull/1053) [`70103dd`](https://github.com/vuetifyjs/0/commit/70103dd083ff400691652bda92f34855f739d30e) Thanks [@johnleider](https://github.com/johnleider)! - fix(createFilter): a plain list filters with less repeated work per search

  The default matcher prepares the query once per pass. Which edits re-run the filter is unchanged. A deep `ref` still tracks every field, so a large list should be a `shallowRef` or a plain array.

- [#1043](https://github.com/vuetifyjs/0/pull/1043) [`2a6e016`](https://github.com/vuetifyjs/0/commit/2a6e0168872f2883ba8f6b46737736bd943b4d64) Thanks [@araishi](https://github.com/araishi)! - fix: smaller Vite 8 bundles when only part of v0 is used ([#1043](https://github.com/vuetifyjs/0/issues/1043))

  A Vite 8 production build no longer pulls unused v0 contexts into the bundle. In an app that uses Vuetify's `VSelect`, `VAutocomplete`, `VCombobox` or `VDataTable`, this saves about 23 kB of gzipped JS on Vue 3.5 and about 73 kB on Vue 3.6, independent of app size.

- [#1026](https://github.com/vuetifyjs/0/pull/1026) [`c9e9fa4`](https://github.com/vuetifyjs/0/commit/c9e9fa439a44c32b0d4aa5a001305969526c741a) Thanks [@johnleider](https://github.com/johnleider)! - fix(useResizeObserver): entries always include `borderBoxSize` and `contentBoxSize` ([#1026](https://github.com/vuetifyjs/0/issues/1026))

  Browsers that omit them from native entries (Safari < 15.4, Chrome < 84) previously passed `undefined` through despite the types; they are now measured from the element's computed style.

- [#1026](https://github.com/vuetifyjs/0/pull/1026) [`c9e9fa4`](https://github.com/vuetifyjs/0/commit/c9e9fa439a44c32b0d4aa5a001305969526c741a) Thanks [@johnleider](https://github.com/johnleider)! - fix(createVirtual): reverse lists start at the bottom, and edge callbacks stop after unmount ([#1026](https://github.com/vuetifyjs/0/issues/1026))

  With `direction: 'reverse'`, the list now opens scrolled to its last item in the browser instead of at the top, including when the first items load after mount or the scroll element is remounted. A `scrollTo()` made right after mount takes precedence over that initial pin. A scroll in flight when the list unmounts no longer calls `onStartReached` or `onEndReached`.

## 1.2.3

### Patch Changes

- [#1003](https://github.com/vuetifyjs/0/pull/1003) [`6426af3`](https://github.com/vuetifyjs/0/commit/6426af360bb47b3c9d8d513a0eae86d8bb05c629) Thanks [@johnleider](https://github.com/johnleider)! - fix(useBreakpoints): breakpoint flags follow the matched name

  `sm` is the `sm` threshold, including when a custom map is not in ascending order. `name` and the boolean flags stay in agreement. Default thresholds are unchanged.

- [#1004](https://github.com/vuetifyjs/0/pull/1004) [`675e097`](https://github.com/vuetifyjs/0/commit/675e09776bb003a9c8b1424ce6b786d908ac6279) Thanks [@johnleider](https://github.com/johnleider)! - fix(useBreakpoints): resize updates run without the plugin

  `createBreakpoints()` follows viewport changes on its own. With `ssr` set, that listener waits for the first `update()`, so the server width stays in place until hydration. The plugin still calls `update()` once after mount in that case.

- [#1001](https://github.com/vuetifyjs/0/pull/1001) [`bbc0ac0`](https://github.com/vuetifyjs/0/commit/bbc0ac024a46900d67e87fc33a981c080372a053) Thanks [@johnleider](https://github.com/johnleider)! - useStorage no longer throws when the browser refuses localStorage; it falls back to memory and reads tolerate a throwing adapter.

## 1.2.2

### Patch Changes

- [#982](https://github.com/vuetifyjs/0/pull/982) [`09a62d7`](https://github.com/vuetifyjs/0/commit/09a62d7ecba84e0f6a8c02f59cb05fc7ac7b65f6) Thanks [@johnleider](https://github.com/johnleider)! - fix(createFilter): track reactive `keys`

  `keys` now accepts a ref or getter (`MaybeRefOrGetter<readonly string[]>`), so changing which fields are searched re-runs the filter. Passing a plain `string[]` is unchanged.

- [#982](https://github.com/vuetifyjs/0/pull/982) [`09a62d7`](https://github.com/vuetifyjs/0/commit/09a62d7ecba84e0f6a8c02f59cb05fc7ac7b65f6) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): stop emitting element-level color on `[data-theme]`

  `ThemeAdapter.generate()` still writes custom properties and `:root { color-scheme }`. It no longer sets `color: var(--*-on-background)` on the theme selector — applying tokens is Paper's job. Unstyled hosts that relied on that inherited `color` need to set it themselves.

- [#985](https://github.com/vuetifyjs/0/pull/985) [`8396668`](https://github.com/vuetifyjs/0/commit/839666876b63106567ae01ae2b8b8a88970b8eb5) Thanks [@johnleider](https://github.com/johnleider)! - fix(Toggle): emit native `disabled` on the default button host

  Disabled `Toggle.Root` now sets the HTML `disabled` attribute when `as` is `"button"` (the default) and omits `aria-disabled` on that path. Non-button hosts still get `aria-disabled`.

## 1.2.1

### Patch Changes

- [#959](https://github.com/vuetifyjs/0/pull/959) [`ac90199`](https://github.com/vuetifyjs/0/commit/ac90199f51f30b0b2cc95c46016598278ac18c26) Thanks [@johnleider](https://github.com/johnleider)! - fix(Breadcrumbs): keep every crumb visible when Ellipsis is omitted ([#911](https://github.com/vuetifyjs/0/issues/911))

  Truncation only runs when `Breadcrumbs.Ellipsis` is composed.

- [#933](https://github.com/vuetifyjs/0/pull/933) [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8) Thanks [@johnleider](https://github.com/johnleider)! - fix(createDataTable): honor the factory `locale` option when a locale plugin is installed

- [#933](https://github.com/vuetifyjs/0/pull/933) [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8) Thanks [@johnleider](https://github.com/johnleider)! - fix(DataGrid): keep column resize working after hide()

  `hide()` leaves columns mounted; resize now matches Splitter panel count, not visible-only columns.

- [#953](https://github.com/vuetifyjs/0/pull/953) [`897cdcf`](https://github.com/vuetifyjs/0/commit/897cdcf0f5d6683f282261c378d84e1550df191c) Thanks [@johnleider](https://github.com/johnleider)! - fix(createValidation): fail unknown rule aliases; join Form via formNamespace

  Unresolved alias strings no longer pass validation. Fields join a Form through `formNamespace` (default `'v0:form'`), matching `groupNamespace` — a custom Form `namespace` only collects children that set the same key.

- [#954](https://github.com/vuetifyjs/0/pull/954) [`2e0025c`](https://github.com/vuetifyjs/0/commit/2e0025cde4d5bcda140834628883fa8a8dff42ba) Thanks [@johnleider](https://github.com/johnleider)! - fix(Input): required fields fail Form submit under novalidate

  `required` on Input and NumberField now registers a presence rule, so empty required fields fail `submit()` even though Form defaults to `novalidate`.

- [#944](https://github.com/vuetifyjs/0/pull/944) [`6ec1732`](https://github.com/vuetifyjs/0/commit/6ec173270d312591f966e32ede760531a1d18e24) Thanks [@J-Sek](https://github.com/J-Sek)! - fix(findMatchRanges): directional `ignoreAccents` now matches an already-accented spelling verbatim

  `ignoreAccents: 'query'` and `'target'` fold only one side of the comparison, so a heavily-accented word like `Kraków` could fail to match its own exact spelling — the query got folded to `Krakow` while the target stayed accented, and the two no longer agreed.

  Both modes now also check for a literal, unfolded match, so typing the exact accented text always finds it — without changing what they're for: `'query'` still only folds the query (typing `cafe` won't find `café`) and `'target'` still only folds the text (typing `café` won't find `cafe`), so a different accent on either side (`café` vs `cafè`) still doesn't match.

- [#957](https://github.com/vuetifyjs/0/pull/957) [`c9575fd`](https://github.com/vuetifyjs/0/commit/c9575fd4c5be46333b010e022f6f00de240a3459) Thanks [@johnleider](https://github.com/johnleider)! - fix(InputControl): keep wrapper attrs when Root leaves them unset

  Wrappers can set a control attr the ambient Input.Root left unset (`readonly`, `disabled`, `required`, `name`, `form`). Root-set values still win.

- [#938](https://github.com/vuetifyjs/0/pull/938) [`9f8eb78`](https://github.com/vuetifyjs/0/commit/9f8eb78d500e2a6f064a32422586cc5483b61c0d) Thanks [@johnleider](https://github.com/johnleider)! - fix(Popover): restore CSS anchoring when Content sets a custom id

  A custom Content `id` paired with a matching Activator `target` is the native popover pairing. Positioning now follows that id again instead of the Root-generated one.

- [#947](https://github.com/vuetifyjs/0/pull/947) [`1b6bb65`](https://github.com/vuetifyjs/0/commit/1b6bb65d01c61bb9e025e1ada9d50b634047b0b7) Thanks [@johnleider](https://github.com/johnleider)! - fix(usePopover): name the plugin namespace `v0:popover`

  `createPopoverPlugin` now provides at `v0:popover`, matching every other plugin. Compound `Popover.Root` context moved to `v0:popover:root` so the two keys do not collide. If you passed `namespace: 'v0:popover-plugin'` explicitly, drop it or switch to `v0:popover`.

- [#933](https://github.com/vuetifyjs/0/pull/933) [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8) Thanks [@johnleider](https://github.com/johnleider)! - fix(Progress): emit a number when filling after an indeterminate start

  An unbound Progress that later received a fill value used to write `[n]` because scalar-vs-array was frozen at setup. Fill also omits inline width while indeterminate so CSS animations can run.

- [#951](https://github.com/vuetifyjs/0/pull/951) [`8155332`](https://github.com/vuetifyjs/0/commit/81553324651e93150ad9f61236d465fade96bd5b) Thanks [@johnleider](https://github.com/johnleider)! - fix(selection): make ticket.unregister() clear selection and tree state

  `ticket.unregister()` now drops the id from selection, mixed, and nested maps — the same cleanup `unregister(id)` already did. `clear()` / `dispose()` on a group or tree wipe mixed and open state too. Stepping after an earlier item unmounts, Progress percent after a segment unmounts, and mandatory `unselectAll` on a tree no longer leave ghost ids or re-select a disabled node.

- [#958](https://github.com/vuetifyjs/0/pull/958) [`2bfaf60`](https://github.com/vuetifyjs/0/commit/2bfaf6049a3c9c7504ed12c898f38af67df4d850) Thanks [@johnleider](https://github.com/johnleider)! - fix(TabsItem): let renderless items supply a focus target

  Pass `el` to `Tabs.Item` when `as` is `null` so arrow keys move focus to the real control.

## 1.2.0

DataTable, DataGrid, and Alert ship in this minor, not 1.1.0. 1.1.0 went out earlier with Splitter pending-intent and `@vuetify/play` after those `feat`s landed on `master`.

### Minor Changes

- [#826](https://github.com/vuetifyjs/0/pull/826) [`bcc509c`](https://github.com/vuetifyjs/0/commit/bcc509c909404443dfff098ef0b0bc73e206da93) Thanks [@johnleider](https://github.com/johnleider)! - feat(DataGrid): headless compound with column layout, editing, and spanning

  Adds `DataGrid` compound component providing structural shells for building data grids:

  - `DataGrid.Root` — context provider wrapping `createDataGrid`. Columns and rows register on mount.
  - `DataGrid.Table` — semantic `<table>` with `role="table"` (not an APG Grid widget)
  - `DataGrid.Header` / `DataGrid.Body` — section containers; `role="rowgroup"` only when `as` is not the native `thead`/`tbody`
  - `DataGrid.Row` — row container with optional `id`/`value` for registration, selection, and expansion
  - `DataGrid.Column` — header cell with sorting state, `aria-sort`, and layout (pin/size)
  - `DataGrid.Cell` — data cell with `role="cell"`, editing state, and row spanning
  - `DataGrid.Empty` — empty-state row; slot `columnCount` for Cell colspan
  - `DataGrid.Handle` — column resize handle (Splitter.Handle) for use inside a resizable row on the `as="div"` chain

  Context injection via `useDataGridRoot` / `provideDataGridRoot` and `useDataGridRow` / `provideDataGridRow`.

- [#825](https://github.com/vuetifyjs/0/pull/825) [`bac9bdb`](https://github.com/vuetifyjs/0/commit/bac9bdbca5d61582780f6bf143ddc163dc03c117) Thanks [@johnleider](https://github.com/johnleider)! - feat(DataTable): introduce compound component over createDataTable

  Headless table with semantic markup. Root creates `createDataTable`; Column and Row register when they mount (same lifecycle as Checkbox.Group). `v-for="user in rank(users)"` — `rank` is on the Body slot and orders the source by the pipeline. Row hides off-page rows itself so they stay registered.

  - **DataTable.Root** — factory + provider; `v-model:search`
  - **DataTable.Table** — `<table>`; `aria-rowcount` only when the page is a subset of total
  - **DataTable.Header** — `<thead>` exposing the 2D header grid
  - **DataTable.Column** — `<th>` with `aria-sort`; `toggle` / `direction` on the slot
  - **DataTable.Body** — `<tbody>`; slot `rank`, `items`, `isEmpty`
  - **DataTable.Row** — `<tr>` for header or body; owns visibility and `aria-rowindex`
  - **DataTable.Cell** — `<td>`
  - **DataTable.Empty** — empty-state row when the page has no items

  Sorting, filtering, pagination, selection, and expansion stay on `createDataTable`. Large lists use `VirtualDataTableAdapter` + `createVirtual`, not this compound.

- [#823](https://github.com/vuetifyjs/0/pull/823) [`afd8718`](https://github.com/vuetifyjs/0/commit/afd8718bef5cd2d4870d653f63840482acdcdfbf) Thanks [@johnleider](https://github.com/johnleider)! - feat(Alert): add `Alert` compound component

  A headless compound component for inline status messages: `Alert.Root` renders a live region that assistive technology announces automatically when content is inserted or updated, `Alert.Title` renders as a `<p>`, and `Alert.Description` renders as a `<p>`. Use `role="alert"` (the default, assertive) for urgent messages that must interrupt the current announcement, or `role="status"` for polite, non-urgent information.

- [#786](https://github.com/vuetifyjs/0/pull/786) [`1d3d810`](https://github.com/vuetifyjs/0/commit/1d3d810341d766c5ecad0e4903b8736abcdc6636) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(NumberField): add opt-in eager commit via `commitOn: 'input'` ([#755](https://github.com/vuetifyjs/0/issues/755))

  `NumberField` only wrote the typed value into the model on blur/Enter — any consumer
  wanting live feedback per keystroke (previews, running calculations) had no way to get
  model updates without bypassing the field's parse/clamp logic entirely.

  Added a `commitOn` option (`'change'` default, matching today's behavior; `'input'`
  opts in to writing on every keystroke) to `createNumberField` and `NumberField.Root`.
  Eager writes go through a new `write()` on the context, which parses but does
  **not** clamp or snap — clamping mid-type would jump a value like `1` to `min` before
  the user finishes typing `15`. Clamping/snapping still happens on the next `commit()`
  (blur/Enter), unchanged.

  Also fixes a real bug found while adding coverage for the above: `NumberFieldRoot`'s
  `clamp` prop is optional and boolean-typed with no explicit default, so when unset,
  Vue's boolean-prop casting resolved it to `false` rather than `undefined` — silently
  disabling the documented default-`true` clamping behavior for every consumer who
  didn't explicitly pass `:clamp="true"`. A component-level default now matches the
  composable's own `clamp: shouldClamp = true` default.

- [#635](https://github.com/vuetifyjs/0/pull/635) [`840d6ea`](https://github.com/vuetifyjs/0/commit/840d6eaa7a578eb895ce8790e45687ac97c341c0) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(Select): add `label` prop to `SelectActivator` ([#635](https://github.com/vuetifyjs/0/issues/635))

  `SelectActivator` had no way to carry an accessible name when the visible label lives in a sibling element. A new `label` prop renders as `aria-label` on the activator (and is exposed through the slot attrs), so screen readers announce the select's purpose without requiring a wired-up `<label>` element.

- [#603](https://github.com/vuetifyjs/0/pull/603) [`be427af`](https://github.com/vuetifyjs/0/commit/be427af15b294fb894f26a426ee1ceb4c5585f51) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(useStack): add app-wide `default` teleport option to `createStackPlugin` ([#603](https://github.com/vuetifyjs/0/issues/603))

  Previously the only way to teleport all Portals to a non-default target was per-component (`<SnackbarPortal to="top-layer" />` on every instance) — there was no single place to configure the fallback for the whole app. `createStackPlugin({ default: 'top-layer' })` now sets that fallback once; `Portal` resolves its target through `to` prop → `stack.default` → `'body'`.

- [#388](https://github.com/vuetifyjs/0/pull/388) [`d2fde78`](https://github.com/vuetifyjs/0/commit/d2fde78dddf57fbaaa5f1a04a5efd51f0ef92be6) Thanks [@johnleider](https://github.com/johnleider)! - feat(useFeatures): add `persist` option to `createFeaturesPlugin`

  Setting `persist: true` saves the user's feature-flag overrides to storage as a delta relative to each flag's registration default (`{ enabled, disabled }`) and reapplies them on load. Flags the user never touched are not stored, so they keep following code and adapter defaults across releases; toggling a flag back to its default drops it from the delta. Overrides for flags that register late (adapters, runtime registrations) apply at registration time, and entries for flags that no longer exist are pruned from the next write. `reset()` restores every flag to its registration default in-session and clears the stored overrides. Backed by the existing `createPluginContext` persist/restore hooks and keyed by the plugin namespace.

- [#862](https://github.com/vuetifyjs/0/pull/862) [`a3d8d1c`](https://github.com/vuetifyjs/0/commit/a3d8d1cb9e2270595054b1fff6bee5db229bc23b) Thanks [@J-Sek](https://github.com/J-Sek)! - feat(toHighlight): add `ignoreAccents` so a plain query matches accented text

  `toHighlight(text, query, { ignoreCase: true, ignoreAccents: true })` folds diacritics before matching and maps the ranges back onto the source, so `zurich` highlights _Zürich_ with its umlaut intact. It is directional — `'target'` folds only the text, `'query'` only the search term, `true` both sides — and covers common letters NFD leaves alone (`ł`, `ø`, `ß`, `æ`, …).

  With `ignoreCase`, Greek final sigma folds to `σ` so `ΣΟΦΟΣ` and `σοφος` match each other.

  The matcher behind it ships as `findMatchRanges(text, query, { ignoreCase, ignoreAccents, matchAll })` for filters that need the same ranges without the chunking.

- [#384](https://github.com/vuetifyjs/0/pull/384) [`04eb489`](https://github.com/vuetifyjs/0/commit/04eb489585f87f95c5d855c6a5d5dd169aaaad60) Thanks [@johnleider](https://github.com/johnleider)! - feat(useNotifications): add `persist` option to `createNotificationsPlugin`

  Setting `persist: true` saves each notification's interaction state — `readAt`, `seenAt`, `archivedAt`, and `snoozedUntil` — to storage as a map keyed by notification id, and merges it back onto the notifications the app registers, whether they exist at restore time or register later (adapters, runtime sends). Notification content is never stored: code stays the source of truth for subject, body, and data. Expired snoozes are dropped on restore, and state for notifications that no longer register is pruned from the next write. Backed by the existing `createPluginContext` persist/restore hooks and keyed by the plugin namespace.

- [#846](https://github.com/vuetifyjs/0/pull/846) [`1864803`](https://github.com/vuetifyjs/0/commit/186480383960f364ba90c0236b8a38711c88b899) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(usePopover): add a pluggable positioning-adapter seam

  `usePopover` had exactly one positioning implementation - CSS anchor
  positioning, hard-coded, with no way to supply another. CSS anchor
  positioning isn't available in Firefox ESR or pre-26 Safari; when the
  browser doesn't support it, the emitted `position-area` /
  `position-try-fallbacks` properties are silently ignored and content
  renders unanchored at `position: fixed`, pinned to the viewport
  origin. There was also no path for a consumer who wants a JS
  positioning library (floating-ui, Popper, or their own) - not as a
  fallback, not as an opt-in.

  `usePopover` now accepts an `adapter: PopoverAdapter` option,
  following the same abstract-class adapter pattern already used by
  `useLogger`, `useLocale`, and `useStorage`. `V0PopoverAdapter` (the
  default) reproduces today's CSS anchor-positioning output byte-for-byte

  - no consumer's build changes, no bundle-size delta, no new dependency.
    This change ships the contract only — no bundled JS-engine adapter.

  The adapter's `setup()` context now also carries the previously-missing
  activator element - a new `attachAnchor()` (companion to the existing
  `attach()`) registers it - so a JS engine can measure both the
  reference and floating elements, plus a normalized `{ side, align }`
  placement descriptor derived from `positionArea` (with the raw CSS
  value always available as an escape hatch).

  `Popover.Root`, `Tooltip.Root`, `Select.Root`, and `createCombobox` all
  thread an `adapter` option through to their underlying `usePopover()`
  call (`positionAdapter` on `createCombobox`, since it already has its
  own `adapter` option for query filtering).

  See the "Bring your own positioning engine" section on the `usePopover`
  docs page for a worked floating-ui adapter example.

- [#917](https://github.com/vuetifyjs/0/pull/917) [`e6c4068`](https://github.com/vuetifyjs/0/commit/e6c406875ae04a6b22ebdf087dd4d5a93e46f410) Thanks [@johnleider](https://github.com/johnleider)! - feat(usePopover): ship a first-party floating-ui adapter

  CSS anchor positioning is still the default and still zero-dependency.
  For Firefox ESR and Safari before 26 — or any consumer who already
  wants a JS engine — import `FloatingUIPopoverAdapter` from
  `@vuetify/v0/popover/adapters/floating-ui` and pass it as `adapter`.
  The subpath is the only place `@floating-ui/dom` is reachable; install
  it as a peer (`>=1.8.0`). `positionTry` is ignored — `flip()` covers
  overflow. Override the default middleware (`offset(8)`, `flip()`,
  `shift({ padding: 8 })`) via the constructor.

- [#917](https://github.com/vuetifyjs/0/pull/917) [`e6c4068`](https://github.com/vuetifyjs/0/commit/e6c406875ae04a6b22ebdf087dd4d5a93e46f410) Thanks [@johnleider](https://github.com/johnleider)! - feat(usePopover): add createPopoverPlugin and a tooltip adapter default

  Set a positioning engine once for the whole app:

  `app.use(createPopoverPlugin({ adapter: new FloatingUIPopoverAdapter() }))`

  importing the adapter from `@vuetify/v0/popover/adapters/floating-ui`.
  Per-instance `adapter` still wins. Tooltips can set their own engine on
  `createTooltipPlugin({ adapter })` without leaking it into Popover,
  Select, or Combobox. Zero-config is unchanged — no plugin still means
  `V0PopoverAdapter` (CSS anchor positioning).

- [#731](https://github.com/vuetifyjs/0/pull/731) [`d876cf9`](https://github.com/vuetifyjs/0/commit/d876cf98c3ebab23e0cdc59a37f279a3b27bd25d) Thanks [@johnleider](https://github.com/johnleider)! - feat(utilities): add `pxToNumber` for reading CSS lengths off `getComputedStyle`

  `pxToNumber(value, fallback?)` parses a resolved CSS length — `'16px'` becomes `16` — and returns `fallback` (default `0`) when the length does not parse, which is what `getComputedStyle` reports for a property that does not apply (`''`, `'auto'`).

  Unlike the `Number.parseFloat(value) || 0` idiom it replaces, a length that legitimately resolves to `0` stays `0` instead of collapsing onto the fallback, so a non-zero fallback is usable: `pxToNumber(style.width, rect.width)` falls back to the client rect only when the resolved width really is unreadable.

- [#693](https://github.com/vuetifyjs/0/pull/693) [`3904c8f`](https://github.com/vuetifyjs/0/commit/3904c8f0082b9e848ef89f67767c41eb2eb444cf) Thanks [@johnleider](https://github.com/johnleider)! - feat(utilities): add `getActiveElement()` and use it for shadow-DOM-aware focus checks

  New `getActiveElement()` utility resolves the deepest focused element by walking open shadow roots — `document.activeElement` returns the shadow _host_ when focus is inside a custom element, which silently breaks focus logic. `useHotkey` (typing guard), `useClickOutside` (iframe-outside check), and `useDragDrop`'s keyboard adapter now use it, so their focus checks stay correct when v0 runs inside a web component / shadow root. Returns the same value as `document.activeElement` in light DOM; open shadow roots only (closed roots can't be traversed).

- [#872](https://github.com/vuetifyjs/0/pull/872) [`e82f95a`](https://github.com/vuetifyjs/0/commit/e82f95aa6b42fb1dbf71e20b9c6bba1af217d12c) Thanks [@johnleider](https://github.com/johnleider)! - feat(useTheme): follow a registered light/dark pair until an explicit select ([#872](https://github.com/vuetifyjs/0/issues/872))

  Pass `system: { light, dark }` on `createTheme` / `createThemePlugin`. The plugin
  tracks `prefers-color-scheme` while `isSystem` is true. `persist: true` stores a
  theme id only after `select`; `reset()` returns to the pair. Both ids must already
  be registered.

### Patch Changes

- [#843](https://github.com/vuetifyjs/0/pull/843) [`2e92047`](https://github.com/vuetifyjs/0/commit/2e9204786d72db0cf58147289792165f9944ba72) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(createProgress): clear stale segment values when the model becomes indeterminate

  `Progress.Root`'s `apply()` only wrote incoming values to segments at matching
  indices, so `apply([])` — what happens when the bound model value becomes
  `undefined`, e.g. flipping `EmProgress`'s `indeterminate` prop after a value was
  already committed — left previously-registered segments untouched. The bar
  correctly ran Emerald's indeterminate sweep animation via CSS, but `data-state`
  stayed `"determinate"` and `aria-valuenow`/`aria-valuetext` kept reporting the
  stale committed value to assistive tech.

  `apply()` now walks every registered segment rather than only the incoming
  values, resetting any segment without a corresponding entry back to `min`. A
  progress bar transitioning to indeterminate now correctly reports
  `data-state="indeterminate"`, clears `aria-valuenow`/`aria-valuetext`, and sets
  `aria-busy`.

  Also fixes the related pin in `isIndeterminate`: an instance created with an
  initial `value` (`createProgress({ value })`) returned `false` permanently, even
  after segments registered and were cleared back to `min`. The initial value now
  only backs the zero-segment state — mirroring `total`'s fallback — so segments
  become the sole source of truth once registered.

- [#845](https://github.com/vuetifyjs/0/pull/845) [`3cd588a`](https://github.com/vuetifyjs/0/commit/3cd588a85dd593e09a4cb5e3a8f1e16ce775d59b) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(useDate): sync with the active locale when installed via createDatePlugin ([#845](https://github.com/vuetifyjs/0/issues/845))

  The documented `useLocale` integration never worked through the plugin path: dates formatted with the plugin's `locale` option (or the adapter default), and switching locales did nothing unless `createDate()` was called directly inside a component's `setup()`. Installed after `createLocalePlugin`, the date plugin now resolves the selected locale and derived `firstDayOfWeek` reactively, and each `app.use()` gets its own date context instead of sharing one across apps — one SSR request's locale no longer bleeds into another's render. That isolation does not extend to a shared `adapter` instance: `adapter.locale` / `adapter.firstDayOfWeek` are mutable state the sync writes into, so construct the adapter fresh per request under SSR (see the use-date FAQ).

## 1.1.0

### Minor Changes

- [#901](https://github.com/vuetifyjs/0/pull/901) [`a27db81`](https://github.com/vuetifyjs/0/commit/a27db81ee18d8b8ca886f70460d52978274574d3) Thanks [@johnleider](https://github.com/johnleider)! - feat(play): share the v0play hash protocol as `@vuetify/play`

  Docs, the playground, and (later) genesis / the builder encode and sanitize the same `{ files, theme, themes }` payload. `ThemeAdapter.SAFE_IDENT` and `UNSAFE_CSS` are public so color values cannot drift from the stylesheet generator; CSS comments are rejected in theme tokens.

- [#457](https://github.com/vuetifyjs/0/pull/457) [`884b6e7`](https://github.com/vuetifyjs/0/commit/884b6e780193161fb21baa0fbfef49cfec4b21b4) Thanks [@johnleider](https://github.com/johnleider)! - feat(Splitter): defer drag collapse/expand to pointer release with a pending intent — dragging a collapsible panel past its `minSize` no longer collapses instantly. While dragging, the panel now pins at its `minSize` (or `collapsedSize` when opening a collapsed panel) and arms a pending intent; the collapse/expand only commits on release, and dragging back out cancels it. `SplitterHandle` exposes the armed state through a `pending` slot prop (`'collapse' | 'expand' | null`) and a matching `data-pending` attribute so consumers can render a "release to hide/open" affordance. Keyboard and programmatic resize keep their existing instant behavior.

### Patch Changes

- [#889](https://github.com/vuetifyjs/0/pull/889) [`0e31f73`](https://github.com/vuetifyjs/0/commit/0e31f73e84fe2e7d3bcb86d24847b60b8e0d59c3) Thanks [@johnleider](https://github.com/johnleider)! - fix(createKanban): contexts can now be disposed — `kanban.dispose()` (and `kanban.columns.dispose`) tears down every column's inner sortable, the internal id → column lookup, and the transfer event bus, so boards no longer leak listeners and stale lookup entries

## 1.0.5

### Patch Changes

- [#857](https://github.com/vuetifyjs/0/pull/857) [`41d90cc`](https://github.com/vuetifyjs/0/commit/41d90cc965ffaacf0f01ecbf51c9575eff57052a) Thanks [@johnleider](https://github.com/johnleider)! - fix(Dialog,AlertDialog): omit aria-labelledby/describedby when Title/Description absent ([#608](https://github.com/vuetifyjs/0/issues/608))

  Dialog.Content and AlertDialog.Content now presence-track their Title and
  Description sub-components. The `aria-labelledby` and `aria-describedby`
  attributes are only emitted when the corresponding element is actually mounted,
  avoiding dangling IDREF warnings from assistive technologies. Follows the same
  pattern as Progress (`hasLabel`) and Combobox (`hasDescription`).

- [#878](https://github.com/vuetifyjs/0/pull/878) [`bd8988b`](https://github.com/vuetifyjs/0/commit/bd8988b00d62b54468ff13767ff502ff5f1f82c5) Thanks [@johnleider](https://github.com/johnleider)! - fix(usePopover): closed popovers no longer leave a visible ghost node — attached elements are force-hidden on close, unmount, and scope dispose

- [#875](https://github.com/vuetifyjs/0/pull/875) [`6cdd09c`](https://github.com/vuetifyjs/0/commit/6cdd09c538c1c68db601b8ff5c8310d938aee8fa) Thanks [@johnleider](https://github.com/johnleider)! - fix(SplitterPanel): panels no longer clip overflowing content (popovers, focus rings) — flex shrink now comes from min-size: 0 instead of overflow: hidden

- [#836](https://github.com/vuetifyjs/0/pull/836) [`a25ea53`](https://github.com/vuetifyjs/0/commit/a25ea53ae53865d595355be8ab883a84f1a3ccaa) Thanks [@johnleider](https://github.com/johnleider)! - fix(Select): Add `data-disabled` attribute to SelectActivator for styling hooks ([#836](https://github.com/vuetifyjs/0/issues/836))

## 1.0.4

### Patch Changes

- [#797](https://github.com/vuetifyjs/0/pull/797) [`5a9a388`](https://github.com/vuetifyjs/0/commit/5a9a388ef42a5bd96d5a398e28cb046da78e59a3) Thanks [@johnleider](https://github.com/johnleider)! - fix(useDate): add a fixedWeeks mode to getWeekArray

  `getWeekArray(date, fixedWeeks?)` can now pad the month matrix to a constant 6 rows (42 cells), so calendar grids keep a stable height across months instead of jumping between 4, 5, and 6 rows. Padding continues day-by-day into the next month; months that naturally span 6 rows are unchanged. Default behavior without the flag is identical to before.

- [#818](https://github.com/vuetifyjs/0/pull/818) [`a7334f8`](https://github.com/vuetifyjs/0/commit/a7334f84e475da9be0f6ab3d880ef474eeec8406) Thanks [@johnleider](https://github.com/johnleider)! - fix(useDragDrop): anchor the drop indicator to the slot and suppress no-op slots

  An interior drop slot now always renders against the end edge of the rect above it. Previously the same slot anchored to the rect above or the rect below depending on which side the pointer approached from, so the indicator visibly jumped across the gap mid-drag — dragging a card down a column drew the line at the top of the next card instead of walking edge to edge.

  A drag over its own zone also no longer proposes the two slots flanking the dragged element's current position: dropping in either puts it straight back where it sits, so the indicator stays hidden there — grabbing the first card and nudging the pointer above it no longer draws a line over its own head — and a drop on a suppressed slot resolves `position.index` to the element's current slot instead of `0`.

- [#796](https://github.com/vuetifyjs/0/pull/796) [`4a19d6c`](https://github.com/vuetifyjs/0/commit/4a19d6c0375e565851d1f1a2cd7125fac5e46ea4) Thanks [@johnleider](https://github.com/johnleider)! - fix(useDate): correct the first day of the week on Firefox and make week data consistent across browsers

  Calendars rendered a Sunday-start week for every locale on Firefox — `de-DE`, `fr-FR`, and `en-GB` all laid out incorrectly — and could disagree between server and client when Node and browser ICU versions differ. Week start and `minimalDays` now come from CLDR 48 data on every runtime, so the same locale always produces the same week layout in Chromium, Firefox, Safari, and Node. An explicit `-u-fw-` keyword on the locale (e.g. `en-US-u-fw-mon`) is honored everywhere, and `minimalDays` for bare language tags is now the correct value for the locale's likely region (affects week numbers for e.g. `sv` and `pt`).

## 1.0.3

### Patch Changes

- [#784](https://github.com/vuetifyjs/0/pull/784) [`e697bab`](https://github.com/vuetifyjs/0/commit/e697bab5ce82eac250ca8f99f71ea4a1e19fc233) Thanks [@johnleider](https://github.com/johnleider)! - fix(Slider,Rating): omit aria-label when ariaLabelledby is provided

  When both `ariaLabel` and `ariaLabelledby` are provided, `aria-labelledby` now consistently wins across Slider, Rating, and NumberField — `aria-label` is omitted from the DOM. Assistive technology output is unchanged (the ARIA accessible-name algorithm already prefers `aria-labelledby`); only the emitted attributes are now consistent.

- [#751](https://github.com/vuetifyjs/0/pull/751) [`f6b8698`](https://github.com/vuetifyjs/0/commit/f6b86980951d4224446ea52b67b1cdfcd776c830) Thanks [@johnleider](https://github.com/johnleider)! - fix(a11y): complete non-button host polyfill for default-button controls

  Controls that default to `as="button"` now apply a consistent host contract when the element is not a native button: `role="button"`, `tabindex` 0/−1, and Enter/Space activation (gated so native buttons keep browser handling only). Covers Carousel Next/Previous, Dialog and AlertDialog activators/actions/close, Pagination First/Prev/Next/Last, Popover Activator, Snackbar Close, plus gating on Collapsible/ExpansionPanel activators and Toggle.

- [#630](https://github.com/vuetifyjs/0/pull/630) [`9bd0517`](https://github.com/vuetifyjs/0/commit/9bd0517b376174752bd7596db4b0147d52a63679) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(AlertDialog): focus the Cancel element on open per the APG alertdialog pattern ([#630](https://github.com/vuetifyjs/0/issues/630))

  The WAI-ARIA Authoring Practices alertdialog pattern calls for initial focus to land on the least-destructive action, and the docs already stated this — but `AlertDialogContent` never actually called `.focus()` on the Cancel element, so focus landed wherever the browser defaulted. `AlertDialogCancel` now registers its DOM element on the shared context, and `AlertDialogContent` focuses it immediately after opening.

- [#770](https://github.com/vuetifyjs/0/pull/770) [`b9f69ed`](https://github.com/vuetifyjs/0/commit/b9f69ed78880c31c57ba51292644ffd2a9ad8458) Thanks [@johnleider](https://github.com/johnleider)! - fix(useBreakpoints): resolve initial state through matchMedia like update() ([#730](https://github.com/vuetifyjs/0/issues/730))

  `createBreakpoints()` previously derived its initial breakpoint name, band flags, and `isMobile` from an `innerWidth` comparison, while `update()` used `matchMedia`. At fractional zoom or with classic scrollbars the two can disagree, so bare `createBreakpoints()` consumers could get a wrong first paint that silently flipped band on the first resize. Initial state now resolves through the same matchMedia-based logic as `update()`. SSR and no-matchMedia environments keep the width-comparison fallback.

- [#766](https://github.com/vuetifyjs/0/pull/766) [`2a91437`](https://github.com/vuetifyjs/0/commit/2a914378bb38198f632c80347b77ff302c145e58) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Input): make the `type` prop reactive ([#757](https://github.com/vuetifyjs/0/issues/757))

  `Input.Root`'s `type` prop was destructured once at setup and assigned as a plain
  value onto `InputRootContext` — every sibling field on the context is a ref or
  getter, but `type` was not. `Input.Control` read that frozen value, so changing
  `:type` on `Input.Root` after mount (the classic password reveal-toggle pattern)
  never reached the rendered `<input>`'s DOM `type` attribute.

  `type` is now placed on the context as `toRef(() => type)`, and `Input.Control`
  reads `root.type.value`, matching how every other reactive context field is
  consumed.

- [#772](https://github.com/vuetifyjs/0/pull/772) [`000304c`](https://github.com/vuetifyjs/0/commit/000304c4de2a10576a6b4af3981cd4c4019ad60b) Thanks [@johnleider](https://github.com/johnleider)! - fix(NumberField): default accessible name on the spinbutton ([#772](https://github.com/vuetifyjs/0/issues/772))

  `NumberField.Control` rendered no accessible name unless a `label` or `ariaLabelledby` prop was set, failing the axe `label` rule in the documented default shape. The spinbutton now falls back to the locale-driven `NumberField.label` message (default: "Number"), matching the increment/decrement buttons. Providing `label` or `ariaLabelledby` overrides the default as before.

- [#640](https://github.com/vuetifyjs/0/pull/640) [`a75e37f`](https://github.com/vuetifyjs/0/commit/a75e37ff5eec5dfa31724622b8e5f52faceca9e4) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(NumberField): add `ariaLabelledby` prop for `aria-labelledby` on the spinbutton ([#640](https://github.com/vuetifyjs/0/issues/640))

  `NumberField.Control` previously only supported accessible naming via the `label` string prop, rendered as `aria-label`. Consumers who render a visible `<label>` element outside the component had no way to wire it to the spinbutton. `ariaLabelledby` now flows through `NumberField.Root`'s context and renders as `aria-labelledby` on the spinbutton, suppressing `aria-label` when both are set to avoid a conflicting accessible name.

- [#638](https://github.com/vuetifyjs/0/pull/638) [`7ead8a0`](https://github.com/vuetifyjs/0/commit/7ead8a036b2897bf101aabfe7205e595fe1e64bc) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Progress): only emit `aria-labelledby` when `Progress.Label` is mounted ([#638](https://github.com/vuetifyjs/0/issues/638))

  `Progress.Root` unconditionally emitted `aria-labelledby` pointing to a label id even when no `Progress.Label` child was mounted, creating a dangling IDREF that assistive technology could misreport. `aria-labelledby` is now conditional on a label actually being present, and a new `ariaLabel` prop covers the case where no visible label exists but an accessible name is still needed.

- [#769](https://github.com/vuetifyjs/0/pull/769) [`5457353`](https://github.com/vuetifyjs/0/commit/54573531313765a2c475fdc2629b7e750b63e2e6) Thanks [@johnleider](https://github.com/johnleider)! - fix(useResizeObserver): report the content box from `immediate` entries ([#729](https://github.com/vuetifyjs/0/issues/729))

  With `immediate: true`, the first synthesized entry's `contentRect` carried border-box dimensions in viewport coordinates, scaled by CSS transforms — every later entry from the observer reports the content box with padding offsets. The immediate entry now matches native semantics: `width`/`height` are the content box and `top`/`left` are the computed padding offsets, so `useElementSize` reports content-box dimensions from mount instead of jumping on the first resize.

- [#771](https://github.com/vuetifyjs/0/pull/771) [`a9b7da7`](https://github.com/vuetifyjs/0/commit/a9b7da77ea484fa50b3276140d157d16f47f85cf) Thanks [@johnleider](https://github.com/johnleider)! - fix(Slider): default accessible name via locale when unlabeled ([#771](https://github.com/vuetifyjs/0/issues/771))

  `Slider.Thumb` rendered `role="slider"` with no accessible name unless `ariaLabel` or `ariaLabelledby` was passed, failing axe's `aria-input-field-name` rule (serious) out of the box. The thumb now defaults its `aria-label` to the localized `Slider.label` message, falling back to "Slider", and skips the default when `ariaLabelledby` is provided so the referenced label wins.

- [#781](https://github.com/vuetifyjs/0/pull/781) [`9bf5b4c`](https://github.com/vuetifyjs/0/commit/9bf5b4c6541b4ee21a3a4e91a7429d8d2a342eaf) Thanks [@johnleider](https://github.com/johnleider)! - fix(Snackbar): stop inline position:relative from overriding portal positioning ([#781](https://github.com/vuetifyjs/0/issues/781))

  Your positioning classes on `Snackbar.Portal` (`absolute`, `fixed`, …) work again — the slot style now carries only `zIndex`. A wrapper that is still `position: static` after mount gets `position: relative` applied automatically, so the stacking-context guarantee from [#602](https://github.com/vuetifyjs/0/issues/602) is preserved. In renderless mode, make sure the wrapper you render is positioned for the z-index to take effect.

- [#633](https://github.com/vuetifyjs/0/pull/633) [`cd59970`](https://github.com/vuetifyjs/0/commit/cd5997070e349ae1e00a31eedac798f452db2cf4) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Group,Selection,Single,Step): complete the provider Item ARIA contract ([#613](https://github.com/vuetifyjs/0/issues/613))

  `aria-selected` is only valid on roles like `option` and `tab`, so the state the provider Items emitted was ignored by assistive technology. SelectionItem and SingleItem now emit `role="option"`, StepItem emits `role="tab"`, and all four Item families (including GroupItem's existing `role="checkbox"`) ship `tabindex` plus Enter/Space (Space for checkbox) keyboard activation so the bound element is operable without consumer completion.

- [#773](https://github.com/vuetifyjs/0/pull/773) [`47342cf`](https://github.com/vuetifyjs/0/commit/47342cf22f819052246125893032f1b1b5bba151) Thanks [@johnleider](https://github.com/johnleider)! - fix(Rating): name the slider and drop focusable stars from examples ([#773](https://github.com/vuetifyjs/0/issues/773))

  `Rating.Root` now exposes `ariaLabel` and `ariaLabelledby` props and always emits an accessible name on the `role="slider"` element — a locale-driven "Rating" default applies when neither is set. Documented examples no longer render `Rating.Item` as `<button>`, so the slider contains no focusable descendants; items stay non-focusable spans and click-to-select is unchanged.

- [#775](https://github.com/vuetifyjs/0/pull/775) [`8191795`](https://github.com/vuetifyjs/0/commit/8191795fa4303dc3cece185137daad2581d924b7) Thanks [@johnleider](https://github.com/johnleider)! - docs(Select): fix double role=option in Item examples ([#775](https://github.com/vuetifyjs/0/issues/775))

  The documented `Select.Item` and `Combobox.Item` usage spread the slot `attrs` onto an inner element inside a non-renderless Item, so following it produced a nested duplicate `role="option"` (axe `aria-required-parent`, critical) and click handlers that fired twice. The Treeview `Cue`/`Checkbox`/`Indicator`/`SelectAll` and Radio `Root`/`Group` examples had the same shape. If you copied any of these, remove the inner `v-bind="attrs"` spread and put your content directly in the slot — or add `renderless` so your element is the only one rendered.

- [#774](https://github.com/vuetifyjs/0/pull/774) [`77f1f59`](https://github.com/vuetifyjs/0/commit/77f1f593f130940e5cefce02895a8c452293afbe) Thanks [@johnleider](https://github.com/johnleider)! - fix(Snackbar): announce toasts via persistent portal live regions

  `Snackbar.Portal` now auto-renders a new `Snackbar.Announcer` — a visually-hidden polite + assertive live-region pair, empty from app start — and each `Snackbar.Root` mirrors its rendered text into the matching region on mount (`urgent` routes to the assertive/alert region), so screen readers reliably announce the first toast, including on NVDA where JS-injected `role="status"` regions are not announced. Toast content renders immediately with no delay; identical consecutive messages re-announce. Pass `:announcer="false"` on the Portal to omit the pair or place `<Snackbar.Announcer>` yourself; a bare `Snackbar.Root` without a Portal keeps its role attributes as best-effort.

## 1.0.2

### Patch Changes

- [#634](https://github.com/vuetifyjs/0/pull/634) [`b8ae3be`](https://github.com/vuetifyjs/0/commit/b8ae3beecafd9bf92b37dd6af924d5faff04e3bf) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Breadcrumbs): collapsed crumbs no longer strand focusable links in the accessibility tree, and the ellipsis can opt into a disclosure toggle ([#614](https://github.com/vuetifyjs/0/issues/614))

  Truncated crumbs are now marked `inert` rather than relying on `display: none` alone. Renderless consumers who bind `attrs` onto their own markup were shipping links that assistive technology could not see but the keyboard could still reach.

  A new `Breadcrumbs.Activator` reveals the collapsed crumbs. Place one inside `Breadcrumbs.Ellipsis` and the ellipsis becomes a disclosure — the ellipsis stays the list item and the Activator is the control, so the trail keeps a valid list structure. It ships `aria-expanded`, a count-aware label, and a `data-state` hook for styling.

  The default is unchanged — an ellipsis with no Activator stays hidden from assistive technology, so opt in where the collapsed levels matter.

- [#745](https://github.com/vuetifyjs/0/pull/745) [`560c6f5`](https://github.com/vuetifyjs/0/commit/560c6f56bc95160982f73c89da36f01bbd295dec) Thanks [@johnleider](https://github.com/johnleider)! - fix(utilities): `isArray` now preserves element types, tuples and `readonly` when narrowing ([#744](https://github.com/vuetifyjs/0/issues/744))

  `isArray` narrowed everything to `unknown[]`, which erased the element type of arrays whose elements involve `any`, turned `readonly` array unions into an intersection that is not an array of anything, and left the array constituent in place in the `else` branch. Guarding a `readonly string[] | string` gave you neither `readonly string[]` in the `if` nor `string` in the `else`.

  Narrowing is now exact: element types, tuple arity and `readonly` survive the guard, and the `else` branch drops exactly the array constituents. `unknown` and `any` inputs narrow as before (`unknown[]` and `any[]`), so mutation and assignment to `unknown[]` keep compiling.

  Not breaking — runtime is unchanged, and every input either narrows identically or more precisely than before.

- [#746](https://github.com/vuetifyjs/0/pull/746) [`b6a90b6`](https://github.com/vuetifyjs/0/commit/b6a90b6b00a16b8885324d5139c33f0d3d830bcf) Thanks [@johnleider](https://github.com/johnleider)! - fix(utilities): `isObject` narrows to `Record<string, any>` so interfaces and negative branches work ([#723](https://github.com/vuetifyjs/0/issues/723))

  `isObject` previously narrowed to `Record<string, unknown>`. That destroyed known property types on interface-typed values (TypeScript never grants interfaces an implicit index signature) and left `Record<string, any>` members alive in the `else` branch of a union. Both are incorrect narrowing, not a strictness win.

  The predicate is now `Record<string, any>`. Runtime is unchanged. Not breaking — the widened predicate is assignable from the old one for any program that already typechecked.

- [#645](https://github.com/vuetifyjs/0/pull/645) [`1cf1ce3`](https://github.com/vuetifyjs/0/commit/1cf1ce3bf7d4600b78fbe5a9b9073d30d312cd2e) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Button,Toggle,Pagination): activate non-native `as` elements on Enter/Space ([#645](https://github.com/vuetifyjs/0/issues/645))

  `ButtonRoot`, `ToggleRoot`, and `PaginationItem` expose `role="button"` and `tabindex` when rendered with a non-native `as` element (e.g. `as="div"`), but browsers only synthesize a click from Enter/Space for native `<button>` elements — for everything else those were dead keys. All three now wire an `onKeydown` handler (only when `as !== 'button'`) so keyboard users can activate them.

- [#727](https://github.com/vuetifyjs/0/pull/727) [`adaace9`](https://github.com/vuetifyjs/0/commit/adaace94db03078c650fc7d86acace0c77783b6c) Thanks [@johnleider](https://github.com/johnleider)! - fix(useProxyModel): keep a v-model value whose item has not rendered yet

  Setting a v-model to a value whose item registers later — selecting a tab that is only rendered once it becomes active, or an option in a list that has not mounted — was immediately reverted to the previous selection. `useProxyModel` already defers such values so late-registering items resolve them, but the same tick wrote the old selection back over the model, discarding the value before its item could register. When the model is a writable `computed`, that write ran the setter, so the revert also fired the consumer's own side effects.

  Values with no registered item are now held until their item registers; a value whose item exists but was refused (disabled, or blocked by `mandatory`) still reverts as before.

- [#720](https://github.com/vuetifyjs/0/pull/720) [`6c157ff`](https://github.com/vuetifyjs/0/commit/6c157ff4c321f6941ab9bf8ef8abe3fda4b27f01) Thanks [@johnleider](https://github.com/johnleider)! - fix(v0): accept Vue 3.6 prereleases and surface npm discovery metadata

  `@vuetify/v0` now installs cleanly alongside `vue@3.6.0-rc.x`. The previous `vue` peer range of `>=3.5.0` excluded prereleases per semver, so any project on a 3.6 release candidate hit `ERESOLVE`; the range is now `>=3.5.0 || >=3.6.0-0`. No change for projects on stable Vue.

  The package also publishes `keywords`, `homepage`, and `bugs` for the first time, and the `description` now leads with what the package is — headless, unstyled, accessible Vue 3 primitives and composables.

- [#725](https://github.com/vuetifyjs/0/pull/725) [`6791e7b`](https://github.com/vuetifyjs/0/commit/6791e7ba97756f4844481e4a63562fa66e2f2d49) Thanks [@johnleider](https://github.com/johnleider)! - fix(useResizeObserver): report border-box measurements so the `box` option is no longer a silent no-op ([#724](https://github.com/vuetifyjs/0/issues/724))

  `useResizeObserver` accepted `box: 'border-box'` but every entry it reported was content-box, so any element with padding or a border measured short by exactly that amount — with no type error and no warning. Entries now also carry `borderBoxSize` and `contentBoxSize`, matching the native `ResizeObserverEntry`:

  ```ts
  useResizeObserver(
    el,
    ([entry]) => {
      entry.contentRect.height; // 30 — content box, as before
      entry.borderBoxSize[0].blockSize; // 40 — with 4px padding and a 1px border
    },
    { box: "border-box" },
  );
  ```

  Both arrays are present on every entry regardless of `box`, so you can read the border box without changing any option. Unlike `getBoundingClientRect()`, they are layout values and are not scaled by CSS transforms.

  `contentRect` is unchanged — existing callbacks keep working as-is.

- [#641](https://github.com/vuetifyjs/0/pull/641) [`497b328`](https://github.com/vuetifyjs/0/commit/497b328f9fb074a0b24341789933554a8260cbab) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - test(Collapsible): cover keyboard toggle for non-native activator elements ([#641](https://github.com/vuetifyjs/0/issues/641))

  `CollapsibleActivator` already handles Enter/Space and sets `role="button"` for non-native `as` elements, but no test asserted that a non-native activator actually toggles the collapsible on Enter/Space. Adds two tests covering that gap.

## 1.0.1

### Patch Changes

- [#602](https://github.com/vuetifyjs/0/pull/602) [`e866af7`](https://github.com/vuetifyjs/0/commit/e866af72035f90cad3a05a77df2d08f7430f0580) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Snackbar): SnackbarPortal creates a stacking context so its z-index takes effect ([#602](https://github.com/vuetifyjs/0/issues/602))

  The teleported snackbar region applied its stack z-index to a `position: static` element, which CSS ignores — a body-fallback snackbar could render behind positioned page chrome regardless of its z-index. `SnackbarPortal` now sets `position: relative` alongside the z-index (visually neutral, no offsets) so the stacking context is established. `Portal`'s `zIndex` slot prop is now documented to require a positioned element.

- [#624](https://github.com/vuetifyjs/0/pull/624) [`64b839c`](https://github.com/vuetifyjs/0/commit/64b839c96ef015269e637477c98c96b87dcb7b49) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Snackbar): add an `urgent` prop that switches the live region to `role="alert"` ([#624](https://github.com/vuetifyjs/0/issues/624))

  Informational snackbars keep `role="status"` (a polite live region); setting `urgent` switches to `role="alert"` (assertive) so critical notifications interrupt assistive technology instead of waiting for it to go idle (WCAG 4.1.3, Status Messages).

- [#567](https://github.com/vuetifyjs/0/pull/567) [`05526f0`](https://github.com/vuetifyjs/0/commit/05526f079b70e05c9fc4beace4ad158c5c2e6b44) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): a token removed via its own `ticket.unregister()` no longer leaves a stale value in the resolution cache ([#567](https://github.com/vuetifyjs/0/issues/567))

  `resolve()` results were only invalidated through the context-level mutator methods, so removing a token via its ticket's own `unregister()` — which is bound to the underlying registry — left the cache stale and subsequent `resolve()` calls returned the removed value. Cache invalidation now runs off registry mutation events, covering every removal and update path uniformly.

- [#566](https://github.com/vuetifyjs/0/pull/566) [`ff9c430`](https://github.com/vuetifyjs/0/commit/ff9c430f1215e4deb7e6c2ae1571858eada4fb8a) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): resolve aliases reached through a segment path, return directly-passed TokenAlias literals, and cache chained resolutions ([#566](https://github.com/vuetifyjs/0/issues/566))

  `resolve()` now follows a `{alias}` that a dotted-segment lookup lands on — previously it returned the raw `'{alias}'` string (visible under `flat: true`, where nested objects are stored whole and addressed by segment). A `TokenAlias` object passed directly to `resolve()` now returns its `$value` (previously a non-alias `$value` was stringified and looked up as an id, yielding `undefined`), and aliased resolutions cache the outer key rather than only the terminal hop. `resolve<T = unknown>()` also accepts an optional return-type parameter.

## 1.0.0

### Minor Changes

- [#372](https://github.com/vuetifyjs/0/pull/372) [`d075615`](https://github.com/vuetifyjs/0/commit/d0756155c3c5a8d480cf32a4d56ec162b1751bc3) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(locale): add `ti()` so components carry inline English aria labels without bundling a locale (WCAG 4.1.2)

  - `locale.ti(key, ...params)` ("translate if exists") returns the translation or `undefined` instead of echoing the key, enabling the `ti(key) ?? '<default>'` pattern at call sites
  - Every v0 component now provides a built-in English aria label via `ti(...) ?? '<default>'`, so apps with no locale plugin get meaningful accessible names — with zero strings bundled into the runtime fallback
  - `@vuetify/v0/locale/messages/en` is exposed as an optional export: the canonical English catalog, handy for seeding a translation or registering full English coverage (never imported by the runtime)

- [#397](https://github.com/vuetifyjs/0/pull/397) [`19aac62`](https://github.com/vuetifyjs/0/commit/19aac62a16c6e236152e176ef6611a07d3ca359b) Thanks [@johnleider](https://github.com/johnleider)! - fix(Dialog, Snackbar): overlays can teleport into the topmost open modal so snackbars shown over a modal Dialog appear above it and stay interactive ([#279](https://github.com/vuetifyjs/0/issues/279))

  A native modal `<dialog>` (`showModal()`) is promoted to the browser **top layer**, which paints above all `z-index` and makes everything outside its subtree inert — so an overlay teleported to `body` rendered beneath the dialog and was unclickable. Overlays can now teleport into the top-layer subtree instead:

  - `Snackbar.Portal` now defaults `teleport` to `'top-layer'`, mounting into the topmost open modal `<dialog>` when one is open and falling back to `body` otherwise. `teleport="body"` (always body) and `:teleport="false"` (render inline) remain escape hatches.
  - `Portal` accepts a new `to="top-layer"` token that resolves to the topmost modal element, or `body` when no modal is open.
  - `useStack` exposes a new `topElement` context field and an `el` option on `register()`, so modal dialogs publish their element as the teleport target.
  - `useClickOutside` bounds mode no longer treats a strict DOM descendant as an outside click, so clicking an overlay teleported into a `<dialog>` (e.g. a Snackbar and its close button) no longer dismisses the dialog. Backdrop clicks (target is the dialog itself) still close it.

### Patch Changes

- [#619](https://github.com/vuetifyjs/0/pull/619) [`95d2d34`](https://github.com/vuetifyjs/0/commit/95d2d34c08692b15b9c6d2d173b010d80be7e024) Thanks [@johnleider](https://github.com/johnleider)! - fix(Switch,Form,Slider): correct ARIA states for mixed, native validation, and grouped form controls ([#543](https://github.com/vuetifyjs/0/issues/543))

  - `Switch.Root` and `Switch.SelectAll` no longer emit the spec-invalid `aria-checked="mixed"`; the value is clamped to `false` while indeterminate, so screen readers announce a valid switch state. Style indeterminate switches with `data-state="indeterminate"` as before.
  - `Switch.Thumb` and `Switch.Track` are now marked `aria-hidden="true"`, hiding the decorative visuals from assistive technology.
  - `Form.Root` now renders `novalidate` by default, so the browser's native constraint popups no longer block submit before v0's async validation runs. Opt back into native constraint validation with `:novalidate="false"`.
  - `Slider.Root` now exposes `role="group"` plus optional `label` / `ariaLabelledby` props, giving multi-thumb sliders an accessible group name.

- [#618](https://github.com/vuetifyjs/0/pull/618) [`d611c03`](https://github.com/vuetifyjs/0/commit/d611c03a1c8f462e51cc2a96032a114da8e91328) Thanks [@johnleider](https://github.com/johnleider)! - fix(Avatar,Scrim,Popover,Tooltip,Select,Toggle): restore dropped alt text and complete missing ARIA wiring ([#543](https://github.com/vuetifyjs/0/issues/543))

  - `Avatar.Image` now accepts an `alt` prop and passes consumer attributes (`alt`, `aria-label`, ...) through to the rendered element — previously they were silently dropped
  - `Scrim` backdrops are hidden from assistive technology with `aria-hidden="true"`
  - `Popover.Activator` explicitly exposes `aria-expanded` and `aria-controls` instead of relying on inconsistent native `popovertarget` mapping
  - `Tooltip.Content` closes on Escape when focus is inside interactive tooltip content
  - `Select.Activator` reflects the disabled state (`aria-disabled` + native `disabled`) and stays keyboard-focusable when rendered as a non-button element; `Select.Content` names its listbox via `aria-labelledby`
  - `Toggle.Group` gains `label`, `ariaLabelledby`, and `ariaDescribedby` props so the group can be named

- [#443](https://github.com/vuetifyjs/0/pull/443) [`2f4275c`](https://github.com/vuetifyjs/0/commit/2f4275cb3dd3162aa89bb0183159380039b5a35d) Thanks [@johnleider](https://github.com/johnleider)! - fix(build): ship type declarations for the `@vuetify/v0/browser` entry — `./browser` mapped to `./dist/browser/index.js` with no `.d.ts`, so `are-the-types-wrong` flagged it `UntypedResolution` and TypeScript consumers importing `@vuetify/v0/browser` got no types. The browser bundle now emits `dist/browser/index.d.ts` (it bundles the same `src/index.ts` as the main entry, so its types are identical), and the `repo:exports` attw check no longer needs to exclude the browser entrypoint.

- [#390](https://github.com/vuetifyjs/0/pull/390) [`5db6a0d`](https://github.com/vuetifyjs/0/commit/5db6a0de80821b48603b876ba420a99c1bcf7ad1) Thanks [@johnleider](https://github.com/johnleider)! - fix(Button): don't auto-set aria-label in renderless mode — in renderless mode the consumer owns the DOM and is responsible for the accessible name; the automatic icon-only fallback no longer overrides visible text in mixed-content renderless usages

  Also migrates the solo icon-only fallback to `locale.ti('Button.label') ?? 'Button'`, matching the inline accessible-name default every other component now ships, so an unconfigured app gets `"Button"` instead of the raw `Button.label` key.

- [#546](https://github.com/vuetifyjs/0/pull/546) [`03b298f`](https://github.com/vuetifyjs/0/commit/03b298f61270dea573e64f618b48173de20cbd4d) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Combobox): route ComboboxEmpty default slot text through useLocale

  The hardcoded `"No results"` fallback in `ComboboxEmpty` was not going through `useLocale`, violating PHILOSOPHY §5.5 (locale-first strings). Added a `Combobox.noResults` key to the English message bundle and changed the default slot content to `{{ locale.ti('Combobox.noResults') ?? 'No results' }}`, matching the pattern used by `Dialog.Close` and other components. Consumers who override the default slot are unaffected.

- [#555](https://github.com/vuetifyjs/0/pull/555) [`9c04ead`](https://github.com/vuetifyjs/0/commit/9c04eadc12c5b2f037aa1202184fe70142646030) Thanks [@johnleider](https://github.com/johnleider)! - perf(createDataGrid): dramatically faster sorting, drag-reordering, and initialization on large grids ([#555](https://github.com/vuetifyjs/0/issues/555))

  Grids with thousands of rows are far faster to sort, drag-reorder, and build — a 10k-row sort is ~28× faster, drag-reordering ~6.5×, and initial construction ~2×. No API change and no migration: existing grids get the speedup on upgrade.

- [#426](https://github.com/vuetifyjs/0/pull/426) [`dc0fc00`](https://github.com/vuetifyjs/0/commit/dc0fc00d5a61dcdfe108ffbb52682407971ef1b5) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): reject disabled items in multiple-mode `apply()` — the v-model sync path (`apply()`) could select a disabled item even though `select`/`unselect`/`toggle` all reject them, violating the "disabled = all selection ops are no-ops" contract. `createModel.apply()`'s browse-fallback now routes through `select()` (which guards instance- and ticket-level `disabled`), and `createSelection.apply()`'s multiple branch gains an inline per-ticket guard before adding (kept inline rather than routed through `select()` so the single-mode `multiple: true` override still works). The ref-write value-sync path is untouched. Affects multiple-mode `createSelection`/`createGroup`/`createNested` via `useProxyModel`.

- [#625](https://github.com/vuetifyjs/0/pull/625) [`584668d`](https://github.com/vuetifyjs/0/commit/584668d559add9271593b5089d16c01c25134214) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Carousel): pause autoplay while keyboard focus is inside the carousel ([#625](https://github.com/vuetifyjs/0/issues/625))

  Moving focus into the carousel now pauses auto-rotation and moving focus out resumes it, mirroring the existing pointer/touch behavior and satisfying WCAG 2.2.2 (Pause, Stop, Hide).

- [#585](https://github.com/vuetifyjs/0/pull/585) [`da2e0c1`](https://github.com/vuetifyjs/0/commit/da2e0c115fb3b1001634a392162c8e22e82a8bfa) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): disabled tickets are now inert to unselect and toggle

  Gesture operations (select, unselect, toggle) no longer mutate disabled tickets in either direction. Wholesale operations (apply/v-model, selectAll, cascade propagation, clear) still drain disabled ids so state can never get stuck.

- [#579](https://github.com/vuetifyjs/0/pull/579) [`23e7a0b`](https://github.com/vuetifyjs/0/commit/23e7a0b421d74397c1a70fbb59c99781c52ebb96) Thanks [@johnleider](https://github.com/johnleider)! - fix(createNested): leaf-mode parent unselect respects mandatory atomically instead of half-clearing the branch

- [#584](https://github.com/vuetifyjs/0/pull/584) [`df823ca`](https://github.com/vuetifyjs/0/commit/df823cad723bb23dc67ce98036d795ce064173dc) Thanks [@johnleider](https://github.com/johnleider)! - fix(createNumberField): commit now no-ops while disabled or readonly, matching increment and decrement

- [#580](https://github.com/vuetifyjs/0/pull/580) [`52b0ea8`](https://github.com/vuetifyjs/0/commit/52b0ea8387242de5f43424d37f2d0c9d80727f74) Thanks [@johnleider](https://github.com/johnleider)! - fix(createProgress): fromValue offsets by min so ProgressFill width matches the ARIA percent

- [#582](https://github.com/vuetifyjs/0/pull/582) [`e741325`](https://github.com/vuetifyjs/0/commit/e741325cf10874c682acd119529e4cdb44a9fb26) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): apply fully replaces the selection under multiple+mandatory instead of stranding a stale id

- [#583](https://github.com/vuetifyjs/0/pull/583) [`9127759`](https://github.com/vuetifyjs/0/commit/9127759efd6dc53b18e260d238277825fed017ea) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSlider): thumb operations (set, up, down, floor, ceil) now no-op while disabled, as documented

- [#627](https://github.com/vuetifyjs/0/pull/627) [`396ea49`](https://github.com/vuetifyjs/0/commit/396ea49d9ddcc17091bfd9907babbb256301e118) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Splitter): give the resize handle a default localized `aria-label` ([#627](https://github.com/vuetifyjs/0/issues/627))

  A `Splitter.Handle` without an explicit `label` now falls back to the localized `Splitter.handle` string ("Resize"), so `role="separator"` always exposes an accessible name to assistive technology (WCAG 4.1.2, Name/Role/Value).

- [#626](https://github.com/vuetifyjs/0/pull/626) [`a1df426`](https://github.com/vuetifyjs/0/commit/a1df4263153830feffacfa23fcab575d1feaf809) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Treeview): expose the active node to assistive technology via `aria-current` ([#626](https://github.com/vuetifyjs/0/issues/626))

  Navigation trees without checkbox selection now convey the current node — the active `treeitem` emits `aria-current="true"` alongside the existing `aria-selected`, so screen readers can announce the focused node.

- [#581](https://github.com/vuetifyjs/0/pull/581) [`cdc9fb5`](https://github.com/vuetifyjs/0/commit/cdc9fb556844f5545227ca88eb44c4401afc69c7) Thanks [@johnleider](https://github.com/johnleider)! - fix(createForm): submit no longer reports failure when a field validation was superseded by a newer concurrent call

  A superseded validate() now resolves to the latest validation's outcome instead of false, so double-submits and concurrent field validation report the form's actual validity.

- [#371](https://github.com/vuetifyjs/0/pull/371) [`3ee1d85`](https://github.com/vuetifyjs/0/commit/3ee1d851b384166217368b6f428c398f18e7515d) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(NumberField): pass parsed value directly to commit() so typed values correctly propagate to the parent v-model on blur and Enter — avoids reading the stale model before Vue's reactivity round-trip completes

- [#417](https://github.com/vuetifyjs/0/pull/417) [`0cd2de5`](https://github.com/vuetifyjs/0/commit/0cd2de57d4e113784ba28a0cb98896386af8755b) Thanks [@johnleider](https://github.com/johnleider)! - perf(Overflow): cache item visibility in a hidden-index set, dropping per-item O(n) rank scans to O(1) (whole-list visibility goes from O(n²) to O(n) per resize)

- [#451](https://github.com/vuetifyjs/0/pull/451) [`fe12826`](https://github.com/vuetifyjs/0/commit/fe12826195d1d887681c9bab67506de2ddd7b391) Thanks [@johnleider](https://github.com/johnleider)! - fix: bring component ARIA/data attributes into PHILOSOPHY §3.6 compliance — `ExpansionPanel` content now emits `data-selected` as `true | undefined` (it was a raw boolean, so `[data-selected]` matched even when unselected), and `Slider` thumb / `Rating` root now emit `aria-disabled` as a concrete boolean (it was `true | undefined`, which dropped the attribute when not disabled).

- [#416](https://github.com/vuetifyjs/0/pull/416) [`6e8f86c`](https://github.com/vuetifyjs/0/commit/6e8f86ceb1fcc59b82b9b1f0e0b3e236438269df) Thanks [@johnleider](https://github.com/johnleider)! - fix(usePopover): coerce the synthesized `anchor-name` / `position-anchor` custom-ident to a valid charset

  A consumer-supplied `id` (or activator `target` / content `_id`) containing non-ident characters produced an invalid `--${id}` custom-property name. The browser rejects it on the client (`style.setProperty` drops the whole inline value), so anchor positioning silently broke. The interpolated identifier is now coerced to `[a-zA-Z0-9_-]`, mirroring the `SAFE_IDENT` guard `ThemeAdapter` already applies. The raw `id` is still used verbatim for the DOM element id and the `popovertarget` linkage — only the CSS custom-ident is coerced, so the native popover wiring is unchanged.

- [#587](https://github.com/vuetifyjs/0/pull/587) [`7f01ea0`](https://github.com/vuetifyjs/0/commit/7f01ea01b211bc0c0c3defa86c13c8ab5c6bffa8) Thanks [@johnleider](https://github.com/johnleider)! - fix(useProxyModel): apply the current v-model to late-registering tickets ([#587](https://github.com/vuetifyjs/0/issues/587)) — when the v-model changed before a value's ticket registered (e.g. tabs, carousels, or button groups whose items load asynchronously), the stale value was still selected once the ticket arrived, leaving the registry out of sync with the v-model. Late registration now honours the current model value.

- [#540](https://github.com/vuetifyjs/0/pull/540) [`2ed9618`](https://github.com/vuetifyjs/0/commit/2ed9618ed365ef9e1a6c6b3bce6c4c6962f689e0) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): memoize reactive keys/values/entries behind a version signal

  Reactive-mode iteration reads previously bypassed the result cache and read the
  order array through its shallowReactive proxy — one trap per index and, inside
  an effect, one tracked dependency per index. Reads now touch a single version
  signal (bumped on every structural mutation) and share the non-reactive cache,
  making reactive reads O(1) between mutations and giving subscribing effects one
  dependency regardless of collection size. Mid-batch reads now always reflect
  mutations already applied instead of a stale pre-batch snapshot.

- [#570](https://github.com/vuetifyjs/0/pull/570) [`e770c89`](https://github.com/vuetifyjs/0/commit/e770c89545cf4ec6666cc2b743f78938851fa7c6) Thanks [@johnleider](https://github.com/johnleider)! - fix(createRegistry): dispatch batched events even when the batch callback throws ([#570](https://github.com/vuetifyjs/0/issues/570))

  Event-driven consumers (e.g. `useProxyRegistry` snapshots) no longer go stale when a batch or `onboard` throws after some mutations already applied — the queued events for those applied mutations now flush regardless of whether the callback completes.

- [#565](https://github.com/vuetifyjs/0/pull/565) [`05be673`](https://github.com/vuetifyjs/0/commit/05be673d6affb83143a8dcba04554fac49d43c64) Thanks [@johnleider](https://github.com/johnleider)! - fix(createRegistry): heal offboard reindex, id identity, and batched field-only upserts

  Three correctness fixes to the registry foundation:

  - **`offboard` now eagerly reindexes** when index-derived tickets shift position, so `values()` / `entries()` and `useProxyRegistry` consumers see corrected `index` / `value` immediately — previously a mid-list `offboard()` left the default (index-valued) survivors stale until some later position-reading call drained the deferred reindex, and iteration-only consumers never healed. It also drops the stale iteration cache before the removals so a sync effect firing mid-`offboard` never observes removed ids.
  - **`offboard` preserves a supplied `id`** across a transfer even when the ticket has no explicit value. It previously used `valueIsIndex` as a proxy for "id was auto-generated" and stripped the id of any value-less ticket, so `register({ id: 'a' })` → `offboard(['a'])` returned `{}` and lost identity. Now only ids the registry itself minted are stripped. **Behavior delta for the selection chain:** `createModel` and everything built on it mint ids in their wrappers before calling `register`, so those ids read as supplied to the base registry — `offboard` now preserves them where it previously stripped them for value-less tickets. Downstream transfers (e.g. moving items between selections) keep their identity instead of getting a fresh id on re-onboard.
  - **`batch()` no longer re-notifies iteration subscribers for a field-only upsert (or an empty batch)**, matching the non-batched `upsert` contract (§4.4): a batch that changes no membership or order leaves version subscribers untouched.

- [#531](https://github.com/vuetifyjs/0/pull/531) [`49e4f8b`](https://github.com/vuetifyjs/0/commit/49e4f8b7235f3c2a5213ccce63850b8b78014f66) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): use O(1) ticket.index for unregister splice locate (with indexOf fallback); avoid values() allocation/copy in seek first/last; never eagerly drain reindex in unregister to preserve the lazy contract

- [#489](https://github.com/vuetifyjs/0/pull/489) [`5c6d087`](https://github.com/vuetifyjs/0/commit/5c6d0871ddc148c52fe6ba4cbd569b433f7b77fc) Thanks [@johnleider](https://github.com/johnleider)! - fix(security): apply prototype-pollution and CSS-injection guards flagged in the security review

  - `useFeatures` adapters (LaunchDarkly / Flagsmith / PostHog) now skip `UNSAFE_KEYS` (`__proto__` / `constructor` / `prototype`) flag names when building the flags object, matching the guard already used by `mergeDeep`, `usePermissions`, and `createTokens`
  - `useLocale` `restore()` validates the persisted value with `isString` / `isNumber` guards before applying it instead of blind-casting `saved as ID`, completing the persist/restore sweep (`useTheme` and `useRtl` now use the same guards)
  - `ThemeAdapter`'s `UNSAFE_CSS` denylist is hardened against declaration injection: it now also rejects `;`, `\` (CSS escape evasion), and the URL-loading functions `src()` / `image()` / `image-set()` / `cross-fade()`
  - `V0Error` filters `UNSAFE_KEYS` when copying caller-supplied error details onto the instance

- [#606](https://github.com/vuetifyjs/0/pull/606) [`9ca3fb3`](https://github.com/vuetifyjs/0/commit/9ca3fb3d23b8b7153083edc2a1dbff48c8b74512) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(useRtl,useTheme): keep SSR head entries in sync with reactive state ([#606](https://github.com/vuetifyjs/0/issues/606))

  During server rendering, the `dir` attribute, `data-theme`, and injected theme styles now update via `entry.patch` when RTL or theme state changes after the initial head push — previously the first-rendered values were frozen for the rest of the request. Adapter disposal also cleans up the new watchers alongside the head entry.

- [#569](https://github.com/vuetifyjs/0/pull/569) [`e653ef5`](https://github.com/vuetifyjs/0/commit/e653ef59537ccb489765b505b320a1db18cf5133) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - test(plugins): lock in SSR safety for every plugin composable ([#569](https://github.com/vuetifyjs/0/issues/569))

  Adds an SSR contract test to each plugin composable — no throw without a provider, and a fresh fallback per call so nothing leaks between requests — plus a guard that fails if a new plugin ships without one. The `useStack` leak these guard against was fixed in [#442](https://github.com/vuetifyjs/0/issues/442).

- [#470](https://github.com/vuetifyjs/0/pull/470) [`38b27ed`](https://github.com/vuetifyjs/0/commit/38b27edba93ecf4b2f9f9fb4d323bce0f4504d05) Thanks [@johnleider](https://github.com/johnleider)! - chore(maturity): promote the v1 stable set to `stable` — the selection family (`createModel`, `createSelection`, `createSingle`, `createStep`, `createGroup`, `createNested`), `createRegistry`, and the plugin trio (`useTheme`, `useStorage`, `useBreakpoints`) are now API-locked for 1.0. They join the already-stable foundation (`createContext`, `createPlugin`, `createTrinity`) and observer (`useIntersectionObserver`, `useMutationObserver`, `useResizeObserver`) composables, bringing the stable surface to 16 composables plus the 17 stable utilities.

- [#655](https://github.com/vuetifyjs/0/pull/655) [`65952f2`](https://github.com/vuetifyjs/0/commit/65952f27190745da40ff62e82505cf04c56a6a40) Thanks [@johnleider](https://github.com/johnleider)! - chore(maturity): promote the 1.0 component spine to `stable` — 13 headless components are now API-locked for 1.0: the primitives `Atom` and `AspectRatio`, the providers `Theme`, `Group`, `Selection`, `Single`, and `Step`, the `Tabs`, `Toggle`, and `Collapsible` disclosure/interaction components, and the `Checkbox`, `Radio`, and `Switch` form controls. Three supporting composables graduate with them — `useProxyModel`, `toElement`, and `toArray` — because every promoted component rests on them, and a stable component cannot sit on a `preview` logic layer. No behavior or signature changes: this is a stability commitment, not a code change, so no consumer action is required.

- [#500](https://github.com/vuetifyjs/0/pull/500) [`ffc4e5a`](https://github.com/vuetifyjs/0/commit/ffc4e5aaec7df81b1b62f022fe78cb4dfc5ef01b) Thanks [@johnleider](https://github.com/johnleider)! - fix(useRules): accept spec-compliant Standard Schema issue paths

  Widens the vendored `StandardSchemaV1` issue `path` typing to `ReadonlyArray<PropertyKey | PathSegment>` per the Standard Schema v1 spec, so schemas typed with `@standard-schema/spec` (Valibot, Zod, ArkType) are assignable to `rules` again.

- [#586](https://github.com/vuetifyjs/0/pull/586) [`562bd14`](https://github.com/vuetifyjs/0/commit/562bd1457c5c5b05c73fa8af69b4a61cef029451) Thanks [@johnleider](https://github.com/johnleider)! - fix(Switch): keep `Switch.Thumb` visible in every state — it no longer forces an inline `visibility: hidden` when the switch is off. The thumb had inherited the "present-when-on" indicator template from `Checkbox`/`Radio`/`Toggle`, but a switch knob is always visible and slides between positions. The inline style also sat at the top of the cascade, forcing consumers to override it with `visibility: visible !important`. Drive the off/on appearance from the `data-state` attribute (`checked` / `unchecked` / `indeterminate`) — e.g. `translate-x-1 data-[state=checked]:translate-x-6` — which now animates directly from the off position. `Switch.Thumb`'s slot `attrs` no longer includes a `style` key.

- [#424](https://github.com/vuetifyjs/0/pull/424) [`ceaeba8`](https://github.com/vuetifyjs/0/commit/ceaeba80fd89e1e7e190e82bdc94fea23d9e875f) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): remove the adopted stylesheet on V0 adapter dispose — the browser adapter (`V0StyleSheetThemeAdapter`) appended a `CSSStyleSheet` to `document.adoptedStyleSheets` in `upsert()` but `dispose()` only stopped the Vue watchers, leaking orphaned sheets on repeated mount/unmount (HMR, test suites, micro-frontend teardown). Dispose now filters the sheet out of `adoptedStyleSheets` and clears the ref across all three dispose paths, mirroring the sibling unhead adapter. Follow-up to the leak-safe adapter lifecycle work.

- [#441](https://github.com/vuetifyjs/0/pull/441) [`bf61d28`](https://github.com/vuetifyjs/0/commit/bf61d285eb184ebb8ecf49a73a201e1dc1e5f468) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): apply `cspNonce` on the SSR head path — `V0StyleSheetThemeAdapter` accepted a `cspNonce` option but never applied it: the SSR `head.push` `<style>` was emitted without the nonce, so strict-CSP (`style-src 'nonce-…'`) apps had their server-rendered theme styles blocked (FOUC until client hydration). The nonce is now threaded into the SSR style entry, and `V0UnheadThemeAdapter` accepts and forwards `cspNonce` too (initial push, reactive patch, and `update()`). The nonce is added only when set, so non-CSP usage is unchanged. The client `adoptedStyleSheets` path correctly needs no nonce.

- [#440](https://github.com/vuetifyjs/0/pull/440) [`999c41f`](https://github.com/vuetifyjs/0/commit/999c41fbd960cd394b82974b0ea2618a8aa819d8) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): validate the theme adapter `prefix` against `SAFE_IDENT` — `ThemeAdapter.generate()` sanitized theme names, color keys, and values, but interpolated the adapter `prefix` into the generated CSS (`--${prefix}-…`, `var(--${prefix}-on-background)`) unvalidated, so a malformed prefix (e.g. containing `}`) could break out of the declaration block and inject arbitrary CSS rules. The constructor now rejects any prefix that doesn't match `SAFE_IDENT` (`/^[a-zA-Z0-9_-]+$/`) with a `V0Error` (`V0_THEME_INVALID_PREFIX`), mirroring the guard already applied to adjacent inputs and the `V0_PALETTE_INVALID_SEED` precedent. Both `V0StyleSheetThemeAdapter` and the unhead adapter inherit it. Non-breaking — valid prefixes already match.

- [#564](https://github.com/vuetifyjs/0/pull/564) [`ef7316b`](https://github.com/vuetifyjs/0/commit/ef7316bb08861501cf163aebac4c805b61c89da5) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): mutators now forward their `event` argument and `ticket.value` is typed accurately under `flat: true` ([#564](https://github.com/vuetifyjs/0/issues/564))

  `upsert` (and the other registry mutators) silently dropped the optional `event` argument, so custom events never emitted for token registries; the wrappers now forward it and match the inherited `RegistryContext` signatures. `TokenValue` also widens to include `TokenCollection` so `ticket.value` reflects the nested objects stored under `flat: true` — the mode `useTheme`/`useFeatures` rely on — instead of claiming leaf/alias only.

  If you exhaustively narrow a `TokenValue` (or `ticket.value`) in a `switch`/type guard, add a `TokenCollection` (object) branch — the union now has an object member alongside the primitive and alias cases.

- [#427](https://github.com/vuetifyjs/0/pull/427) [`0c355e6`](https://github.com/vuetifyjs/0/commit/0c355e657b37c9254e8159486b69c01b4fdb2c18) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): `resolve()` no longer returns inherited prototype members — the alias-path walk used `segment in current`, which traverses the prototype chain, so resolving a path whose final segment named an `Object.prototype` member (`constructor`, `toString`, `hasOwnProperty`, `__proto__`, …) returned that builtin instead of `undefined` + the "Path not found" warning. `resolve()` now mirrors `flatten()`'s guard (`UNSAFE_KEYS` + `Object.prototype.hasOwnProperty.call`). Correctness/defense-in-depth — config and the resolve argument are developer-authored, so this is a consistency fix, not a security fix.

- [#589](https://github.com/vuetifyjs/0/pull/589) [`3b5565d`](https://github.com/vuetifyjs/0/commit/3b5565d8450260e4ca27174e710c19082bf82ef1) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): follow a `{alias}` reached through a segment path ([#566](https://github.com/vuetifyjs/0/issues/566))

  `resolve()` now re-resolves an alias that a dotted-segment lookup lands on, instead of returning the raw `'{alias}'` string. This is visible under `flat: true` (where nested groups are stored whole and addressed by segment), so `useTheme` — which resolves theme colors through a `flat: true` token table — no longer drops or leaks an unresolved `{alias}` for a palette entry that is itself an alias. The leaf-value branch already followed terminal aliases; the segment branch now matches it.

- [#648](https://github.com/vuetifyjs/0/pull/648) [`4c2ede3`](https://github.com/vuetifyjs/0/commit/4c2ede35af553631e2af9383014288a476f2636a) Thanks [@johnleider](https://github.com/johnleider)! - fix(Tooltip): expose anchor styles on Tooltip.Activator's renderless slot

  `Tooltip.Activator` now surfaces its CSS anchor-positioning styles as a `styles` slot prop (mirroring `Tooltip.Content`). In renderless mode the activator no longer renders its own element, so previously the anchor name was lost and the tooltip content could not position. Consumers can now bind `attrs` and apply `styles` onto their own trigger element — e.g. attaching a tooltip to a native `<button type="submit">` without the activator overriding its `type`.

- [#542](https://github.com/vuetifyjs/0/pull/542) [`76ca193`](https://github.com/vuetifyjs/0/commit/76ca1933d9c147a1f3ca53e4e9a9f579b49169cc) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): skip version notification on field-only upsert

  Patching an existing ticket via `upsert` no longer re-notifies version-subscribed
  iterating effects — membership and order are unchanged, and field changes already
  propagate through the shallowReactive ticket proxies and the `update:ticket`
  event. The read cache still refreshes so event-driven snapshot consumers
  (`useProxyRegistry`) observe a fresh array identity. This restores the pre-[#540](https://github.com/vuetifyjs/0/issues/540)
  iteration granularity for field patches.

- [#370](https://github.com/vuetifyjs/0/pull/370) [`7bd450c`](https://github.com/vuetifyjs/0/commit/7bd450c13c6d904bffe16ed320420e8fe78e9dab) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Treeview): don't intercept keyboard events originating from embedded interactive controls (switches, comboboxes, etc.) so they can handle their own key events

- [#341](https://github.com/vuetifyjs/0/pull/341) [`ab6da17`](https://github.com/vuetifyjs/0/commit/ab6da170680a383f26b9292975ef3aa6e2494c4f) Thanks [@J-Sek](https://github.com/J-Sek)! - fix(Treeview): let keyboard focus reach controls inside items

  Tab and Shift+Tab now move focus between a tree node and the focusable controls it contains. Tabbing out of a control advances from that control's own row, and `aria-disabled` controls are skipped.

- [#418](https://github.com/vuetifyjs/0/pull/418) [`9063b2c`](https://github.com/vuetifyjs/0/commit/9063b2c21e1f375b83e5926bd8a911094b3f2771) Thanks [@johnleider](https://github.com/johnleider)! - fix(useStack): make ticket blocking/scrim reactive

  `register()` now accepts `MaybeRefOrGetter` for `blocking`/`scrim` and exposes them as `Readonly<Ref<boolean>>` on the ticket, so a reactive `blocking` (e.g. a Dialog backing VDialog's reactive `persistent`) propagates instead of freezing at registration. `Dialog`/`AlertDialog`/`Portal` now pass them as getters.

  Type change: `StackTicket.blocking`/`scrim` are now `Readonly<Ref<boolean>>` (were `boolean`) — read `.value`. Reads are internal to v0; `register()` still accepts plain booleans.

- [#442](https://github.com/vuetifyjs/0/pull/442) [`789c2e9`](https://github.com/vuetifyjs/0/commit/789c2e94ec6998dc00b815f3aeb856ea40b1ffbb) Thanks [@johnleider](https://github.com/johnleider)! - fix(useStack): don't share the fallback stack across SSR requests — `useStack()` fell back to a module-scoped singleton when no provider existed, so in a long-lived Node SSR process overlay tickets persisted across requests (z-index bleed + unbounded memory growth). Under SSR (`!IN_BROWSER`), `getStackFallback()` now returns a fresh ephemeral `createStack()` per call instead of the shared global; the browser singleton is unchanged. For coordinated per-app SSR z-index, use `createStackPlugin` (as the docs already advise).

- [#588](https://github.com/vuetifyjs/0/pull/588) [`237c90a`](https://github.com/vuetifyjs/0/commit/237c90a6888b364e0c4bb650c8b79e69745c6a5b) Thanks [@johnleider](https://github.com/johnleider)! - fix(createValidation): stop `isValidating` sticking `true` when a silent validation interleaves an async one ([#588](https://github.com/vuetifyjs/0/issues/588)) — triggering a silent `validate()` while a non-silent async validation was still in flight left `isValidating` stuck at `true` (a permanent loading/validating state) until the next clean validation. The flag is now owned by the latest non-silent run and clears reliably.

## 1.0.0-rc.9

### Patch Changes

- [#619](https://github.com/vuetifyjs/0/pull/619) [`95d2d34`](https://github.com/vuetifyjs/0/commit/95d2d34c08692b15b9c6d2d173b010d80be7e024) Thanks [@johnleider](https://github.com/johnleider)! - fix(Switch,Form,Slider): correct ARIA states for mixed, native validation, and grouped form controls ([#543](https://github.com/vuetifyjs/0/issues/543))

  - `Switch.Root` and `Switch.SelectAll` no longer emit the spec-invalid `aria-checked="mixed"`; the value is clamped to `false` while indeterminate, so screen readers announce a valid switch state. Style indeterminate switches with `data-state="indeterminate"` as before.
  - `Switch.Thumb` and `Switch.Track` are now marked `aria-hidden="true"`, hiding the decorative visuals from assistive technology.
  - `Form.Root` now renders `novalidate` by default, so the browser's native constraint popups no longer block submit before v0's async validation runs. Opt back into native constraint validation with `:novalidate="false"`.
  - `Slider.Root` now exposes `role="group"` plus optional `label` / `ariaLabelledby` props, giving multi-thumb sliders an accessible group name.

- [#618](https://github.com/vuetifyjs/0/pull/618) [`d611c03`](https://github.com/vuetifyjs/0/commit/d611c03a1c8f462e51cc2a96032a114da8e91328) Thanks [@johnleider](https://github.com/johnleider)! - fix(Avatar,Scrim,Popover,Tooltip,Select,Toggle): restore dropped alt text and complete missing ARIA wiring ([#543](https://github.com/vuetifyjs/0/issues/543))

  - `Avatar.Image` now accepts an `alt` prop and passes consumer attributes (`alt`, `aria-label`, ...) through to the rendered element — previously they were silently dropped
  - `Scrim` backdrops are hidden from assistive technology with `aria-hidden="true"`
  - `Popover.Activator` explicitly exposes `aria-expanded` and `aria-controls` instead of relying on inconsistent native `popovertarget` mapping
  - `Tooltip.Content` closes on Escape when focus is inside interactive tooltip content
  - `Select.Activator` reflects the disabled state (`aria-disabled` + native `disabled`) and stays keyboard-focusable when rendered as a non-button element; `Select.Content` names its listbox via `aria-labelledby`
  - `Toggle.Group` gains `label`, `ariaLabelledby`, and `ariaDescribedby` props so the group can be named

- [#625](https://github.com/vuetifyjs/0/pull/625) [`584668d`](https://github.com/vuetifyjs/0/commit/584668d559add9271593b5089d16c01c25134214) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Carousel): pause autoplay while keyboard focus is inside the carousel ([#625](https://github.com/vuetifyjs/0/issues/625))

  Moving focus into the carousel now pauses auto-rotation and moving focus out resumes it, mirroring the existing pointer/touch behavior and satisfying WCAG 2.2.2 (Pause, Stop, Hide).

- [#627](https://github.com/vuetifyjs/0/pull/627) [`396ea49`](https://github.com/vuetifyjs/0/commit/396ea49d9ddcc17091bfd9907babbb256301e118) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Splitter): give the resize handle a default localized `aria-label` ([#627](https://github.com/vuetifyjs/0/issues/627))

  A `Splitter.Handle` without an explicit `label` now falls back to the localized `Splitter.handle` string ("Resize"), so `role="separator"` always exposes an accessible name to assistive technology (WCAG 4.1.2, Name/Role/Value).

- [#626](https://github.com/vuetifyjs/0/pull/626) [`a1df426`](https://github.com/vuetifyjs/0/commit/a1df4263153830feffacfa23fcab575d1feaf809) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Treeview): expose the active node to assistive technology via `aria-current` ([#626](https://github.com/vuetifyjs/0/issues/626))

  Navigation trees without checkbox selection now convey the current node — the active `treeitem` emits `aria-current="true"` alongside the existing `aria-selected`, so screen readers can announce the focused node.

- [#606](https://github.com/vuetifyjs/0/pull/606) [`9ca3fb3`](https://github.com/vuetifyjs/0/commit/9ca3fb3d23b8b7153083edc2a1dbff48c8b74512) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(useRtl,useTheme): keep SSR head entries in sync with reactive state ([#606](https://github.com/vuetifyjs/0/issues/606))

  During server rendering, the `dir` attribute, `data-theme`, and injected theme styles now update via `entry.patch` when RTL or theme state changes after the initial head push — previously the first-rendered values were frozen for the rest of the request. Adapter disposal also cleans up the new watchers alongside the head entry.

- [#655](https://github.com/vuetifyjs/0/pull/655) [`65952f2`](https://github.com/vuetifyjs/0/commit/65952f27190745da40ff62e82505cf04c56a6a40) Thanks [@johnleider](https://github.com/johnleider)! - chore(maturity): promote the 1.0 component spine to `stable` — 13 headless components are now API-locked for 1.0: the primitives `Atom` and `AspectRatio`, the providers `Theme`, `Group`, `Selection`, `Single`, and `Step`, the `Tabs`, `Toggle`, and `Collapsible` disclosure/interaction components, and the `Checkbox`, `Radio`, and `Switch` form controls. Three supporting composables graduate with them — `useProxyModel`, `toElement`, and `toArray` — because every promoted component rests on them, and a stable component cannot sit on a `preview` logic layer. No behavior or signature changes: this is a stability commitment, not a code change, so no consumer action is required.

- [#589](https://github.com/vuetifyjs/0/pull/589) [`3b5565d`](https://github.com/vuetifyjs/0/commit/3b5565d8450260e4ca27174e710c19082bf82ef1) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): follow a `{alias}` reached through a segment path ([#566](https://github.com/vuetifyjs/0/issues/566))

  `resolve()` now re-resolves an alias that a dotted-segment lookup lands on, instead of returning the raw `'{alias}'` string. This is visible under `flat: true` (where nested groups are stored whole and addressed by segment), so `useTheme` — which resolves theme colors through a `flat: true` token table — no longer drops or leaks an unresolved `{alias}` for a palette entry that is itself an alias. The leaf-value branch already followed terminal aliases; the segment branch now matches it.

- [#648](https://github.com/vuetifyjs/0/pull/648) [`4c2ede3`](https://github.com/vuetifyjs/0/commit/4c2ede35af553631e2af9383014288a476f2636a) Thanks [@johnleider](https://github.com/johnleider)! - fix(Tooltip): expose anchor styles on Tooltip.Activator's renderless slot

  `Tooltip.Activator` now surfaces its CSS anchor-positioning styles as a `styles` slot prop (mirroring `Tooltip.Content`). In renderless mode the activator no longer renders its own element, so previously the anchor name was lost and the tooltip content could not position. Consumers can now bind `attrs` and apply `styles` onto their own trigger element — e.g. attaching a tooltip to a native `<button type="submit">` without the activator overriding its `type`.

## 1.0.0-rc.8

### Patch Changes

- [#546](https://github.com/vuetifyjs/0/pull/546) [`03b298f`](https://github.com/vuetifyjs/0/commit/03b298f61270dea573e64f618b48173de20cbd4d) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Combobox): route ComboboxEmpty default slot text through useLocale

  The hardcoded `"No results"` fallback in `ComboboxEmpty` was not going through `useLocale`, violating PHILOSOPHY §5.5 (locale-first strings). Added a `Combobox.noResults` key to the English message bundle and changed the default slot content to `{{ locale.ti('Combobox.noResults') ?? 'No results' }}`, matching the pattern used by `Dialog.Close` and other components. Consumers who override the default slot are unaffected.

- [#555](https://github.com/vuetifyjs/0/pull/555) [`9c04ead`](https://github.com/vuetifyjs/0/commit/9c04eadc12c5b2f037aa1202184fe70142646030) Thanks [@johnleider](https://github.com/johnleider)! - perf(createDataGrid): dramatically faster sorting, drag-reordering, and initialization on large grids ([#555](https://github.com/vuetifyjs/0/issues/555))

  Grids with thousands of rows are far faster to sort, drag-reorder, and build — a 10k-row sort is ~28× faster, drag-reordering ~6.5×, and initial construction ~2×. No API change and no migration: existing grids get the speedup on upgrade.

- [#585](https://github.com/vuetifyjs/0/pull/585) [`da2e0c1`](https://github.com/vuetifyjs/0/commit/da2e0c115fb3b1001634a392162c8e22e82a8bfa) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): disabled tickets are now inert to unselect and toggle

  Gesture operations (select, unselect, toggle) no longer mutate disabled tickets in either direction. Wholesale operations (apply/v-model, selectAll, cascade propagation, clear) still drain disabled ids so state can never get stuck.

- [#579](https://github.com/vuetifyjs/0/pull/579) [`23e7a0b`](https://github.com/vuetifyjs/0/commit/23e7a0b421d74397c1a70fbb59c99781c52ebb96) Thanks [@johnleider](https://github.com/johnleider)! - fix(createNested): leaf-mode parent unselect respects mandatory atomically instead of half-clearing the branch

- [#584](https://github.com/vuetifyjs/0/pull/584) [`df823ca`](https://github.com/vuetifyjs/0/commit/df823cad723bb23dc67ce98036d795ce064173dc) Thanks [@johnleider](https://github.com/johnleider)! - fix(createNumberField): commit now no-ops while disabled or readonly, matching increment and decrement

- [#580](https://github.com/vuetifyjs/0/pull/580) [`52b0ea8`](https://github.com/vuetifyjs/0/commit/52b0ea8387242de5f43424d37f2d0c9d80727f74) Thanks [@johnleider](https://github.com/johnleider)! - fix(createProgress): fromValue offsets by min so ProgressFill width matches the ARIA percent

- [#582](https://github.com/vuetifyjs/0/pull/582) [`e741325`](https://github.com/vuetifyjs/0/commit/e741325cf10874c682acd119529e4cdb44a9fb26) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): apply fully replaces the selection under multiple+mandatory instead of stranding a stale id

- [#583](https://github.com/vuetifyjs/0/pull/583) [`9127759`](https://github.com/vuetifyjs/0/commit/9127759efd6dc53b18e260d238277825fed017ea) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSlider): thumb operations (set, up, down, floor, ceil) now no-op while disabled, as documented

- [#581](https://github.com/vuetifyjs/0/pull/581) [`cdc9fb5`](https://github.com/vuetifyjs/0/commit/cdc9fb556844f5545227ca88eb44c4401afc69c7) Thanks [@johnleider](https://github.com/johnleider)! - fix(createForm): submit no longer reports failure when a field validation was superseded by a newer concurrent call

  A superseded validate() now resolves to the latest validation's outcome instead of false, so double-submits and concurrent field validation report the form's actual validity.

- [#587](https://github.com/vuetifyjs/0/pull/587) [`7f01ea0`](https://github.com/vuetifyjs/0/commit/7f01ea01b211bc0c0c3defa86c13c8ab5c6bffa8) Thanks [@johnleider](https://github.com/johnleider)! - fix(useProxyModel): apply the current v-model to late-registering tickets ([#587](https://github.com/vuetifyjs/0/issues/587)) — when the v-model changed before a value's ticket registered (e.g. tabs, carousels, or button groups whose items load asynchronously), the stale value was still selected once the ticket arrived, leaving the registry out of sync with the v-model. Late registration now honours the current model value.

- [#570](https://github.com/vuetifyjs/0/pull/570) [`e770c89`](https://github.com/vuetifyjs/0/commit/e770c89545cf4ec6666cc2b743f78938851fa7c6) Thanks [@johnleider](https://github.com/johnleider)! - fix(createRegistry): dispatch batched events even when the batch callback throws ([#570](https://github.com/vuetifyjs/0/issues/570))

  Event-driven consumers (e.g. `useProxyRegistry` snapshots) no longer go stale when a batch or `onboard` throws after some mutations already applied — the queued events for those applied mutations now flush regardless of whether the callback completes.

- [#565](https://github.com/vuetifyjs/0/pull/565) [`05be673`](https://github.com/vuetifyjs/0/commit/05be673d6affb83143a8dcba04554fac49d43c64) Thanks [@johnleider](https://github.com/johnleider)! - fix(createRegistry): heal offboard reindex, id identity, and batched field-only upserts

  Three correctness fixes to the registry foundation:

  - **`offboard` now eagerly reindexes** when index-derived tickets shift position, so `values()` / `entries()` and `useProxyRegistry` consumers see corrected `index` / `value` immediately — previously a mid-list `offboard()` left the default (index-valued) survivors stale until some later position-reading call drained the deferred reindex, and iteration-only consumers never healed. It also drops the stale iteration cache before the removals so a sync effect firing mid-`offboard` never observes removed ids.
  - **`offboard` preserves a supplied `id`** across a transfer even when the ticket has no explicit value. It previously used `valueIsIndex` as a proxy for "id was auto-generated" and stripped the id of any value-less ticket, so `register({ id: 'a' })` → `offboard(['a'])` returned `{}` and lost identity. Now only ids the registry itself minted are stripped. **Behavior delta for the selection chain:** `createModel` and everything built on it mint ids in their wrappers before calling `register`, so those ids read as supplied to the base registry — `offboard` now preserves them where it previously stripped them for value-less tickets. Downstream transfers (e.g. moving items between selections) keep their identity instead of getting a fresh id on re-onboard.
  - **`batch()` no longer re-notifies iteration subscribers for a field-only upsert (or an empty batch)**, matching the non-batched `upsert` contract (§4.4): a batch that changes no membership or order leaves version subscribers untouched.

- [#569](https://github.com/vuetifyjs/0/pull/569) [`e653ef5`](https://github.com/vuetifyjs/0/commit/e653ef59537ccb489765b505b320a1db18cf5133) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - test(plugins): lock in SSR safety for every plugin composable ([#569](https://github.com/vuetifyjs/0/issues/569))

  Adds an SSR contract test to each plugin composable — no throw without a provider, and a fresh fallback per call so nothing leaks between requests — plus a guard that fails if a new plugin ships without one. The `useStack` leak these guard against was fixed in [#442](https://github.com/vuetifyjs/0/issues/442).

- [#586](https://github.com/vuetifyjs/0/pull/586) [`562bd14`](https://github.com/vuetifyjs/0/commit/562bd1457c5c5b05c73fa8af69b4a61cef029451) Thanks [@johnleider](https://github.com/johnleider)! - fix(Switch): keep `Switch.Thumb` visible in every state — it no longer forces an inline `visibility: hidden` when the switch is off. The thumb had inherited the "present-when-on" indicator template from `Checkbox`/`Radio`/`Toggle`, but a switch knob is always visible and slides between positions. The inline style also sat at the top of the cascade, forcing consumers to override it with `visibility: visible !important`. Drive the off/on appearance from the `data-state` attribute (`checked` / `unchecked` / `indeterminate`) — e.g. `translate-x-1 data-[state=checked]:translate-x-6` — which now animates directly from the off position. `Switch.Thumb`'s slot `attrs` no longer includes a `style` key.

- [#564](https://github.com/vuetifyjs/0/pull/564) [`ef7316b`](https://github.com/vuetifyjs/0/commit/ef7316bb08861501cf163aebac4c805b61c89da5) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): mutators now forward their `event` argument and `ticket.value` is typed accurately under `flat: true` ([#564](https://github.com/vuetifyjs/0/issues/564))

  `upsert` (and the other registry mutators) silently dropped the optional `event` argument, so custom events never emitted for token registries; the wrappers now forward it and match the inherited `RegistryContext` signatures. `TokenValue` also widens to include `TokenCollection` so `ticket.value` reflects the nested objects stored under `flat: true` — the mode `useTheme`/`useFeatures` rely on — instead of claiming leaf/alias only.

  If you exhaustively narrow a `TokenValue` (or `ticket.value`) in a `switch`/type guard, add a `TokenCollection` (object) branch — the union now has an object member alongside the primitive and alias cases.

- [#588](https://github.com/vuetifyjs/0/pull/588) [`237c90a`](https://github.com/vuetifyjs/0/commit/237c90a6888b364e0c4bb650c8b79e69745c6a5b) Thanks [@johnleider](https://github.com/johnleider)! - fix(createValidation): stop `isValidating` sticking `true` when a silent validation interleaves an async one ([#588](https://github.com/vuetifyjs/0/issues/588)) — triggering a silent `validate()` while a non-silent async validation was still in flight left `isValidating` stuck at `true` (a permanent loading/validating state) until the next clean validation. The flag is now owned by the latest non-silent run and clears reliably.

## 1.0.0-rc.7

### Patch Changes

- [#540](https://github.com/vuetifyjs/0/pull/540) [`2ed9618`](https://github.com/vuetifyjs/0/commit/2ed9618ed365ef9e1a6c6b3bce6c4c6962f689e0) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): memoize reactive keys/values/entries behind a version signal

  Reactive-mode iteration reads previously bypassed the result cache and read the
  order array through its shallowReactive proxy — one trap per index and, inside
  an effect, one tracked dependency per index. Reads now touch a single version
  signal (bumped on every structural mutation) and share the non-reactive cache,
  making reactive reads O(1) between mutations and giving subscribing effects one
  dependency regardless of collection size. Mid-batch reads now always reflect
  mutations already applied instead of a stale pre-batch snapshot.

- [#531](https://github.com/vuetifyjs/0/pull/531) [`49e4f8b`](https://github.com/vuetifyjs/0/commit/49e4f8b7235f3c2a5213ccce63850b8b78014f66) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): use O(1) ticket.index for unregister splice locate (with indexOf fallback); avoid values() allocation/copy in seek first/last; never eagerly drain reindex in unregister to preserve the lazy contract

- [#489](https://github.com/vuetifyjs/0/pull/489) [`5c6d087`](https://github.com/vuetifyjs/0/commit/5c6d0871ddc148c52fe6ba4cbd569b433f7b77fc) Thanks [@johnleider](https://github.com/johnleider)! - fix(security): apply prototype-pollution and CSS-injection guards flagged in the security review

  - `useFeatures` adapters (LaunchDarkly / Flagsmith / PostHog) now skip `UNSAFE_KEYS` (`__proto__` / `constructor` / `prototype`) flag names when building the flags object, matching the guard already used by `mergeDeep`, `usePermissions`, and `createTokens`
  - `useLocale` `restore()` validates the persisted value with `isString` / `isNumber` guards before applying it instead of blind-casting `saved as ID`, completing the persist/restore sweep (`useTheme` and `useRtl` now use the same guards)
  - `ThemeAdapter`'s `UNSAFE_CSS` denylist is hardened against declaration injection: it now also rejects `;`, `\` (CSS escape evasion), and the URL-loading functions `src()` / `image()` / `image-set()` / `cross-fade()`
  - `@vuetify/paper` `useTheme` sanitizes color keys and values before writing them into the injected `<style>` element, mirroring the hardened v0 `ThemeAdapter` `SAFE_IDENT` / `UNSAFE_CSS` guards
  - `@vuetify/paper` `createTheme` now merges `options.themes` into the defaults — previously they were passed as `structuredClone`'s options bag and silently dropped, so a custom `current` theme threw at first render
  - `V0Error` filters `UNSAFE_KEYS` when copying caller-supplied error details onto the instance

- [#500](https://github.com/vuetifyjs/0/pull/500) [`ffc4e5a`](https://github.com/vuetifyjs/0/commit/ffc4e5aaec7df81b1b62f022fe78cb4dfc5ef01b) Thanks [@johnleider](https://github.com/johnleider)! - fix(useRules): accept spec-compliant Standard Schema issue paths

  Widens the vendored `StandardSchemaV1` issue `path` typing to `ReadonlyArray<PropertyKey | PathSegment>` per the Standard Schema v1 spec, so schemas typed with `@standard-schema/spec` (Valibot, Zod, ArkType) are assignable to `rules` again.

- [#542](https://github.com/vuetifyjs/0/pull/542) [`76ca193`](https://github.com/vuetifyjs/0/commit/76ca1933d9c147a1f3ca53e4e9a9f579b49169cc) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): skip version notification on field-only upsert

  Patching an existing ticket via `upsert` no longer re-notifies version-subscribed
  iterating effects — membership and order are unchanged, and field changes already
  propagate through the shallowReactive ticket proxies and the `update:ticket`
  event. The read cache still refreshes so event-driven snapshot consumers
  (`useProxyRegistry`) observe a fresh array identity. This restores the pre-[#540](https://github.com/vuetifyjs/0/issues/540)
  iteration granularity for field patches.

## 1.0.0-rc.6

### Patch Changes

- [#470](https://github.com/vuetifyjs/0/pull/470) [`38b27ed`](https://github.com/vuetifyjs/0/commit/38b27edba93ecf4b2f9f9fb4d323bce0f4504d05) Thanks [@johnleider](https://github.com/johnleider)! - chore(maturity): promote the v1 stable set to `stable` — the selection family (`createModel`, `createSelection`, `createSingle`, `createStep`, `createGroup`, `createNested`), `createRegistry`, and the plugin trio (`useTheme`, `useStorage`, `useBreakpoints`) are now API-locked for 1.0. They join the already-stable foundation (`createContext`, `createPlugin`, `createTrinity`) and observer (`useIntersectionObserver`, `useMutationObserver`, `useResizeObserver`) composables, bringing the stable surface to 16 composables plus the 17 stable utilities.

## 1.0.0-beta.5

### Patch Changes

- [#451](https://github.com/vuetifyjs/0/pull/451) [`fe12826`](https://github.com/vuetifyjs/0/commit/fe12826195d1d887681c9bab67506de2ddd7b391) Thanks [@johnleider](https://github.com/johnleider)! - fix: bring component ARIA/data attributes into PHILOSOPHY §3.6 compliance — `ExpansionPanel` content now emits `data-selected` as `true | undefined` (it was a raw boolean, so `[data-selected]` matched even when unselected), and `Slider` thumb / `Rating` root now emit `aria-disabled` as a concrete boolean (it was `true | undefined`, which dropped the attribute when not disabled).

## 1.0.0-beta.4

### Minor Changes

- [#372](https://github.com/vuetifyjs/0/pull/372) [`d075615`](https://github.com/vuetifyjs/0/commit/d0756155c3c5a8d480cf32a4d56ec162b1751bc3) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(locale): add `ti()` so components carry inline English aria labels without bundling a locale (WCAG 4.1.2)

  - `locale.ti(key, ...params)` ("translate if exists") returns the translation or `undefined` instead of echoing the key, enabling the `ti(key) ?? '<default>'` pattern at call sites
  - Every v0 component now provides a built-in English aria label via `ti(...) ?? '<default>'`, so apps with no locale plugin get meaningful accessible names — with zero strings bundled into the runtime fallback
  - `@vuetify/v0/locale/messages/en` is exposed as an optional export: the canonical English catalog, handy for seeding a translation or registering full English coverage (never imported by the runtime)

- [#397](https://github.com/vuetifyjs/0/pull/397) [`19aac62`](https://github.com/vuetifyjs/0/commit/19aac62a16c6e236152e176ef6611a07d3ca359b) Thanks [@johnleider](https://github.com/johnleider)! - fix(Dialog, Snackbar): overlays can teleport into the topmost open modal so snackbars shown over a modal Dialog appear above it and stay interactive ([#279](https://github.com/vuetifyjs/0/issues/279))

  A native modal `<dialog>` (`showModal()`) is promoted to the browser **top layer**, which paints above all `z-index` and makes everything outside its subtree inert — so an overlay teleported to `body` rendered beneath the dialog and was unclickable. Overlays can now teleport into the top-layer subtree instead:

  - `Snackbar.Portal` now defaults `teleport` to `'top-layer'`, mounting into the topmost open modal `<dialog>` when one is open and falling back to `body` otherwise. `teleport="body"` (always body) and `:teleport="false"` (render inline) remain escape hatches.
  - `Portal` accepts a new `to="top-layer"` token that resolves to the topmost modal element, or `body` when no modal is open.
  - `useStack` exposes a new `topElement` context field and an `el` option on `register()`, so modal dialogs publish their element as the teleport target.
  - `useClickOutside` bounds mode no longer treats a strict DOM descendant as an outside click, so clicking an overlay teleported into a `<dialog>` (e.g. a Snackbar and its close button) no longer dismisses the dialog. Backdrop clicks (target is the dialog itself) still close it.

### Patch Changes

- [#443](https://github.com/vuetifyjs/0/pull/443) [`2f4275c`](https://github.com/vuetifyjs/0/commit/2f4275cb3dd3162aa89bb0183159380039b5a35d) Thanks [@johnleider](https://github.com/johnleider)! - fix(build): ship type declarations for the `@vuetify/v0/browser` entry — `./browser` mapped to `./dist/browser/index.js` with no `.d.ts`, so `are-the-types-wrong` flagged it `UntypedResolution` and TypeScript consumers importing `@vuetify/v0/browser` got no types. The browser bundle now emits `dist/browser/index.d.ts` (it bundles the same `src/index.ts` as the main entry, so its types are identical), and the `repo:exports` attw check no longer needs to exclude the browser entrypoint.

- [#390](https://github.com/vuetifyjs/0/pull/390) [`5db6a0d`](https://github.com/vuetifyjs/0/commit/5db6a0de80821b48603b876ba420a99c1bcf7ad1) Thanks [@johnleider](https://github.com/johnleider)! - fix(Button): don't auto-set aria-label in renderless mode — in renderless mode the consumer owns the DOM and is responsible for the accessible name; the automatic icon-only fallback no longer overrides visible text in mixed-content renderless usages

  Also migrates the solo icon-only fallback to `locale.ti('Button.label') ?? 'Button'`, matching the inline accessible-name default every other component now ships, so an unconfigured app gets `"Button"` instead of the raw `Button.label` key.

- [#426](https://github.com/vuetifyjs/0/pull/426) [`dc0fc00`](https://github.com/vuetifyjs/0/commit/dc0fc00d5a61dcdfe108ffbb52682407971ef1b5) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): reject disabled items in multiple-mode `apply()` — the v-model sync path (`apply()`) could select a disabled item even though `select`/`unselect`/`toggle` all reject them, violating the "disabled = all selection ops are no-ops" contract. `createModel.apply()`'s browse-fallback now routes through `select()` (which guards instance- and ticket-level `disabled`), and `createSelection.apply()`'s multiple branch gains an inline per-ticket guard before adding (kept inline rather than routed through `select()` so the single-mode `multiple: true` override still works). The ref-write value-sync path is untouched. Affects multiple-mode `createSelection`/`createGroup`/`createNested` via `useProxyModel`.

- [#371](https://github.com/vuetifyjs/0/pull/371) [`3ee1d85`](https://github.com/vuetifyjs/0/commit/3ee1d851b384166217368b6f428c398f18e7515d) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(NumberField): pass parsed value directly to commit() so typed values correctly propagate to the parent v-model on blur and Enter — avoids reading the stale model before Vue's reactivity round-trip completes

- [#417](https://github.com/vuetifyjs/0/pull/417) [`0cd2de5`](https://github.com/vuetifyjs/0/commit/0cd2de57d4e113784ba28a0cb98896386af8755b) Thanks [@johnleider](https://github.com/johnleider)! - perf(Overflow): cache item visibility in a hidden-index set, dropping per-item O(n) rank scans to O(1) (whole-list visibility goes from O(n²) to O(n) per resize)

- [#416](https://github.com/vuetifyjs/0/pull/416) [`6e8f86c`](https://github.com/vuetifyjs/0/commit/6e8f86ceb1fcc59b82b9b1f0e0b3e236438269df) Thanks [@johnleider](https://github.com/johnleider)! - fix(usePopover): coerce the synthesized `anchor-name` / `position-anchor` custom-ident to a valid charset

  A consumer-supplied `id` (or activator `target` / content `_id`) containing non-ident characters produced an invalid `--${id}` custom-property name. The browser rejects it on the client (`style.setProperty` drops the whole inline value), so anchor positioning silently broke. The interpolated identifier is now coerced to `[a-zA-Z0-9_-]`, mirroring the `SAFE_IDENT` guard `ThemeAdapter` already applies. The raw `id` is still used verbatim for the DOM element id and the `popovertarget` linkage — only the CSS custom-ident is coerced, so the native popover wiring is unchanged.

- [#424](https://github.com/vuetifyjs/0/pull/424) [`ceaeba8`](https://github.com/vuetifyjs/0/commit/ceaeba80fd89e1e7e190e82bdc94fea23d9e875f) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): remove the adopted stylesheet on V0 adapter dispose — the browser adapter (`V0StyleSheetThemeAdapter`) appended a `CSSStyleSheet` to `document.adoptedStyleSheets` in `upsert()` but `dispose()` only stopped the Vue watchers, leaking orphaned sheets on repeated mount/unmount (HMR, test suites, micro-frontend teardown). Dispose now filters the sheet out of `adoptedStyleSheets` and clears the ref across all three dispose paths, mirroring the sibling unhead adapter. Follow-up to the leak-safe adapter lifecycle work.

- [#441](https://github.com/vuetifyjs/0/pull/441) [`bf61d28`](https://github.com/vuetifyjs/0/commit/bf61d285eb184ebb8ecf49a73a201e1dc1e5f468) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): apply `cspNonce` on the SSR head path — `V0StyleSheetThemeAdapter` accepted a `cspNonce` option but never applied it: the SSR `head.push` `<style>` was emitted without the nonce, so strict-CSP (`style-src 'nonce-…'`) apps had their server-rendered theme styles blocked (FOUC until client hydration). The nonce is now threaded into the SSR style entry, and `V0UnheadThemeAdapter` accepts and forwards `cspNonce` too (initial push, reactive patch, and `update()`). The nonce is added only when set, so non-CSP usage is unchanged. The client `adoptedStyleSheets` path correctly needs no nonce.

- [#440](https://github.com/vuetifyjs/0/pull/440) [`999c41f`](https://github.com/vuetifyjs/0/commit/999c41fbd960cd394b82974b0ea2618a8aa819d8) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): validate the theme adapter `prefix` against `SAFE_IDENT` — `ThemeAdapter.generate()` sanitized theme names, color keys, and values, but interpolated the adapter `prefix` into the generated CSS (`--${prefix}-…`, `var(--${prefix}-on-background)`) unvalidated, so a malformed prefix (e.g. containing `}`) could break out of the declaration block and inject arbitrary CSS rules. The constructor now rejects any prefix that doesn't match `SAFE_IDENT` (`/^[a-zA-Z0-9_-]+$/`) with a `V0Error` (`V0_THEME_INVALID_PREFIX`), mirroring the guard already applied to adjacent inputs and the `V0_PALETTE_INVALID_SEED` precedent. Both `V0StyleSheetThemeAdapter` and the unhead adapter inherit it. Non-breaking — valid prefixes already match.

- [#427](https://github.com/vuetifyjs/0/pull/427) [`0c355e6`](https://github.com/vuetifyjs/0/commit/0c355e657b37c9254e8159486b69c01b4fdb2c18) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): `resolve()` no longer returns inherited prototype members — the alias-path walk used `segment in current`, which traverses the prototype chain, so resolving a path whose final segment named an `Object.prototype` member (`constructor`, `toString`, `hasOwnProperty`, `__proto__`, …) returned that builtin instead of `undefined` + the "Path not found" warning. `resolve()` now mirrors `flatten()`'s guard (`UNSAFE_KEYS` + `Object.prototype.hasOwnProperty.call`). Correctness/defense-in-depth — config and the resolve argument are developer-authored, so this is a consistency fix, not a security fix.

- [#370](https://github.com/vuetifyjs/0/pull/370) [`7bd450c`](https://github.com/vuetifyjs/0/commit/7bd450c13c6d904bffe16ed320420e8fe78e9dab) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Treeview): don't intercept keyboard events originating from embedded interactive controls (switches, comboboxes, etc.) so they can handle their own key events

- [#341](https://github.com/vuetifyjs/0/pull/341) [`ab6da17`](https://github.com/vuetifyjs/0/commit/ab6da170680a383f26b9292975ef3aa6e2494c4f) Thanks [@J-Sek](https://github.com/J-Sek)! - fix(Treeview): let keyboard focus reach controls inside items

  Tab and Shift+Tab now move focus between a tree node and the focusable controls it contains. Tabbing out of a control advances from that control's own row, and `aria-disabled` controls are skipped.

- [#418](https://github.com/vuetifyjs/0/pull/418) [`9063b2c`](https://github.com/vuetifyjs/0/commit/9063b2c21e1f375b83e5926bd8a911094b3f2771) Thanks [@johnleider](https://github.com/johnleider)! - fix(useStack): make ticket blocking/scrim reactive

  `register()` now accepts `MaybeRefOrGetter` for `blocking`/`scrim` and exposes them as `Readonly<Ref<boolean>>` on the ticket, so a reactive `blocking` (e.g. a Dialog backing VDialog's reactive `persistent`) propagates instead of freezing at registration. `Dialog`/`AlertDialog`/`Portal` now pass them as getters.

  Type change: `StackTicket.blocking`/`scrim` are now `Readonly<Ref<boolean>>` (were `boolean`) — read `.value`. Reads are internal to v0; `register()` still accepts plain booleans.

- [#442](https://github.com/vuetifyjs/0/pull/442) [`789c2e9`](https://github.com/vuetifyjs/0/commit/789c2e94ec6998dc00b815f3aeb856ea40b1ffbb) Thanks [@johnleider](https://github.com/johnleider)! - fix(useStack): don't share the fallback stack across SSR requests — `useStack()` fell back to a module-scoped singleton when no provider existed, so in a long-lived Node SSR process overlay tickets persisted across requests (z-index bleed + unbounded memory growth). Under SSR (`!IN_BROWSER`), `getStackFallback()` now returns a fresh ephemeral `createStack()` per call instead of the shared global; the browser singleton is unchanged. For coordinated per-app SSR z-index, use `createStackPlugin` (as the docs already advise).
