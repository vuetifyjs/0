# @paper/bootstrap — Design Spec

## Identity

**Class:** Compat (see [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md) *Compat class*).

Bootstrap 6 ships CSS and a JavaScript bundle. `@paper/bootstrap` replaces the
bundle. Components render Bootstrap 6's real markup and classes against the
user's own Bootstrap stylesheet. `@vuetify/v0` provides behavior, focus, and
accessibility. The package never imports `bootstrap`, `bootstrap/js`,
`@floating-ui/dom`, or `vanilla-calendar-pro`.

Component prefix: `B*`.

**Coverage.** Tier 1 is the Bootstrap 6 docs catalog pinned in
[harness/PIN.md](harness/PIN.md): the JS plugins and the documented content,
form, and layout families. A v0 primitive existing is not a reason to add a
component Bootstrap does not document. Tier 2 is named below and stays labeled.

## Upstream pin

- **Peer:** `bootstrap@>=6.0.0-0`, optional, the day that version exists on npm.
  It is **not** in `package.json` yet. pnpm `autoInstallPeers` tries to resolve
  every peer range, and `>=6.0.0-0` matches nothing (latest published is
  5.3.8), which fails the workspace install. Add the peer and
  `peerDependenciesMeta.optional` in the same commit that flips `PIN.md` to a
  real npm version. Zero-config consumers load the CSS off a CDN. The package
  never imports it.
- **npm:** unreleased as of the pin date. `package.json` on `v6-dev` says
  `6.0.0-alpha1`; that string is not a published artifact. Latest npm release
  is still 5.3.x. Bootstrap 5 is unsupported.
- **SHA:** `f6cc0f2cde9cbf3d73759ada24a39555d2de3a12` (`twbs/bootstrap` `v6-dev`,
  2026-10-07). Flip the pin to the published version when one exists.
- **Docs:** https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/
- No stylesheet artifact. No owned token prefix. `createBootstrapPlugin()` is
  optional. It sets `data-bs-theme` and, when a theme color is passed, the
  matching `--bs-*` variable. It does not write `--v0-*` or a package prefix.
  Components render without it.

## Declared deviations from DESIGN_SYSTEMS.md

Inherent to the compat class:

1. **No owned token namespace** (ruling 1) — `--bs-*` belongs to upstream.
2. **Native form controls where Bootstrap's CSS demands them** (ruling 2) —
   `.form-control` styles native `<input>`, `<textarea>`, and `<select>`. A
   non-native control gets none of the user's CSS. Rich controls that Bootstrap
   6 documents itself (`BCombobox`, `BOtp`, `BRange`) are Tier 1 on v0
   primitives. `BDatepicker` is gated on `createDatePicker`.
3. **Upstream state classes, unprefixed** (ruling 3) — open state is `.show`
   or the native `open` attribute, not `data-open`. State classes are
   component-owned and set from v0 state. There is no `show` prop.

Rules kept: never `<style>` in package source; parts are the Bootstrap HTML;
a11y via v0; conformance harness diffs rendered markup against pinned fixtures.
Additive attributes are `aria-*`, `data-*`, `role`, `tabindex`, and `id` only.

## v6 names

Names follow the v6 docs, not BootstrapVue.

| v6 | Not |
|---|---|
| `BDialog` | `BModal` |
| `BDrawer` | `BOffcanvas` |
| `BMenu` | `BDropdown` |

`BDialog` is a native `<dialog class="dialog">` with `v-model`. Backdrop is
`::backdrop`. Do not mount v0 `Scrim`. `BMenu` uses `usePopover` and must not
set the native `popover` attribute. Positioning is whatever adapter the app
installed (`V0PopoverAdapter` by default, or `FloatingUIPopoverAdapter` from
`@vuetify/v0/popover/adapters/floating-ui`). This package does not depend on
`@floating-ui/dom`.

Buttons are two classes: `variant` → `btn-solid` / `btn-outline` / `btn-subtle`
/ `btn-text`, and `theme` → `theme-{theme}`. Utilities use colons (`md:col-6`),
not `col-md-6`.

Accordion is `<details>` / `<summary>`. Navbar collapse is a drawer. Collapse
toggles `.show` only — there is no `.collapsing` class.

## BDialog

