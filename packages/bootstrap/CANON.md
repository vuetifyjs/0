# @paper/bootstrap — Implementation Canon

Binding for every component that lands in this package. Per-component amendments
are added under the component's heading when that component is written. Do not
port Bulma class names (`is-active`, `is-primary`) or Bootstrap 5 names
(`modal`, `offcanvas`, `dropdown`, `col-md-6`).

## Imports, files, style

- Import ONLY from `@vuetify/v0`. Never `#v0/*` in package source. The `#v0`
  alias exists for tooling parity.
- Layout: `src/components/BThing/BThing.vue` + `src/components/BThing/index.ts`.
  Append one alphabetically placed line to `src/components/index.ts`.
- Dual-script SFC. `defineOptions({ name: 'BThing' })`. Destructured props, no
  `withDefaults`. `defineModel` plus an explicit kebab `defineEmits`. `toRef`
  for slot props. No `<style>` block.
- Flat components, composed in userland the way Bootstrap nests elements.
  Region parts are flat too (`BDialogHeader`). The current family contract also
  allows attaching a part to the parent export (`BDialog.Header`); the flat
  name stays valid.
- Reach for the v0 primitive named in SPEC.md. Dialog and Drawer use the
  native `dialog`. Menu, Tooltip, and Popover use `usePopover`. Tabs use
  `createSingle` and `useRovingFocus`. Do not wrap v0 `Button` or `Tabs`.
  Their classes do not match this pin. Do not wrap `bootstrap.js`.

## Prop → class

| Prop | Class |
|---|---|
| `theme` | `theme-{theme}` |
| `variant` (buttons) | `btn-{variant}` (`solid` / `outline` / `subtle` / `text`) |
| `size` | `btn-xs` / `btn-sm` / `btn-lg`, `dialog-sm` / `dialog-lg` / `dialog-xl` |
| `show` | **forbidden as a prop** — `v-model` / v0 state only |
| open state | `.show` or native `open` / `showModal()` |

Undefined prop ⇒ no class. A user `class` always merges. State classes are
owned by the component and driven only by v0 state.

## v-model

Plain `v-model`. Open/closed boolean on Dialog, Drawer, Menu, Collapse, Alert,
Toast. No `data-bs-toggle` as behavior.

## Slots

No named slots. The default slot is the content region. Every region Bootstrap
names with a part element is a part component. Parts that need parent state
inject it. Package context is optional and warns in dev when missing. Parts
backed by a v0 context throw.

## Rendering

Element tags match the pinned fixture. `BDialog` is a native `<dialog>`. Do not
copy `BuModal`'s `div.modal`. Do not set the native `popover` attribute on
`BMenu` — it top-layers the menu and fights Bootstrap's CSS. Toggle `.show`
(or `open`) and let Bootstrap's `@starting-style` animate. Do not add a
`.collapsing` class.

## Harness

`conform()` from `harness/conform.ts`. Fixtures are verbatim markup from the
SHA in `PIN.md`, one or more blocks per file, each introduced by
`<!-- fixture: <label> -->`. Tests address blocks by label.

1. Tag structure and class sets match the fixture on component-owned elements.
2. Additions of `aria-*`, `data-*`, `role`, `tabindex`, and `id` are tolerated.
   Any other extra attribute needs an explicit `ignoreAttrs` entry.
3. Colon utility classes (`md:d-none`) are real class tokens. Do not escape
   them.

## BDialog

- Host element is `<dialog class="dialog">`. `size` adds only `dialog-sm`,
  `dialog-lg`, or `dialog-xl`.
- `showModal()` and `close()` run on this component's element ref. Both are
  guarded with `element.open`. `onCancel` calls `preventDefault()` so
  `.hiding` can run before `close()`.
- Scroll lock is the `dialog-open` class on `document.documentElement`.
- `blocking` adds `dialog-static` on a backdrop click and does not close.
  Escape still closes.
- Fixture diff ignores `open` and `style`.
- `BDialogTitle` renders through `Dialog.Title`. `BDialogClose` does not use
  `Dialog.Close`.

## BDrawer

