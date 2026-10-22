# @paper/quantum: Design Spec

## Identity

**Class:** design system (rich). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

Quantum is the complete, exclusive implementation of Material Design 1 (the 2014 to 2017 "Material Design" guidelines, internal codename "Quantum Paper") on `@vuetify/v0`. The name keeps `@paper/material` / `Md*` reserved for the pinned MD3 package in the family catalog. Quantum is the older language in its own right, not a theme of the newer one.

| Item | Value |
|---|---|
| npm | `@paper/quantum` (MIT; icon artwork Apache 2.0, see Icons) |
| Component prefix | `Qu*` |
| Class prefix | `quantum-*` (`quantum-button`, `quantum-button__content`) |
| Token namespace | `--quantum-*` |
| Theme ids | `quantum-light` (default), `quantum-dark` (`dark: true`) |
| Plugin | `createQuantumPlugin({ theme, icons, reducedMotion })` composes `createThemePlugin`, `createQuantumIconsPlugin` and `createReducedMotionPlugin`; each key takes that plugin's options or `false` to skip it |
| Adapter | `QuantumStyleSheetAdapter extends V0StyleSheetThemeAdapter` (`prefix: 'quantum'`, `stylesheetId: 'quantum-theme-stylesheet'`) |
| Stylesheets | `@paper/quantum/style.css` (components, type and elevation utilities), `@paper/quantum/theme.css` (prebaked default theme) |
| Installable without Vuetify | required and met: `pnpm add @paper/quantum`, `app.use(createQuantumPlugin())`, `QuButton` |
| Research notes | `packages/quantum/spec/**` carries every number with its source and confidence. This file cites those notes and does not repeat their tables |

Purpose: Quantum proves the Paper design-system contract against a specification that is complete, closed and old enough that Google can no longer move it. Every `Qu*` API is judged by one question: is it the spec's vocabulary rendered on v0, and nothing more.

## Pinned spec