Native `<dialog class="dialog">`. v0 `Dialog.Root` owns `v-model`.
`Dialog.Content` is renderless, with `scrim` false and `closeOnClickOutside`
false, because that mode exposes no element. This component calls `showModal()`
and `close()` on its own `<dialog>`.

Backdrop is `::backdrop`. A backdrop click is a click whose target is the
dialog element.

- `blocking` is Bootstrap's `backdrop: "static"`. The click adds
  `.dialog-static` for the bounce and does not close. Escape still closes
  unless `keyboard` is false. `keyboard: false` bounces a modal dialog and
  does not close it. A non-modal dialog ignores Escape with no bounce.
- `modal` defaults to true (`showModal()`). False calls `show()`, adds
  `.dialog-nonmodal`, and does not set `dialog-open`. There is no backdrop.
- Close adds `.hiding` and calls `close()` after the opacity transition, so
  the exit animation still has a top layer and a backdrop. `.dialog-instant`
  and `prefers-reduced-motion: reduce` close immediately.
- While a modal dialog is open, `dialog-open` is set on
  `document.documentElement` and removed when none remain.
- `size` adds `dialog-sm`, `dialog-lg`, or `dialog-xl`. `dialog-scrollable`,
  `dialog-fullscreen`, `dialog-instant`, and the slide modifiers are user
  classes.
- Do not emit `data-bs-toggle` or `data-bs-dismiss`. Conform ignores `open`
  and `style` (native open state, stack z-index).
- `BDialogTitle` is `Dialog.Title` as `h1.dialog-title` and supplies
  `aria-labelledby`. `BDialogClose` is `button.btn-close`. It injects
  `bootstrap:dialog` and warns in dev when that context is missing.

## BDrawer

Native `<dialog class="drawer">`. Same factory as `BDialog`: v0 `Dialog.Root`
owns `v-model`, `Dialog.Content` is renderless (`scrim` false,
`closeOnClickOutside` false), and this component calls `showModal()` and
`close()` on its own `<dialog>`. Backdrop is `::backdrop`.

- `placement` adds exactly one of `drawer-start`, `drawer-end`, `drawer-top`,
  `drawer-bottom`, `drawer-fullscreen`. Bootstrap ships no default placement,
  so an omitted prop adds no placement class. `sheet` adds `drawer-sheet`.
- `drawer-instant`, `drawer-translucent`, and the responsive
  `.sm:drawer` / `.md:drawer` / … classes are user classes. Navbar collapse
  consumes the drawer later. A touch or pen swipe past 40px dismisses in
  the placement's outward direction (start swipes left in LTR). `scroll`
  leaves the page scrollable: the drawer stays modal while it has a
  backdrop, and `dialog-open` is not added.
- `blocking` is Bootstrap's `backdrop: "static"`. The click adds
  `.drawer-static` for the bounce and does not close. Escape still closes
  unless `keyboard` is false, which bounces and does not close.
- An animated close adds `.hiding` and leaves the dialog open until the
  exit transition ends. `close()` drops `::backdrop` in the same turn, and
  this pin has no `.drawer.hiding::backdrop` rule (dialog has one), so the
  scrim would pop. While the dialog stays modal the component sets
  `--bs-drawer-backdrop-bg: transparent` and `--bs-drawer-backdrop-blur: 0px`
  and lets the existing backdrop transition interpolate them. `.drawer[open]`
  pins `transform: none`, so the same exit writes the placement's off-screen
  transform inline. The transform is cleared when `close()` runs. The backdrop
  tokens stay for another 400ms: this pin keeps `::backdrop` mounted for the
  discrete exit, and restoring them early paints the scrim back at full
  strength. `.hiding` covers the slide, which is what a navbar's
  `:not([open], .hiding)` rule needs.
  `.drawer-instant` and `prefers-reduced-motion: reduce` still call `close()`
  in the same turn.
- Scroll lock is the same `dialog-open` class `BDialog` uses, on
  `document.documentElement`, removed when no `dialog[open]:modal` remains.
- Do not emit `data-bs-toggle` or `data-bs-dismiss`. Conform ignores `open`
  and `style`.
- `BDrawerTitle` is `Dialog.Title` as `h5.drawer-title`. `BDrawerClose` is
  `button.btn-close`. It injects `bootstrap:drawer` and warns in dev when
  that context is missing. `BDrawerFooter` is `div.drawer-footer`.