- Host element is `<dialog class="drawer">`. `placement` adds only
  `drawer-start`, `drawer-end`, `drawer-top`, `drawer-bottom`, or
  `drawer-fullscreen`. `sheet` adds `drawer-sheet`. An omitted prop adds
  nothing.
- `showModal()` and `close()` run on this component's element ref. `onCancel`
  calls `preventDefault()`. An animated exit keeps `open` until the transition
  ends. `close()` snaps `::backdrop`, and `.drawer[open]` pins
  `transform: none`, so the exit sets inline `transform` plus
  `--bs-drawer-backdrop-bg` and `--bs-drawer-backdrop-blur`. The transform is
  cleared when `close()` runs. The backdrop tokens stay 400ms longer so the
  discrete `::backdrop` hold does not paint the scrim back. `.hiding` is
  present for the slide. `.drawer-instant` and reduced
  motion call `close()` in the same turn.
- Scroll lock is the `dialog-open` class on `document.documentElement`, shared
  with `BDialog`. Remove it only when no `dialog[open]:modal` remains.
- `blocking` adds `drawer-static` on a backdrop click and does not close.
  Escape still closes.
- Fixture diff ignores `open` and `style`.
- `BDrawerTitle` renders through `Dialog.Title` as `h5`. `BDrawerClose` does
  not use `Dialog.Close`.

## BMenu

- Host is a `button.btn-solid.theme-primary` beside `div.menu`. No `.dropdown`
  wrapper. `.show` goes on `.menu`, and on `.submenu` plus its nested `.menu`
  while that submenu is open. The trigger does not get `.show`.
- Do not set the native `popover` attribute. `data-bs-placement` is written
  from `placement` (default `bottom-start`) as a transform-origin hook.
- `BMenuItem` is `a.menu-item` with `href`, otherwise `button.menu-item`.
  `BMenuDivider` is `hr.menu-divider`. `BMenuHeader` is `h6.menu-header`.
  `BMenuSubmenu` is `div.submenu` > `button.menu-item` + `div.menu`.
- Fixture diff ignores `style`. Do not emit `data-bs-toggle`. Do not add
  `role="menu"`.

## BToast

- Host is `div.toast`. `.show` is the open state. `role="alert"`,
  `aria-live="assertive"`, and `aria-atomic="true"` are part of the contract.
- `BToastBody` is `div.toast-body`. `BToastClose` is `button.btn-close` with
  `type="button"` and an accessible name. Do not emit `data-bs-dismiss`.
- `BToastQueue` is `div.toast-container`. Pushed toasts are `.toast.show`
  until they close. The container is not a plugin.

## BTooltip

- Host is a `span.d-inline-block` beside `div.tooltip.bs-tooltip-auto`.
  `.show` goes on `.tooltip`. The tip is `role="tooltip"`. Inside it:
  `div.tooltip-arrow` and `div.tooltip-inner`.
- `data-bs-placement` is written from `placement` (default `top`). The arrow
  CSS requires `bs-tooltip-auto` plus that attribute. The arrow element is
  absolutely positioned and aligned to the trigger's center. Do not set the
  native `popover` attribute. Do not emit `data-bs-toggle`.
- Fixture diff ignores `style`. Title text is plain text. An empty title does
  not add `.show`.

## BCarousel

- Host is `div.carousel.slide`. `fade` adds `carousel-fade` and keeps `slide`.
  The default is stacked. There is no caption markup — the pinned carousel
  page does not use the Bootstrap 5 caption classes.
- Slides are `div.carousel-item` inside `div.carousel-inner`. `.active` is the
  current slide only. `v-model` is that slide's index.
- Prev/next are `button.btn-icon.btn-sm` with `span.carousel-icon-prev` /
  `span.carousel-icon-next` and `span.visually-hidden` text. The text is
  `Carousel.prev` / `Carousel.next`, or Previous / Next. Arrow keys call
  the same actions and follow the writing direction. Do not emit
  `data-bs-slide` or `data-bs-ride`.
- `autoplay` is a boolean or a millisecond count, not `ride`. `true` is
  5000ms. There is no `carousel-indicators` class on the pinned page, so this
  component does not render indicator buttons.