| Source | Pin | Role |
|---|---|---|
| Material Design, 2014 to 2017 guidelines | `material.io/archive/guidelines`, Wayback snapshot 2018-12-25 00:22:55 UTC: `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/` | authoritative; the spec text wins over every other source. The archive's own changelog (`material-design/whats-new`, served capture 2018-12-25 00:22:49) ends with "September 2017", which dates the frozen content |
| Fallback 1 | live guidelines snapshot 2018-02-23: `http://web.archive.org/web/20180223140411/https://material.io/guidelines/` | used when a page 404s in the archive |
| Fallback 2 | Google Design snapshot 2016-06-04: `http://web.archive.org/web/20160604061521/http://www.google.com/design/spec/` | original 2014 wording; used to record revision drift |
| Mirror | `https://m1.material.io/` (Google's own frozen copy; `material.io/archive/guidelines/*` 301s to it) | text verified identical to the Wayback captures wherever both were readable; used when the Wayback host refused connections |
| Vuetify 1.5.24 | `vuetifyjs/vuetify` tag `v1.5.24`, path `packages/vuetify/src/stylus/**` (https://github.com/vuetifyjs/vuetify/tree/v1.5.24/packages/vuetify/src/stylus) | numeric cross-check only; never a source of API, and never a source of a value the spec states |
| Material Icons | `google/material-design-icons` at commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4`, `materialicons` (filled) 24px sources, Apache License 2.0 | glyph source for `QuIcon`: 80 glyphs, 27 aliases (`spec/icons.md`) |

Where the archive served a neighbouring capture (2018-01, 2020-05, 2021-03, 2021-08), the note that read the page records the served timestamp; the content is the frozen archive page in every case. Where a value exists only inside a spec PNG or video, the notes read the artwork at 2 px per dp and this file tags the value `measured`. Where no source states a value, the notes say `not found` and this file records the Quantum decision that fills the gap.

Confidence legend for this file: `high` = spec text; `moderate` = Vuetify 1.5 stylus only; `measured` = read from spec artwork at 2 px per dp (the notes write "measured" in the value cell and tag such rows `moderate`); `low` = memory.

### Units and device classes

dp and sp are px, 1:1 (`layout/units-measurements`: "When writing CSS, use px wherever dp or sp is stated"). The spec has three independent axes; Quantum maps each exactly once and every component section below inherits the mapping.

| Spec axis | Spec wording | Quantum mapping |
|---|---|---|
| Handset vs tablet/desktop layout | 56 vs 64 dp app bar, 16 vs 24 dp margins, 72 vs 80 dp keyline, 280 vs 320 dp drawer, 16 vs 24 dp FAB inset, snackbar and dialog desktop forms | `@media (min-width: 600px)`: the handset/tablet split of `layout/responsive-ui` |
| Desktop input | "mouse and keyboard are the primary input"; desktop type sizes (15 and 13 sp), desktop menus (32 px rows), resting elevation 2 dp lower, 150 to 200 ms durations, no touch halo, 20 dp icons | `@media (pointer: fine)` |
| Dense | "measurements may be condensed": dense button 32 dp, dense list 40 dp, dense text field, dense app bar 48 dp, dense menu 24 px | explicit `dense` prop on the components whose page names a dense variant. `dense` is MD1 vocabulary, not Vuetify's `density` enum; a wrapper translates `density` onto it (ruling 8) |

## Coverage

### Component pages that ship

| MD1 page | Quantum |
|---|---|
| bottom-navigation | `QuBottomNavigation` |
| bottom-sheets | `QuBottomSheet` |
| buttons | `QuButton`, `QuIconToggle`, `QuToggleButtons`, `QuDropdownButton` |
| buttons-floating-action-button | `QuFab` |
| cards | `QuCard` |
| chips | `QuChip` |
| data-tables | `QuDataTable` |
| dialogs | `QuDialog` |
| dividers | `QuDivider` |
| expansion-panels | `QuExpansionPanel` |
| grid-lists | `QuGridList` |
| lists, lists-controls | `QuList`; the controls are `QuCheckbox`, `QuSwitch`, `QuRadio` placed in `QuList.Action` |
| menus | `QuMenu` |
| pickers | `QuDatePicker`, `QuTimePicker` |
| progress-activity | `QuProgressLinear`, `QuProgressCircular` |
| selection-controls | `QuCheckbox`, `QuRadio`, `QuSwitch` |
| sliders | `QuSlider` |
| snackbars-toasts | `QuSnackbar` (toasts are out) |
| steppers | `QuStepper` |
| subheaders | `QuSubheader` |
| tabs | `QuTabs` |
| text-fields | `QuTextField`, `QuAutocomplete` |
| toolbars | `QuToolbar` |
| tooltips | `QuTooltip` |
| widgets | none (out) |

Plus, from the patterns section, `QuNavigationDrawer` and `QuSearchBar`; from `growth-communications/feature-discovery`, `QuFeatureDiscovery`; from `style/icons`, `QuIcon`; and `QuRipple`, the ink reaction every component page describes.

### Style, motion and layout sections that ship as tokens and stylesheet

| Section | Ships as |
|---|---|
| style/color | the full palette (`--quantum-<hue>-<shade>`), theme roles, system colors, ink opacities; the `quantum-light` and `quantum-dark` themes |
| style/typography | type tokens per style; `quantum-type-<style>` classes; the font stack; dense and tall script rules keyed on `:lang()` |
| style/icons | `QuIcon`, the role vocabulary, `createQuantumIconsPlugin`, RTL mirroring (`spec/icons.md`, `spec/iconography.md`) |
| style/imagery | the text protection range behind `--quantum-grid-list-bar`, the loading-images recipe on `QuCard.Media` and `QuGridList.Tile`, avatar and thumbnail sizes (`spec/iconography.md`) |
| style/writing | the default copy table through `useLocale`, sentence-case source text, uppercase button labels by CSS (`spec/iconography.md`) |
| material-design/elevation-shadows | `--quantum-elevation-0..24`; `quantum-elevation-<n>` classes |
| motion/* | duration and easing tokens; `QuRipple`; from `motion/creative-customization` (`spec/motion.md`), `QuToolbar.Nav` animates `menu` to `arrow-back` (`data-icon`) over `--quantum-duration-standard` when the drawer opens and back on close; product icons and illustrations are out (no surface) |
| layout/* | keyline, increment, spacing and touch target tokens; breakpoints as documented values plus a JS map (`quantumBreakpoints`); `layout/split-screen` is out (see Out) |
| usability/bidirectionality, usability/accessibility | logical properties everywhere; icon mirroring; 48 dp targets; the WCAG opacities |

### Pattern rulings

From `spec/patterns/rulings.md`, which carries the reasons.

| Pattern page | Ruling |
|---|---|
| navigation-drawer | component `QuNavigationDrawer` |
| search | component `QuSearchBar` (persistent search) and the `Search` part of `QuToolbar` (expandable search); one Combobox core |
| scrolling-techniques | `QuToolbar` props `scroll` and `tabBar`, part `Extension` |
| selection | selected state on `QuList.Item`, `QuGridList.Tile`, `QuCard`; `QuToolbar.Contextual`; a `::selection` rule in the accent |
| errors, empty-states, confirmation-acknowledgement, settings, navigation, loading-images, offline-states, help-feedback | documented compositions of shipped components (docs pages, no surface) |
| navigational-transitions | sibling slide on `QuTabs` panels; parent-to-child expansion on `QuFab` and `QuCard` through the motion tokens |
| swipe-to-refresh | a composition example on `QuProgressCircular`; no `QuSwipeRefresh` (v0 has no swipe primitive, mobile browsers own pull-to-refresh, the spec forbids it in drawers and pannable content) |
| data-formats, gestures, notifications, launch-screens, permissions, fingerprint, app-shortcuts | out of scope |

### Growth and communications

| Page | Ruling |
|---|---|
| growth-communications/feature-discovery | `QuFeatureDiscovery` on `Tour.Root`, `Tour.Activator`, `Tour.Highlight`, `Tour.Content`, `Tour.Skip` (one step, so no `Tour.Next`): the circular tap target over the promoted action, the prompt background in `--quantum-primary` at 96%, white ink, dismiss by tapping outside; the 88 dp edge rule, the 20 dp offset and the 280 x 360 dp surface rule (`spec/patterns/feature-discovery.md`). Hint text is `QuTextField placeholder`; the guided flow (tap target, ripples, completion toast) is a documented composition of `QuFeatureDiscovery`, `QuRipple` and `QuSnackbar` |
| growth-communications/onboarding | composition: the quickstart, self-select and top-user-benefits screens are docs compositions of `QuButton` ("Get started", "Next", "Previous"), `QuList` or `QuGridList` (self-select choices) and `QuCard` (the desktop carousel card) with pagination dots the consumer draws; no surface |
| growth-communications/gesture-education | out: the hint motion that previews a swipe or pinch is a gesture rehearsal with no metrics; the full-screen variant's text lives in a `QuSnackbar` the consumer raises |
| growth-communications/introduction | out: section introduction, no rules |

### Out

MD1 pages with no web surface:

| Page | Reason |
|---|---|
| Widgets | Android home-screen launcher surface (placement, long-press resize mode, placement-time configuration); a browser document has nothing to host |
| Notifications | "Android only" on the page; the OS notification drawer; the Web Notifications API renders browser chrome |
| Fingerprint | Android only; WebAuthn prompts are browser chrome |
| Permissions | the nine Android runtime permission groups; browser permission prompts are chrome |
| Launch screens | the cold-launch splash is OS chrome; the PWA manifest owns it on the web |
| App shortcuts | Android launcher feature; the page was never captured on any host |
| Swipe to refresh | see the rulings table |
| Toasts | Android system messaging at the bottom of the screen that cannot be swiped off; `QuSnackbar` is the web surface |
| Gestures, data formats | rules carried by the owning components and the docs; no surface |
| Text selection handles and the floating Cut / Copy / Paste toolbar | OS and browser chrome; Quantum ships only the `::selection` rule |
| Split screen (`layout/split-screen`) | "Android only" on the page: multi-window activation, divider dragging and activity launch placement; the browser owns window management (`spec/layout.md`) |
| Material design: introduction, environment, material properties | principles carried by the elevation, motion and colour tokens (`spec/elevation.md` and `spec/color.md` read them as supplementary sources); no surface |
| What's new (`material-design/whats-new`) | the archive's changelog; cited in the Pinned spec table for its "September 2017" last entry |
| Platform adaptation (`platforms/platform-adaptation`) | Quantum follows the page's Android / Web column: titles always left-aligned, the up button is a thin arrow with a stem (`arrow-back`), the action overflow icon is three vertical dots; the iOS column does not ship |
| Android (`platforms/android`) | Android-specific guidance; no web surface |

v0 primitives Quantum deliberately does not wrap because MD1 has no such component (a primitive existing is not a reason to ship, ruling 7): `Breadcrumbs`; `Avatar` as a standalone (avatars are parts of `QuList`, `QuCard`, `QuChip` and `QuNavigationDrawer.Header`); `Carousel`; `Rating` (the cards page names stars-to-rate only as an example UI control with no spec of its own; consumers compose v0 `Rating` with `QuIcon star` through the escape hatch); `Kanban`; `Splitter`; `Treeview`; `Otp`; `Alert` (MD1 has no banner; alerts are dialogs and snackbars); `Pagination` as a standalone (it lives inside `QuDataTable.Footer`); `NumberField`; `Virtualizer`; `Image` and `AspectRatio`; `DataGrid`; `Select` as a standalone (it is the core of `QuTextField dropdown`, text-fields page "Nested menus & pickers"); `Form` (consumers use v0's `Form` directly; the errors pattern is documented against it); `Menu.Bar` and `Menu.Context` (no menubar and no right-click menu in MD1).

Vuetify 1.5 features that are not in MD1 and do not ship: range and vertical sliders; large (72 dp) and extended FABs; outline, block, round and depressed buttons; choice, filter, input and small chips; dense subheaders; top-placed snackbars; slider tick labels; vertical dividers; `v-overflow-btn`; `v-badge` ("badge" is not in MD1); expandable data-table rows; calendar; timeline; carousel; `v-img`.

### Escape hatch

A missing piece is the consumer's: compose a v0 primitive with the `--quantum-*` tokens, the `quantum-type-*` and `quantum-elevation-*` classes and `QuRipple`. That composition is unsupported as a Quantum component. The docs index documents it as the way to cover a hole, and every hole is listed under Known limitations instead of being filled with a silent leftover tier.

## Pipeline

| Path | How |
|---|---|
| Happy path | `import '@paper/quantum/theme.css'` + `import '@paper/quantum/style.css'` + `app.use(createQuantumPlugin())` |
| CSS only | `theme.css` alone: static tokens on `:root`, dark under `[data-theme="quantum-dark"]`, no runtime switch |
| Host owns `createThemePlugin` | `createQuantumPlugin({ theme: false })`; register `QuantumStyleSheetAdapter` plus `quantumColors` / `quantumDarkColors` on the host plugin |
| Icons | composed by the main plugin; `{ icons: false }` skips registration, not the bundle (ruling 6); `useQuIcons` falls back to the built-in set |
| Kit interop | the adapter emits `--v0-*` aliases (see The v0 bridge) |
| Reduced motion | composed; `{ reducedMotion: false }` when the host installs `createReducedMotionPlugin` itself (without any install `useReducedMotion()` falls back to `isReduced: false`, so `QuRipple`'s JS gate relies on the plugin); CSS stays gated on `@media (prefers-reduced-motion: reduce)` and `body[data-reduced-motion="reduce"]` either way |

The plugin registers `quantum-light` as the default and follows the OS through `system: { light: 'quantum-light', dark: 'quantum-dark' }` until `useTheme().select`. Package skeleton, file layout, the browser test runner (`QuX.browser.test.ts`) and every docs registration step are in `spec/house-style.md`; this file does not repeat them.

## Consumer contract

Emerald's contract, restated where Quantum differs:

- Behavioural components compose v0 compounds; presentational ones render `Atom`; nothing routes through `@vuetify/paper`.
- Never `<style scoped>`. Isolation is the `quantum-` class prefix; state hooks are `data-*` (`true | undefined` for booleans, strings for enums); every design value is `var(--quantum-*, <literal>)`.
- No named slots. Spec anatomy is a prop for short text (`label`, `helper`, `title`) or a compound part; every component has one default slot.
- No orchestrator API: no `density`, `ripple`, `to`, no Vuetify colour prop lists. Where MD1 names a thing, the prop is the spec's own word (`dense`, `raised`, `mini`, `shifting`, `prominent`, `inset`, `discrete`, `linear`, `editable`).
- Glyphs draw through `QuIcon` roles; no inline glyph SVG in a `Qu*` file. Non-glyph geometry (the circular progress arc, the clock face and hand) is inline SVG, declared under Deviations.
- Every interactive component hosts a `QuRipple`. There is no prop to remove it: the ripple is the spec's press feedback, not an option (ruling 8 keeps Vuetify's `ripple` prop on the wrapper).
- Native `<dialog>` paints the scrim through `::backdrop` in `--quantum-scrim`; Quantum never mounts v0 `Scrim`, and every `Dialog.Content` it renders passes `scrim: false` (issue #910).
- Default copy comes from the writing page's button label table (`spec/iconography.md`: OK, Cancel, Dismiss, Got it, Learn more, Next, Back, Done, Skip, No thanks, Not now) through `useLocale().ti('Quantum.<key>') ?? '<English>'`. Button labels are uppercased by CSS; source text stays sentence case.

## Compound access

Every compound attaches its parts to the root; the sub-key drops the parent prefix (`QuDialogTitle` is `QuDialog.Title`, `QuListAction` is `QuList.Action`). The flat names stay exported and valid. The root is the compound; there is no `.Root` key. Shells attach nothing. Parts read the root through an optional `quantum:<name>` context and warn in dev when orphaned; parts backed by a v0 context throw, as v0 does.

## Inventory

Pattern vocabulary: shell (one SFC on a v0 compound); compound (one SFC per region, attached to the root); presentational (`Atom`); DS-owned headless (state in a Quantum composable because v0 has no primitive; the component binds the DOM events).

| Component | Spec page | Pattern | v0 primitive(s) | Parts | Key props | `data-*` hooks |
|---|---|---|---|---|---|---|
| `QuToolbar` | toolbars, layout/structure, patterns | presentational compound | `Atom`, `Combobox.*` (Search), `useRovingFocus` (Actions) | `Nav`, `Title`, `Actions`, `Extension`, `Search`, `Contextual` | `appBar`, `variant`, `prominent`, `dense`, `scroll`, `tabBar`, `contextual`, `floating`, `position` | `data-app-bar`, `data-variant`, `data-prominent`, `data-dense`, `data-scrolled`, `data-collapsed`, `data-hidden`, `data-search`, `data-contextual`, `data-floating`, `data-position`; Nav `data-icon` |
| `QuBottomNavigation` | bottom-navigation | compound | `createSingle` + `useProxyModel`, `Button.Root` | `Action` | `shifting`, `variant`, `hideOnScroll` | `data-shifting`, `data-variant`, `data-hidden`; Action `data-selected` |
| `QuBottomSheet` | bottom-sheets | compound | `Dialog.*` (modal); `Portal` + `Collapsible` (persistent) | `Activator`, `Title`, `Item` | `persistent`, `grid`, `expanded` | `data-persistent`, `data-layout`, `data-expanded`, `data-open` |
| `QuButton` | buttons | shell | `Button.Root`, `Button.Content`, `Button.Icon` | none | `variant`, `dense`, `footer`, `icon`, `disabled`, `ariaLabel` | `data-variant`, `data-dense`, `data-footer`, `data-disabled`, `data-solo` |
| `QuIconToggle` | buttons | shell | `Toggle.Root`, `Toggle.Indicator` | none | `icon`, `iconOn`, `unbounded`, `ariaLabel` | `data-state`, `data-unbounded`, `data-disabled` |
| `QuToggleButtons` | buttons | compound | `Toggle.Group`, `Toggle.Root` | `Item` | `multiple`, `mandatory`, `disabled` | `data-multiple`; Item `data-state`, `data-disabled` |
| `QuDropdownButton` | buttons, menus | compound | `Menu.Root`, `Menu.Activator`, `Menu.Content`, `Menu.RadioGroup`, `Menu.RadioItem` | `Item` | `segmented`, `dense`, `desktop`, `disabled` | `data-open`, `data-segmented`; Item `data-state` |
| `QuFab` | buttons-floating-action-button | shell; compound when it has `Action` children | `Button.Root`, `Button.Icon`; `Menu.*` for the speed dial | `Action` | `icon`, `mini`, `ariaLabel`, `position` | `data-mini`, `data-open`, `data-position`, `data-disabled` |
| `QuCard` | cards | presentational compound | `Atom`, `Collapsible.*` (Expanded) | `Header`, `Media`, `Title`, `Subtitle`, `Supporting`, `Actions`, `Expanded` | `expanded`, `selected` | `data-expanded`, `data-selected`; Media `data-inset` |
| `QuChip` | chips | shell; compound for the open contact chip | `Atom` or `Button.Root`; `Button.Root` (delete); `Popover.*` (Addresses) | `Addresses`, `Address` | `icon`, `avatar`, `deletable`, `contact`, `disabled` | `data-deletable`, `data-contact`, `data-open`, `data-disabled`, `data-focused` |
| `QuDataTable` | data-tables | compound | `DataTable.*`, `Checkbox.Root`, `Button.Root`, `Popover.*`, `createPagination` | `Header`, `Contextual`, `Table`, `Head`, `Column`, `Body`, `Row`, `Cell`, `Footer` | `selectable`, `rowsPerPage`, `v-model:selected`; Cell `v-model` | Column `aria-sort`, `data-direction`, `data-numeric`; Row `data-selected`; Cell `data-editable`; root `data-contextual` |
| `QuDialog` | dialogs | compound | `Dialog.*`; `AlertDialog.*` for `alert` | `Activator`, `Content`, `Title`, `Text`, `Actions`, `Cancel`, `Confirm` | `variant`, `dismissible`, `v-model:value` | `data-variant`, `data-open`, `data-scrolled`, `data-dismissible`; Actions `data-stacked` |
| `QuDivider` | dividers | presentational | `Atom as="hr"` | none | `inset` | `data-inset` |
| `QuExpansionPanel` | expansion-panels | compound | `ExpansionPanel.*` | `Item`, `Header`, `Content`, `Actions` | `multiple` | Item `data-selected`, `data-disabled`; Header `data-state` |
| `QuGridList` | grid-lists | presentational compound | `Atom`, `Button.Root` (tile and bar actions) | `Tile`, `Bar` | `gutter`, `columns`, `ratio`, `horizontal` | `data-gutter`, `data-horizontal`; Tile `data-selected`; Bar `data-position`, `data-lines`, `data-icon` |
| `QuList` | lists, lists-controls | compound | `Atom`, `createSingle` / `createSelection`, `Collapsible.*` (Group) | `Item`, `Avatar`, `Icon`, `Content`, `Primary`, `Secondary`, `Action`, `Group` | `dense`, `select`, `lines` | `data-dense`, `data-select`; Item `data-lines`, `data-selected`, `data-disabled`; Group `data-state` |
| `QuSubheader` | subheaders | presentational | `Atom` | none | `inset`, `primary`, `sticky` | `data-inset`, `data-primary` |
| `QuMenu` | menus | compound | `Menu.*` | `Activator`, `Content`, `Item`, `CheckItem`, `Divider`, `Subheader`, `Sub` | `dense`, `desktop`, `disabled` | `data-dense`, `data-desktop`, `data-open`; Item `data-highlighted`, `data-state`, `data-disabled` |
| `QuDatePicker` | pickers | DS-owned headless | `useRovingFocus({ columns: 7 })`, `Button.Root`, `useDate` | none | `landscape`, `firstDayOfWeek` | `data-landscape`, `data-view` (`date`, `year`) |
| `QuTimePicker` | pickers | DS-owned headless | `Radio.Group` + `Radio.Root` (AM/PM, clock numbers), `Toggle.Group` (hour/minute view) | none | `landscape`, `format` | `data-landscape`, `data-view` (`hour`, `minute`), `data-period` |
| `QuProgressLinear` | progress-activity | shell | `Progress.Root`, `Track`, `Fill`, `Buffer`, `Presence` | none | `value`, `buffer`, `query` | `data-state`, `data-query`, `data-buffer`, `data-presence` |
| `QuProgressCircular` | progress-activity | shell | `Progress.Root` + DS SVG arc | none | `value`, `size`, `fab` | `data-state`, `data-fab` |
| `QuCheckbox` | selection-controls | shell | `Checkbox.Root`, `Checkbox.Indicator` | none | `label`, `value`, `disabled`, `indeterminate` | `data-state`, `data-disabled` |
| `QuRadio` | selection-controls | shell inside a compound group | `Radio.Group`, `Radio.Root`, `Radio.Indicator` | `Group` | `label`, `value`, `disabled`; Group `name`, `mandatory` | `data-state`, `data-disabled` |
| `QuSwitch` | selection-controls | shell | `Switch.Root`, `Track`, `Thumb` | none | `label`, `disabled` | `data-state`, `data-disabled` |
| `QuSlider` | sliders | shell | `Slider.Root`, `Track`, `Range`, `Thumb` | none | `min`, `max`, `step`, `discrete`, `iconStart`, `iconEnd`, `editable`, `disabled` | `data-discrete`, `data-zero`, `data-dragging`, `data-disabled` |
| `QuSnackbar` | snackbars-toasts | compound | `Snackbar.*`, `Presence`, `Button.Root` | `Portal`, `Queue` | `action`, `multiline`, `align` | `data-multiline`, `data-stacked`, `data-align` |
| `QuStepper` | steppers | compound | `Step.Root`, `Step.Item`, `Collapsible.*`, `Button.Root`, `Progress.Root` | `Step`, `Content`, `Actions`, `Bar` | `vertical`, `linear`, `alternativeLabels`, `mobile` | `data-vertical`, `data-linear`, `data-alternative`, `data-mobile`; Step `data-state`, `data-editable`, `data-optional`, `data-error` |
| `QuTabs` | tabs | compound | `Tabs.*`, `createOverflow` | `List`, `Item`, `Panel` | `scrollable` | `data-scrollable`, `data-fixed`, `data-overflow`; Item `data-selected`, `data-icon`, `data-lines` |
| `QuTextField` | text-fields | shell; compound under `dropdown` (`Item` children) | `Input.Root`, `Input.Control`, `Input.Description`, `Input.Error`, `Button.Root` (clear, visibility, voice, picker icon), `Select.*` (dropdown) | `Item` (dropdown only) | `label`, `helper`, `placeholder`, `prefix`, `suffix`, `counter`, `required`, `optional`, `icon`, `clearable`, `voice`, `box`, `dense`, `multiline`, `textarea`, `fullWidth`, `solo`, `dropdown`, `picker`, `mask`, `type`, `rules`, `validateOn` | `data-state`, `data-focused`, `data-dirty`, `data-disabled`, `data-box`, `data-dense`, `data-full-width`, `data-multiline`, `data-solo`, `data-scrolled`, `data-dropdown`, `data-open`, `data-picker`, `data-mask`, `data-counter` |
| `QuAutocomplete` | text-fields | compound | `Combobox.*` | `Item`, `Empty` | the `QuTextField` text props plus `strict`, `multiple`, `inline` | `data-open`, `data-inline`; Item `data-highlighted`, `data-selected` |
| `QuTooltip` | tooltips | compound | `Tooltip.*`, `createTooltipPlugin` | `Activator`, `Content` | `disabled` | Content `data-state`, `data-touch` |
| `QuNavigationDrawer` | patterns/navigation-drawer | compound; DS-owned headless for the non-modal types | `Dialog.*` (temporary); `Atom`, `Collapsible.*` (persistent, permanent, mini) | `Activator`, `Header`, `Content` | `type`, `mini`, `clipped`, `floating`, `side` | `data-type`, `data-mini`, `data-clipped`, `data-floating`, `data-open`, `data-side` |
| `QuSearchBar` | patterns/search, text-fields | compound | `Combobox.*` (`ClientComboboxAdapter`), `QuTextField solo`, `Button.Root` | `Item`, `Empty` | `voice`, `placeholder`, `button` | `data-focused`, `data-scrolled`, `data-open`, `data-button` |
| `QuFeatureDiscovery` | growth-communications/feature-discovery | compound | `Tour.Root`, `Tour.Activator`, `Tour.Highlight`, `Tour.Content`, `Tour.Title`, `Tour.Description`, `Tour.Skip`, `Tour.Keyboard` | `Target`, `Title`, `Text` | `v-model`, `color`, `contained`, `placement` | `data-open`, `data-color`, `data-contained`, `data-placement` |
| `QuIcon` | style/icons | shell | `createTokens` registry (plugin) | none | `name`, `label`, `size`, `namespace` | `data-size`, `data-mirror` |
| `QuRipple` | every component page | DS-owned headless | `useEventListener`, `useReducedMotion` | none | `unbounded`, `center` | `data-unbounded` |

## Components

Each section gives the element tree and class names, the props with defaults, the hooks, the v0 composition, the values (with the note that pins them) and the limits. Every interactive root also hosts `span.quantum-ripple` as its first child; that line is not repeated.

### QuToolbar

`header.quantum-toolbar` (`div` unless `appBar`) > `div.quantum-toolbar__row` > [`button.quantum-toolbar__nav`, `div.quantum-toolbar__title`, `div.quantum-toolbar__actions[role=toolbar]`] + `div.quantum-toolbar__extension`. Search mode replaces the row content with `form.quantum-toolbar__search[role=search]`; contextual mode with `div.quantum-toolbar__contextual`.

- `appBar` (`false`): fixed to the viewport top, `header` banner landmark, scroll behaviours enabled; `data-app-bar`. It is the spec's "app bar" (layout/structure); Vuetify's `app` layout-registration prop is the wrapper's to translate (ruling 8), which is why the prop is not named `app`.
- `floating` (`false`): a detached 2 dp toolbar or palette with its own width, the structure page's "Floating toolbar" and "Detached toolbar palette"; `data-floating`. Column-width and card toolbars are `QuToolbar` without `appBar` inside a column or `QuCard`.
- `position: 'top' | 'bottom'` (`'top'`): `bottom` fixes the bar to the bottom edge above the keyboard (`inset-block-end: env(keyboard-inset-height, 0px)`), the structure page's "Bottom toolbar that launches to a shelf and clings to the top of the keyboard or other bottom component"; `data-position`. The shelf is a documented composition with `QuBottomSheet persistent`. The structure page gives no metrics for any of these: heights follow the app bar table.
- `variant`: `'surface' | 'primary' | 'transparent'` (`'surface'`: Grey 100 / Grey 900 app bar role; `'primary'`: `--quantum-primary` with 100% white ink; `'transparent'`: no fill, no elevation).
- `prominent` (`false`): 128 dp (96 dp with `dense`). `dense` (`false`): 48 dp.
- `scroll`: `'fixed' | 'hide' | 'waterfall' | 'collapse'` (`'fixed'`). `hide` translates with the content and returns on reverse scroll; `waterfall` starts seamed (0 dp) and lifts to 4 dp when content scrolls under it; `collapse` shrinks `Extension` until only the row remains and interpolates the title to 20 sp. `tabBar`: `'anchored' | 'hide' | 'staggered'` (`'anchored'`), honoured only when `Extension` holds `QuTabs`; `staggered` returns the tab bar on reverse scroll and the row at the top.
- `contextual` (`false`): swaps the row for `Contextual`.
- Parts: `Nav` (`icon: 'menu' | 'up'`, `open` (`false`): while `open` the `menu` glyph morphs into `arrow-back` over `--quantum-duration-standard` on the standard curve and back on close, the creative-customization page's dual-function icon, the consumer binding it to the drawer's model; `data-icon` carries the current glyph; 48 dp target at the 16 dp keyline, emits `click`); `Title` (Title 20 sp Medium at the 72 dp keyline, 80 dp at the tablet breakpoint; one line, ellipsis); `Actions` (`role="toolbar"`, one tab stop: composes `useRovingFocus({ orientation: 'horizontal' })` over its children, Home and End jump to the first and last action; `QuButton icon` children at 48 dp pitch; the overflow is a `QuMenu` the consumer places last); `Extension` (`image`, `ratio` default `'4:3'`; hosts `QuTabs`, the large title or related content; tinted `--quantum-primary` at the end of the collapse; under `variant="primary"` an extension holding related content other than `QuTabs` or an image fills with `--quantum-primary-light` and `--quantum-text-primary` ink, the colour page's "beneath the region using the primary color, related information is colored with a lighter version of the primary color"); `Search` (`v-model` query, `v-model:open`, `voice`, emits `submit`, `voice`, `clear`; the up arrow closes; the `Combobox` core of `QuSearchBar` with the toolbar's chrome); `Contextual` (`count` renders "N selected", `close` glyph emits `clear`, Escape clears; actions are children).
- Values: `spec/components/toolbars.md`, `spec/layout.md`, `spec/patterns/scrolling-techniques.md`. 56 dp (48 dp landscape under 600 px), 64 dp from 600 px; padding 16 / 24 dp; icon 24 dp in 48; elevation 4 dp (2 dp under `pointer: fine`); title Medium 20 sp.
- Limits: the bottom, floating and column toolbars have no metrics on their pages (heights follow the app bar table; see Known limitations); scroll thresholds and the parallax ratio are not in the spec, so `hide` moves 1:1 with the content and `waterfall` lifts at the first scrolled pixel; `scroll="waterfall"` with an image `Extension` (overlapping content) refuses `QuTabs` with a dev warning, as the spec requires.

### QuBottomNavigation

`nav.quantum-bottom-navigation` > `button.quantum-bottom-navigation__action` (an `a` when `href`) > [`svg.quantum-icon`, `span.quantum-bottom-navigation__label`].

- `v-model` selected value; `shifting` (`false`); `variant: 'surface' | 'primary'`; `hideOnScroll` (`false`).
- `Action`: `value`, `icon`, `label` (short, never wraps or truncates), `href`, `disabled`; `aria-current="page"` when selected. Three to five actions: a dev warning outside that range.
- Composition: `createSingle({ mandatory: 'force', events: true })` + `useProxyModel`; actions are `Button.Root` or anchors binding the ticket state, never `Tabs` (no panel semantics in the spec).
- Values: `spec/components/bottom-navigation.md`. 56 dp bar; fixed action 80 to 168 dp; shifting active 96 to 168 dp, inactive 56 to 96 dp; icon 24 dp; label Regular 14 sp active, 12 sp inactive; padding above icon 6 dp active / 8 dp inactive (16 dp shifting inactive); 10 dp under text; 12 dp beside text; elevation 8 dp; active ink `--quantum-primary`, inactive `--quantum-text-secondary`; `primary` variant forces black or white ink by contrast.
- Limits: `safe-area-inset-bottom` is added below the 56 dp; the content cross-fade between views is the consumer's transition; hide and reveal use the sharp curve at the standard duration.

### QuBottomSheet

Modal: `dialog.quantum-bottom-sheet` > `div.quantum-bottom-sheet__content`. Persistent: `aside.quantum-bottom-sheet[data-persistent]` in a `Portal` with `scrim: false`.

- `v-model` open; `persistent` (`false`): non-modal, no scrim, no focus trap, rests at the content's elevation and may move the FAB up; `grid` (`false`): `Item` children lay out as 48 dp icon tiles with 16 dp labels; `v-model:expanded` (`false`): full height with internal scroll and an `X`.
- Parts: `Activator` (renderless `Dialog.Activator`); `Title` (56 dp row, Regular 16 sp at 54%, 1 dp divider below); `Item` (`icon`, `href`, `disabled`; 48 dp row, 24 dp icon, 32 dp icon-to-text gap; a `Button.Root` or anchor). Dividers are `QuDivider`.
- Composition: `Dialog.Root` + `Dialog.Content` (native `<dialog>`, `scrim: false`, `::backdrop` in `--quantum-scrim`) positioned at the bottom edge; persistent sheets use `Portal` + `Collapsible` for the expanded state.
- Values: `spec/components/bottom-sheets.md`. 16 dp elevation (modal); scrim `#000` 20%; 16 dp side keyline, 8 dp top and bottom; grid margin 24 dp, rows 24 dp apart; initial max height = width x 9 / 16; full width under 960 px; from 960 px the inset follows the increment table (1 increment from the edge, 6 wide; 2 and 8 at 1280; 3 and 9 at 1440) with the 64 dp increment.
- Limits: swipe to dismiss and swipe to expand are not shipped (gesture); `X`, scrim click and Escape are the paths. No corner radius (square in every figure).

### QuButton

`button.quantum-button` > [`span.quantum-ripple`, `span.quantum-button__icon` (when `icon`), `span.quantum-button__content`].

- `variant`: `'flat' | 'raised'` (`'flat'`). `dense` (`false`): 32 dp, 13 sp. `footer` (`false`): the persistent footer button, 48 dp flat, full width of its container, no radius; `footer` with `raised` is a dev warning (the spec forbids raised buttons in persistent areas). `icon`: a glyph role; with slot content it leads the label, without it the button is icon-only (`data-solo` from `Button.Icon`, 48 dp circular target, `ariaLabel` required, dev warning when missing). `disabled`, `ariaLabel`, `name`, `namespace`.
- No `loading`: MD1 buttons have no loading state (ruling 7); progress is a `QuProgressCircular` beside the button.
- Composition: `Button.Root` + `Button.Content`; `Button.Icon` wraps `QuIcon`.
- Values: `spec/components/buttons.md`. 36 dp tall in a 48 dp target; min width 88 dp; radius 2 dp; padding 0 16 dp; 8 dp between buttons; label Button 14 sp Medium caps; flat ink `--quantum-accent` (primary accents selected buttons, accent is the action colour); raised fill `--quantum-primary` 500 at 2 dp, 8 dp pressed, pressed fill `--quantum-primary-dark` (700); desktop raised rests at 0 dp and gains 2 dp on hover; focus 12%; pressed overlay 40% `#999999` light, 25% `#CCCCCC` dark; disabled text 26% / 30%, disabled raised fill 12%.
- Decision: hover overlay for flat and raised buttons is not in the spec; Quantum draws `--quantum-hover` (6% black, from the steppers page) and records the Vuetify 12% as the rejected precedent.

### QuIconToggle

`button.quantum-icon-toggle[aria-pressed]` > [`span.quantum-ripple`, `svg.quantum-icon`].

- `v-model` pressed; `icon` (off glyph), `iconOn` (on glyph, defaults to `icon`), `unbounded` (`true`: the 48 dp circular ripple extends past the 24 dp glyph), `ariaLabel` (required), `disabled`.
- Composition: `Toggle.Root` + `Toggle.Indicator`; `data-state="on" | "off"` drives the glyph swap.
- Values: `spec/components/buttons.md`, `spec/iconography.md`. Active icon 54% black / 100% white, inactive 38% / 50%, focused 87% / 100%; 24 dp glyph, 48 dp target (20 / 40 dp under `dense` hosts).

### QuToggleButtons

`div.quantum-toggle-buttons[role=group]` > `button.quantum-toggle-buttons__item[aria-pressed]`.

- `v-model` (`T | T[]`), `multiple` (`false`: exclusive), `mandatory` (`false`), `disabled`. `Item`: `value`, `icon`, `disabled`; text, icon or both in the slot.
- Composition: `Toggle.Group` + `Toggle.Root`. Fewer than three items is a dev warning (the spec's minimum).
- Values: `spec/components/buttons.md` records the group's metrics as image-only. Decision: items are 36 dp flat buttons (48 dp target) sharing one 2 dp radius container, 1 dp `--quantum-divider` between items, selected item filled with `--quantum-focus` (12%) and ink `--quantum-text-primary`; focus and pressed may paint the whole group (spec).

### QuDropdownButton

`div.quantum-dropdown-button` > [`button.quantum-dropdown-button__state`, `button.quantum-dropdown-button__arrow` (segmented only)] + `div.quantum-menu[popover]`.

- `v-model` the selected state value; `segmented` (`false`): the state segment emits `select` with the current value and the arrow segment opens the menu; otherwise the whole button opens. `dense`, `desktop`, `disabled` as `QuMenu`. `Item`: `value`, `icon`, `disabled`; a `Menu.RadioItem` so the menu shows the current state with a check.
- Composition: `Menu.Root` + `Menu.Activator` (styled as a flat `QuButton` with a trailing `arrow-drop-down` glyph) + `Menu.Content` + `Menu.RadioGroup`. The menu opens over the button with the selected item aligned on it (spec); selecting dismisses and updates the label.
- Values: `spec/components/buttons.md` (desktop dropdown paddings 16 / 24 / 16 dp), `spec/components/menus.md` for the sheet.
- Limits: the editable segmented dropdown (font size picker) is specified by definition only and is deferred: compose `QuTextField` and `QuDropdownButton` (Known limitations).

### QuFab

`button.quantum-fab` > [`span.quantum-ripple`, `svg.quantum-icon`]. Speed dial: `div.quantum-fab__dial` > [the button as `Menu.Activator`, `div.quantum-fab__actions[popover][role=menu]` > `button.quantum-fab__action[role=menuitem]` + `span.quantum-fab__label`].

- `icon` (required), `ariaLabel` (required), `mini` (`false`; forced on under 460 px by media query), `position`: `'end' | 'start' | 'static' | 'seam'` (`'end'`: fixed, 16 dp from the bottom and end edges, 24 dp from 600 px; `'seam'`: absolutely positioned at the end keyline (16 dp, 24 dp from 600 px) straddling the bottom edge of its host by half its height, `translateY(50%)`, hosted by `QuToolbar.Extension`, `QuCard` and `QuBottomSheet` through a `data-fab-host` wrapper: the FAB page's "attach to an extended app bar", "attached to a toolbar or structural element within a sheet" and "attached to the edge of a sheet", and the layout principles' rule that a FAB may straddle a step when it relates to the content creating the step and a seam when it relates to both sheets), `disabled`.
- `Action` children turn the FAB into a speed dial: `icon`, `label`, `value`; items fly out above the FAB as 40 dp mini FABs with a label at the start side; the FAB stays; pressing it again closes. Two to five actions (three to six including the FAB) or a dev warning.
- Composition: `Button.Root` + `Button.Icon`; speed dial on `Menu.Root` / `Menu.Content` with `positionArea="top span-left"`.
- Values: `spec/components/buttons-floating-action-button.md`. 56 dp, mini 40 dp (48 dp target), icon 24 dp in both; 6 dp resting, 12 dp pressed; fill `--quantum-accent`, white icon; focus "changes colour" (`--quantum-focus` overlay); entrance scales from the centre (225 ms decelerate); the FAB moves up by the snackbar height while a snackbar shows.
- Limits: morph, toolbar and full-screen transforms are documented compositions on `QuDialog` and `QuToolbar`; speed dial item spacing is not in the spec (decision: 16 dp between 40 dp items, 16 dp label gap).

### QuCard

`article.quantum-card` > parts in anatomy order; `Media` is `div.quantum-card__media` with an `img` or background; `Actions` is `div.quantum-card__actions`.

- `v-model:expanded` (`undefined`: no expansion), `selected` (`false`: check mark and scrim, selection pattern). No `as`: the root is always `article` (house-style 2.2 withholds `as` from every wrapper); a consumer who needs `li` or `section` composes `Atom` with the card classes through the escape hatch.
- Parts: `Header` (72 dp: avatar 40 dp at 16 dp, title and subtitle at 72 dp; props `avatar`, `title`, `subtitle`); `Media` (`ratio: '16:9' | '1:1' | '1x' | '1.5x' | '2x' | '3x'`; the `nx` values are the inset 80 dp increments with 16 dp padding); `Title` (Headline 24 sp, 24 dp top, 16 dp bottom); `Subtitle` (Body 1 14 sp, 12 dp top); `Supporting` (Body 1 14 sp, 16 dp top, 24 dp bottom when last, 16 dp with actions below); `Actions` (8 dp padding, 4 dp between actions, two actions plus an overflow `QuMenu`; `align: 'start' | 'end'`; also hosts the cards page's UI controls, "a slider to choose a day, stars to rate content, or a segmented button to select a date range": `QuSlider`, `QuToggleButtons`, `QuTabs` or an escape-hatch `Rating` placed inline, a documented composition); `Expanded` (`Collapsible.Content` revealed by the card's `expanded` model, full-bleed divider seam).
- Values: `spec/components/cards.md`. 16 dp content keyline (24 dp from 600 px); 2 dp resting, 8 dp picked up; under `pointer: fine` 0 dp resting and 8 dp on hover; 8 dp collection gutters; dividers full-bleed for seams, inset for related content.
- Decision: corner radius 2 dp (text says "rounded corners" only; Vuetify 2 px). Swipe to dismiss and pick-up-and-move are gestures: not shipped; provide buttons.

### QuChip

`span.quantum-chip` (a `button` when `@click` is bound or `contact`) > [`img.quantum-chip__avatar` | `svg.quantum-icon`, `span.quantum-chip__label`, `button.quantum-chip__delete` > `svg.quantum-icon`].

- `icon`, `avatar` (image URL), `deletable` (`false`: `cancel` glyph at 24 dp 54%, emits `delete`; keyboard Delete on the focused chip also emits it; persistent on desktop), `contact` (`false`: the in-field contact chip, 8 dp avatar-side padding, Regular 14 sp), `disabled`.
- `Addresses` (optional part, contact chips only): `Popover.Content` at 8 dp listing `Address` rows (Regular 14 sp) under the name at 16 sp; the chip becomes the `Popover.Activator`; a second press closes.
- Values: `spec/components/chips.md`. 32 dp tall; label Regular 13 sp 87%; 12 dp side padding; delete icon 24 dp with 4 dp margin; focused in-field chip 40 dp with 2 dp elevation.
- Decisions: fill Grey 300 `#E0E0E0` light / `#555555` dark and a full pill radius are image-derived (`moderate`); chips sit at 0 dp (absent from the elevation table).

### QuDataTable

`div.quantum-data-table` > [`div.quantum-data-table__header`, `div.quantum-data-table__contextual`, `div.quantum-data-table__scroll` > `table.quantum-data-table__table`, `div.quantum-data-table__footer`].

- Root: passes `sortMultiple: false` and `selectStrategy: 'page'` to `DataTable.Root` internally (the page sorts one column: "If the user clicks on a column that is already sorted, reverse the sort order and rotate the sort icon"); public props `rowsPerPage` (`10`, the footer label's own word) and `selectable` (`false`: adds the checkbox column with select-all); `v-model:selected`. No `v-model:search`: a consumer who needs filtering composes `QuSearchBar` with `DataTable.Root v-model:search` through the escape hatch.
- Parts: `Header` (64 dp card title row: `title` Regular 20 sp, action icons at 54% with 24 dp spacing and 14 dp to the edge); `Contextual` (replaces `Header` while rows are selected: fill `--quantum-accent-light` (the secondary colour's 50 value), count label, contextual icons); `Table`, `Head`, `Column` (`id`, `sortable`, `numeric`, `tooltip`: `aria-sort` on the `th`, the sort control is a `Button.Root` showing `arrow-upward` at 38% on hover and 87% when sorted, rotated for descending), `Body`, `Row` (`value`, `selectable`), `Cell` (`numeric`, `editable: 'small' | 'large'`: small opens a `Popover` edit sheet with one `QuTextField` confirmed by Enter, large opens a `QuDialog` with Cancel and Save; `Cell` takes `v-model` for the edited value and emits `update:modelValue` on Enter or Save, Escape and Cancel revert and emit nothing, the consumer writes the row), `Footer` (56 dp: "Rows per page:" with a `QuDropdownButton` bound to `rowsPerPage` 40 dp from its label, the range text "1-10 of 100" 32 dp apart, `chevron-left` / `chevron-right` 24 dp apart and 14 dp from the edge).
- Values: `spec/components/data-tables.md`. Header row 56 dp, data rows 48 dp; 24 dp edge padding; 56 dp minimum between columns (the redline's 24 dp first gap is recorded as an inconsistency); content Regular 13 sp 87%; column headers Medium 12 sp 54%; row hover Grey 200, selected row Grey 100; checkbox 18 dp glyph in 24 dp; table card 2 dp.
- Limits: phone layout is horizontal scroll inside `__scroll`; no pinned headers; checkboxes stay visible (the figures) rather than hover-revealed; inline menu cells are `QuMenu` the consumer places in a `Cell`.

### QuDialog

`dialog.quantum-dialog` > `div.quantum-dialog__sheet` > [`h2.quantum-dialog__title`, `div.quantum-dialog__text`, `div.quantum-dialog__actions`].

- `v-model` open; `variant`: `'alert' | 'simple' | 'confirmation' | 'full-screen'` (`'alert'`); `dismissible` (`true`; `false` disables outside click and Escape so an action must be chosen, the dialogs page's "the user's ability to dismiss a dialog may be disabled"; `data-dismissible`). Not `persistent`: in MD1 that word means a non-modal surface that stays (`QuBottomSheet persistent`, `QuNavigationDrawer type="persistent"`). `v-model:value` (`unknown`, `undefined`): the choice a `simple` or `confirmation` dialog commits.
- `alert` composes `AlertDialog.*`, the other variants `Dialog.*`; both forward `closeOnClickOutside` from `dismissible` and prevent the native `cancel` event (Escape) while not dismissible (the spec lets dialogs dismiss unless disabled). The root provides a `quantum:dialog` context with `value` and `commit(value)`: `QuList.Item` (under `simple`) and `QuRadio.Group` / `QuCheckbox` (under `confirmation`) call `commit` when hosted in a dialog. `simple` hosts a `QuList` whose item click commits and closes (56 dp avatar rows, 80 dp keyline); `confirmation` hosts `QuRadio.Group` or `QuCheckbox` rows and keeps `Confirm` disabled until `value` is set; `full-screen` fills the viewport under 600 px, hosts a `QuToolbar` with `Nav icon="close"` and the verb action, and prompts a discard confirmation when `dirty` is set.
- Parts: `Activator` (renderless), `Content` (the `<dialog>`; `::backdrop` in `--quantum-scrim`; `scrim: false`), `Title` (Medium 20 sp, 28 dp line height, 24 dp top, 20 dp to the text; pinned while a list scrolls), `Text` (Body 1 14 sp at `--quantum-text-secondary`), `Actions` (52 dp, 8 dp padding, affirmative at the end, dismissive before it; `stacked` auto when a label exceeds (width - 24) / 2, each stacked button a 48 dp target; a 12% stroke appears above while the content is scrolled), `Cancel` and `Confirm` (flat `QuButton`s placed inside `Actions`; labels default to `locale.ti('Quantum.cancel') ?? 'Cancel'` and `locale.ti('Quantum.ok') ?? 'OK'` and the default slot overrides them; rendered on `AlertDialog.Cancel` / `AlertDialog.Action` under `variant="alert"` and on `Dialog.Close` / a plain `Button.Root` otherwise; `Confirm` emits `confirm` with `value` and closes, and is `disabled` while `value` is `undefined` under `confirmation`).
- Values: `spec/components/dialogs.md`. 24 dp content padding; 24 dp elevation; 36 dp buttons, 64 dp minimum width in dialogs; at least 40 dp from the side edges and 24 dp top and bottom; width in 56 dp units, minimum 280 dp; at most two actions (a third is a dev warning).
- Decisions: desktop width is not in the spec: the sheet sizes to content between 280 px and 560 px (5 and 10 units); the body text style is not stated: Body 1 at secondary ink (`low`); scrim: `--quantum-scrim` (see Theme).

### QuDivider

`hr.quantum-divider`. `inset` (`false`): starts at the 72 dp keyline (80 dp from 600 px). 1 dp, `--quantum-divider` 12%. Placed inside the bottom of a tile when rendered by `QuList`; standalone between sections otherwise. `spec/components/dividers.md`. No vertical variant.

### QuExpansionPanel

`div.quantum-expansion-panel` > `div.quantum-expansion-panel__item` > [`h3 > button.quantum-expansion-panel__header`, `div.quantum-expansion-panel__content[role=region]`].

- Root is `ExpansionPanel.Group`: `v-model`, `multiple` (`false`: accordion), `disabled`. `Item`: `value`, `disabled`. `Header`: `label`, `summary` (middle column), `secondary` (12 sp line under the label); the chevron is the `Cue` with `expand-more`, 38% at rest, 54% on hover. `Content`: the editing body. `Actions`: the CANCEL / SAVE row (16 dp above and below 36 dp buttons, 8 dp apart) above a divider; it emits nothing, the buttons are the consumer's.
- Values: `spec/components/expansion-panels.md`. Collapsed 48 dp, expanded header 64 dp; 16 dp vertical and 24 dp horizontal padding; 16 dp between columns; 24 dp icon; 1 dp dividers; label Regular 15 sp 87% (16 sp in the 2016 revision); focus fill Grey 200.
- Decisions: single-open by default (spec silent); the expanded item detaches 16 dp above and below and lifts by the family's dynamic offset (+6 dp) to 8 dp over the group's 2 dp card; headers follow the APG Accordion pattern (Enter and Space).

### QuGridList

`ul.quantum-grid-list` > `li.quantum-grid-list__tile` > [the primary action (`a` or `button.quantum-grid-list__action`) wrapping the image, `div.quantum-grid-list__bar`].

- Root: `gutter: 4 | 1` (`4`), `columns` (`undefined`: auto-fill from `ratio` and the container), `ratio` (`'1:1'`; one of 16:9, 3:2, 4:3, 1:1, 3:4, 2:3), `horizontal` (`false`: the single-line gallery).
- `Tile`: `span` and `rowSpan` (`1`), `href`, `selected`, `alt`. `Bar`: `position: 'header' | 'footer'` (`'footer'`), `title`, `subtitle` (two lines, 68 dp), `icon`, `iconSide: 'start' | 'end'`; emits `action` from the icon (a 48 dp `Button.Root` flush with the tile edge). `QuSubheader` separates sections (48 dp, 16 dp keyline); no dividers.
- Values: `spec/components/grid-lists.md`. Bar 48 dp single, 68 dp double; 16 dp text padding; 16 sp / 12 sp or 14 sp / 14 sp; square corners; text truncates with an ellipsis.
- Entrance: on mount the tiles fade and lift in sequence left to right then top to bottom, each `--quantum-stagger` (20 ms) after the previous, over `--quantum-duration-enter` on the decelerate curve (the choreography page's stagger rule), gated by reduced motion.
- Decision: the bar scrim is not in the spec: `--quantum-grid-list-bar` = `rgba(0, 0, 0, 0.6)` with white ink (the imagery page's 20 to 60% range, upper bound for legibility).

### QuList

`ul.quantum-list` > `li.quantum-list__item` > [`button | a | div.quantum-list__tile`] > [`div.quantum-list__avatar`, `svg.quantum-list__icon`, `div.quantum-list__content` > [`div.quantum-list__primary`, `div.quantum-list__secondary`], `div.quantum-list__action`].

- Root: `dense` (`false`), `select: 'none' | 'single' | 'multiple'` (`'none'`), `v-model`, `lines: 1 | 2 | 3` default for items.
- `Item`: `value`, `href`, `disabled`, `lines`; the whole tile is the primary action; `aria-current="page"` for navigation lists under `select="none"`; under `select="single" | "multiple"` the root renders `ul[role=listbox]` (`aria-multiselectable` for `multiple`) and each tile `role="option"` with `aria-selected` (the hover check mark and scrim of the selection pattern); `aria-selected` is never set outside a real listbox (it is valid only on `option`, `gridcell`, `row` and `tab`; Emerald's `EmList` uses `aria-current` for the same reason). `Avatar` (`src`, 40 dp), `Icon` (`name`, 24 dp, also 24 dp in dense), `Content`, `Primary` (Regular 16 sp, 13 sp dense), `Secondary` (Regular 14 sp, clamped to two lines in three-line tiles), `Action` (the 56 dp secondary column: a `QuCheckbox`, `QuSwitch`, `QuIconToggle`, a `reorder` handle, or Caption 12 sp info), `Group` (`Collapsible`: an item-shaped header with `icon` and `title`, chevron `expand-more` rotating, children indented to 72 dp, full-bleed dividers above and below; the expanded title takes `--quantum-primary`).
- Values: `spec/components/lists.md`, `spec/components/lists-controls.md`. Heights 48 / 56 (avatar) / 72 / 88 dp, dense 40 / 48 / 60 / 76 dp; 16 dp edge, 72 dp text keyline (80 dp from 600 px); list padding 8 dp (4 dp dense); 20 dp text paddings to the baseline.
- Entrance: on mount the items fade and lift in sequence, each `--quantum-stagger` (20 ms) after the previous, over `--quantum-duration-enter` on the decelerate curve, top to bottom (the choreography page's stagger rule), gated by reduced motion.
- Limits: reorder and leave-behind swipes are not shipped (gestures); the `reorder` handle exposes keyboard move-up and move-down with a live region instead. Hover 6% (decision above), focus 12%, pressed ripple.

### QuSubheader

`div.quantum-subheader` (`li[role=presentation]` inside `QuList`; `role="heading"` with `aria-level` otherwise). `inset` (`false`: 72 dp, for a list with a left-aligned FAB), `primary` (`false`: `--quantum-primary` text instead of 54%), `sticky` (`true`: `position: sticky; top: 0`, pushed off by the next subheader). 48 dp, Medium 14 sp, 16 dp keyline. `spec/components/subheaders.md`.

### QuMenu

`div.quantum-menu[popover][role=menu]` > [`div.quantum-menu__item[role=menuitem]` > [`svg.quantum-icon`, `span.quantum-menu__label`, `span.quantum-menu__info`], `hr.quantum-menu__divider`, `div.quantum-subheader`].

- Root (`Menu.Root`): `v-model`, `dense` (`false`), `desktop` (`false`: 32 px rows, 24 px padding, 15 px type; `dense` + `desktop`: 24 px, 13 px), `disabled`, `openDelay` / `closeDelay` from v0 (100 / 250 ms) for sub menus.
- Parts: `Activator` (renderless), `Content` (8 dp sheet; width snapped up to the 56 dp unit, 112 dp minimum and 280 dp maximum on handsets, 64 px unit on desktop; 16 dp from the edges, 24 dp from 600 px; scrolls internally with a visible scrollbar), `Item` (`icon`, `info` (inline information such as a shortcut, never truncated, `aria-keyshortcuts`), `disabled`, `value`), `CheckItem` (`Menu.CheckboxItem`, `v-model:checked`, check glyph in the leading slot), `Divider` (`Menu.Separator`, 8 dp above and below), `Subheader`, `Sub` (`Menu.Sub` + `SubActivator` + `SubContent` folded into one part with `label` and `icon`; `arrow-right` trailing glyph; 9 dp, +1 dp per level; opens on pointer rest, focus or ArrowRight; one level ideally).
- Values: `spec/components/menus.md`. 48 dp rows, 16 dp text padding, 8 dp top and bottom, 16 sp (14 sp dense) on handsets; text 87%, disabled 38%, icons 54%; selected row highlighted with `--quantum-focus`.
- Decisions: hover `--quantum-hover`; radius 2 dp (`low`); items fade in as the sheet grows from its origin at the activator (225 ms decelerate in, 195 ms accelerate out).
- Limit: the simple-menu rule that positions the selected item over the emitting element is not implemented in v1 (CSS anchor positioning has no measured offset); the menu opens below the activator.

### QuDatePicker

`div.quantum-date-picker` > [`div.quantum-date-picker__header` > [`button.quantum-date-picker__year`, `div.quantum-date-picker__date`], `div.quantum-date-picker__body` > [`div.quantum-date-picker__nav`, `table.quantum-date-picker__grid[role=grid]` | `ul.quantum-date-picker__years[role=listbox]`]].

- `v-model` an ISO date string (`useDate` formats when `createDatePlugin` is installed, plain `Date` otherwise); `landscape` (`false`: header becomes a 168 dp start column); `firstDayOfWeek` (`0`). Tapping the year opens the year view; chevrons and horizontal swipe move months; the grid is an APG Date Picker grid on `useRovingFocus({ columns: 7 })` (`orientation` is ignored when `columns` is set).
- DS-owned headless: a private `createDatePickerCore` modelled on Emerald's `createCalendar` (approach, not code) because v0's `createDatePicker` is a draft with no source. Graduates to v0 when it lands.
- Values: `spec/components/pickers.md` (measured, `moderate`). 328 x 484 dp portrait, 512 x 304 dp landscape; 96 dp header in `--quantum-primary` (Grey 700 in dark) with the year at 14 sp 70% and the date at Display 1 34 sp; 48 dp navigation row, Medium 14 sp label; 40 dp weekday row at 12 sp 38%; day cells 44 x 40 dp, 12 sp; selected day a 40 dp `--quantum-primary` circle (`--quantum-accent-control` in dark); today in primary and heavier weight; year list 44 dp pitch at 16 sp, selected year 24 sp.
- Hosted by `QuDialog variant="confirmation"`, which supplies CANCEL and OK; the picker never renders its own actions. One value per picker.
- Limits: min, max, disabled dates and ranges are not in the spec and do not ship.

### QuTimePicker

`div.quantum-time-picker` > [`div.quantum-time-picker__header` > [`div.quantum-time-picker__view[role=group]` > [`button.quantum-time-picker__hours[aria-pressed]`, `span`, `button.quantum-time-picker__minutes[aria-pressed]`], `div.quantum-time-picker__period[role=radiogroup]` > `button[role=radio]` x2], `div.quantum-time-picker__clock[role=radiogroup]` > `svg` face + hand (inline geometry, declared under Deviations) + `button[role=radio]` per number].

- `v-model` `"HH:mm"`; `format: '12' | '24'` (`'12'`; `24` draws the inner ring, an interpretation since the spec names but does not draw it); `landscape`.
- Tapping the hour or minute digits switches views (`Toggle.Group` + `Toggle.Root`: `role="group"` with `aria-pressed`); AM / PM and the clock numbers are each a `Radio.Group mandatory="force"` of `Radio.Root`s (`radiogroup` / `radio` with roving tabindex and wrapping arrow keys built in; no `useRovingFocus`, which would double-handle the keys); selecting an hour advances to minutes; arrows also rotate the hand.
- Values: `spec/components/pickers.md`. Digits about 60 sp (48 sp landscape), active 100% white, inactive 70%; face 296 dp (224 dp landscape) in Grey 200 (Grey 700 dark); numbers 16 sp at a 124 dp radius; 2 dp hand from a 6 dp dot to a 40 dp filled target (36 dp landscape).
- Hosted by `QuDialog variant="confirmation"` like the date picker.

### QuProgressLinear

`div.quantum-progress-linear[role=progressbar]` > [`div.quantum-progress-linear__track`, `div.quantum-progress-linear__buffer`, `div.quantum-progress-linear__fill`].

- `value` (`undefined`: indeterminate), `buffer` (`undefined`: the buffer variant with a dotted trail for the unbuffered remainder), `query` (`false`: the indeterminate sweep reversed until `value` arrives). No `active`: the page says bars "appear and disappear" at the edge of a header or sheet; the consumer mounts the indicator with `v-if` and Quantum animates it in and out through `Presence` (`data-presence` carries the phase), 225 ms decelerate in and 195 ms accelerate out.
- Composition: `Progress.Root` + `Track` + `Fill` + `Buffer`; a `value` of `0` is passed as determinate (v0 reports 0 as indeterminate, so Quantum binds `data-state` from its own prop).
- Values: `spec/components/progress-activity.md`. 4 dp tall, full width at the edge of a header or sheet; fill `--quantum-primary`, track the fill at 30%; never decreases.
- Decision: the indeterminate cycle is not in the spec: 2 s per sweep on the standard curve.

### QuProgressCircular

`div.quantum-progress-circular[role=progressbar]` > `svg` (inline geometry, declared under Deviations) > [`circle.quantum-progress-circular__track` (determinate only), `circle.quantum-progress-circular__arc`].

- `value`, `size` (`40`), `fab` (`false`: 64 dp ring drawn around a sibling 56 dp `QuFab`, completing by filling the FAB in `--quantum-accent` with a `check`).
- Composition: `Progress.Root` for the attrs and `percent`; the arc is `stroke-dasharray` on a 4 dp stroke, growing clockwise from the top; indeterminate rotates with a varying sweep (1.4 s, decision).
- The refresh indicator (3 dp) is this component with `--quantum-elevation-3` on a 40 dp white disc, documented under the swipe-to-refresh composition.

### QuCheckbox, QuRadio, QuSwitch

`label.quantum-checkbox` > [`button.quantum-checkbox__control[role=checkbox]` > [`span.quantum-ripple`, `span.quantum-checkbox__box` > `svg.quantum-icon` (`QuIcon name="check"`, `name="remove"` under `indeterminate`)], `span.quantum-checkbox__label`]; the same shape for `quantum-radio` (`role=radio`, ring and dot) and `quantum-switch` (`role=switch`, `span.quantum-switch__track` > `span.quantum-switch__thumb`).

- Shared: `label` (the visible text; the control's `aria-labelledby` points at it), `value`, `name`, `disabled`, `namespace`. `QuCheckbox` and `QuSwitch` take `v-model` boolean; `QuRadio` must sit inside `QuRadio.Group` (`v-model`, `name`, `mandatory`, `activation`), as v0 requires.
- `QuCheckbox` `indeterminate` is a declared extension: MD1 has no mixed state, `QuDataTable` select-all needs one (see Deviations).
- Composition: `Checkbox.Root` + `Indicator`; `Radio.Group` + `Radio.Root` + `Indicator`; `Switch.Root` + `Track` + `Thumb` (the Track's hard-coded `dir="ltr"` is counteracted by `transform: scaleX(-1)` on the Quantum track under `[dir="rtl"]`).
- Values: `spec/components/selection-controls.md` (text for colours, measured geometry). Checkbox 18 dp box, 2 dp border, 2 dp radius; radio 20 dp ring, 2 dp stroke, 10 dp dot; switch 36 x 14 dp track, 20 dp thumb at 1 dp elevation, 16 dp travel; on: `--quantum-accent` (switch `--quantum-accent-control` in dark, track at 50%); off: 54% black / 70% white, switch thumb Grey 50 / Grey 400 on a 38% / 30% track; disabled 26% / 30%, disabled switch thumb Grey 400 / Grey 800 on a 12% / 10% track; 48 dp halo on focus and press (6 to 10%), drawn only under `pointer: coarse`; 48 dp target; 8 dp control-to-label gap (decision).

### QuSlider

`div.quantum-slider[role=group]` > [`svg.quantum-icon` (start), `div.quantum-slider__track` > [`span.quantum-slider__range`, `span.quantum-slider__ticks`], `span.quantum-slider__thumb[role=slider]` > `span.quantum-slider__pin`, `svg.quantum-icon` (end), `input` numeric field when `editable`].

- `v-model` number; `min` (`0`), `max` (`100`), `step` (`1`); `discrete` (`false`: snaps to ticks, a 26 x 32 dp value pin replaces the thumb on focus, 2 dp ticks appear while pressed); `iconStart`, `iconEnd` (24 dp intensity icons, 16 dp from the track); `editable` (`false`: a 24 dp wide numeric `QuTextField` 16 dp after the track, live during drag); `disabled`; `label` / `ariaLabel`.
- Composition: `Slider.Root` + `Track` + `Range` + `Thumb`; the pin binds the Thumb's `value` slot prop.
- Values: `spec/components/sliders.md` (measured). 2 dp track; 12 dp thumb, 18 dp pressed, hollow 2 dp ring at 0%; 32 dp focus halo (16% accent on, 11% black off); disabled 8 dp thumb with 2 dp gaps; active track `--quantum-accent` (`--quantum-accent-control` in dark), inactive 26% black / 30% white, 38% while focused; pin text about 10 sp white.
- Out: range and vertical sliders (not MD1).

### QuSnackbar

`div.quantum-snackbar[role=status]` > [`span.quantum-snackbar__text`, `button.quantum-snackbar__action`]; `Portal` is `div.quantum-snackbar-portal` fixed at the bottom; `Queue` renders only the newest ticket.

- Root: `action` (label string; emits `action`; "Dismiss" and "Cancel" are refused with a dev warning); `multiline` (`false`: 80 dp, two lines); `align: 'center' | 'start'` (`'center'`; `start` is 24 dp from the start and bottom edges) for the tablet and desktop form. The root is always `role="status"`: the page names no urgency level and the errors pattern keeps critical errors out of snackbars; a consumer who needs an assertive `role="alert"` composes v0 `Snackbar` through the escape hatch. The 112 dp stacked-action layout triggers from the measured action width, not a prop.
- `Queue` uses `createNotificationsPlugin({ timeout })`: one snackbar at a time; a new one waits for the first to contract downward; hover and focus pause the timer.
- Composition: `Snackbar.Portal` + `Queue` + `Root` + `Content`; `Presence` for the upward entrance (225 ms decelerate) and downward exit (195 ms accelerate); the action is a flat `QuButton` in the accent.
- Values: `spec/components/snackbars-toasts.md`. 48 dp single line; full width and square under 600 px; 288 to 568 dp wide with 2 dp corners from 600 px; 24 dp side padding, 14 dp vertical; text Regular 14 sp white on `#323232`; 24 dp text-to-action gap (48 dp from 600 px); 6 dp elevation; `--quantum-snackbar-height` is published so `QuFab` moves up.
- Decision: auto-dismiss 6000 ms (not in the spec; Vuetify 1.5's default, `low`); no icons, at most one action, never persistent, never stacked.

### QuStepper

Horizontal: `div.quantum-stepper` > [`ol.quantum-stepper__header` > `li.quantum-stepper__step` > [`button.quantum-stepper__label` > [`span.quantum-stepper__circle`, `span.quantum-stepper__text` > [`span`, `small`]], `hr.quantum-stepper__connector`], `div.quantum-stepper__content[role=tabpanel]`]. Vertical: the `ol` holds each step's content under its label. Mobile: `div.quantum-stepper__bar` with BACK and NEXT around dots, a progress bar or nothing.

- Root (`Step.Root`): `v-model` current step, `vertical` (`false`), `linear` (`true`: inactive labels 38% and locked; `false`: 54% with hover and pressed), `alternativeLabels` (`false`: 104 dp bar, labels centred under circles, equal parts), `mobile: 'text' | 'dots' | 'progress'` (`undefined`: the bottom-bar variant replaces the header; `text` renders "Step N of M" in a 48 dp bar under the app bar).
- `Step` (`Step.Item`): `value`, `label`, `optional` (12 sp "Optional" sub-label), `editable` (pencil in the completed circle), `error` (message string: red warning glyph, red Medium label); `aria-current="step"` on the active item; headers are buttons only when the step is reachable. `Content`: the active step's body (`Collapsible` in vertical mode, indented to the 60 dp keyline). `Actions`: CONTINUE (raised) and CANCEL (flat), 16 dp above, 8 dp apart. `Bar`: the mobile bottom bar (56 dp, `#EEEEEE`), 8 dp dots at 16 dp pitch or a 3 x 112 dp `Progress.Root`.
- Values: `spec/components/steppers.md`. 72 dp bar; 24 dp circles with 12 sp numbers; 24 dp padding; 8 dp circle-to-label (12 dp vertical); 1 dp connectors in Grey 400 (text wins over the sheet's Grey 300); active circle `--quantum-primary` with white, inactive 38%; hover 6%.
- `feedback` (string, `undefined`): while set, the active step's `Content` is replaced by an indeterminate `QuProgressCircular` and the message in Body 1 14 sp at `--quantum-text-secondary`; root `data-feedback`; the steppers page's "transient feedback message after a step is saved", to be used only when there is long latency between steps.
- Decisions: header elevation 2 dp (drawn as a card, value not stated); the feedback layout is `not found` (the page shows it in video only), so the spinner-plus-message layout above is a decision.

### QuTabs

`div.quantum-tabs` > [`div.quantum-tabs__bar` > [`button.quantum-tabs__arrow` x2 when overflowing, `div.quantum-tabs__list[role=tablist]` > `button.quantum-tabs__item[role=tab]` > [`svg.quantum-icon`, `span.quantum-tabs__label`], `span.quantum-tabs__indicator`], `div.quantum-tabs__panel[role=tabpanel]`].

- Root (`Tabs.Root`): `v-model`, `scrollable` (`false`: fixed tabs share the width and carry `data-fixed`; from 600 px the fixed bar centres automatically when the margin between the tab edge and the view edge exceeds 16 dp, the tabs page's rule, so there is no `centered` prop), `disabled`. `Item`: `value`, `icon`, `label`, `disabled`; `icon` with slot text is the 72 dp stacked variant; mixing labelled and icon-only tabs in one bar is a dev warning (the spec's "Don't"). `Panel`: `value`; sibling slide on change (new content from the end side, old content to the start side, 300 ms standard; `[dir="rtl"]` mirrors).
- Composition: `Tabs.List` + `Item` + `Panel`; `createOverflow` decides when the desktop pagination arrows show; the bar is swipe-scrollable on touch.
- Values: `spec/components/tabs.md`. 48 dp (72 dp icons and text); min width 72 dp (160 dp from 600 px), max 264 dp (scrollable: the smaller of 264 dp and the view minus 56 dp); 12 dp side padding (24 dp under `pointer: fine`, where the label drops to 13 sp and the first tab starts at the 80 dp keyline); 20 dp bottom padding (12 dp when wrapped to two lines at 12 sp); 10 dp icon-to-text; 2 dp indicator; 24 dp icons.
- Decisions: on a `primary` bar the active ink and indicator are white and inactive is white 70% (spec); on a surface bar the active ink and indicator are `--quantum-accent` and inactive is `--quantum-text-secondary`; disabled is white 60% (2015 page) or `--quantum-text-disabled`. Overflow on desktop uses pagination arrows; the "More" dropdown is deferred.

### QuTextField

`div.quantum-text-field` > [`svg.quantum-icon` (signifier, 16 dp before the label; wrapped in `button.quantum-text-field__picker` under `picker`), `div.quantum-text-field__field` > [`label.quantum-text-field__label`, `span.quantum-text-field__prefix`, `input | textarea.quantum-text-field__input`, `span.quantum-text-field__suffix`, `button.quantum-text-field__clear`, `button.quantum-text-field__visibility`, `button.quantum-text-field__voice`, `button.quantum-text-field__dropdown` (the 24 x 24 dp `arrow-drop-down` container under `dropdown`), `span.quantum-text-field__line`], `div.quantum-text-field__list[role=listbox][popover]` > `div.quantum-text-field__item[role=option]` (under `dropdown`), `div.quantum-text-field__details` > [`span.quantum-text-field__helper | __error[aria-live=polite]`, `span.quantum-text-field__counter`]].

- `v-model`; `label` (required by the spec; `heading` hides it visually and keeps the accessible name), `helper`, `placeholder`, `prefix`, `suffix`, `counter: number | { words: number }` (a character limit, or a word limit counting whitespace-separated words, the page's "character or word counters"; "used / limit" at the end, red line and error state over the limit; `data-counter="characters" | "words"`), `required` (asterisk), `optional` ("(optional)"), `icon`, `clearable` (`close`, enabled only with text), `voice` (`mic`, always enabled, emits `voice`), `type` (`password` adds the `visibility` toggle), `box` (`false`: 56 dp filled box, 4 dp radius, 6% black / 10% white, 44 dp with `dense`), `dense` (`false`: 13 sp, halved spacings), `multiline` (`false`: grows downward), `textarea` (`false`: fixed height, scrolls, 1 dp border in the line colour), `fullWidth` (`false`: 56 dp, 20 dp vertical padding, 48 dp with `dense`), `solo` (`false`: the page's solo field "for a single action such as search": no input line, no floating label, placeholder only, icons inside the sheet, `--quantum-elevation-2` rising to 3 with `data-scrolled`, 2 px radius; `data-solo`), `dropdown` (`false`: the field is the spec's select, the page's "Nested menus & pickers": the input is readonly, an `arrow-drop-down` glyph sits in a 24 x 24 dp container 8 dp above the line, pressing the field or the arrow opens a `QuMenu`-styled `Select.Content` listing the `Item` children (`value`, `disabled`), choosing one writes `v-model`; `data-dropdown`, `data-open`), `picker: 'date' | 'time'` (`undefined`: the icon signifier becomes a `Button.Root` that opens `QuDatePicker` or `QuTimePicker` inside `QuDialog variant="confirmation"` and writes the formatted value back on OK, the page's "a calendar icon may be tapped to reveal a date picker"; `data-picker`), `mask` (a group pattern such as `'(###) ###-####'` or `'#### #### #### ####'`, the page's "Grouped characters": separators are inserted on `input`, the caret jumps past a separator when its group fills, `v-model` stays unformatted; `data-mask`), `disabled`, `readonly`, `rules`, `validateOn` (`'blur'`), `error`, `errorMessages`.
- Composition: `Input.Root` (owns validation) + `Input.Control` (`as="textarea"` for `multiline` and `textarea`) + `Input.Description` + `Input.Error`; the visible `<label for>` floats on `data-dirty` or `data-focused`; `label` is not forwarded to `Input.Root` (no duplicate accessible name). Under `dropdown` the field composes `Select.Root` + `Select.Activator` (the readonly control and the arrow) + `Select.Content` + `Select.Item` (`Item`), one value per field. Under `picker` the signifier is a `Button.Root` hosting a `QuDialog`.
- Values: `spec/components/text-fields.md`. Input Regular 16 sp, label 16 sp resting and 12 sp floating, helper, error and counter 12 sp; 16 dp above the label, 8 dp between label and input, 8 dp around the line, 8 dp to the helper; tile heights 72 dp (floating label), 80 dp with error, 88 dp with counter, 16 dp between fields; line 1 dp 42% black / 70% white, hover 2 dp 87% / 100%, focus 2 dp `--quantum-accent` with the "ripple and wash" from the touch point, error 2 dp Red A400 `#FF1744`, disabled 1 dp dotted; label 54% / 70%, floating focused in the accent, disabled 38% / 50%; placeholder 42% / 50%.
- Decisions: the accent, not the primary, is the active colour (the colour page lists text fields and cursors under the secondary colour); errors show when focus leaves (`validateOn="blur"`) and replace the helper; in-field contact chips are `QuAutocomplete` territory (grouped characters are `mask` above).

### QuAutocomplete

`div.quantum-autocomplete` > [the `QuTextField` chrome with `input[role=combobox]`, `div.quantum-autocomplete__list[role=listbox][popover=manual]` > `div.quantum-autocomplete__item[role=option]`].

- `v-model`; the `QuTextField` text props; `strict` (`false`: free text allowed), `multiple` (`false`: selections render as contact `QuChip`s inside the field, the "To" field of the chips page), `inline` (`false`: the suggestion completes to the right of the cursor at placeholder colour; Enter accepts), `displayValue`.
- Parts: `Item` (`value`, `disabled`, `icon`; 48 dp rows at the 72 dp keyline when iconed), `Empty`.
- Composition: `Combobox.Root` + `Activator` + `Control` + `Content` + `Item` + `Empty`; the list is a `QuMenu`-styled 8 dp sheet anchored to the field.
- Values: `spec/components/text-fields.md` (auto-complete), `spec/components/menus.md` (sheet), `spec/components/chips.md` (in-field chips: 32 dp, 40 dp focused).

### QuTooltip

`div.quantum-tooltip[role=tooltip][popover]` > text. `Activator` is renderless.

- Root (`Tooltip.Root`): `v-model`, `disabled`; `Activator` (renderless; binds the slot `attrs` to the consumer's control) and `Content` (plain text; rich content is refused by the spec).
- Composition: `Tooltip.*` with `createTooltipPlugin` for the region delays. Touch: v0 drops touch pointers, so `Activator` adds a DS-owned press-and-hold (`pointerdown` + `useTimer`): hold shows, lift keeps it 1.5 s, any other action hides.
- Values: `spec/components/tooltips.md`. Desktop (`pointer: fine`): 22 dp tile, 8 dp side padding, 14 dp below the target, Medium 10 sp; touch: 32 dp, 16 dp, 24 dp, Medium 14 sp; Grey 700 at 90% with white text; no arrow; 150 ms in on the deceleration curve, 150 ms out on the acceleration curve; opens on hover and on `:focus-visible`; centred below the target, flipping above when there is no room (decision).
- Decisions: radius 2 dp, no elevation, 0 ms open delay on hover (not in the spec), long-press threshold 500 ms (not in the spec).

### QuNavigationDrawer

Temporary: `dialog.quantum-navigation-drawer` > `nav.quantum-navigation-drawer__sheet` > [`div.quantum-navigation-drawer__header`, `div.quantum-navigation-drawer__content`]. Persistent, permanent and mini: `nav.quantum-navigation-drawer` without the `dialog`.

- `v-model` open; `type: 'temporary' | 'persistent' | 'permanent'` (`'temporary'`); `mini` (`false`: the persistent drawer at rest shows only the 16 dp icon column and expands on open); `clipped` (`false`: starts under the app bar), `floating` (`false`: detached inside a card); `side: 'start' | 'end'` (`'start'`; the end drawer is the spec's right nav).
- Parts: `Activator` (renderless, temporary only); `Header` (the account area: `name` Medium 14 sp white, `email` Regular 14 sp white, `avatar`, `image` background, `--quantum-primary` fill by default; 56 dp row keyline); `Content` (scrolls; holds `QuList`, `QuSubheader`, `QuDivider`; 8 dp around each grouping; full-bleed dividers with 8 dp above and below).
- Composition: temporary drawers are `Dialog.Root` + `Dialog.Content` (native `<dialog>` at the start edge, `scrim: false`, `::backdrop`, focus containment and Escape from the browser), the Bootstrap `BDrawer` precedent; the other types are DS-owned on `Atom` with `Collapsible` for nested groups and `useBreakpoints` for a documented `type` switch the consumer binds.
- Values: `spec/patterns/navigation-drawer.md`, `spec/layout.md`. Width `min(100vw - 56px, 280px)` under 600 px and `min(100vw - 64px, 320px)` from 600 px (the structure page's 320 dp is the ceiling; desktop left nav at most 400 dp); 16 dp elevation for temporary, content elevation otherwise; items Medium 14 sp 87%, icons 54%, selected item in `--quantum-primary` with a darker tint when the ripple needs contrast; subheaders Medium 14 sp 54% at the 16 dp keyline; the drawer scrolls as a view.
- Decisions: mini width 56 dp (64 dp from 600 px), one standard increment, derived from the 16 dp icon margins on both sides (Vuetify 80 px recorded); the persistent drawer's open state is the consumer's `useStorage`; the cascading desktop drawer is a composition with `QuMenu` panels.

### QuSearchBar

`form.quantum-search-bar[role=search]` > [`button.quantum-search-bar__nav` (`search` glyph at rest, `arrow-back` while focused), `input.quantum-search-bar__input[role=combobox]`, `button.quantum-search-bar__clear`, `button.quantum-search-bar__voice`, `button.quantum-search-bar__button` (raised, under `button`), `div.quantum-search-bar__list[role=listbox]` > `div.quantum-search-bar__item`].

- `v-model` query; `placeholder`; `voice` (`false`); `button` (`false`; forced on under `(pointer: fine)`): a raised `QuButton` labelled Search (`locale.ti('Quantum.search') ?? 'Search'`) after the field, the text-fields page's "On desktop, a raised search button should appear to the right of the search field"; `data-button`; emits `submit` (Enter, the button, or a chosen suggestion), `voice`, `clear`. `Item` (`value`, `icon` default `history` for historical and `search` for completions), `Empty`.
- Composition: the field is `QuTextField solo` (the inset sheet, the clear and mic buttons, the 2 dp resting and 3 dp scrolled elevation of the elevation table's quick entry / search bar rows); the suggestions are `Combobox.*` (`ClientComboboxAdapter` filtering, `displayValue`, `Combobox.Control openOn="input"`; `useTypeahead` is a prefix matcher for `Select` and does not compose with the adapter); the up arrow releases focus and closes the suggestions. Results are the consumer's `QuCard`s.
- Values: `spec/patterns/search.md`, `spec/components/text-fields.md` (solo field). The page has no metrics: 48 dp tall field (the solo field height, decision), 16 dp keylines, 48 dp suggestion rows at the 72 dp keyline, 2 dp radius.

### QuFeatureDiscovery

`div.quantum-feature-discovery` (the `Tour.Highlight` portal, fixed over the page) > [`div.quantum-feature-discovery__background` (the circular prompt background), `div.quantum-feature-discovery__target` (the circular tap target over the promoted action)] + `div.quantum-feature-discovery__content[role=dialog]` (`Tour.Content`) > [`h2.quantum-feature-discovery__title`, `p.quantum-feature-discovery__text`].

- `v-model` open; `color: 'primary' | 'accent'` (`'primary'`: the page's "the tap target may use the primary color of your app or toolbar"; the colour figures show the accent as the alternative); `contained` (`undefined`: auto; `true` limits the prompt to the surface the target rests on, the desktop and tablet rule); `placement: 'start' | 'end'` (`undefined`: computed from the edge rules below; set, it forces the 20 dp background offset side). Emits `complete` (the promoted action was tapped) and `dismiss` (tap outside or Escape).
- Parts: `Target` (renderless `Tour.Activator` whose `attrs` the consumer binds on the promoted action, a `QuFab` or `QuButton icon`; the action stays tappable through the highlight); `Title` (`Tour.Title`); `Text` (`Tour.Description`). One prompt holds one action and no other buttons (spec).
- Composition: `Tour.Root` with a single step + `Tour.Highlight` (`blocking: false`, `blockActivator: false`; v0's cutout scrim restyled into the two circles) + `Tour.Content` (placement from the edge rules) + `Tour.Title` + `Tour.Description`; tapping outside runs `Tour.Skip`, Escape comes from `Tour.Keyboard`, tapping the promoted action runs the root's `complete`. `Tour.Next`, `Tour.Prev` and `Tour.Progress` are not rendered (one step).
- Values: `spec/patterns/feature-discovery.md`. Background in `--quantum-primary` (or `--quantum-accent`) at 96% opacity; within 88 dp of the screen top or bottom the target sits directly on the promoted action with the background centred on it; toward the centre the background is offset 20 dp away from the target (left for targets right of centre, right for targets left of centre, by writing direction for a centred target); on desktop and tablet the prompt is limited to the target's surface and the target is the size of the tappable surface, a surface smaller than 280 dp tall and 360 dp wide lets both circles extend past its edges at a higher elevation, targets within 88 dp of the surface edge centre the background, and targets within 144 dp of the top or bottom or 200 dp of the left or right screen edge centre the background above other elements; appear from the promoted icon on the standard curve; the idle pulse grows the highlighted action by 10% over one second and shrinks it, with a `QuRipple` at its largest size; the tap expands then fades and the dismiss shrinks then fades, both on the decelerate curve (the page's "ease out").
- Decisions (`not found` on the page, figures unreadable at research time): the target circle is 88 dp (the page's own edge threshold) and the background circle 2.5 times the target (`low`); appear over `--quantum-duration-enter`, interaction and dismiss over `--quantum-duration-leave`; title and body are Title 20 sp white and Subheading 16 sp white 70% (`low`).
- Limits: swipe to dismiss is not shipped (gesture); the guided flow (tap target, then `QuRipple`s on the following steps, then a `QuSnackbar` completion message with an action back to the origin) is a documented composition; hint text is `QuTextField placeholder`; one prompt per session and the targeting rules are the consumer's.

### QuIcon

`svg.quantum-icon[viewBox="0 0 24 24"][fill=currentColor]` > `path` per entry. `name` (a role; aliases resolve through `createTokens`), `label` (`role="img"` + `aria-label`; without it `aria-hidden="true"`), `size: 'm' | 's'` (`'m'` 24 px, `'s'` 20 px dense), `namespace`. `data-mirror` on the 11 directional roles (plus the conditional `help`, excluded under `:lang(he)`) flips under `[dir="rtl"]`. Unknown roles render nothing and warn in dev. Opacity tiers (`--quantum-icon-active`, `-inactive`, `-focused`) are applied by the host. The full role table, path data, aliases, licence text and the `README` / `LICENSE-ICONS` notice are in `spec/icons.md`; artwork is Material Icons at the pinned commit (the two post-MD1 redraws, `settings` and `account-circle`, ship master; the 3.0.2 strings are in the note).

### QuRipple

`span.quantum-ripple[aria-hidden]` > `span.quantum-ripple__wave` per press. A DS-owned `useRipple(target, { unbounded, center })` holds the wave list; the component binds `pointerdown`, `pointerup`, `pointercancel` and `keydown` (Enter, Space) through `useEventListener` and draws nothing while `useReducedMotion().isReduced` or `body[data-reduced-motion="reduce"]` (the `:active` fill stays as the non-animated pressed state).

- Values: origin at the pointer (centre on keyboard and when `center`); radius half the host's diagonal (`unbounded`: 48 dp circle); colour `--quantum-pressed` (the spec's pressed overlay: 40% `#999999` light, 25% `#CCCCCC` dark); expand over `--quantum-ripple-duration` (an alias of `--quantum-duration-standard`) on the standard curve, fade over `--quantum-duration-leave`.
- The spec states no ripple numbers; the timings are the motion page's own durations rather than Vuetify's 250 / 300 ms. Hosts never expose a `ripple` prop (ruling 8). Exported so consumers composing a v0 primitive through the escape hatch can add ink.

## Theme and tokens

`src/design-system.ts` is the dictionary; `src/colors.ts` holds the two flat theme maps; the adapter publishes everything as `--quantum-*` custom properties and `-channels` triplets. Numbers come from `spec/color.md`, `spec/typography.md`, `spec/elevation.md`, `spec/motion.md`, `spec/layout.md`, `spec/iconography.md`.

### Palette

`--quantum-<hue>-<shade>` for the 19 hues x (50..900 + A100..A700 where they exist) plus `--quantum-black` and `--quantum-white`: 256 values, imported from `@vuetify/v0/palettes/md1` (verified 256 / 256 identical to the spec page and to Vuetify 1.5, `spec/color.md` 1.1), not copied. Emitted on `:root` as foundations. The recommended text colour per swatch (black or white) is exported as `quantumPaletteInk` for consumers picking a custom primary; the six swatches contested between the 2016 and 2018 pages follow 2018.

### Roles

| Token | Rule | Light | Dark |
|---|---|---|---|
| `--quantum-primary` | the primary hue's 500 | Indigo 500 `#3F51B5` | same |
| `--quantum-primary-dark` | 700 (status bar, pressed raised button) | Indigo 700 `#303F9F` | same |
| `--quantum-primary-light` | 100 (related information under a primary region: the `QuToolbar.Extension` fill for related content under a `primary` bar; also the `--v0-surface-tint` bridge) | Indigo 100 `#C5CAE9` | same |
| `--quantum-accent` | the accent hue's A200 (FAB, flat and raised action buttons, text fields, selection, links) | Pink A200 `#FF4081` | same |
| `--quantum-accent-light` | A100, the spec's lighter contrast fallback; the `QuDataTable.Contextual` header fill. The darker fallback A400 is not a role token (no component reads it, ruling 5); it stays reachable as the palette value `--quantum-<hue>-a400` | `#FF80AB` | same |
| `--quantum-accent-control` | selection controls, sliders and picker ink: the accent in light, the accent hue's 200 in dark (selection-controls and pickers pages) | `#FF4081` | Pink 200 `#F48FB1` |
| `--quantum-on-primary`, `--quantum-on-accent` | 100% white on coloured backgrounds; black for the swatches the palette marks dark | `#FFFFFF` | same |
| `--quantum-error` | Red A400 (text fields error line, stepper error step) | `#FF1744` | same |
| `--quantum-app-bar` | theme figure | Grey 100 `#F5F5F5` | Grey 900 `#212121` |
| `--quantum-background` | theme figure | Grey 50 `#FAFAFA` | `#303030` (not a palette value) |
| `--quantum-surface` | cards, dialogs, sheets, menus, drawers | White `#FFFFFF` | Grey 800 `#424242` |

The default theme is the spec's own worked example (Indigo primary, Pink accent, `spec/color.md` 2.1). Consumers pass another hue set through `createQuantumPlugin({ theme: { themes } })`; `quantumHueTheme(primary, accent)` derives the 500 / 700 / 100 / A200 / A100 set from the palette for any of the 16 accent-bearing hues.

### Ink and state

| Token | Light | Dark | Source |
|---|---|---|---|
| `--quantum-text-primary` | black 87% | white 100% | colour page |
| `--quantum-text-secondary` | 54% | 70% | colour page |
| `--quantum-text-disabled`, `--quantum-text-hint` | 38% | 50% | colour page |
| `--quantum-divider` | black 12% | white 12% | colour page |
| `--quantum-icon-active` / `-inactive` / `-focused` | 54% / 38% / 87% | 100% / 50% / 100% | icons page |
| `--quantum-focus` | black 12% | white 12% | buttons page |
| `--quantum-pressed` | `#999999` 40% | `#CCCCCC` 25% | buttons page |
| `--quantum-hover` | black 6% | white 10% | steppers page (light, high); dark measured halo (`moderate`); not stated for buttons |
| `--quantum-button-disabled` | black 12% | white 12% | buttons page (raised container) |
| `--quantum-button-disabled-text` | black 26% | white 30% | buttons page |
| `--quantum-scrim` | black 20% | black 20% | bottom-sheets page; the only overlay value in MD1, applied to every modal `::backdrop` (Vuetify's `#212121` at 46% recorded as the rejected precedent) |
| `--quantum-snackbar` / `-snackbar-text` | `#323232` / white | same | snackbars page |
| `--quantum-tooltip` / `-tooltip-text` | Grey 700 at 90% / white | same | tooltips page |
| `--quantum-chip` | Grey 300 `#E0E0E0` | `#555555` | image only, Vuetify value (`moderate`) |
| `--quantum-grid-list-bar` | black 60% | same | decision (imagery page range) |
| `--quantum-selection` | `--quantum-accent` at 30% | same | selection page names the accent; the alpha is a decision |

### Typography

`--quantum-font-family: Roboto, Noto, sans-serif`; weights light 300, regular 400, medium 500, bold 700. One token set per style: `--quantum-type-<style>-size`, `-weight`, `-leading`, `-tracking`, `-transform`. Device sizes by default; `(pointer: fine)` switches subheading to 15 sp and body 2, body 1, menu to 13 sp.

| Style | Weight | Size (device / desktop) | Leading | Tracking | Opacity |
|---|---|---|---|---|---|
| display-4 | Light | 112 | single line | -10 | 54% |
| display-3 | Regular | 56 | single line | -5 | 54% |
| display-2 | Regular | 45 | 48 | 0 | 54% |
| display-1 | Regular | 34 | 40 | 0 | 54% |
| headline | Regular | 24 | 32 | 0 | 87% |
| title | Medium | 20 | single line | 5 | 87% |
| subheading | Regular | 16 / 15 | 24 | 10 | 87% |
| subheading-2 | Regular | 16 / 15 | 28 | 10 | 87% |
| body-2 | Medium | 14 / 13 | 24 | 10 | 87% |
| body-1 | Regular | 14 / 13 | 20 | 10 | 87% |
| caption | Regular | 12 | single line | 20 | 54% |
| button | Medium, uppercase | 14 | single line | 10 | 87% |
| menu | Medium | 14 / 13 | single line | 10 | 87% (metrics `low`: the archived scale image omits Menu) |

Decisions: single-line styles get `line-height: 1`; tracking numbers are Adobe units at 1/1000 em (`-10` is `-0.01em`), the unit being `low`; dense scripts (`:lang(ja), :lang(ko), :lang(zh)`) add 1 sp from title down and use the dense leading column; tall scripts (`:lang(ar), :lang(hi), :lang(th), :lang(vi)` and the rest of the page's list) use Regular and Bold only with the tall leading column; the font stack adds `"Noto Sans CJK"` and `"Noto Sans"` for those languages. Contrast floor 4.5:1, preferred 7:1.

### Elevation

`--quantum-elevation-0` to `--quantum-elevation-24`: the three-layer `box-shadow` values (umbra `--quantum-shadow-umbra` `rgba(0,0,0,.2)`, penumbra `.14`, ambient `.12`), the recipe tabulated in `spec/elevation.md` (Vuetify 1.5's `_elevations.styl`, the only pixel recipe; the spec gives dp only). Transition `box-shadow 280ms` on the standard curve. The dark theme keeps the same shadows (the spec's dark theme is surfaces, not lights). Component resting values are the spec's: dialog and picker 24, drawers and modal bottom sheet 16, FAB 6 (12 pressed), sub menu 9, menu 8, bottom navigation 8, snackbar 6, app bar 4, refresh indicator 3, search bar 2 (3 scrolled), card and raised button 2 (8 raised), switch 1; under `pointer: fine` every resting value drops 2 dp (raised button 0, 2 on hover and press).

### Motion

| Token | Value |
|---|---|
| `--quantum-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--quantum-easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--quantum-easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--quantum-easing-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` |
| `--quantum-duration-enter` / `-leave` / `-standard` / `-complex` | 225 / 195 / 300 / 375 ms; x1.3 at `(min-width: 600px) and (pointer: coarse)` (tablet); 150 / 150 / 200 / 200 ms under `pointer: fine` (desktop) |
| `--quantum-stagger` | 20 ms (the `QuList` and `QuGridList` entrance sequences) |
| `--quantum-ripple-duration` | `var(--quantum-duration-standard)` (read by `QuRipple`) |

Vuetify's `swing` and `fast-in-fast-out` curves are not Quantum curves.

### Layout

`--quantum-spacing-1..5` (8, 16, 24, 32, 40 px); `--quantum-keyline-margin` (16 px, 24 px from 600 px); `--quantum-keyline-content` (72 px, 80 px from 600 px); `--quantum-increment` (56 px, 64 px from 600 px); `--quantum-touch-target` (48 px); `--quantum-radius` (2 px), `--quantum-radius-box` (4 px); `--quantum-icon-size` (24 px, 20 px in dense hosts). Breakpoints cannot be custom properties: they ship as the documented 13-row table and the JS map `quantumBreakpoints` (480, 600, 840, 960, 1280, 1440, 1600, 1920 with the 16 px desktop reduction on 1024 and above) for `useBreakpoints`. The responsive-ui gutter (16 px, 24 px from 960 px) is not a token: no component reads it (`QuGridList` has its own `gutter` prop, ruling 5); the documented value lives in `spec/layout.md`.

### Theme definitions

`quantumColors` (light) and `quantumDarkColors` (`satisfies Record<keyof typeof quantumColors, string>`) hold every role, ink, state and surface token above; `createQuantumPlugin` registers them as `quantum-light` and `quantum-dark`. Scoped dark surfaces use v0's `Theme` component (`<Theme theme="quantum-dark">`), which the adapter honours through `[data-theme="quantum-dark"]`.

### The v0 bridge

The adapter also emits, on both theme blocks: `--v0-primary`, `--v0-on-primary`, `--v0-secondary` (= accent), `--v0-on-secondary`, `--v0-surface`, `--v0-on-surface` (= text-primary), `--v0-surface-variant` (= app-bar), `--v0-on-surface-variant` (= text-secondary), `--v0-surface-tint` (= primary-light), `--v0-background`, `--v0-on-background`, `--v0-divider`, `--v0-border` (= divider), `--v0-pre` (= app-bar), `--v0-accent` (= accent) and `--v0-on-accent` (= on-accent; Genesis `GnDocsCallout` reads `--v0-accent` and would paint its purple fallback without it), `--v0-error` / `--v0-on-error`, and the kit severities `--v0-info` Blue 500 `#2196F3`, `--v0-success` Green 500 `#4CAF50`, `--v0-warning` Orange 600 `#FB8C00` with `--v0-on-info` / `--v0-on-success` / `--v0-on-warning` white (the palette's recommended ink on those swatches) (bridge-only values from Vuetify 1.5's theme defaults, `moderate`; MD1 defines no such roles and Quantum components never read them). The same keys go in the `V0_ALIAS_KEYS` / `V0_REMAP_KEYS` tables (`spec/house-style.md` 1.6 and 1.7). `{ v0Aliases: false }` turns the bridge off.

### Prebaked theme.css

`scripts/bake-theme.ts` writes `dist/theme.css`: foundations on `:root`, the light block on `[data-theme="quantum-light"]` and `:root`, the dark block on `[data-theme="quantum-dark"]`, `color-scheme` for both, every colour also as `-channels`. The bake throws on sanitizer hits, empty blocks and light / dark key drift. `theme.css` is kept in `package.json#exports` through `customExports` (see `spec/house-style.md` 1.6).

## Typography and elevation utilities

`style.css` ships two utility families and nothing else outside component classes:

- `.quantum-type-<style>` for the 13 styles above (`quantum-type-display-4` ... `quantum-type-menu`): font family, size, weight, leading, tracking, case and the style's ink opacity, with the desktop and script switches built in.
- `.quantum-elevation-<n>` for `n` 0 to 24: `box-shadow: var(--quantum-elevation-<n>)` plus the elevation transition.

Both exist so the escape hatch composition renders in the system's type and depth without copying tokens. No spacing, colour or layout utilities ship. This is a declared deviation from ruling 3 (no utility classes in package source), listed below; if the lead rejects it, this section is deleted and the escape hatch points at the `--quantum-type-*` and `--quantum-elevation-*` tokens (open question 11).

## Deviations from DESIGN_SYSTEMS.md

| Deviation | Reason |
|---|---|
| DS-owned headless cores for `QuDatePicker` and `QuTimePicker` | v0's `createDatePicker` and `createTimePicker` are `draft` entries in `maturity.json` with no source and no export (`spec/v0-map.md`). Spec-in still ships (Emerald `EmCalendar` precedent); both graduate to v0 when the composables land |
| DS-owned headless `useRipple` | v0 has no ink primitive (zero matches for `ripple` in `packages/0/src`); the composable holds state only and the component binds the events, per the house rule |
| DS-owned non-modal surfaces (persistent and permanent drawers, persistent bottom sheet) | no v0 compound covers a non-modal sheet; built on `Atom`, `Portal` and `Collapsible` |
| `QuCheckbox` `indeterminate` | extra-spec under ruling 7, declared here: MD1 has no mixed state, `QuDataTable` select-all needs one and v0 provides it |
| `QuProgressCircular` `size` | the spec draws one size (about 40 dp); a numeric prop is a rendering knob for the FAB ring and the refresh indicator, not a spec variant |
| 38 utility classes (`quantum-type-*`, `quantum-elevation-*`) in `style.css` | the escape hatch (ruling 7) needs the type scale and depth without copying 13 x 5 tokens; no other utilities ship, so ruling 3 otherwise holds |
| Inline SVG geometry in `QuProgressCircular` and `QuTimePicker` | the arc and the clock are drawings parameterised at runtime (`stroke-dasharray`, hand angle), not glyphs a consumer rebrands; every glyph still routes through `QuIcon` (ruling 6) |

Everything else follows the contract: tokens on `theme.ts` through a `V0StyleSheetThemeAdapter` subclass; `dist/theme.css` prebaked; v0 compounds for behaviour and `Atom` for presentation; no native form controls (the text field's editable element is v0's `Input.Control`); unscoped styles; `data-*` state; own icon set through `createTokens`; installable without Vuetify; wrappable (every non-spec Vuetify prop is the wrapper's to translate).

## Known limitations

- **Pickers are DS-owned.** `QuDatePicker` and `QuTimePicker` carry their own cores until v0 ships the composables; min, max, disabled dates and ranges are not in MD1 and do not ship.
- **Native `<dialog>` versus the global `Scrim`.** Quantum paints `::backdrop`; an app that also mounts v0's `<Scrim>` paints a second backdrop (#910).
- **Gestures.** Swipe to dismiss (cards, snackbars, bottom sheets, list leave-behinds), pick-up-and-move (cards, lists), swipe to refresh and edge-swipe drawer opening are not shipped; every one has a button, keyboard or scrim path. Tab panels change on tab activation; panel swipe is deferred.
- **Menus.** The simple-menu rule that aligns the selected item over the emitting element is not implemented; menus open below the activator. The desktop "More" dropdown for overflowing tabs is deferred in favour of pagination arrows.
- **Editable segmented dropdown button.** Definition only in the spec; deferred as a `QuTextField` + `QuDropdownButton` composition.
- **Values the spec never states**, filled by the decisions recorded above and in the notes: hover overlay, scrim alpha, card, menu and tooltip radius, chip fill, grid-list bar scrim, snackbar timeout, ripple timing, mini drawer width, speed-dial spacing, expanded-panel elevation, dialog desktop width and body text style, tab colours on surface bars, tooltip open delay and long-press threshold, control-to-label gap, indeterminate cycle durations. Each is tagged in the component section; none is `high`.
- **Measured geometry.** Selection controls, sliders, pickers, progress thickness and the snackbar line pitch come from the spec's own artwork at 2 px per dp (`measured`), not from text.
- **Desktop and dense mapping.** `(pointer: fine)` stands in for the spec's "mouse and keyboard"; a touch laptop gets device metrics. There is no runtime override in v1.
- **Vuetify 1.5 disagreements** with the spec (switch thumb 4 dp, bottom navigation single-layer shadow, bottom sheet at 24 dp, 300 px drawer, 64 dp "prominent", swing curve, 7 px progress bar, 290 px picker, 42 px snackbar gap, 22 px dense list icons, 12% hover) are resolved in the spec's favour; the notes list every one.
- **Bottom, floating and column toolbars.** The structure page names them and gives no metrics; `QuToolbar position="bottom"` and `floating` ship with the app bar heights and a 2 dp floating elevation as decisions; the bottom toolbar shelf is a `QuBottomSheet persistent` composition, not a component. `QuBottomNavigation` is the bar for destinations.
- **Status bar.** The theme figure's status-bar colour (Grey 300 light, Black dark; the primary's 700 under a primary app bar) is not a token: a browser has no status bar and no component reads it (ruling 5). Consumers set `<meta name="theme-color">` themselves.
- **Feature discovery geometry.** The page states the edge rules and the 96% background and nothing about circle sizes or type; `QuFeatureDiscovery` fills them with `low` decisions until the figures can be read.
- **Docs and release.** The first npm publish of a new scoped package is manual (`spec/house-style.md` 6).

## Lead decisions

The eleven questions the synthesis raised, answered by the lead on 2026-10-22. Each answer is binding for the implementation; each is tagged with the confidence of its basis.

| # | Question | Decision | Basis |
|---|---|---|---|
| 1 | Default app bar colour | `QuToolbar` defaults to `variant="primary"` when `appBar` is set (status-bar 700 is not emitted, see Known limitations); a plain toolbar (`appBar` unset) defaults to `surface` | the colour page: large areas take the primary colour; every app-bar figure on the toolbars page is primary 500 (`high`) |
| 2 | Scrim alpha | two tokens: `--quantum-scrim-sheet` = black 20% for `QuBottomSheet` (the only stated value); `--quantum-scrim` = `#212121` at 46% for `QuDialog` and the temporary `QuNavigationDrawer` | bottom sheets page (`high`); Vuetify 1.5 `_overlay.styl` (`moderate`, declared decision) |
| 3 | Hover overlay | 6% currentColor wherever a page states no hover value (lists, menus, steppers, chips, tiles); buttons keep their own page: no hover overlay on flat and raised buttons, 12% focus overlay, raised gains 2 dp on hover under `(pointer: fine)` | steppers page 6% (`high`); buttons page (`high`) |
| 4 | Expanded expansion panel elevation | 8 dp (2 dp group plus the 6 dp dynamic offset of the elevation page) | elevation page (`high` for the offset, `measured` for the panel) |
| 5 | `QuSearchBar` | ships as a component; the expandable mode stays the `Search` part of `QuToolbar`; one Combobox core | rulings note judgment call 1, confirmed |
| 6 | Speed dial | stays on `QuFab` as `Action` children; no `QuSpeedDial` | the FAB page treats it as a FAB transition |
| 7 | `dense` prop beside `(pointer: fine)` | confirmed as specified; no plugin-level device-class override in v1 | the three spec axes map once each (Units and device classes) |
| 8 | Snackbar timeout | 6000 ms default (`timeout` prop) | Vuetify 1.5 (`moderate`); MD1 states no duration |
| 9 | Material Icons artwork | master commit `49d4db35` ships as pinned; the two post-MD1 redraws stay | upstream parity over period fidelity |
| 10 | Persistent-drawer breakpoint | `type` is explicit; no default mapping in the plugin; the docs page shows the `useBreakpoints` composition (temporary under 600, persistent under 1280, permanent above) as the recommended recipe | the pattern page gives no pixel values |
| 11 | Utility classes | the 38 `quantum-type-*` and `quantum-elevation-*` classes ship in `style.css` as the declared deviation | the MD1 type scale is a set of named styles; the escape hatch needs them |