## BMenu

Flat markup: `button.btn-solid.theme-primary` beside `div.menu`. No `.dropdown`
wrapper. The default slot is the menu contents. Trigger text is the `label`
prop (`Toggle menu`). `v-model` toggles `.show` on `.menu`. The trigger does
not get `.show`.

- `placement` defaults to `bottom-start` and is written to `data-bs-placement`
  on the menu, including while closed, so `@starting-style` transform-origin
  matches. The attribute is a styling hook. Behavior is `usePopover`:
  `bottom-start` maps to `position-area: block-end span-inline-end`.
  `contentAttrs`
  is not spread. The menu has no `popover` attribute. `attach()` would call
  `showPopover()`; the component replaces that method with a no-op before
  attach so the positioning adapter still receives the element.
- `autoClose`: `true` (default) closes on an inside or outside click.
  `'inside'` and `'outside'` close on only that side. `false` leaves Escape
  and the trigger. Escape always closes and returns focus to the trigger.
  A click that opens does not move focus. ArrowDown / ArrowUp on the trigger
  open and focus the first / last item. Tab closes and is not
  `preventDefault`. Arrows, Home, and End rove (`circular`). The page is not
  inert.
- Submenus are `div.submenu` > `button.menu-item` + nested `div.menu`. Hover
  opens immediately and closes after 100ms. A click that entered a closed
  submenu keeps it open; a later click toggles. ArrowRight (ArrowLeft in RTL)
  opens and focuses the first nested item. The opposite arrow closes the
  submenu and focuses its trigger. Nested placement is
  `inline-end span-block-end`, so RTL flips the side. The pin's
  `.submenu > .menu { top: 0 }` is cleared with inline `inset: auto`, and the
  popover supplies the offset. Safe-triangle, the touch `mouseover`
  hack, container teleport, breakpoint listeners, and responsive
  `md:bottom-end` are out of scope.
- `BMenuItem` is `a.menu-item` when `href` is set, otherwise
  `button.menu-item`. `disabled` adds `.disabled`, `aria-disabled`, and the
  `disabled` attribute on a button. `BMenuDivider` is `hr.menu-divider`.
  `BMenuHeader` is `h6.menu-header`. Header and divider are not in the roving
  list. Parts inject `bootstrap:menu` and warn in dev when that context is
  missing. Do not emit `data-bs-toggle`. Do not add `role="menu"`. Conform
  ignores `style`.

## BToast

A `div.toast`. `v-model` toggles `.show`. The default slot is the toast
contents. `role="alert"`, `aria-live="assertive"`, and `aria-atomic="true"`
are always present. Do not emit `data-bs-dismiss`.

- `autohide` defaults to `true`. `delay` defaults to `5000`. While the toast
  is open the timer hides it. Pointer enter and focus inside clear the timer.
  Leaving starts the full delay again. `autohide` `false` leaves the toast up
  until `BToastClose` or the model.
- `instant` adds `.toast-instant`. The pin uses that class to skip the opacity
  transition. It does not change the timer.
- `BToastBody` is `div.toast-body`. `BToastClose` is `button.btn-close` and
  calls `close()`. It warns in dev when `bootstrap:toast` is missing. Header
  markup (`div.toast-header`) stays in the consumer slot. The page is not inert.
- `BToast.Queue` is `div.toast-container`. `push(message)` adds a toast. With
  no slot the queue renders each one (body, close). A slot receives `items`
  and `push`. The queue is optional. A single `BToast` does not need it and
  does not need a plugin. Bootstrap shows every toast in the stack at once, so
  the queue registers tickets with `timeout: -1` and each toast runs its own
  timer. Removing `.show` starts the fade. The node leaves about 200ms later.
  Hover pauses that toast only.

## BTooltip

A trigger and a sibling `.tooltip`. The trigger is the default slot, wrapped in
`span.d-inline-block` so the anchor has a box. `v-model` toggles `.show`. The
tip is `role="tooltip"` and carries `bs-tooltip-auto` because the pin's arrow
rules are `.bs-tooltip-auto[data-bs-placement^=…]`. `data-bs-placement` is that
hook. Default placement is `top`.

