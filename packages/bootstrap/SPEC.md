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
- No stylesheet artifact. No owned token prefix. No plugin at Tier 1. A later
  plugin would drive Bootstrap's own `--bs-*` variables and `data-bs-theme`,
  never an owned prefix.

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
  `.dialog-static` for the bounce and does not close. Escape still closes.
  v6 static backdrop does not trap Escape. `keyboard: false` is not a prop.
  `modal: false` (`show()`) is out of scope.
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

## Tier 1

Overlay: `BDialog`, `BDrawer`, `BMenu`, `BTooltip`, `BPopover`, `BToast`
(`BToast.Queue` optional).

Disclosure: `BCollapse`, `BAccordion`, `BTabs` / `BNav`, `BNavbar`,
`BNavOverflow`. `BScrollSpy` may slip; the hole stays written down if it does.

Forms: `BFormControl`, `BFormField`, `BFormLabel`, `BFormText`, `BFormFeedback`,
`BCheck`, `BRadio`, `BSwitch`, `BFile`, `BInputGroup`, `BCombobox`, `BOtp`,
`BRange`, `BChips`, `BStrength`, `BToggler`. `BDatepicker` is specified and
blocked on `createDatePicker`.

Content and layout: `BAlert`, `BBadge`, `BButton`, `BButtonGroup`, `BCard`,
`BClose`, `BSpinner`, `BPlaceholder`, `BProgress`, `BBreadcrumb`, `BPagination`,
`BListGroup`, `BCarousel`, `BContainer`, `BRow`, `BCol`.

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
  `<dialog>` covers Dialog and Drawer. `BMenu` still needs a trap.