- Behavior is v0 `Carousel` (`renderless`), so the Bootstrap classes sit on
  elements this package owns. Fixture diff tolerates the region's `aria-*`,
  `role`, and `data-*`.

## BContainer

- Host is `div.container`. `fluid` replaces it with `container-fluid` and
  wins over `breakpoint`.
- `breakpoint` is `sm`, `md`, `lg`, `xl`, or `2xl` and adds that colon
  utility (`md:container`), never `container-md` / `container-sm`.

## BRow

- Host is `div.row`. No gutter classes.
- `cols` adds `row-cols-{n}` only for an integer 1 through 6. Anything else
  stays `row`.

## BCol

- Host is `div.col` when `span` is omitted. `span` replaces that with
  `col-{n}`.
- `sm`, `md`, and `lg` add `sm:col-{n}`, `md:col-{n}`, and `lg:col-{n}`.
  Not `col-md-6`.
- `offset` adds `offset-{n}`. The columns snippet has `offset-` classes.

## BStepper

- BStepper was in the pinned catalog and missing from the SPEC bullet list.
- Host is `ol.stepper` of `li.stepper-item`. `.active` means reached: the
  current step and every step before it. The first pinned example marks the
  first two items `.active` and leaves the rest plain.
- `v-model` is the current step index. Clicking a step selects it. Each item is `role="button"` with `tabindex="0"`. Enter and Space select it. `aria-current="step"` is the current index only.
- `overflow` wraps the list in `div.stepper-overflow`. The class is on that
  wrapper in the snippet, not on the `ol`.
- v0 `Step` is renderless, so the Bootstrap list is the DOM. Each item
  registers with `Step.Item`. Reached state follows the model, because
  `Step.Item` only exposes the current selection.

## BTabs

- Renderless root. `v-model` is the selected value.
- `List` is `ul.nav` `role="tablist"`. `Item` is `button.nav-link`
  `role="tab"`. `Content` is `div.tab-content`. `Panel` is `div.tab-pane`.
  The selected pane has `.show.active`.
- Panes are direct children of `.tab-content`. `vertical` forces pills.
  `instant` adds `.tab-pane-instant`.
- No `data-bs-toggle`. Not v0 Tabs.

## BNav

- `ul.nav`, or `nav` when `as="nav"`. Variants are `nav-tabs`, `nav-pills`,
  and `nav-underline`. `vertical` wins and uses the pills classes.
- `Link` is `a.nav-link`. Disabled drops `href`. No `role="tab"`.

## BAlert

- `div.alert` `role="alert"` `aria-live="assertive"` `aria-atomic="true"`.
  Close adds `.hiding` for 150ms, then unmounts. `instant` and reduced
  motion unmount immediately.
- Dismiss is a slotted `BClose`. No `data-bs-dismiss`.

## BBadge

- `span.badge`. `subtle` and `outline` add `badge-subtle` or `badge-outline`
  and keep `.badge`. No pill prop.

## BButton

- The face stands alone: `btn`, or `btn-solid` / `btn-outline` /
  `btn-subtle` / `btn-link` / `btn-text`. Not both.
- `btn-icon` replaces `btn` when there is no variant.
- `href` is an anchor with `role="button"`. Disabled anchors keep `href`.

## BButtonGroup

- `div.btn-group` `role="group"`. `vertical` replaces the class with
  `btn-group-vertical`. No selection model.

## BCard

- `section.card`. Parts: header, body, title (`h4`), subtitle, text.
- No footer part.

## BClose

- `button.btn-close`. Name is `Close.label`, or `Close`. It does not close
  a parent. `BDialogClose` does, and its key is `Dialog.close`.

## Other components

Amendments that are not folded into a heading above live in
`harness/canon-notes/` and in the `canon.md` or `CANON.md` file beside
some component roots (`BAvatar`, `BNavbar`, `BScrollSpy`, `BNavOverflow`,
`BBreadcrumb`, `BListGroup`, `BPagination`, `BPlaceholder`, `BProgress`,
`BSpinner`). `BDatepicker` is a canon note only. It does not ship.