- Positioning is `usePopover`. `top` maps to `position-area: block-start`. The
  same logical table as `BMenu`. `contentAttrs` is not spread. The tip has no
  `popover` attribute. `attach()` would call `showPopover()`; the component
  replaces that method with a no-op. The adapter's `margin: unset` is replaced
  with a `0.4rem` gap on the outer side, which is the arrow's height. The
  arrow element is `position: absolute`. Its offset along the edge is the
  trigger's center, clamped to the tip. The pin's CSS chooses the edge from
  `data-bs-placement`; it does not center the arrow.
- `text` is rendered as text. An empty or whitespace title does not open.
  Markup goes in the `content` slot, not through HTML injection. The trigger
  binds the slot's `attrs` so `aria-describedby` points at the tip while it is
  open.
- `trigger` defaults to `hover focus`. `hover`, `focus`, and `click` are the
  other values. Moving from the trigger onto the tip keeps it open. Leaving
  both closes it. A press on the tip keeps a focus-triggered tip open until
  pointerup. Escape closes immediately, in the capture phase, and does not
  wait for `delay`.
- `delay` defaults to `0`. A number is both show and hide. `{ show, hide }`
  sets them separately. `0` opens and closes in the same turn. `instant` adds
  `.tooltip-instant`.
- Do not emit `data-bs-toggle` or `data-bs-title`. Do not wrap v0 `Tooltip`
  (its content sets the native `popover` attribute). No `useTooltip` plugin.
  Responsive `md:right` placements, delegated `selector`, and touch `mouseover`
  are out of scope. Conform ignores `style`.

## BTabs

Renderless root. `v-model` is the selected value.

- `createSingle({ events: true, mandatory: 'force' })` plus `useProxyModel`.
  `useRovingFocus` is circular. Its orientation is read once, from `vertical`.
  Watching the selection assigns `focusedId`. It does not call `focus()`, so
  a model change does not steal DOM focus. Click calls `focus(id)`.
- `List` is `ul.nav` and `role="tablist"`. Default class is `nav-tabs`.
  `variant="pills"` is `nav-pills`. `vertical` forces `nav-pills` and
  `nav-pills-vertical`, and sets `aria-orientation="vertical"`.
- `Item` is `li.nav-item` > `button.nav-link` with `role="tab"`. Selected
  adds `.active`. Disabled is the native attribute. Ids come from `useId()`.
- `Content` is `div.tab-content`. `Panel` is `div.tab-pane`. The selected
  pane also has `.show` and `.active`, `role="tabpanel"`, and `tabindex="0"`.
  Panes must be direct children of `.tab-content`. The pin's rule is
  `.tab-content > .tab-pane` and `.tab-content > .active`.
- `instant` adds `.tab-pane-instant`. No `data-bs-toggle` or `data-bs-target`.
  Do not wrap v0 Tabs.

## BNav

A link list. Not a tab widget.

- Default host is `ul.nav`. `as="nav"` renders `nav` and the consumer does
  not use `Item`.
- `variant` adds `nav-tabs`, `nav-pills`, or `nav-underline`. `vertical`
  wins and uses `nav-pills` plus `nav-pills-vertical`. `fill` adds
  `nav-fill`. `justified` adds `nav-justified`.
- `Item` is `li.nav-item`. `Link` is `a.nav-link`. `active` adds `.active`
  and `aria-current="page"`. `disabled` adds `.disabled`,
  `aria-disabled="true"`, omits `href`, and sets `tabindex="-1"`.
- No `role="tab"`. No `createSingle`. No `data-bs-toggle`.

## BAlert

`div.alert` with `role="alert"`, `aria-live="assertive"`, and
`aria-atomic="true"`. `v-model` defaults to true. `theme` adds
`theme-{theme}`.

- Setting the model false adds `.hiding` and unmounts after 150ms. That is
  the pin's `--bs-alert-transition-duration`. `instant` adds
  `.alert-instant` and unmounts in the same turn. Reduced motion does too.
  Opening again stops the timer and cancels the leave.
- Dismiss is a `BClose` in the slot. This component does not listen for it.
  No `data-bs-dismiss`. Do not also bind `v-if` to the same model.

## BBadge

`span.badge`, or `as`. `variant="subtle"` adds `badge-subtle`.
`variant="outline"` adds `badge-outline`. `.badge` stays. `theme` adds
`theme-{theme}`. No pill prop.

## BButton

The face class stands alone. The pin groups `.btn`, `.btn-link`, `.btn-icon`,
`.btn-solid`, `.btn-outline`, `.btn-subtle`, and `.btn-text` in one selector.

- No variant: `btn`. `solid`, `outline`, `subtle`, `link`, or `text`:
  `btn-{variant}` and not also `btn`.
- `icon` with no variant is `btn-icon` alone. With a variant, `btn-icon` is
  added. `xs`, `sm`, and `lg` add `btn-xs`, `btn-sm`, `btn-lg`. `theme`
  adds `theme-{theme}`. `active` adds `.active`.
- A string `href` renders `a` with `role="button"`. `type` defaults to
  `button` on a button and is omitted on an anchor.
- Disabled button: native `disabled`, no `aria-disabled`. Disabled anchor:
  keeps `href`, adds `.disabled`, `aria-disabled="true"`, `tabindex="-1"`.
  `aria-current="page"` only on an active anchor.
- Do not wrap v0 Button.

## BButtonGroup

`div.btn-group` with `role="group"`. `vertical` replaces `btn-group` with
`btn-group-vertical`. `divider` adds `btn-group-divider`. `label` sets
`aria-label` only when it is a non-empty string. No selection model.

## BCard

`section.card`. `as` changes the host. `subtle` adds `card-subtle`.
`translucent` adds `card-translucent`.

- `Header` is `div.card-header`. `Body` is `div.card-body`. `Title` is
  `h4.card-title` (`as` changes the heading). `Subtitle` is
  `p.card-subtitle`. `Text` is `p.card-text`.
- No footer part. `.card-footer` is a class the consumer writes.

## BClose

`button.btn-close` with `type="button"` and no children. The name is
`locale.ti('Close.label')`, or `Close`. `disabled` is the native attribute.
No click handler and no `data-bs-dismiss`. `BDialogClose` is separate. It
uses `Dialog.close` and closes the dialog.

## Tier 1

Overlay: `BDialog`, `BDrawer`, `BMenu`, `BTooltip`, `BPopover`, `BToast`
(`BToast.Queue` optional).

Disclosure: `BCollapse`, `BAccordion`, `BTabs`, `BNav`, `BNavbar`,
`BNavOverflow`, `BScrollSpy`.

Forms: `BFormControl`, `BFormField`, `BFormLabel`, `BFormText`, `BFormFeedback`,
`BCheck`, `BRadio`, `BSwitch`, `BFile`, `BInputGroup`, `BFormAdorn`,
`BCombobox`, `BOtp`, `BRange`, `BChips`, `BStrength`, `BToggler`.
`BDatepicker` is specified and blocked on `createDatePicker`.

Content and layout: `BAlert`, `BBadge`, `BButton`, `BButtonGroup`, `BCard`,
`BClose`, `BSpinner`, `BPlaceholder`, `BProgress`, `BBreadcrumb`, `BPagination`,
`BListGroup`, `BAvatar`, `BCarousel`, `BContainer`, `BRow`, `BCol`, `BStepper`.

`BFormAdorn`, `BAvatar`, and `BStepper` are in the pinned catalog. They were
missing from the earlier bullet list. They ship. Per-component amendments
live in `harness/canon-notes/` and in `CANON.md`.

## Tier 2 (labeled)

- `BTable` / `BDataTable` — not a Bootstrap component.
- Anything Bootstrap does not document.

Out of scope: a 5.3 dual pin, BootstrapVue API compatibility, directives,
`BApp`, a required plugin, wrapping `bootstrap.js`.

## Known limitations

- **`createDatePicker` is draft.** `BDatepicker` does not ship until that
  composable has source. Do not take `vanilla-calendar-pro` as a dependency.
- **Global `<Scrim>` vs `::backdrop`.** `BDialog` uses the dialog's own
  backdrop. An app that also mounts v0's global `<Scrim>` paints a second one
  ([#910](https://github.com/vuetifyjs/0/issues/910)).
- **`window.bootstrap`.** If the Bootstrap JS bundle is also loaded, dev builds
  warn. Behavior comes from this package, not `data-bs-toggle`.
- **Focus trap** ([#909](https://github.com/vuetifyjs/0/issues/909)). Native
  `<dialog>` covers Dialog and Drawer. `BMenu` roves with the arrows and
  closes on Tab. It does not inert the page. Bootstrap's menu does not either.
