# @paper/md1: Design Spec

## Identity

**Class:** design system (rich). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

`@paper/md1` is the complete, exclusive implementation of Material Design 1 (the 2014 to 2017 "Material Design" guidelines, internal codename "Quantum Paper") on `@vuetify/v0`. Its prefix is `Md1*`; `@paper/material` and `Md*` stay reserved for the pinned MD3 package in the family catalog. Material Design 1 is the older language in its own right, not a theme of the newer one.

| Item | Value |
|---|---|
| npm | `@paper/md1` (MIT; icon artwork Apache 2.0, see Icons) |
| Component prefix | `Md1*` |
| Class prefix | `md1-*` (`md1-button`, `md1-button__content`) |
| Token namespace | `--md1-*` |
| Theme ids | `md1-light` (default), `md1-dark` (`dark: true`) |
| Plugin | `createMd1Plugin({ theme, icons, reducedMotion })` composes `createThemePlugin`, `createMd1IconsPlugin` and `createReducedMotionPlugin`; each key takes that plugin's options or `false` to skip it |
| Adapter | `Md1StyleSheetAdapter extends V0StyleSheetThemeAdapter` (`prefix: 'md1'`, `stylesheetId: 'md1-theme-stylesheet'`) |
| Stylesheets | `@paper/md1/style.css` (components, type and elevation utilities), `@paper/md1/theme.css` (prebaked default theme) |
| Installable without Vuetify | required and met: `pnpm add @paper/md1`, `app.use(createMd1Plugin())`, `Md1Button` |
| Research notes | `packages/md1/spec/**` carries every number with its source and confidence. This file cites those notes and does not repeat their tables |

Purpose: Material Design 1 proves the Paper design-system contract against a specification that is complete, closed and old enough that Google can no longer move it. Every `Md1*` API is judged by one question: is it the spec's vocabulary rendered on v0, and nothing more.

## Pinned spec

| Source | Pin | Role |
|---|---|---|
| Material Design, 2014 to 2017 guidelines | `https://m1.material.io/`, the Material Design 1 guidelines Google hosts as an archive | authoritative; the spec text wins over every other source. The archive's own changelog (`material-design/whats-new`) ends with "September 2017", which dates the frozen content. The research notes verified their values against the archive's content as of 2018-12-25 |
| Earlier revisions | the 2015 and 2016 Google Design spec and the early-2018 live guidelines | read only to record revision drift; the notes name the revision in prose, and none of it is a source of a pinned value |
| Vuetify 1.5.24 | `vuetifyjs/vuetify` tag `v1.5.24`, path `packages/vuetify/src/stylus/**` (https://github.com/vuetifyjs/vuetify/tree/v1.5.24/packages/vuetify/src/stylus) | the styling source where the spec is silent, in both themes (see Authority order); never a source of API, and never a source of a value the spec states |
| Material Icons | `google/material-design-icons` at commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4`, `materialicons` (filled) 24px sources, Apache License 2.0 | glyph source for `Md1Icon`: 84 glyphs, 27 aliases (`spec/icons.md`) |

Where a note read an archive copy dated later than 2018-12-25 (2020-05, 2021-03, 2021-08), it records the date; the content is the frozen archive page in every case. Where a value exists only inside a spec PNG or video, the notes read the artwork at 2 px per dp and this file tags the value `measured`. Where no source states a value, the notes say `not found` and the gap is filled by the authority order below.

### Authority order

1. **The m1 spec where it is explicit**: the page text, and values the notes measure from the page's own artwork (`measured`).
2. **Vuetify 1.5.24's styling where the spec is silent**, in both themes, cited as `file:line` under `packages/vuetify/src/stylus/` (`th:` is `settings/_theme.styl`, `var:` is `settings/_variables.styl`), or under `packages/vuetify/src/components/` for a default set in a component's script (`VDialog.js`, `VTooltip.js`). Styling only: no Vuetify prop, part or behaviour comes with it (no `color`, `size`, `to` or `ripple` props). A gap value taken this way is MD1-faithful even where it misses the 4.5:1 floor; every such shortfall is listed under Known limitations.
3. **A Material Design 1 decision only where Vuetify 1.5 has no equivalent** (no component, no part, or a reset value that contradicts the spec), tagged as a decision in the component section.

Vuetify 1.5 has no single hover value: 12% `currentColor` on buttons, bottom navigation actions and picker days (`_buttons.styl:54,62-72`); 4% black / 8% white on lists and menus (th:51-52, 145-146); 6% of the foreground on steppers (`_steppers.styl:27-28`); none on chips and tabs. Each component takes its own value; there is no family-wide hover rule.

Confidence legend for this file: `high` = spec text; `moderate` = Vuetify 1.5 stylus only (authority 2); `measured` = read from spec artwork at 2 px per dp (the notes write "measured" in the value cell and tag such rows `moderate`); `low` = memory.

### Units and device classes

dp and sp are px, 1:1 (`layout/units-measurements`: "When writing CSS, use px wherever dp or sp is stated"). The spec has three independent axes; Material Design 1 maps each exactly once and every component section below inherits the mapping.

| Spec axis | Spec wording | Material Design 1 mapping |
|---|---|---|
| Handset vs tablet/desktop layout | 56 vs 64 dp app bar, 16 vs 24 dp margins, 72 vs 80 dp keyline, 280 vs 320 dp drawer, 16 vs 24 dp FAB inset, snackbar and dialog desktop forms | `@media (min-width: 600px)`: the handset/tablet split of `layout/responsive-ui` |
| Desktop input | "mouse and keyboard are the primary input"; desktop type sizes (15 and 13 sp), desktop menus (32 px rows), resting elevation 2 dp lower, 150 to 200 ms durations, no touch halo, 20 dp icons | `@media (pointer: fine)` |
| Dense | "measurements may be condensed": dense button 32 dp, dense list 40 dp, dense text field, dense app bar 48 dp, dense menu 24 px | explicit `dense` prop on the components whose page names a dense variant. `dense` is MD1 vocabulary, not Vuetify's `density` enum; a wrapper translates `density` onto it (ruling 8) |

## Coverage

### Component pages that ship

| MD1 page | Component |
|---|---|
| bottom-navigation | `Md1BottomNavigation` |
| bottom-sheets | `Md1BottomSheet` |
| buttons | `Md1Button`, `Md1IconToggle`, `Md1ToggleButtons`, `Md1DropdownButton` |
| buttons-floating-action-button | `Md1Fab` |
| cards | `Md1Card` |
| chips | `Md1Chip` |
| data-tables | `Md1DataTable` |
| dialogs | `Md1Dialog` |
| dividers | `Md1Divider` |
| expansion-panels | `Md1ExpansionPanel` |
| grid-lists | `Md1GridList` |
| lists, lists-controls | `Md1List`; the controls are `Md1Checkbox`, `Md1Switch`, `Md1Radio` placed in `Md1List.Action` |
| menus | `Md1Menu` |
| pickers | `Md1DatePicker`, `Md1TimePicker` |
| progress-activity | `Md1ProgressLinear`, `Md1ProgressCircular` |
| selection-controls | `Md1Checkbox`, `Md1Radio`, `Md1Switch` |
| sliders | `Md1Slider` |
| snackbars-toasts | `Md1Snackbar` (toasts are out) |
| steppers | `Md1Stepper` |
| subheaders | `Md1Subheader` |
| tabs | `Md1Tabs` |
| text-fields | `Md1TextField`, `Md1Autocomplete` |
| toolbars | `Md1Toolbar` |
| tooltips | `Md1Tooltip` |
| widgets | none (out) |

Plus, from the patterns section, `Md1NavigationDrawer` and `Md1SearchBar`; from `growth-communications/feature-discovery`, `Md1FeatureDiscovery`; from `style/icons`, `Md1Icon`; and `Md1Ripple`, the ink reaction every component page describes.

### Style, motion and layout sections that ship as tokens and stylesheet

| Section | Ships as |
|---|---|
| style/color | the full palette (`--md1-<hue>-<shade>`), theme roles, system colors, ink opacities; the `md1-light` and `md1-dark` themes |
| style/typography | type tokens per style; `md1-type-<style>` classes; the font stack; dense and tall script rules keyed on `:lang()` |
| style/icons | `Md1Icon`, the role vocabulary, `createMd1IconsPlugin`, RTL mirroring (`spec/icons.md`, `spec/iconography.md`) |
| style/imagery | the text protection range behind `--md1-grid-list-bar`, the loading-images recipe on `Md1Card.Media` and `Md1GridList.Tile`, avatar and thumbnail sizes (`spec/iconography.md`) |
| style/writing | the default copy table through `useLocale`, sentence-case source text, uppercase button labels by CSS (`spec/iconography.md`) |
| material-design/elevation-shadows | `--md1-elevation-0..24`; `md1-elevation-<n>` classes |
| motion/* | duration and easing tokens; `Md1Ripple`; from `motion/creative-customization` (`spec/motion.md`), `Md1Toolbar.Nav` animates `menu` to `arrow-back` (`data-icon`) over `--md1-duration-standard` when the drawer opens and back on close; product icons and illustrations are out (no surface) |
| layout/* | keyline, increment, spacing and touch target tokens; breakpoints as documented values plus a JS map (`md1Breakpoints`); `layout/split-screen` is out (see Out) |
| usability/bidirectionality, usability/accessibility | logical properties everywhere; icon mirroring; 48 dp targets; the WCAG opacities |

### Pattern rulings

From `spec/patterns/rulings.md`, which carries the reasons.

| Pattern page | Ruling |
|---|---|
| navigation-drawer | component `Md1NavigationDrawer` |
| search | component `Md1SearchBar` (persistent search) and the `Search` part of `Md1Toolbar` (expandable search); one Combobox core |
| scrolling-techniques | `Md1Toolbar` props `scroll` and `tabBar`, part `Extension` |
| selection | selected state on `Md1List.Item`, `Md1GridList.Tile`, `Md1Card`; `Md1Toolbar.Contextual`; the accent text highlight is the app's `::selection` rule (Known limitations) |
| errors, empty-states, confirmation-acknowledgement, settings, navigation, loading-images, offline-states, help-feedback | documented compositions of shipped components (docs pages, no surface) |
| navigational-transitions | sibling slide on `Md1Tabs` panels; parent-to-child expansion on `Md1Fab` and `Md1Card` through the motion tokens |
| swipe-to-refresh | a composition example on `Md1ProgressCircular`; no `Md1SwipeRefresh` (v0 has no swipe primitive, mobile browsers own pull-to-refresh, the spec forbids it in drawers and pannable content) |
| data-formats, gestures, notifications, launch-screens, permissions, fingerprint, app-shortcuts | out of scope |

### Growth and communications

| Page | Ruling |
|---|---|
| growth-communications/feature-discovery | `Md1FeatureDiscovery` on `Tour.Root`, `Tour.Activator`, `Tour.Highlight`, `Tour.Content`, `Tour.Skip` (one step, so no `Tour.Next`): the circular tap target over the promoted action, the prompt background in `--md1-primary` at 96%, white ink, dismiss by tapping outside; the 88 dp edge rule, the 20 dp offset and the 280 x 360 dp surface rule (`spec/patterns/feature-discovery.md`). Hint text is `Md1TextField placeholder`; the guided flow (tap target, ripples, completion toast) is a documented composition of `Md1FeatureDiscovery`, `Md1Ripple` and `Md1Snackbar` |
| growth-communications/onboarding | composition: the quickstart, self-select and top-user-benefits screens are docs compositions of `Md1Button` ("Get started", "Next", "Previous"), `Md1List` or `Md1GridList` (self-select choices) and `Md1Card` (the desktop carousel card) with pagination dots the consumer draws; no surface |
| growth-communications/gesture-education | out: the hint motion that previews a swipe or pinch is a gesture rehearsal with no metrics; the full-screen variant's text lives in an `Md1Snackbar` the consumer raises |
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
| Toasts | Android system messaging at the bottom of the screen that cannot be swiped off; `Md1Snackbar` is the web surface |
| Gestures, data formats | rules carried by the owning components and the docs; no surface |
| Text selection handles and the floating Cut / Copy / Paste toolbar | OS and browser chrome; the accent highlight is the app's `::selection` rule (Known limitations) |
| Split screen (`layout/split-screen`) | "Android only" on the page: multi-window activation, divider dragging and activity launch placement; the browser owns window management (`spec/layout.md`) |
| Material design: introduction, environment, material properties | principles carried by the elevation, motion and colour tokens (`spec/elevation.md` and `spec/color.md` read them as supplementary sources); no surface |
| What's new (`material-design/whats-new`) | the archive's changelog; cited in the Pinned spec table for its "September 2017" last entry |
| Platform adaptation (`platforms/platform-adaptation`) | Material Design 1 follows the page's Android / Web column: titles always left-aligned, the up button is a thin arrow with a stem (`arrow-back`), the action overflow icon is three vertical dots; the iOS column does not ship |
| Android (`platforms/android`) | Android-specific guidance; no web surface |

v0 primitives Material Design 1 deliberately does not wrap because MD1 has no such component (a primitive existing is not a reason to ship, ruling 7): `Breadcrumbs`; `Avatar` as a standalone (avatars are parts of `Md1List`, `Md1Card`, `Md1Chip` and `Md1NavigationDrawer.Header`); `Carousel`; `Rating` (the cards page names stars-to-rate only as an example UI control with no spec of its own; consumers compose v0 `Rating` with `Md1Icon star` through the escape hatch); `Kanban`; `Splitter`; `Treeview`; `Otp`; `Alert` (MD1 has no banner; alerts are dialogs and snackbars); `Pagination` as a standalone (it lives inside `Md1DataTable.Footer`); `NumberField`; `Virtualizer`; `Image` and `AspectRatio`; `DataGrid`; `Select` as a standalone (it is the core of `Md1TextField dropdown`, text-fields page "Nested menus & pickers"); `Form` (consumers use v0's `Form` directly; the errors pattern is documented against it); `Menu.Bar` and `Menu.Context` (no menubar and no right-click menu in MD1).

Vuetify 1.5 features that are not in MD1 and do not ship: range and vertical sliders; large (72 dp) and extended FABs; outline, block, round and depressed buttons; choice, filter, input and small chips; dense subheaders; top-placed snackbars; slider tick labels; vertical dividers; `v-overflow-btn`; `v-badge` ("badge" is not in MD1); expandable data-table rows; calendar; timeline; carousel; `v-img`.

### Escape hatch

A missing piece is the consumer's: compose a v0 primitive with the `--md1-*` tokens, the `md1-type-*` and `md1-elevation-*` classes and `Md1Ripple`. That composition is unsupported as a Material Design 1 component. The docs index documents it as the way to cover a hole, and every hole is listed under Known limitations instead of being filled with a silent leftover tier.

## Pipeline

| Path | How |
|---|---|
| Happy path | `import '@paper/md1/theme.css'` + `import '@paper/md1/style.css'` + `app.use(createMd1Plugin())` |
| CSS only | `theme.css` alone: static tokens on `:root`, dark under `[data-theme="md1-dark"]`, no runtime switch |
| Host owns `createThemePlugin` | `createMd1Plugin({ theme: false })`; register `Md1StyleSheetAdapter` plus `md1Colors` / `md1DarkColors` on the host plugin |
| Icons | composed by the main plugin; `{ icons: false }` skips registration, not the bundle (ruling 6); `useMd1Icons` falls back to the built-in set |
| Kit interop | the adapter emits `--v0-*` aliases (see The v0 bridge) |
| Reduced motion | composed; `{ reducedMotion: false }` when the host installs `createReducedMotionPlugin` itself (without any install `useReducedMotion()` falls back to `isReduced: false`, so `Md1Ripple`'s JS gate relies on the plugin); CSS stays gated on `@media (prefers-reduced-motion: reduce)` and `body[data-reduced-motion="reduce"]` either way |

The plugin registers `md1-light` as the default and follows the OS through `system: { light: 'md1-light', dark: 'md1-dark' }` until `useTheme().select`. Package skeleton, file layout, the browser test runner (`Md1X.browser.test.ts`) and every docs registration step are in `spec/house-style.md`; this file does not repeat them.

## Consumer contract

Emerald's contract, restated where Material Design 1 differs:

- Behavioural components compose v0 compounds; presentational ones render `Atom`; nothing routes through `@vuetify/paper`.
- Never `<style scoped>`. Isolation is the `md1-` class prefix; state hooks are `data-*` (`true | undefined` for booleans, strings for enums); every design value is `var(--md1-*, <literal>)`.
- No named slots. Spec anatomy is a prop for short text (`label`, `helper`, `title`) or a compound part; every component has one default slot.
- No orchestrator API: no `density`, `ripple`, `to`, no Vuetify colour prop lists. Where MD1 names a thing, the prop is the spec's own word (`dense`, `raised`, `mini`, `shifting`, `prominent`, `inset`, `discrete`, `linear`, `editable`).
- Glyphs draw through `Md1Icon` roles; no inline glyph SVG in an `Md1*` file. Non-glyph geometry (the circular progress arc, the clock face and hand) is inline SVG, declared under Deviations.
- Withheld v0 props are withheld at the type level. A shell's `Pick` is the public surface and TypeScript rejects the rest; at runtime the attrs still fall through to the v0 root (`<Md1Button loading>` reaches `Button.Root`), the shape Emerald ships too. No shell filters attrs.
- Every interactive component hosts an `Md1Ripple`. There is no prop to remove it: the ripple is the spec's press feedback, not an option (ruling 8 keeps Vuetify's `ripple` prop on the wrapper).
- Native `<dialog>` paints the scrim through `::backdrop` in `--md1-scrim` (`--md1-scrim-sheet` under a bottom sheet, Lead decision 2); Material Design 1 never mounts v0 `Scrim`, and every `Dialog.Content` it renders passes `scrim: false` (issue #910).
- Default copy comes from the writing page's button label table (`spec/iconography.md`: OK, Cancel, Dismiss, Got it, Learn more, Next, Back, Done, Skip, No thanks, Not now) through `useLocale().ti('Material Design 1.<key>') ?? '<English>'`. Button labels are uppercased by CSS; source text stays sentence case.

## Compound access

Every compound attaches its parts to the root; the sub-key drops the parent prefix (`Md1DialogTitle` is `Md1Dialog.Title`, `Md1ListAction` is `Md1List.Action`). The flat names stay exported and valid. The root is the compound; there is no `.Root` key. Shells attach nothing. Parts read the root through an optional `md1:<name>` context and warn in dev when orphaned; parts backed by a v0 context throw, as v0 does.

## Inventory

Pattern vocabulary: shell (one SFC on a v0 compound); compound (one SFC per region, attached to the root); presentational (`Atom`); DS-owned headless (state in a Material Design 1 composable because v0 has no primitive; the component binds the DOM events).

| Component | Spec page | Pattern | v0 primitive(s) | Parts | Key props | `data-*` hooks |
|---|---|---|---|---|---|---|
| `Md1Toolbar` | toolbars, layout/structure, patterns | presentational compound | `Atom`, `Combobox.*` (Search), `useRovingFocus` (Actions) | `Nav`, `Title`, `Actions`, `Extension`, `Search`, `Contextual` | `appBar`, `variant`, `prominent`, `dense`, `scroll`, `tabBar`, `contextual`, `floating`, `position` | `data-app-bar`, `data-variant`, `data-prominent`, `data-dense`, `data-scrolled`, `data-collapsed`, `data-hidden`, `data-search`, `data-contextual`, `data-floating`, `data-position`; Nav `data-icon` |
| `Md1BottomNavigation` | bottom-navigation | compound | `createSingle` + `useProxyModel`, `Button.Root` | `Action` | `shifting`, `variant`, `hideOnScroll` | `data-shifting`, `data-variant`, `data-hidden`; Action `data-selected` |
| `Md1BottomSheet` | bottom-sheets | compound | `Dialog.*` (modal); `Portal` + `Collapsible` (persistent) | `Activator`, `Title`, `Item` | `persistent`, `grid`, `expanded` | `data-persistent`, `data-layout`, `data-expanded`, `data-open` |
| `Md1Button` | buttons | shell | `Button.Root`, `Button.Content`, `Button.Icon` | none | `variant`, `dense`, `footer`, `icon`, `disabled`, `ariaLabel` | `data-variant`, `data-dense`, `data-footer`, `data-disabled`, `data-solo` |
| `Md1IconToggle` | buttons | shell | `Toggle.Root`, `Toggle.Indicator` | none | `icon`, `iconOn`, `unbounded`, `ariaLabel` | `data-state`, `data-unbounded`, `data-disabled` |
| `Md1ToggleButtons` | buttons | compound | `Toggle.Group`, `Toggle.Root` | `Item` | `multiple`, `mandatory`, `disabled` | `data-multiple`; Item `data-state`, `data-disabled` |
| `Md1DropdownButton` | buttons, menus | compound | `Menu.Root`, `Menu.Activator`, `Menu.Content`, `Menu.RadioGroup`, `Menu.RadioItem` | `Item` | `segmented`, `dense`, `desktop`, `disabled` | `data-open`, `data-segmented`; Item `data-state` |
| `Md1Fab` | buttons-floating-action-button | shell; compound when it has `Action` children | `Button.Root`, `Button.Icon`; `Menu.*` for the speed dial | `Action` | `icon`, `mini`, `ariaLabel`, `position` | `data-mini`, `data-open`, `data-position`, `data-disabled` |
| `Md1Card` | cards | presentational compound | `Atom`, `Collapsible.*` (Expanded) | `Header`, `Media`, `Title`, `Subtitle`, `Supporting`, `Actions`, `Expanded` | `expanded`, `selected` | `data-expanded`, `data-selected`; Media `data-inset` |
| `Md1Chip` | chips | shell; compound for the open contact chip | `Atom` or `Button.Root`; `Button.Root` (delete); `Popover.*` (Addresses) | `Addresses`, `Address` | `icon`, `avatar`, `deletable`, `contact`, `disabled` | `data-deletable`, `data-contact`, `data-open`, `data-disabled`, `data-focused` |
| `Md1DataTable` | data-tables | compound | `DataTable.*`, `Checkbox.Root`, `Button.Root`, `Popover.*`, `createPagination` | `Header`, `Contextual`, `Table`, `Head`, `Column`, `Body`, `Row`, `Cell`, `Footer` | `selectable`, `rowsPerPage`, `v-model:selected`; Cell `v-model` | Column `aria-sort`, `data-direction`, `data-numeric`; Row `data-selected`; Cell `data-editable`; root `data-contextual` |
| `Md1Dialog` | dialogs | compound | `Dialog.*`; `AlertDialog.*` for `alert` | `Activator`, `Content`, `Title`, `Text`, `Actions`, `Cancel`, `Confirm` | `variant`, `dismissible`, `v-model:value` | `data-variant`, `data-open`, `data-scrolled`, `data-dismissible`; Actions `data-stacked` |
| `Md1Divider` | dividers | presentational | `Atom as="hr"` | none | `inset` | `data-inset` |
| `Md1ExpansionPanel` | expansion-panels | compound | `ExpansionPanel.*` | `Item`, `Header`, `Content`, `Actions` | `multiple` | Item `data-selected`, `data-disabled`; Header `data-state` |
| `Md1GridList` | grid-lists | presentational compound | `Atom`, `Button.Root` (tile and bar actions) | `Tile`, `Bar` | `gutter`, `columns`, `ratio`, `horizontal` | `data-gutter`, `data-horizontal`; Tile `data-selected`; Bar `data-position`, `data-lines`, `data-icon` |
| `Md1List` | lists, lists-controls | compound | `Atom`, `createSingle` / `createSelection`, `Collapsible.*` (Group) | `Item`, `Avatar`, `Icon`, `Content`, `Primary`, `Secondary`, `Action`, `Group` | `dense`, `select`, `lines` | `data-dense`, `data-select`; Item `data-lines`, `data-selected`, `data-disabled`; Group `data-state` |
| `Md1Subheader` | subheaders | presentational | `Atom` | none | `inset`, `primary`, `sticky` | `data-inset`, `data-primary` |
| `Md1Menu` | menus | compound | `Menu.*` | `Activator`, `Content`, `Item`, `CheckItem`, `Divider`, `Subheader`, `Sub` | `dense`, `desktop`, `disabled` | `data-dense`, `data-desktop`, `data-open`; Item `data-highlighted`, `data-state`, `data-disabled` |
| `Md1DatePicker` | pickers | DS-owned headless | `useRovingFocus({ columns: 7 })`, `Button.Root`, `useDate` | none | `landscape`, `firstDayOfWeek` | `data-landscape`, `data-view` (`date`, `year`) |
| `Md1TimePicker` | pickers | DS-owned headless | `Radio.Group` + `Radio.Root` (AM/PM, clock numbers), `Toggle.Group` (hour/minute view) | none | `landscape`, `format` | `data-landscape`, `data-view` (`hour`, `minute`), `data-period` |
| `Md1ProgressLinear` | progress-activity | shell | `Progress.Root`, `Track`, `Fill`, `Buffer`, `Presence` | none | `value`, `buffer`, `query` | `data-state`, `data-query`, `data-buffer`, `data-presence` |
| `Md1ProgressCircular` | progress-activity | shell | `Progress.Root` + DS SVG arc | none | `value`, `size`, `fab` | `data-state`, `data-fab` |
| `Md1Checkbox` | selection-controls | shell | `Checkbox.Root`, `Checkbox.Indicator` | none | `label`, `value`, `disabled`, `indeterminate` | `data-state`, `data-disabled` |
| `Md1Radio` | selection-controls | shell inside a compound group | `Radio.Group`, `Radio.Root`, `Radio.Indicator` | `Group` | `label`, `value`, `disabled`; Group `name`, `mandatory` | `data-state`, `data-disabled` |
| `Md1Switch` | selection-controls | shell | `Switch.Root`, `Track`, `Thumb` | none | `label`, `disabled` | `data-state`, `data-disabled` |
| `Md1Slider` | sliders | shell | `Slider.Root`, `Track`, `Range`, `Thumb` | none | `min`, `max`, `step`, `discrete`, `iconStart`, `iconEnd`, `editable`, `disabled` | `data-discrete`, `data-zero`, `data-dragging`, `data-disabled` |
| `Md1Snackbar` | snackbars-toasts | compound | `Snackbar.*`, `Presence`, `Button.Root` | `Portal`, `Queue` | `action`, `multiline`, `align` | `data-multiline`, `data-stacked`, `data-align` |
| `Md1Stepper` | steppers | compound | `Step.Root`, `Step.Item`, `Collapsible.*`, `Button.Root`, `Progress.Root` | `Step`, `Content`, `Actions`, `Bar` | `vertical`, `linear`, `alternativeLabels`, `mobile` | `data-vertical`, `data-linear`, `data-alternative`, `data-mobile`; Step `data-state`, `data-editable`, `data-optional`, `data-error` |
| `Md1Tabs` | tabs | compound | `Tabs.*`, `createOverflow` | `List`, `Item`, `Panel` | `scrollable` | `data-scrollable`, `data-fixed`, `data-overflow`; Item `data-selected`, `data-icon`, `data-lines` |
| `Md1TextField` | text-fields | shell; compound under `dropdown` (`Item` children) | `Input.Root`, `Input.Control`, `Input.Description`, `Input.Error`, `Button.Root` (clear, visibility, voice, picker icon), `Select.*` (dropdown) | `Item` (dropdown only) | `label`, `helper`, `placeholder`, `prefix`, `suffix`, `counter`, `required`, `optional`, `icon`, `clearable`, `voice`, `box`, `dense`, `multiline`, `textarea`, `fullWidth`, `solo`, `dropdown`, `picker`, `mask`, `type`, `rules`, `validateOn` | `data-state`, `data-focused`, `data-dirty`, `data-disabled`, `data-box`, `data-dense`, `data-full-width`, `data-multiline`, `data-solo`, `data-scrolled`, `data-dropdown`, `data-open`, `data-picker`, `data-mask`, `data-counter` |
| `Md1Autocomplete` | text-fields | compound | `Combobox.*` | `Item`, `Empty` | the `Md1TextField` text props plus `strict`, `multiple`, `inline` | `data-open`, `data-inline`; Item `data-highlighted`, `data-selected` |
| `Md1Tooltip` | tooltips | compound | `Tooltip.*`, `createTooltipPlugin` | `Activator`, `Content` | `disabled` | Content `data-state`, `data-touch` |
| `Md1NavigationDrawer` | patterns/navigation-drawer | compound; DS-owned headless for the non-modal types | `Dialog.*` (temporary); `Atom`, `Collapsible.*` (persistent, permanent, mini) | `Activator`, `Header`, `Content` | `type`, `mini`, `clipped`, `floating`, `side` | `data-type`, `data-mini`, `data-clipped`, `data-floating`, `data-open`, `data-side` |
| `Md1SearchBar` | patterns/search, text-fields | compound | `Combobox.*` (`ClientComboboxAdapter`), `Button.Root`; the field is its own `__field` box with the `Md1TextField` solo values | `Item`, `Empty` | `voice`, `placeholder`, `button` | `data-focused`, `data-scrolled`, `data-open`, `data-button` |
| `Md1FeatureDiscovery` | growth-communications/feature-discovery | compound | `Tour.Root`, `Tour.Activator`, `Tour.Highlight`, `Tour.Content`, `Tour.Title`, `Tour.Description`, `Tour.Skip`, `Tour.Keyboard` | `Target`, `Title`, `Text` | `v-model`, `color`, `contained`, `placement` | `data-open`, `data-color`, `data-contained`, `data-placement` |
| `Md1Icon` | style/icons | shell | `createTokens` registry (plugin) | none | `name`, `label`, `size`, `namespace` | `data-size`, `data-mirror` |
| `Md1Ripple` | every component page | DS-owned headless | `useEventListener`, `useReducedMotion` | none | `unbounded`, `center` | `data-unbounded` |

## Components

Each section gives the element tree and class names, the props with defaults, the hooks, the v0 composition, the values (with the note that pins them) and the limits. Every interactive root also hosts `span.md1-ripple` as its first child; that line is not repeated.

### Md1Toolbar

`header.md1-toolbar` (`div` unless `appBar`) > `div.md1-toolbar__row` > [`button.md1-toolbar__nav`, `div.md1-toolbar__title`, `div.md1-toolbar__actions[role=toolbar]`] + `div.md1-toolbar__extension`. Search mode replaces the row content with `form.md1-toolbar__search[role=search]`; contextual mode with `div.md1-toolbar__contextual`.

- `appBar` (`false`): fixed to the viewport top, `header` banner landmark, scroll behaviours enabled; `data-app-bar`. It is the spec's "app bar" (layout/structure); Vuetify's `app` layout-registration prop is the wrapper's to translate (ruling 8), which is why the prop is not named `app`.
- `floating` (`false`): a detached toolbar or palette with its own width, the structure page's "Floating toolbar" and "Detached toolbar palette"; the page gives no metrics, so it is Vuetify 1.5's floating toolbar: the toolbar's own elevation, square corners, 16 px clear of its surroundings (`_toolbar.styl:34,153-156`); `data-floating`. Column-width and card toolbars are `Md1Toolbar` without `appBar` inside a column or `Md1Card`.
- `position: 'top' | 'bottom'` (`'top'`): `bottom` fixes the bar to the bottom edge above the keyboard (`inset-block-end: env(keyboard-inset-height, 0px)`), the structure page's "Bottom toolbar that launches to a shelf and clings to the top of the keyboard or other bottom component"; `data-position`. The shelf is a documented composition with `Md1BottomSheet persistent`. The structure page gives no metrics for any of these: heights follow the app bar table.
- `variant`: `'surface' | 'primary' | 'transparent'` (`'surface'`: Grey 100 / Grey 900 app bar role; `'primary'`: `--md1-primary` with 100% white ink; `'transparent'`: no fill, no elevation).
- `prominent` (`false`): 128 dp (96 dp with `dense`). `dense` (`false`): 48 dp.
- `scroll`: `'fixed' | 'hide' | 'waterfall' | 'collapse'` (`'fixed'`). `hide` translates with the content and returns on reverse scroll; `waterfall` starts seamed (0 dp) and lifts to 4 dp when content scrolls under it; `collapse` shrinks `Extension` until only the row remains and interpolates the title to 20 sp. `tabBar`: `'anchored' | 'hide' | 'staggered'` (`'anchored'`), honoured only when `Extension` holds `Md1Tabs`; `staggered` returns the tab bar on reverse scroll and the row at the top.
- `contextual` (`false`): swaps the row for `Contextual`.
- Parts: `Nav` (`icon: 'menu' | 'up'`, `open` (`false`): while `open` the `menu` glyph morphs into `arrow-back` over `--md1-duration-standard` on the standard curve and back on close, the creative-customization page's dual-function icon, the consumer binding it to the drawer's model; `data-icon` carries the current glyph; 48 dp target at the 16 dp keyline, emits `click`); `Title` (Title 20 sp Medium at the 72 dp keyline, 80 dp at the tablet breakpoint; one line, ellipsis); `Actions` (`role="toolbar"`, one tab stop: composes `useRovingFocus({ orientation: 'horizontal' })` over its children, Home and End jump to the first and last action; `Md1Button icon` children at 48 dp pitch; the overflow is an `Md1Menu` the consumer places last); `Extension` (`image`, `ratio` default `'4:3'`; hosts `Md1Tabs`, the large title or related content; tinted `--md1-primary` at the end of the collapse; under `variant="primary"` an extension holding related content other than `Md1Tabs` or an image fills with `--md1-primary-light` and `--md1-text-primary` ink, the colour page's "beneath the region using the primary color, related information is colored with a lighter version of the primary color"); `Search` (`v-model` query, `v-model:open`, `voice`, emits `submit`, `voice`, `clear`; the up arrow closes; the `Combobox` core of `Md1SearchBar` with the toolbar's chrome); `Contextual` (`count` renders "N selected", `close` glyph emits `clear`, Escape clears; actions are children).
- Values: `spec/components/toolbars.md`, `spec/layout.md`, `spec/patterns/scrolling-techniques.md`. 56 dp (48 dp landscape under 600 px), 64 dp from 600 px; padding 16 / 24 dp; icon 24 dp in 48; elevation 4 dp (2 dp under `pointer: fine`); title Medium 20 sp.
- Limits: the bottom, floating and column toolbars have no metrics on their pages (heights follow the app bar table; see Known limitations); the parallax ratio is not in the spec; `hide` moves 1:1 with the content because the scrolling-techniques page says the bar "scrolls off with the content" (spec-explicit; Vuetify 1.5's 300 px `scrollThreshold`, `VToolbar.ts:58-60`, contradicts it and does not apply), and `waterfall` lifts at the first scrolled pixel; the extended bar's large title stays Display 1 34 sp, because the page has the title shrink to 20 sp as the flexible space collapses (spec-explicit) and Vuetify 1.5's 20 px-only title (`_toolbar.styl:54-55`) has no larger state to take; `scroll="waterfall"` with an image `Extension` (overlapping content) refuses `Md1Tabs` with a dev warning, as the spec requires.

### Md1BottomNavigation

`nav.md1-bottom-navigation` > `button.md1-bottom-navigation__action` (an `a` when `href`) > [`svg.md1-icon`, `span.md1-bottom-navigation__label`].

- `v-model` selected value; `shifting` (`false`); `variant: 'surface' | 'primary'`; `hideOnScroll` (`false`).
- `Action`: `value`, `icon`, `label` (short, never wraps or truncates), `href`, `disabled`; `aria-current="page"` when selected. Three to five actions: a dev warning outside that range.
- Composition: `createSingle({ mandatory: 'force', events: true })` + `useProxyModel`; actions are `Button.Root` or anchors binding the ticket state, never `Tabs` (no panel semantics in the spec).
- Values: `spec/components/bottom-navigation.md`. 56 dp bar; fixed action 80 to 168 dp; shifting active 96 to 168 dp, inactive 56 to 96 dp; icon 24 dp; label Regular 14 sp active, 12 sp inactive; padding above icon 6 dp active / 8 dp inactive (16 dp shifting inactive); 10 dp under text; 12 dp beside text; elevation 8 dp; active ink `--md1-primary` in both themes (Vuetify 1.5 keeps the hue on dark), inactive `--md1-text-secondary`; `primary` variant forces black or white ink by contrast. Vuetify 1.5 gap fills (`_bottom-navs.styl`): hover is the buttons' 12% `currentColor` on an inactive action and none on the active one (:62-65); shifting actions take equal flex shares inside the page's bounds (:73-84), so only the 96 dp minimum widens the active one.
- Limits: `safe-area-inset-bottom` is added below the 56 dp; the content cross-fade between views is the consumer's transition; hide and reveal use the sharp curve at the standard duration.

### Md1BottomSheet

Modal: `dialog.md1-bottom-sheet` > `div.md1-bottom-sheet__content`. Persistent: `aside.md1-bottom-sheet[data-persistent]` in a `Portal` with `scrim: false`.

- `v-model` open; `persistent` (`false`): non-modal, no scrim, no focus trap, rests at the content's elevation and may move the FAB up; `grid` (`false`): `Item` children lay out as 48 dp icon tiles with 16 dp labels; `v-model:expanded` (`false`): full height with internal scroll and an `X`.
- Parts: `Activator` (renderless `Dialog.Activator`); `Title` (56 dp row, Regular 16 sp at 54%, 1 dp divider below); `Item` (`icon`, `href`, `disabled`; 48 dp row, 24 dp icon, 32 dp icon-to-text gap; a `Button.Root` or anchor). Dividers are `Md1Divider`.
- Composition: `Dialog.Root` + `Dialog.Content` (native `<dialog>`, `scrim: false`, `::backdrop` in `--md1-scrim-sheet`) positioned at the bottom edge; persistent sheets use `Portal` + `Collapsible` for the expanded state.
- Values: `spec/components/bottom-sheets.md`. 16 dp elevation (modal); scrim `--md1-scrim-sheet`, `#000` 20%; 16 dp side keyline, 8 dp top and bottom; grid margin 24 dp, rows 24 dp apart; initial max height = width x 9 / 16; full width under 960 px; from 960 px the inset follows the increment table (1 increment from the edge, 6 wide; 2 and 8 at 1280; 3 and 9 at 1440) with the 64 dp increment.
- Limits: swipe to dismiss and swipe to expand are not shipped (gesture); `X`, scrim click and Escape are the paths. No corner radius (square in every figure).
- Vuetify 1.5 gap fill: the page states no item states, so `Item` takes the list tile's: the 4% / 8% `--md1-list-hover` and no focus fill, keyboard focus showing the user agent's ring (th:51-52, 145-146).

### Md1Button

`button.md1-button` > [`span.md1-ripple`, `span.md1-button__icon` (when `icon`), `span.md1-button__content` (omitted when the button is icon-only, so `Button.Icon` can mark the root `data-solo`)].

- `variant`: `'flat' | 'raised'` (`'flat'`). `dense` (`false`): 32 dp, 13 sp. `footer` (`false`): the persistent footer button, 48 dp flat, full width of its container, no radius; `footer` with `raised` is a dev warning (the spec forbids raised buttons in persistent areas). `icon`: a glyph role; with slot content it leads the label, without it the button is icon-only (`data-solo` from `Button.Icon`, 48 dp circular target, `ariaLabel` required, dev warning when missing). `disabled`, `ariaLabel`, `name` (feeds v0's hidden input, which submits only when the button is selected inside a v0 `Button.Group`), `namespace` (forwarded to `Button.Icon` and `Button.Content` as well as `Button.Root`).
- No `loading`: MD1 buttons have no loading state (ruling 7); progress is an `Md1ProgressCircular` beside the button.
- Composition: `Button.Root` + `Button.Content`; `Button.Icon` wraps `Md1Icon`.
- Values: `spec/components/buttons.md`. 36 dp tall in a 48 dp target; min width 88 dp; radius 2 dp; padding 0 16 dp; 8 dp between buttons; label Button 14 sp Medium caps; flat ink `--md1-accent` (primary accents selected buttons, accent is the action colour); raised fill `--md1-primary` 500 at 2 dp, 8 dp pressed, pressed fill `--md1-primary-dark` (700); desktop raised rests at 0 dp and gains 2 dp on hover; focus 12% (raised: a 12% black shade over the colour, the page's own words, so it stays black); pressed overlay 40% `#999999` light, 25% `#CCCCCC` dark; disabled text 26% / 30%, disabled raised fill 12%.
- Vuetify 1.5 gap fills: hover is a 12% `currentColor` overlay on flat and raised buttons, dropped under `(hover: none)` (`_buttons.styl:54,62-72`; it supersedes Lead decision 3's "no hover overlay"), so a raised button takes a 12% white wash beside its desktop 2 dp lift; the icon sits 16 px before the label (`.v-icon--left`, `_icons.styl:25-26`); an icon-only button inks in `--md1-text-primary`, 87% black / white (`_buttons.styl:5-6`), not the accent.

### Md1IconToggle

`button.md1-icon-toggle[aria-pressed]` > [`span.md1-ripple`, `svg.md1-icon`].

- `v-model` pressed; `icon` (off glyph), `iconOn` (on glyph, defaults to `icon`), `unbounded` (`true`: the 48 dp circular ripple extends past the 24 dp glyph), `ariaLabel` (required), `disabled`.
- Composition: `Toggle.Root` + `Toggle.Indicator`; `data-state="on" | "off"` drives the glyph swap.
- Values: `spec/components/buttons.md`, `spec/iconography.md`. Active icon 54% black / 100% white, inactive 38% / 50%, focused 87% / 100%; 24 dp glyph, 48 dp target (20 / 40 dp under `dense` hosts).

### Md1ToggleButtons

`div.md1-toggle-buttons[role=group]` > `button.md1-toggle-buttons__item[aria-pressed]`.

- `v-model` (`T | T[]`), `multiple` (`false`: exclusive), `mandatory` (`false`), `disabled`. `Item`: `value`, `icon`, `disabled`; text, icon or both in the slot.
- Composition: `Toggle.Group` + `Toggle.Root`. Fewer than three items is a dev warning (the spec's minimum).
- Values: `spec/components/buttons.md` records the group's metrics as image-only, so the group takes Vuetify 1.5's `v-btn-toggle` (`_button-toggle.styl`): a `--md1-surface` strip with 2 px corners and no outline, raised to 2 dp while any item is selected (:6-7, 19-23, 53-54); items are 36 dp flat buttons (48 dp target) with 0 8 px padding (:29) in `--md1-text-primary` at opacity .4, full opacity once selected (:9-10, 31, 40-41); a selected item carries the buttons' 12% `currentColor` overlay and a 1 px seam after it at the disabled-button ink, 26% / 30% (:12-15, 34-35, `_buttons.styl:62-68`); no seam between unselected items; hover is the buttons' 12% overlay; 10 px between label and icon (:43-45). Focus and pressed may paint the whole group (spec).

### Md1DropdownButton

`div.md1-dropdown-button` > [`button.md1-dropdown-button__state`, `button.md1-dropdown-button__arrow` (segmented only)] + `div.md1-menu[popover]`.

- `v-model` the selected state value; `segmented` (`false`): the state segment emits `select` with the current value and the arrow segment opens the menu; otherwise the whole button opens. `dense`, `desktop`, `disabled` as `Md1Menu`. `Item`: `value`, `icon`, `disabled`; a `Menu.RadioItem` so the menu shows the current state with a check.
- Composition: `Menu.Root` + `Menu.Activator` (styled as a flat `Md1Button` with a trailing `arrow-drop-down` glyph) + `Menu.Content` + `Menu.RadioGroup`. The menu opens over the button with the selected item aligned on it (spec); selecting dismisses and updates the label.
- Values: `spec/components/buttons.md` (desktop dropdown paddings 16 / 24 / 16 dp), `spec/components/menus.md` for the sheet.
- Limits: the editable segmented dropdown (font size picker) is specified by definition only and is deferred: compose `Md1TextField` and `Md1DropdownButton` (Known limitations).

### Md1Fab

`button.md1-fab` > [`span.md1-ripple`, `svg.md1-icon`]. Speed dial: `div.md1-fab__dial` > [the button as `Menu.Activator`, `div.md1-fab__actions[popover][role=menu]` > `button.md1-fab__action[role=menuitem]` + `span.md1-fab__label`].

- `icon` (required), `ariaLabel` (required), `mini` (`false`; forced on under 460 px by media query), `position`: `'end' | 'start' | 'static' | 'seam'` (`'end'`: fixed, 16 dp from the bottom and end edges, 24 dp from 600 px; `'seam'`: absolutely positioned at the end keyline (16 dp, 24 dp from 600 px) straddling the bottom edge of its host by half its height, `translateY(50%)`, hosted by `Md1Toolbar.Extension`, `Md1Card` and `Md1BottomSheet` through a `data-fab-host` wrapper: the FAB page's "attach to an extended app bar", "attached to a toolbar or structural element within a sheet" and "attached to the edge of a sheet", and the layout principles' rule that a FAB may straddle a step when it relates to the content creating the step and a seam when it relates to both sheets), `disabled`.
- `Action` children turn the FAB into a speed dial: `icon`, `label`, `value`; items fly out above the FAB as 40 dp mini FABs with a label at the start side; the FAB stays; pressing it again closes. Two to five actions (three to six including the FAB) or a dev warning.
- Composition: `Button.Root` + `Button.Icon`; speed dial on `Menu.Root` / `Menu.Content` with `positionArea="top span-left"`.
- Values: `spec/components/buttons-floating-action-button.md`. 56 dp, mini 40 dp (48 dp target), icon 24 dp in both; 6 dp resting, 12 dp pressed; fill `--md1-accent`, white icon; focus "changes colour" (`--md1-focus` overlay); entrance scales from the centre (225 ms decelerate); the FAB moves up by the snackbar height while a snackbar shows.
- Limits: morph, toolbar and full-screen transforms are documented compositions on `Md1Dialog` and `Md1Toolbar`; speed dial item spacing is not in the spec: 12 px between the 40 dp items, Vuetify 1.5's 6 px button margins on each side (var:169-171); the actions fill with `--md1-app-bar`, Grey 100 / Grey 900, the uncoloured floating button of `_buttons.styl:18-19`; the 16 dp label gap and the 2 dp Body 1 label sheet are decisions (Vuetify 1.5 has no labels).

### Md1Card

`article.md1-card` > parts in anatomy order; `Media` is `div.md1-card__media` with an `img` or background; `Actions` is `div.md1-card__actions`.

- `v-model:expanded` (`undefined`: no expansion), `selected` (`false`: check mark and scrim, selection pattern). No `as`: the root is always `article` (house-style 2.2 withholds `as` from every wrapper); a consumer who needs `li` or `section` composes `Atom` with the card classes through the escape hatch.
- Parts: `Header` (72 dp: avatar 40 dp at 16 dp, title and subtitle at 72 dp; props `avatar`, `title`, `subtitle`); `Media` (`ratio: '16:9' | '1:1' | '1x' | '1.5x' | '2x' | '3x'`; the `nx` values are the inset 80 dp increments with 16 dp padding); `Title` (Headline 24 sp, 24 dp top, 16 dp bottom); `Subtitle` (Body 1 14 sp, 12 dp top); `Supporting` (Body 1 14 sp, 16 dp top, 24 dp bottom when last, 16 dp with actions below); `Actions` (8 dp padding, 4 dp between actions, two actions plus an overflow `Md1Menu`; `align: 'start' | 'end'`; also hosts the cards page's UI controls, "a slider to choose a day, stars to rate content, or a segmented button to select a date range": `Md1Slider`, `Md1ToggleButtons`, `Md1Tabs` or an escape-hatch `Rating` placed inline, a documented composition); `Expanded` (`Collapsible.Content` revealed by the card's `expanded` model, full-bleed divider seam).
- Values: `spec/components/cards.md`. 16 dp content keyline (24 dp from 600 px); 2 dp resting, 8 dp picked up; under `pointer: fine` 0 dp resting and 8 dp on hover; 8 dp collection gutters; dividers full-bleed for seams, inset for related content.
- Decision: corner radius 2 dp (text says "rounded corners" only; Vuetify 2 px). Swipe to dismiss and pick-up-and-move are gestures: not shipped; provide buttons.

### Md1Chip

`span.md1-chip` (a `button` when `@click` is bound or `contact`) > [`img.md1-chip__avatar` | `svg.md1-icon`, `span.md1-chip__label`, `button.md1-chip__delete` > `svg.md1-icon`].

- `icon`, `avatar` (image URL), `deletable` (`false`: `cancel` glyph at 24 dp 54%, emits `delete`; keyboard Delete on the focused chip also emits it; persistent on desktop), `contact` (`false`: the in-field contact chip, 8 dp avatar-side padding, Regular 14 sp), `disabled`.
- `Addresses` (optional part, contact chips only): `Popover.Content` at 8 dp listing `Address` rows (Regular 14 sp) under the name at 16 sp; the chip becomes the `Popover.Activator`; a second press closes.
- Values: `spec/components/chips.md`. 32 dp tall; label Regular 13 sp 87%; 12 dp side padding; delete icon 24 dp with 4 dp margin; focused in-field chip 40 dp with 2 dp elevation.
- Decisions: fill Grey 300 `#E0E0E0` light / `#555555` dark and a full pill radius are image-derived (`moderate`); chips sit at 0 dp (absent from the elevation table).
- Vuetify 1.5 gap fills (`_chips.styl`): no hover overlay; keyboard focus is a 13% `currentColor` overlay (:84-95); the leading icon sits 4 px in and 12 px before the label (:156-158, var:208-209); disabled drops the ink to `--md1-text-disabled` and leaves the avatar opaque (:8-9).

### Md1DataTable

`div.md1-data-table` > [`div.md1-data-table__header`, `div.md1-data-table__contextual`, `div.md1-data-table__scroll` > `table.md1-data-table__table`, `div.md1-data-table__footer`].

- Root: passes `sortMultiple: false` and `selectStrategy: 'page'` to `DataTable.Root` internally (the page sorts one column: "If the user clicks on a column that is already sorted, reverse the sort order and rotate the sort icon"); public props `rowsPerPage` (`10`, the footer label's own word) and `selectable` (`false`: adds the checkbox column with select-all); `v-model:selected`. No `v-model:search`: a consumer who needs filtering composes `Md1SearchBar` with `DataTable.Root v-model:search` through the escape hatch.
- Parts: `Header` (64 dp card title row: `title` Regular 20 sp, action icons at 54% with 24 dp spacing and 14 dp to the edge); `Contextual` (replaces `Header` while rows are selected: fill `--md1-accent-light` (the secondary colour's 50 value), count label, contextual icons); `Table`, `Head`, `Column` (`id`, `sortable`, `numeric`, `tooltip`: `aria-sort` on the `th`, the sort control is a `Button.Root` showing `arrow-upward` at 38% on hover and 87% when sorted, rotated for descending), `Body`, `Row` (`value`, `selectable`), `Cell` (`numeric`, `editable: 'small' | 'large'`: small opens a `Popover` edit sheet with one `Md1TextField` confirmed by Enter, large opens an `Md1Dialog` with Cancel and Save; `Cell` takes `v-model` for the edited value and emits `update:modelValue` on Enter or Save, Escape and Cancel revert and emit nothing, the consumer writes the row), `Footer` (56 dp: "Rows per page:" with an `Md1DropdownButton` bound to `rowsPerPage` 40 dp from its label, the range text "1-10 of 100" 32 dp apart, `chevron-left` / `chevron-right` 24 dp apart and 14 dp from the edge).
- Values: `spec/components/data-tables.md`. Header row 56 dp, data rows 48 dp; 24 dp edge padding; 56 dp minimum between columns (the redline's 24 dp first gap is recorded as an inconsistency); content Regular 13 sp 87%; column headers Medium 12 sp 54%; row hover Grey 200, selected row Grey 100; checkbox 18 dp glyph in 24 dp, `--md1-accent` in both themes like `Md1Checkbox` (the selection-controls page's checkbox stays Swatch 500 on dark; Vuetify 1.5's `selectable.js:22` agrees); table card 2 dp.
- Limits: phone layout is horizontal scroll inside `__scroll`; no pinned headers; checkboxes stay visible (the figures) rather than hover-revealed; inline menu cells are `Md1Menu` the consumer places in a `Cell`.

### Md1Dialog

`dialog.md1-dialog` > `div.md1-dialog__sheet` > [`h2.md1-dialog__title`, `div.md1-dialog__text`, `div.md1-dialog__actions`].

- `v-model` open; `variant`: `'alert' | 'simple' | 'confirmation' | 'full-screen'` (`'alert'`); `dismissible` (`true`; `false` disables outside click and Escape so an action must be chosen, the dialogs page's "the user's ability to dismiss a dialog may be disabled"; `data-dismissible`). Not `persistent`: in MD1 that word means a non-modal surface that stays (`Md1BottomSheet persistent`, `Md1NavigationDrawer type="persistent"`). `v-model:value` (`unknown`, `undefined`): the choice a `simple` or `confirmation` dialog commits.
- `alert` composes `AlertDialog.*`, the other variants `Dialog.*`; both forward `closeOnClickOutside` from `dismissible` and prevent the native `cancel` event (Escape) while not dismissible (the spec lets dialogs dismiss unless disabled). The root provides a `md1:dialog` context with `value` and `commit(value)`: `Md1List.Item` (under `simple`) and `Md1Radio.Group` / `Md1Checkbox` (under `confirmation`) call `commit` when hosted in a dialog. `simple` hosts an `Md1List` whose item click commits and closes (56 dp avatar rows, 80 dp keyline); `confirmation` hosts `Md1Radio.Group` or `Md1Checkbox` rows and keeps `Confirm` disabled until `value` is set; `full-screen` fills the viewport under 600 px, hosts an `Md1Toolbar` with `Nav icon="close"` and the verb action, and prompts a discard confirmation when `dirty` is set.
- Parts: `Activator` (renderless), `Content` (the `<dialog>`; `::backdrop` in `--md1-scrim`; `scrim: false`), `Title` (Medium 20 sp, 28 dp line height, 24 dp top, 20 dp to the text; pinned while a list scrolls), `Text` (Body 1 14 sp at `--md1-text-primary`), `Actions` (52 dp, 8 dp padding, affirmative at the end, dismissive before it; `stacked` auto when a label exceeds (width - 24) / 2, each stacked button a 48 dp target; a 12% stroke appears above while the content is scrolled), `Cancel` and `Confirm` (flat `Md1Button`s placed inside `Actions`; labels default to `locale.ti('Md1.cancel') ?? 'Cancel'` and `locale.ti('Md1.ok') ?? 'OK'` and the default slot overrides them; rendered on `AlertDialog.Cancel` / `AlertDialog.Action` under `variant="alert"` and on `Dialog.Close` / a plain `Button.Root` otherwise; `Confirm` emits `confirm` with `value` and closes, and is `disabled` while `value` is `undefined` under `confirmation`).
- Values: `spec/components/dialogs.md`. 24 dp content padding; 24 dp elevation; 36 dp buttons, 64 dp minimum width in dialogs; at least 40 dp from the side edges and 24 dp top and bottom; width in 56 dp units, minimum 280 dp; at most two actions (a third is a dev warning).
- Vuetify 1.5 gap fills: desktop width is not in the spec, so the sheet sizes to its content from the 280 px minimum with no maximum but the 40 dp side margins (`VDialog/VDialog.js:44-54`, `maxWidth: 'none'`); the body text colour is not stated (the notes read secondary grey from the figures at `low`), so it inherits the card's 87% black / white (`_cards.styl:5-8,44-46`); scrim: `--md1-scrim` (see Theme). Motion stays the motion page's 225 ms decelerate in and 195 ms accelerate out (spec-explicit), not Vuetify's 0.3 s fast-in-fast-out.

### Md1Divider

`hr.md1-divider`. `inset` (`false`): starts at the 72 dp keyline (80 dp from 600 px). 1 dp, `--md1-divider` 12%. Placed inside the bottom of a tile when rendered by `Md1List`; standalone between sections otherwise. `spec/components/dividers.md`. No vertical variant.

### Md1ExpansionPanel

`div.md1-expansion-panel` > `div.md1-expansion-panel__item` > [`h3 > button.md1-expansion-panel__header`, `div.md1-expansion-panel__content[role=region]`].

- Root is `ExpansionPanel.Group`: `v-model`, `multiple` (`false`: accordion), `disabled`. `Item`: `value`, `disabled`. `Header`: `label`, `summary` (middle column), `secondary` (12 sp line under the label); the chevron is the `Cue` with `expand-more`, 38% at rest, 54% on hover. `Content`: the editing body. `Actions`: the CANCEL / SAVE row (16 dp above and below 36 dp buttons, 8 dp apart) above a divider; it emits nothing, the buttons are the consumer's.
- Values: `spec/components/expansion-panels.md`. Collapsed 48 dp, expanded header 64 dp; 16 dp vertical and 24 dp horizontal padding; 16 dp between columns; 24 dp icon; 1 dp dividers; label Regular 15 sp 87% (16 sp in the 2016 revision); focus fill Grey 200.
- Decisions: single-open by default (spec silent); headers follow the APG Accordion pattern (Enter and Space).
- Vuetify 1.5 gap fills (`_expansion-panel.styl`): the group rests at 1 dp (:34); the expanded item detaches 16 dp above and below (the page's figure, spec-explicit) and lifts to 3 dp, Vuetify's popout and inset value (:75-80), superseding Lead decision 4's 8 dp; the dark header focus fill is `#494949` (th:155) where the light one is the page's Grey 200, both through `--md1-panel-focus`.

### Md1GridList

`ul.md1-grid-list` > `li.md1-grid-list__tile` > [the primary action (`a` or `button.md1-grid-list__action`) wrapping the image, `div.md1-grid-list__bar`].

- Root: `gutter: 4 | 1` (`4`), `columns` (`undefined`: auto-fill from `ratio` and the container), `ratio` (`'1:1'`; one of 16:9, 3:2, 4:3, 1:1, 3:4, 2:3), `horizontal` (`false`: the single-line gallery).
- `Tile`: `span` and `rowSpan` (`1`), `href`, `selected`, `alt`. `Bar`: `position: 'header' | 'footer'` (`'footer'`), `title`, `subtitle` (two lines, 68 dp), `icon`, `iconSide: 'start' | 'end'`; emits `action` from the icon (a 48 dp `Button.Root` flush with the tile edge). `Md1Subheader` separates sections (48 dp, 16 dp keyline); no dividers.
- Values: `spec/components/grid-lists.md`. Bar 48 dp single, 68 dp double; 16 dp text padding; 16 sp / 12 sp or 14 sp / 14 sp; square corners; text truncates with an ellipsis.
- Entrance: on mount the tiles fade and lift in sequence left to right then top to bottom, each `--md1-stagger` (20 ms) after the previous, over `--md1-duration-enter` on the decelerate curve (the choreography page's stagger rule), gated by reduced motion.
- Decision: the bar scrim is not in the spec: `--md1-grid-list-bar` = `rgba(0, 0, 0, 0.6)` with white ink (the imagery page's 20 to 60% range, upper bound for legibility).

### Md1List

`ul.md1-list` > `li.md1-list__item` > [`button | a | div.md1-list__tile`] > [`div.md1-list__avatar`, `svg.md1-list__icon`, `div.md1-list__content` > [`div.md1-list__primary`, `div.md1-list__secondary`], `div.md1-list__action`].

- Root: `dense` (`false`), `select: 'none' | 'single' | 'multiple'` (`'none'`), `v-model`, `lines: 1 | 2 | 3` default for items.
- `Item`: `value`, `href`, `disabled`, `lines`; the whole tile is the primary action; `aria-current="page"` for navigation lists under `select="none"`; under `select="single" | "multiple"` the root renders `ul[role=listbox]` (`aria-multiselectable` for `multiple`) and each tile `role="option"` with `aria-selected` (the hover check mark and scrim of the selection pattern); `aria-selected` is never set outside a real listbox (it is valid only on `option`, `gridcell`, `row` and `tab`; Emerald's `EmList` uses `aria-current` for the same reason). `Avatar` (`src`, 40 dp), `Icon` (`name`, 24 dp, also 24 dp in dense), `Content`, `Primary` (Regular 16 sp, 13 sp dense), `Secondary` (Regular 14 sp, clamped to two lines in three-line tiles), `Action` (the 56 dp secondary column: an `Md1Checkbox`, `Md1Switch`, `Md1IconToggle`, or Caption 12 sp info), `Group` (`Collapsible`: an item-shaped header with `icon` and `title`, chevron `expand-more` rotating, children indented to 72 dp, full-bleed dividers above and below; the expanded title takes `--md1-primary`). The current item of a navigation list and the expanded group title keep `--md1-primary` on the dark theme too: Vuetify 1.5 leaves the primary unchanged on dark surfaces (Lead decision 12 is reverted; the shortfall is under Known limitations). The selection check mark is `--md1-accent` in both themes (`selectable.js:22`).
- Values: `spec/components/lists.md`, `spec/components/lists-controls.md`. Heights 48 / 56 (avatar) / 72 / 88 dp, dense 40 / 48 / 60 / 76 dp; 16 dp edge, 72 dp text keyline (80 dp from 600 px); list padding 8 dp (4 dp dense); 20 dp text paddings to the baseline.
- Entrance: on mount the items fade and lift in sequence, each `--md1-stagger` (20 ms) after the previous, over `--md1-duration-enter` on the decelerate curve, top to bottom (the choreography page's stagger rule), gated by reduced motion.
- Limits: reorder and leave-behind swipes are not shipped (gestures), and neither is a `reorder` handle (Known limitations). Hover is Vuetify 1.5's list-tile hover, `--md1-list-hover`, black 4% / white 8% (th:51-52, 145-146); focus 12%; pressed ripple.

### Md1Subheader

`div.md1-subheader` (`li[role=presentation]` inside `Md1List`; `role="heading"` with `aria-level` otherwise). `inset` (`false`: 72 dp, for a list with a left-aligned FAB), `primary` (`false`: `--md1-primary` text instead of 54%, in both themes: Vuetify 1.5 colours it through a class that the dark theme leaves alone), `sticky` (`true`: `position: sticky; top: 0`, pushed off by the next subheader). 48 dp, Medium 14 sp, 16 dp keyline. `spec/components/subheaders.md`.

### Md1Menu

`div.md1-menu[popover][role=menu]` > [`div.md1-menu__item[role=menuitem]` > [`svg.md1-icon`, `span.md1-menu__label`, `span.md1-menu__info`], `hr.md1-menu__divider`, `div.md1-subheader`].

- Root (`Menu.Root`): `v-model`, `dense` (`false`), `desktop` (`false`: 32 px rows, 24 px padding, 15 px type; `dense` + `desktop`: 24 px, 13 px), `disabled`, `openDelay` / `closeDelay` from v0 (100 / 250 ms) for sub menus.
- Parts: `Activator` (renderless), `Content` (8 dp sheet; width snapped up to the 56 dp unit, 112 dp minimum and 280 dp maximum on handsets, 64 px unit on desktop; 16 dp from the edges, 24 dp from 600 px; scrolls internally with a visible scrollbar), `Item` (`icon`, `info` (inline information such as a shortcut, never truncated, `aria-keyshortcuts`), `disabled`, `value`), `CheckItem` (`Menu.CheckboxItem`, `v-model:checked`, check glyph in the leading slot), `Divider` (`Menu.Separator`, 8 dp above and below), `Subheader`, `Sub` (`Menu.Sub` + `SubActivator` + `SubContent` folded into one part with `label` and `icon`; `arrow-right` trailing glyph; 9 dp, +1 dp per level; opens on pointer rest, focus or ArrowRight; one level ideally).
- Values: `spec/components/menus.md`. 48 dp rows, 16 dp text padding, 8 dp top and bottom, 16 sp (14 sp dense) on handsets; text 87%, disabled 38%, icons 54%; selected row highlighted with `--md1-focus`.
- Decisions: hover and the keyboard highlight are `--md1-list-hover`, black 4% / white 8% (th:51-52, 145-146; `_lists.styl:20-23`); radius 2 dp (`_menus.styl:21`); items fade in as the sheet grows from its origin at the activator over the motion page's 225 ms decelerate in and 195 ms accelerate out (spec-explicit; Vuetify's 0.3 s fast-in-fast-out does not apply).
- Limit: the simple-menu rule that positions the selected item over the emitting element is not implemented in v1 (CSS anchor positioning has no measured offset); the menu opens below the activator.

### Md1DatePicker

`div.md1-date-picker` > [`div.md1-date-picker__header` > [`button.md1-date-picker__year`, `div.md1-date-picker__date`], `div.md1-date-picker__body` > [`div.md1-date-picker__nav`, `table.md1-date-picker__grid[role=grid]` | `ul.md1-date-picker__years[role=listbox]`]].

- `v-model` an ISO date string (`useDate` formats when `createDatePlugin` is installed, plain `Date` otherwise); `landscape` (`false`: header becomes a 168 dp start column); `firstDayOfWeek` (`0`). Tapping the year opens the year view; chevrons and horizontal swipe move months; the grid is an APG Date Picker grid on `useRovingFocus({ columns: 7 })` (`orientation` is ignored when `columns` is set).
- DS-owned headless: a private `createDatePickerCore` modelled on Emerald's `createCalendar` (approach, not code) because v0's `createDatePicker` is a draft with no source. Graduates to v0 when it lands.
- Values: `spec/components/pickers.md` (measured, `moderate`). 328 x 484 dp portrait, 512 x 304 dp landscape; 96 dp header in `--md1-primary` (Grey 700 in dark) with the year at 14 sp 70% and the date at Display 1 34 sp; 48 dp navigation row, Medium 14 sp label; 40 dp weekday row at 12 sp 38%; day cells 44 x 40 dp, 12 sp; selected day a 40 dp `--md1-primary` circle (`--md1-accent-control` in dark); today in primary and heavier weight; year list 44 dp pitch at 16 sp, selected year 24 sp (`--md1-accent-control` in dark, the dark-theme 200 rule the pickers and selection-controls pages state, kept over Vuetify 1.5's primary). Hover: a day takes the flat button's 12% `currentColor` (`_buttons.styl:62-68`); a year takes black 12% in both themes (`_date-picker-years.styl:22-23`).
- Hosted by `Md1Dialog variant="confirmation"`, which supplies CANCEL and OK; the picker never renders its own actions. One value per picker.
- Limits: min, max, disabled dates and ranges are not in the spec and do not ship.

### Md1TimePicker

`div.md1-time-picker` > [`div.md1-time-picker__header` > [`div.md1-time-picker__view[role=group]` > [`button.md1-time-picker__hours[aria-pressed]`, `span`, `button.md1-time-picker__minutes[aria-pressed]`], `div.md1-time-picker__period[role=radiogroup]` > `button[role=radio]` x2], `div.md1-time-picker__clock[role=radiogroup]` > `svg` face + hand (inline geometry, declared under Deviations) + `button[role=radio]` per number].

- `v-model` `"HH:mm"`; `format: '12' | '24'` (`'12'`; `24` draws the inner ring, an interpretation since the spec names but does not draw it); `landscape`.
- Tapping the hour or minute digits switches views (`Toggle.Group` + `Toggle.Root`: `role="group"` with `aria-pressed`); AM / PM and the clock numbers are each a `Radio.Group mandatory="force"` of `Radio.Root`s (`radiogroup` / `radio` with roving tabindex and wrapping arrow keys built in; no `useRovingFocus`, which would double-handle the keys); selecting an hour advances to minutes; arrows also rotate the hand.
- Values: `spec/components/pickers.md`. Digits about 60 sp (48 sp landscape), active 100% white, inactive 70%; face 296 dp (224 dp landscape) in Grey 200 (Grey 700 dark); numbers 16 sp at a 124 dp radius; 2 dp hand from a 6 dp dot to a 40 dp filled target (36 dp landscape).
- Hosted by `Md1Dialog variant="confirmation"` like the date picker.
- The dark hand and target keep `--md1-accent-control` with dark digits (the pickers page's dark artwork and the selection-controls page's dark 200 rule), not Vuetify 1.5's accent A200. Hover: no overlay; an inactive header button rises from 70% to full opacity while it is not focused (`_pickers.styl:36-41`).

### Md1ProgressLinear

`div.md1-progress-linear[role=progressbar]` > [`div.md1-progress-linear__track`, `div.md1-progress-linear__buffer`, `div.md1-progress-linear__fill`].

- `value` (`undefined`: indeterminate), `buffer` (`undefined`: the buffer variant with a dotted trail for the unbuffered remainder), `query` (`false`: the indeterminate sweep reversed until `value` arrives). No `active`: the page says bars "appear and disappear" at the edge of a header or sheet; the consumer mounts the indicator with `v-if` and Material Design 1 animates it in and out through `Presence` (`data-presence` carries the phase), 225 ms decelerate in and 195 ms accelerate out.
- Composition: `Progress.Root` + `Track` + `Fill` + `Buffer`; a `value` of `0` is passed as determinate (v0 reports 0 as indeterminate, so Material Design 1 binds `data-state` from its own prop).
- Values: `spec/components/progress-activity.md`. 4 dp tall, full width at the edge of a header or sheet; fill `--md1-primary`, track the fill at 30%; never decreases.
- Vuetify 1.5 gap fill: the indeterminate cycle is not in the spec: 2.2 s per sweep, 2 s for `query` (`_progress-linear.styl:33-35,60-61`), on the standard curve.

### Md1ProgressCircular

`div.md1-progress-circular[role=progressbar]` > `svg` (inline geometry, declared under Deviations) > [`circle.md1-progress-circular__track` (determinate only), `circle.md1-progress-circular__arc`].

- `value`, `size` (`40`), `fab` (`false`: 64 dp ring drawn around a sibling 56 dp `Md1Fab`, completing by filling the FAB in `--md1-accent` with a `check`).
- Composition: `Progress.Root` for the attrs and `percent`; the arc is `stroke-dasharray` on a 4 dp stroke, growing clockwise from the top; indeterminate rotates with a varying sweep (1.4 s, var:285-286); the determinate track is black 10% in both themes (var:288), nearly invisible on the dark theme (Known limitations).
- The refresh indicator (3 dp) is this component with `--md1-elevation-3` on a 40 dp white disc, documented under the swipe-to-refresh composition.

### Md1Checkbox, Md1Radio, Md1Switch

`label.md1-checkbox` > [`button.md1-checkbox__control[role=checkbox]` > [`span.md1-ripple`, `span.md1-checkbox__box` > `svg.md1-icon` (`Md1Icon name="check"`, `name="remove"` under `indeterminate`)], `span.md1-checkbox__label`]; the same shape for `md1-radio` (`role=radio`, ring and dot) and `md1-switch` (`role=switch`, `span.md1-switch__track` > `span.md1-switch__thumb`).

- Shared: `label` (the visible text; the control's `aria-labelledby` points at it), `value`, `name`, `disabled`, `namespace`. `Md1Checkbox` and `Md1Switch` take `v-model` boolean; `Md1Radio` must sit inside `Md1Radio.Group` (`v-model`, `name`, `mandatory`, `activation`), as v0 requires.
- `Md1Checkbox` `indeterminate` is a declared extension: MD1 has no mixed state, `Md1DataTable` select-all needs one (see Deviations).
- Composition: `Checkbox.Root` + `Indicator`; `Radio.Group` + `Radio.Root` + `Indicator`; `Switch.Root` + `Track` + `Thumb` (the Track's hard-coded `dir="ltr"` is counteracted by `transform: scaleX(-1)` on the Material Design 1 track under `[dir="rtl"]`).
- Values: `spec/components/selection-controls.md` (text for colours, measured geometry). Checkbox 18 dp box, 2 dp border, 2 dp radius; radio 20 dp ring, 2 dp stroke, 10 dp dot; switch 36 x 14 dp track, 20 dp thumb at 1 dp elevation, 16 dp travel; on: `--md1-accent` (switch `--md1-accent-control` in dark, track at 50%); off: 54% black / 70% white, switch thumb Grey 50 / Grey 400 on a 38% / 30% track; disabled 26% / 30%, disabled switch thumb Grey 400 / Grey 800 on a 12% / 10% track; 48 dp halo on focus and press (6 to 10%, `--md1-hover`), drawn only under `pointer: coarse` (the halo is measured from the page's sheets, so it is kept over Vuetify 1.5's 34 px, 20% ripple, `_selection-controls.styl:62-77,94-97`); 48 dp target; 8 dp control-to-label gap (decision).

### Md1Slider

`div.md1-slider[role=group]` > [`svg.md1-icon` (start), `div.md1-slider__track` > [`span.md1-slider__range`, `span.md1-slider__ticks`], `span.md1-slider__thumb[role=slider]` > `span.md1-slider__pin`, `svg.md1-icon` (end), `input` numeric field when `editable`].

- `v-model` number; `min` (`0`), `max` (`100`), `step` (`1`); `discrete` (`false`: snaps to ticks, a 26 x 32 dp value pin replaces the thumb on focus, 2 dp ticks appear while pressed); `iconStart`, `iconEnd` (24 dp intensity icons, 16 dp from the track); `editable` (`false`: a 24 dp wide numeric `Md1TextField` 16 dp after the track, live during drag); `disabled`; `label` / `ariaLabel`.
- Composition: `Slider.Root` + `Track` + `Range` + `Thumb`; the pin binds the Thumb's `value` slot prop.
- Values: `spec/components/sliders.md` (measured). 2 dp track; 12 dp thumb, 18 dp pressed, hollow 2 dp ring at 0%; 32 dp focus halo (16% accent on, 11% black off); disabled 8 dp thumb with 2 dp gaps; active track `--md1-accent` (`--md1-accent-control` in dark), inactive 26% black / 30% white, while focused 38% black / 30% white (`--md1-slider-focused`; Vuetify 1.5's th:168 and `_sliders.styl:37-39`, which the dark sheet's 28% corroborates); pin text about 10 sp white in both themes (`_sliders.styl:239`), about 2:1 on the dark Pink 200 pin (Known limitations). The thumb hosts no `Md1Ripple`: the sliders page draws none and Vuetify 1.5 has none (`_sliders.styl:53-56,187-199`), so the 18 dp thumb and the 32 dp halo are its press feedback, the one exception to the every-interactive-root ripple rule.
- Out: range and vertical sliders (not MD1).

### Md1Snackbar

`div.md1-snackbar[role=status]` > [`span.md1-snackbar__text`, `button.md1-snackbar__action`]; `Portal` is `div.md1-snackbar-portal` fixed at the bottom; `Queue` renders only the newest ticket.

- Root: `action` (label string; emits `action`; "Dismiss" and "Cancel" are refused with a dev warning); `multiline` (`false`: 80 dp, two lines); `align: 'center' | 'start'` (`'center'`; `start` is 24 dp from the start and bottom edges) for the tablet and desktop form. The root is always `role="status"`: the page names no urgency level and the errors pattern keeps critical errors out of snackbars; a consumer who needs an assertive `role="alert"` composes v0 `Snackbar` through the escape hatch. The 112 dp stacked-action layout triggers from the measured action width, not a prop.
- `Queue` uses `createNotificationsPlugin({ timeout })`: one snackbar at a time; a new one waits for the first to contract downward; hover and focus pause the timer.
- Composition: `Snackbar.Portal` + `Queue` + `Root` + `Content`; `Presence` for the upward entrance (225 ms decelerate) and downward exit (195 ms accelerate), the motion page's entering and leaving rule (spec-explicit; Vuetify 1.5's 0.4 s swing does not apply); the action is a flat `Md1Button` in the accent.
- Values: `spec/components/snackbars-toasts.md`. 48 dp single line; full width and square under 600 px; 288 to 568 dp wide with 2 dp corners from 600 px; 24 dp side padding, 14 dp vertical; text Regular 14 sp white on `#323232`; 24 dp text-to-action gap (48 dp from 600 px); 6 dp elevation; `--md1-snackbar-height` is published so `Md1Fab` moves up.
- Decision: auto-dismiss 6000 ms (not in the spec; Vuetify 1.5's default, `low`); no icons, at most one action, never persistent, never stacked.

### Md1Stepper

Horizontal: `div.md1-stepper` > [`ol.md1-stepper__header` > `li.md1-stepper__step` > [`button.md1-stepper__label` > [`span.md1-stepper__circle`, `span.md1-stepper__text` > [`span`, `small`]], `hr.md1-stepper__connector`], `div.md1-stepper__content[role=tabpanel]`]. Vertical: the `ol` holds each step's content under its label. Mobile: `div.md1-stepper__bar` with BACK and NEXT around dots, a progress bar or nothing.

- Root (`Step.Root`): `v-model` current step, `vertical` (`false`), `linear` (`true`: inactive labels 38% and locked; `false`: 54% with hover and pressed), `alternativeLabels` (`false`: 104 dp bar, labels centred under circles, equal parts), `mobile: 'text' | 'dots' | 'progress'` (`undefined`: the bottom-bar variant replaces the header; `text` renders "Step N of M" in a 48 dp bar under the app bar).
- `Step` (`Step.Item`): `value`, `label`, `optional` (12 sp "Optional" sub-label), `editable` (pencil in the completed circle), `error` (message string: red warning glyph, red Medium label); `aria-current="step"` on the active item; headers are buttons only when the step is reachable. `Content`: the active step's body (`Collapsible` in vertical mode, indented to the 60 dp keyline). `Actions`: CONTINUE (raised) and CANCEL (flat), 16 dp above, 8 dp apart. `Bar`: the mobile bottom bar (56 dp, `#EEEEEE`), 8 dp dots at 16 dp pitch or a 3 x 112 dp `Progress.Root`.
- Values: `spec/components/steppers.md`. 72 dp bar; 24 dp circles with 12 sp numbers; 24 dp padding; 8 dp circle-to-label (12 dp vertical); 1 dp connectors in Grey 400 (text wins over the sheet's Grey 300); active circle `--md1-primary` with white, inactive 38%; hover 6% of the foreground in both themes (black 6%, white 6%; `_steppers.styl:27-28`, which matches the page's light value); no focus fill (Vuetify 1.5 draws none): keyboard focus shows the user agent's focus ring; the sheet is white / `#303030` (`--md1-stepper`, `_steppers.styl:4-5`).
- `feedback` (string, `undefined`): while set, the active step's `Content` is replaced by an indeterminate `Md1ProgressCircular` and the message in Body 1 14 sp at `--md1-text-secondary`; root `data-feedback`; the steppers page's "transient feedback message after a step is saved", to be used only when there is long latency between steps.
- Decisions: header elevation 2 dp (drawn as a card, value not stated); the feedback layout is `not found` (the page shows it in video only), so the spinner-plus-message layout above is a decision.

### Md1Tabs

`div.md1-tabs` > [`div.md1-tabs__bar` > [`button.md1-tabs__arrow` x2 when overflowing, `div.md1-tabs__list[role=tablist]` > `button.md1-tabs__item[role=tab]` > [`svg.md1-icon`, `span.md1-tabs__label`], `span.md1-tabs__indicator`], `div.md1-tabs__panel[role=tabpanel]`].

- Root (`Tabs.Root`): `v-model`, `scrollable` (`false`: fixed tabs share the width and carry `data-fixed`; from 600 px the fixed bar centres automatically when the margin between the tab edge and the view edge exceeds 16 dp, the tabs page's rule, so there is no `centered` prop), `disabled`. `Item`: `value`, `icon`, `label`, `disabled`; `icon` with slot text is the 72 dp stacked variant; mixing labelled and icon-only tabs in one bar is a dev warning (the spec's "Don't"). `Panel`: `value`; sibling slide on change (new content from the end side, old content to the start side, 300 ms standard; `[dir="rtl"]` mirrors).
- Composition: `Tabs.List` + `Item` + `Panel`; `createOverflow` decides when the desktop pagination arrows show; the bar is swipe-scrollable on touch.
- Values: `spec/components/tabs.md`. 48 dp (72 dp icons and text); min width 72 dp (160 dp from 600 px), max 264 dp (scrollable: the smaller of 264 dp and the view minus 56 dp); 12 dp side padding (24 dp under `pointer: fine`, where the label drops to 13 sp and the first tab starts at the 80 dp keyline); 20 dp bottom padding (12 dp when wrapped to two lines at 12 sp); 10 dp icon-to-text; 2 dp indicator; 24 dp icons.
- Values on a `primary` bar: the active ink and indicator are white and inactive is white 70% (spec). Vuetify 1.5 gap fills (`_tabs.styl`, th:70-71, 173-174): on a surface bar the active label is `tabs.active`, `--md1-text-primary` (87% black / white), and only the indicator is `--md1-accent` (`VTabs/VTabsSlider.js:10`); inactive is the same ink at 70% (:139-140), about 61% black / 70% white; disabled is the disabled-button ink, 26% / 30% on a surface bar and white 30% on a primary one (:11-12); no hover and no focus fill, so keyboard focus shows the user agent's focus ring. Overflow on desktop uses pagination arrows; the "More" dropdown is deferred.

### Md1TextField

`div.md1-text-field` > [`svg.md1-icon` (signifier, 16 dp before the label; wrapped in `button.md1-text-field__picker` under `picker`), `div.md1-text-field__field` > [`label.md1-text-field__label`, `span.md1-text-field__prefix`, `input | textarea.md1-text-field__input`, `span.md1-text-field__suffix`, `button.md1-text-field__clear`, `button.md1-text-field__visibility`, `button.md1-text-field__voice`, `button.md1-text-field__dropdown` (the 24 x 24 dp `arrow-drop-down` container under `dropdown`), `span.md1-text-field__line`], `div.md1-text-field__list[role=listbox][popover]` > `div.md1-text-field__item[role=option]` (under `dropdown`), `div.md1-text-field__details` > [`span.md1-text-field__helper | __error[aria-live=polite]`, `span.md1-text-field__counter`]].

- `v-model`; `label` (required by the spec; `heading` hides it visually and keeps the accessible name), `helper`, `placeholder`, `prefix`, `suffix`, `counter: number | { words: number }` (a character limit, or a word limit counting whitespace-separated words, the page's "character or word counters"; "used / limit" at the end, red line and error state over the limit; `data-counter="characters" | "words"`), `required` (asterisk), `optional` ("(optional)"), `icon`, `clearable` (`close`, enabled only with text), `voice` (`mic`, always enabled, emits `voice`), `type` (`password` adds the `visibility` toggle), `box` (`false`: 56 dp filled box, 4 dp radius, 6% black / 10% white, 44 dp with `dense`), `dense` (`false`: 13 sp, halved spacings), `multiline` (`false`: grows downward), `textarea` (`false`: fixed height, scrolls, 1 dp border in the line colour), `fullWidth` (`false`: 56 dp, 20 dp vertical padding, 48 dp with `dense`), `solo` (`false`: the page's solo field "for a single action such as search": no input line, no floating label, placeholder only, icons inside the sheet, `--md1-elevation-2` rising to 3 with `data-scrolled` (0 and 1 under `pointer: fine`, the desktop drop), 2 px radius; `data-solo`), `dropdown` (`false`: the field is the spec's select, the page's "Nested menus & pickers": the input is readonly, an `arrow-drop-down` glyph sits in a 24 x 24 dp container 8 dp above the line, pressing the field or the arrow opens an `Md1Menu`-styled `Select.Content` listing the `Item` children (`value`, `disabled`), choosing one writes `v-model`; `data-dropdown`, `data-open`), `picker: 'date' | 'time'` (`undefined`: the icon signifier becomes a `Button.Root` that opens `Md1DatePicker` or `Md1TimePicker` inside `Md1Dialog variant="confirmation"` and writes the formatted value back on OK, the page's "a calendar icon may be tapped to reveal a date picker"; `data-picker`), `mask` (a group pattern such as `'(###) ###-####'` or `'#### #### #### ####'`, the page's "Grouped characters": separators are inserted on `input`, the caret jumps past a separator when its group fills, `v-model` stays unformatted; `data-mask`), `disabled`, `readonly`, `rules`, `validateOn` (`'blur'`), `error`, `errorMessages`.
- Composition: `Input.Root` (owns validation) + `Input.Control` (`as="textarea"` for `multiline` and `textarea`) + `Input.Description` + `Input.Error`; the visible `<label for>` floats on `data-dirty` or `data-focused`; `label` is not forwarded to `Input.Root` (no duplicate accessible name). Under `dropdown` the field composes `Select.Root` + `Select.Activator` (the readonly control and the arrow) + `Select.Content` + `Select.Item` (`Item`), one value per field. Under `picker` the signifier is a `Button.Root` hosting an `Md1Dialog`.
- Values: `spec/components/text-fields.md`. Input Regular 16 sp, label 16 sp resting and 12 sp floating, helper, error and counter 12 sp; 16 dp above the label, 8 dp between label and input, 8 dp around the line, 8 dp to the helper; tile heights 72 dp (floating label), 80 dp with error, 88 dp with counter, 16 dp between fields; line 1 dp 42% black / 70% white, hover 2 dp 87% / 100%, focus 2 dp `--md1-accent` with the "ripple and wash" from the touch point, error 2 dp Red A400 `#FF1744`, disabled 1 dp dotted; label 54% / 70%, floating focused in the accent, disabled 38% / 50%; placeholder 42% / 50%.
- Decisions: the accent, not the primary, is the active colour (the colour page lists text fields and cursors under the secondary colour); errors show when focus leaves (`validateOn="blur"`) and replace the helper; in-field contact chips are `Md1Autocomplete` territory (grouped characters are `mask` above).

### Md1Autocomplete

`div.md1-autocomplete` > [the `Md1TextField` chrome with `input[role=combobox]`, `div.md1-autocomplete__list[role=listbox][popover=manual]` > `div.md1-autocomplete__item[role=option]`].

- `v-model`; the `Md1TextField` text props; `strict` (`false`: free text allowed), `multiple` (`false`: selections render as contact `Md1Chip`s inside the field, the "To" field of the chips page), `inline` (`false`: the suggestion completes to the right of the cursor at placeholder colour; Enter accepts), `displayValue`.
- Parts: `Item` (`value`, `disabled`, `icon`; 48 dp rows at the 72 dp keyline when iconed), `Empty`.
- Composition: `Combobox.Root` + `Activator` + `Control` + `Content` + `Item` + `Empty`; the list is an `Md1Menu`-styled 8 dp sheet anchored to the field.
- Values: `spec/components/text-fields.md` (auto-complete), `spec/components/menus.md` (sheet), `spec/components/chips.md` (in-field chips: 32 dp, 40 dp focused).

### Md1Tooltip

`div.md1-tooltip[role=tooltip][popover]` > text. `Activator` is renderless.

- Root (`Tooltip.Root`): `v-model`, `disabled`; `Activator` (renderless; binds the slot `attrs` to the consumer's control) and `Content` (plain text; rich content is refused by the spec).
- Composition: `Tooltip.*` with `createTooltipPlugin` for the region delays. Touch: v0 drops touch pointers, so `Activator` adds a DS-owned press-and-hold (`pointerdown` + `useTimer`): hold shows, lift keeps it 1.5 s, any other action hides.
- Values: `spec/components/tooltips.md`. Desktop (`pointer: fine`): 22 dp tile, 8 dp side padding, 14 dp below the target, Medium 10 sp; touch: 32 dp, 16 dp, 24 dp, Medium 14 sp; Grey 700 at 90% with white text; no arrow; 150 ms in on the deceleration curve, 150 ms out on the acceleration curve; opens on hover and on `:focus-visible`; centred below the target, flipping above when there is no room (decision).
- Vuetify 1.5 gap fills: radius 2 px (`_tooltips.styl:7`), 2 dp elevation (`_tooltips.styl:15`), 200 ms open and close delays on hover (`VTooltip/VTooltip.js:22-37`). Decision: long-press threshold 500 ms (not in the spec; Vuetify 1.5 has no touch hold).

### Md1NavigationDrawer

Temporary: `dialog.md1-navigation-drawer` > `nav.md1-navigation-drawer__sheet` > [`div.md1-navigation-drawer__header`, `div.md1-navigation-drawer__content`]. Persistent, permanent and mini: `nav.md1-navigation-drawer` without the `dialog`.

- `v-model` open; `type: 'temporary' | 'persistent' | 'permanent'` (`'temporary'`); `mini` (`false`: the persistent drawer at rest shows only the 16 dp icon column and expands on open); `clipped` (`false`: starts under the app bar), `floating` (`false`: detached inside a card); `side: 'start' | 'end'` (`'start'`; the end drawer is the spec's right nav).
- Parts: `Activator` (renderless, temporary only); `Header` (the account area: `name` Medium 14 sp white, `email` Regular 14 sp white, `avatar`, `image` background, `--md1-primary` fill by default; 56 dp row keyline); `Content` (scrolls; holds `Md1List`, `Md1Subheader`, `Md1Divider`; 8 dp around each grouping; full-bleed dividers with 8 dp above and below).
- Composition: temporary drawers are `Dialog.Root` + `Dialog.Content` (native `<dialog>` at the start edge, `scrim: false`, `::backdrop`, focus containment and Escape from the browser), the Bootstrap `BDrawer` precedent; the other types are DS-owned on `Atom` with `Collapsible` for nested groups and `useBreakpoints` for a documented `type` switch the consumer binds.
- Values: `spec/patterns/navigation-drawer.md`, `spec/layout.md`. Width `min(100vw - 56px, 280px)` under 600 px and `min(100vw - 64px, 320px)` from 600 px (the structure page's 320 dp is the ceiling; desktop left nav at most 400 dp); 16 dp elevation for temporary, content elevation otherwise; items Medium 14 sp 87%, icons 54%, selected item in `--md1-primary` in both themes (Vuetify 1.5 keeps the primary on dark) with a darker tint when the ripple needs contrast; subheaders Medium 14 sp 54% at the 16 dp keyline; the drawer scrolls as a view.
- Vuetify 1.5 gap fill: mini width 80 px (`VNavigationDrawer/VNavigationDrawer.ts:54-56`). `floating` keeps the card it sits in, 2 dp corners and the card's 2 dp elevation, because the pattern page's figures draw the floating drawer detached inside a card (spec-explicit; Vuetify 1.5's floating drawer only drops its seam, `_navigation-drawer.styl:7-9,33-38`, and does not detach). Decisions: the 8 dp detachment (the figure gives no gap, Vuetify has no equivalent); the persistent drawer's open state is the consumer's `useStorage`; the cascading desktop drawer is a composition with `Md1Menu` panels.

### Md1SearchBar

`form.md1-search-bar[role=search]` > [`div.md1-search-bar__field` (`Combobox.Activator`) > [`button.md1-search-bar__nav` (`search` glyph at rest, `arrow-back` while focused), `input.md1-search-bar__input[role=combobox]`, `button.md1-search-bar__clear`, `button.md1-search-bar__voice`], `button.md1-search-bar__button` (raised, under `button`), `div.md1-search-bar__list[role=listbox]` > `div.md1-search-bar__item`].

- `v-model` query; `placeholder`; `voice` (`false`); `button` (`false`; forced on under `(pointer: fine)`): a raised `Md1Button` labelled Search (`locale.ti('Md1.search') ?? 'Search'`) after the field, the text-fields page's "On desktop, a raised search button should appear to the right of the search field"; `data-button`; emits `submit` (Enter, the button, or a chosen suggestion), `voice`, `clear`. `Item` (`value`, `icon` default `history` for historical and `search` for completions), `Empty`.
- Composition: the field is the bar's own `__field` box drawn with the solo values of `Md1TextField` (the inset sheet, the clear and mic buttons, the 2 dp resting and 3 dp scrolled elevation of the elevation table's quick entry / search bar rows, 0 dp and 1 dp while closed under `pointer: fine`), not a mounted `Md1TextField`: its editable element is `Combobox.Control`, not `Input.Control`; the suggestions are `Combobox.*` (`ClientComboboxAdapter` filtering, `displayValue`, `Combobox.Control openOn="input"`; `useTypeahead` is a prefix matcher for `Select` and does not compose with the adapter); the up arrow releases focus and closes the suggestions. Results are the consumer's `Md1Card`s.
- Values: `spec/patterns/search.md`, `spec/components/text-fields.md` (solo field). The page has no metrics: 48 dp tall field (the solo field height, decision), 16 dp keylines, 48 dp suggestion rows at the 72 dp keyline, 2 dp radius.

### Md1FeatureDiscovery

`div.md1-feature-discovery` (the `Tour.Highlight` portal, fixed over the page) > [`div.md1-feature-discovery__background` (the circular prompt background), `div.md1-feature-discovery__target` (the circular tap target over the promoted action)] + `div.md1-feature-discovery__content[role=dialog]` (`Tour.Content`) > [`h2.md1-feature-discovery__title`, `p.md1-feature-discovery__text`].

- `v-model` open; `color: 'primary' | 'accent'` (`'primary'`: the page's "the tap target may use the primary color of your app or toolbar"; the colour figures show the accent as the alternative); `contained` (`undefined`: auto; `true` limits the prompt to the surface the target rests on, the desktop and tablet rule); `placement: 'start' | 'end'` (`undefined`: computed from the edge rules below; set, it forces the 20 dp background offset side). Emits `complete` (the promoted action was tapped) and `dismiss` (tap outside or Escape).
- Parts: `Target` (renderless `Tour.Activator` whose `attrs` the consumer binds on the promoted action, an `Md1Fab` or `Md1Button icon`; the action stays tappable through the highlight); `Title` (`Tour.Title`); `Text` (`Tour.Description`). One prompt holds one action and no other buttons (spec).
- Composition: `Tour.Root` with a single step + `Tour.Highlight` (`blocking: false`, `blockActivator: false`; v0's cutout scrim restyled into the two circles) + `Tour.Content` (placement from the edge rules) + `Tour.Title` + `Tour.Description`; tapping outside runs `Tour.Skip`, Escape comes from `Tour.Keyboard`, tapping the promoted action runs the root's `complete`. `Tour.Next`, `Tour.Prev` and `Tour.Progress` are not rendered (one step).
- Values: `spec/patterns/feature-discovery.md`. Background in `--md1-primary` (or `--md1-accent`) at 96% opacity; within 88 dp of the screen top or bottom the target sits directly on the promoted action with the background centred on it; toward the centre the background is offset 20 dp away from the target (left for targets right of centre, right for targets left of centre, by writing direction for a centred target); on desktop and tablet the prompt is limited to the target's surface and the target is the size of the tappable surface, a surface smaller than 280 dp tall and 360 dp wide lets both circles extend past its edges at a higher elevation, targets within 88 dp of the surface edge centre the background, and targets within 144 dp of the top or bottom or 200 dp of the left or right screen edge centre the background above other elements; appear from the promoted icon on the standard curve; the idle pulse grows the highlighted action by 10% over one second and shrinks it, with an `Md1Ripple` at its largest size; the tap expands then fades and the dismiss shrinks then fades, both on the decelerate curve (the page's "ease out").
- Decisions (`not found` on the page, figures unreadable at research time): the target circle is 88 dp (the page's own edge threshold) and the background circle 2.5 times the target (`low`); appear over `--md1-duration-enter`, interaction and dismiss over `--md1-duration-leave`; title and body are Title 20 sp white and Subheading 16 sp white 70% (`low`).
- Limits: swipe to dismiss is not shipped (gesture); the guided flow (tap target, then `Md1Ripple`s on the following steps, then an `Md1Snackbar` completion message with an action back to the origin) is a documented composition; hint text is `Md1TextField placeholder`; one prompt per session and the targeting rules are the consumer's.

### Md1Icon

`svg.md1-icon[viewBox="0 0 24 24"][fill=currentColor]` > `path` per entry. `name` (a role; aliases resolve through `createTokens`), `label` (`role="img"` + `aria-label`; without it `aria-hidden="true"`), `size: 'm' | 's'` (`'m'` 24 px, `'s'` 20 px dense), `namespace`. `data-mirror` on the 11 directional roles (plus the conditional `help`, excluded under `:lang(he)`) flips under `[dir="rtl"]`. Unknown roles render nothing and warn in dev. Opacity tiers (`--md1-icon-active`, `-inactive`, `-focused`) are applied by the host. The full role table, path data, aliases, licence text and the `README` / `LICENSE-ICONS` notice are in `spec/icons.md`; artwork is Material Icons at the pinned commit (the two post-MD1 redraws, `settings` and `account-circle`, ship master; the 3.0.2 strings are in the note).

### Md1Ripple

`span.md1-ripple[aria-hidden]` > `span.md1-ripple__wave` per press. A DS-owned `useRipple(target, { unbounded, center })` holds the wave list; the component binds `pointerdown`, `pointerup`, `pointercancel` and `keydown` (Enter, Space) through `useEventListener` and draws nothing while `useReducedMotion().isReduced` or `body[data-reduced-motion="reduce"]` (the `:active` fill stays as the non-animated pressed state).

- Values: origin at the pointer (centre on keyboard and when `center`); radius half the host's diagonal (`unbounded`: 48 dp circle); colour `--md1-pressed` (the spec's pressed overlay: 40% `#999999` light, 25% `#CCCCCC` dark); expand over `--md1-ripple-duration` (250 ms) and fade over `--md1-ripple-fade` (300 ms), both on the standard curve.
- The spec states no ripple numbers, so the timings are Vuetify 1.5's (var:342-343: `transform .25s`, `opacity .3s`, both `fast-out-slow-in`, the standard curve); they do not follow the device duration scale. Hosts never expose a `ripple` prop (ruling 8). Exported so consumers composing a v0 primitive through the escape hatch can add ink.

## Theme and tokens

`src/design-system.ts` is the dictionary; `src/colors.ts` holds the two flat theme maps; the adapter publishes everything as `--md1-*` custom properties and `-channels` triplets. Numbers come from `spec/color.md`, `spec/typography.md`, `spec/elevation.md`, `spec/motion.md`, `spec/layout.md`, `spec/iconography.md`.

### Palette

`--md1-<hue>-<shade>` for the 19 hues x (50..900 + A100..A700 where they exist) plus `--md1-black` and `--md1-white`: 256 values, imported from `@vuetify/v0/palettes/md1` (verified 256 / 256 identical to the spec page and to Vuetify 1.5, `spec/color.md` 1.1), not copied. Emitted on `:root` as foundations. The recommended text colour per swatch (black or white) is exported as `md1PaletteInk` for consumers picking a custom primary; the six swatches contested between the 2016 and 2018 pages follow 2018.

### Roles

| Token | Rule | Light | Dark |
|---|---|---|---|
| `--md1-primary` | the primary hue's 500 | Indigo 500 `#3F51B5` | same |
| `--md1-primary-dark` | 700 (status bar, pressed raised button) | Indigo 700 `#303F9F` | same |
| `--md1-primary-light` | 100 (related information under a primary region: the `Md1Toolbar.Extension` fill for related content under a `primary` bar; the light theme's `--v0-surface-tint` bridge value, see The v0 bridge). Primary ink on dark surfaces stays the 500 (Lead decision 12, reverted) | Indigo 100 `#C5CAE9` | same |
| `--md1-accent` | the accent hue's A200 (FAB, flat and raised action buttons, text fields, selection, links) | Pink A200 `#FF4081` | same |
| `--md1-accent-light` | the accent hue's 50, the data tables page's contextual header ("the 50-value of the secondary app color"); its only reader is `Md1DataTable.Contextual`. The colour page's lighter and darker contrast fallbacks (A100, A400) are not role tokens (no component reads them, ruling 5); they stay reachable as the palette values `--md1-<hue>-a100` and `--md1-<hue>-a400` | Pink 50 `#FCE4EC` | same |
| `--md1-accent-control` | the switch, the slider and the picker ink: the accent in light, the accent hue's 200 in dark (selection-controls and pickers pages) | `#FF4081` | Pink 200 `#F48FB1` |
| `--md1-on-primary`, `--md1-on-accent` | 100% white on coloured backgrounds; black for the swatches the palette marks dark | `#FFFFFF` | same |
| `--md1-error` | Red A400 (text fields error line, stepper error step) | `#FF1744` | same |
| `--md1-app-bar` | theme figure | Grey 100 `#F5F5F5` | Grey 900 `#212121` |
| `--md1-background` | theme figure | Grey 50 `#FAFAFA` | `#303030` (not a palette value) |
| `--md1-surface` | cards, dialogs, sheets, menus, drawers | White `#FFFFFF` | Grey 800 `#424242` |

The default theme is the spec's own worked example (Indigo primary, Pink accent, `spec/color.md` 2.1). Consumers pass another hue set through `createMd1Plugin({ theme: { themes } })`; `md1HueTheme(primary, accent)` derives the 500 / 700 / 100 / A200 / 50 set from the palette for any of the 16 accent-bearing hues.

### Ink and state

| Token | Light | Dark | Source |
|---|---|---|---|
| `--md1-text-primary` | black 87% | white 100% | colour page |
| `--md1-text-secondary` | 54% | 70% | colour page |
| `--md1-text-disabled`, `--md1-text-hint` | 38% | 50% | colour page |
| `--md1-placeholder` | black 42% | white 50% | text-fields page (placeholder, autocomplete suggestion) |
| `--md1-divider` | black 12% | white 12% | colour page |
| `--md1-icon-active` / `-inactive` / `-focused` | 54% / 38% / 87% | 100% / 50% / 100% | icons page; dark active 100%, Lead decision 13 |
| `--md1-focus` | black 12% | white 12% | buttons page |
| `--md1-pressed` | `#999999` 40% | `#CCCCCC` 25% | buttons page |
| `--md1-hover` | black 6% | white 10% | the text-fields page's box fill (high) and the selection-control halo the sheets measure (`measured`); also the grid-list tile hover (a decision: Vuetify 1.5 has no grid list). Not a family hover: see Authority order |
| `--md1-list-hover` | black 4% | white 8% | Vuetify 1.5's list-tile hover (th:51-52, 145-146): lists, menus, the menu-styled selects and suggestion lists, bottom-sheet items |
| `--md1-button-disabled` | black 12% | white 12% | buttons page (raised container) |
| `--md1-button-disabled-text` | black 26% | white 30% | buttons page |
| `--md1-scrim` | Grey 900 `#212121` 46% | same | Lead decision 2: Vuetify 1.5's overlay (`moderate`) for the `::backdrop` of `Md1Dialog`, the temporary `Md1NavigationDrawer` and the `Md1DataTable` edit dialog; the dialog and drawer pages state no value |
| `--md1-scrim-sheet` | black 20% | same | bottom-sheets page, the only overlay value in MD1; the `::backdrop` of a modal `Md1BottomSheet` |
| `--md1-snackbar` / `-snackbar-text` | `#323232` / white | same | snackbars page |
| `--md1-tooltip` / `-tooltip-text` | Grey 700 at 90% / white | same | tooltips page |
| `--md1-chip` | Grey 300 `#E0E0E0` | `#555555` | image only, Vuetify value (`moderate`) |
| `--md1-grid-list-bar` | black 60% | same | decision (imagery page range) |
| `--md1-panel-focus` | Grey 200 `#EEEEEE` | `#494949` | expansion-panels page (light); Vuetify 1.5 th:155 (dark) |
| `--md1-stepper` | white | `#303030` | Vuetify 1.5's stepper sheet (`_steppers.styl:4-5`) |
| `--md1-slider-focused` | black 38% | white 30% | the focused inactive slider line: sliders page (light); Vuetify 1.5 th:168 (dark), which the dark sheet's 28% corroborates |
| `--md1-selection` | `--md1-accent` at 30% | same | selection page names the accent; the alpha is a decision |

### Typography

`--md1-font-family: Roboto, Noto, sans-serif`; weights light 300, regular 400, medium 500, bold 700. One token set per style: `--md1-type-<style>-size`, `-weight`, `-leading`, `-tracking`, `-transform`. Device sizes by default; `(pointer: fine)` switches subheading to 15 sp and body 2, body 1, menu to 13 sp.

| Style | Weight | Size (device / desktop) | Leading | Tracking | Opacity |
|---|---|---|---|---|---|
| display-4 | Light | 112 | single line | -10 (ships -0.04em) | 54% |
| display-3 | Regular | 56 | single line (ships 1.35) | -5 (ships -0.02em) | 54% |
| display-2 | Regular | 45 | 48 | 0 | 54% |
| display-1 | Regular | 34 | 40 | 0 | 54% |
| headline | Regular | 24 | 32 | 0 | 87% |
| title | Medium | 20 | single line | 5 (ships 0.02em) | 87% |
| subheading | Regular | 16 / 15 | 24 | 10 | 87% |
| subheading-2 | Regular | 16 / 15 | 28 | 10 | 87% |
| body-2 | Medium | 14 / 13 | 24 | 10 | 87% |
| body-1 | Regular | 14 / 13 | 20 | 10 | 87% |
| caption | Regular | 12 | single line | 20 | 54% |
| button | Medium, uppercase | 14 | single line | 10 | 87% |
| menu | Medium | 14 / 13 | single line | 10 | 87% (metrics `low`: the archived scale image omits Menu) |

Decisions: single-line styles get `line-height: 1`, except Display 3, which takes Vuetify 1.5's 1.35 (var:101); tracking numbers are Adobe units at 1/1000 em (`10` is `0.01em`), the unit being `low`, except Display 4, Display 3 and Title, which take Vuetify 1.5's -0.04em, -0.02em and 0.02em (var:100-105; Vuetify sets no tracking on the other styles, and its `normal` would contradict the page's non-zero numbers, so they keep the 1/1000 em reading); dense scripts (`:lang(ja), :lang(ko), :lang(zh)`) add 1 sp from title down and use the dense leading column; tall scripts (`:lang(ar), :lang(hi), :lang(th), :lang(vi)` and the rest of the page's list) use Regular and Bold only with the tall leading column; the font stack adds `"Noto Sans CJK"` and `"Noto Sans"` for those languages. Contrast floor 4.5:1, preferred 7:1.

### Elevation

`--md1-elevation-0` to `--md1-elevation-24`: the three-layer `box-shadow` values (umbra `--md1-shadow-umbra` `rgba(0,0,0,.2)`, penumbra `.14`, ambient `.12`), the recipe tabulated in `spec/elevation.md` (Vuetify 1.5's `_elevations.styl`, the only pixel recipe; the spec gives dp only). Transition `box-shadow 280ms` on the standard curve: a fixed literal shared by the `md1-elevation-*` utilities and the raised button (Vuetify 1.5's `elevationTransition`, `moderate`), with no duration token behind it; it does not follow the desktop duration scale, which covers the colour and movement transitions only. The dark theme keeps the same shadows (the spec's dark theme is surfaces, not lights). Component resting values are the spec's: dialog and picker 24, drawers and modal bottom sheet 16, FAB 6 (12 pressed), sub menu 9, menu 8, bottom navigation 8, snackbar 6, app bar 4, refresh indicator 3, search bar 2 (3 scrolled), card and raised button 2 (8 raised), switch 1; under `pointer: fine` every resting value drops 2 dp (raised button 0, 2 on hover and press).

### Motion

| Token | Value |
|---|---|
| `--md1-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--md1-easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--md1-easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--md1-easing-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` |
| `--md1-duration-enter` / `-leave` / `-standard` / `-complex` | 225 / 195 / 300 / 375 ms; x1.3 at `(min-width: 600px) and (pointer: coarse)` (tablet); 150 / 150 / 200 / 200 ms under `pointer: fine` (desktop) |
| `--md1-stagger` | 20 ms (the `Md1List` and `Md1GridList` entrance sequences) |
| `--md1-ripple-duration` | `var(--md1-duration-standard)` (read by `Md1Ripple`) |

Vuetify's `swing` and `fast-in-fast-out` curves are not Material Design 1 curves.

### Layout

`--md1-spacing-1..5` (8, 16, 24, 32, 40 px); `--md1-keyline-margin` (16 px, 24 px from 600 px); `--md1-keyline-content` (72 px, 80 px from 600 px); `--md1-increment` (56 px, 64 px from 600 px); `--md1-touch-target` (48 px); `--md1-radius` (2 px), `--md1-radius-box` (4 px); `--md1-icon-size` (24 px, 20 px in dense hosts). Breakpoints cannot be custom properties: they ship as the documented 13-row table and as `md1Breakpoints`, the documented dp table in JS (480, 600, 840, 960, 1280, 1440, 1600, 1920, keyed by the nominal width, with the 16 px desktop reduction on 1024 and above). v0's `useBreakpoints` has its own named breakpoints and takes no Material Design 1 input; consumers map the table onto those names themselves when a layout needs the spec's widths. The responsive-ui gutter (16 px, 24 px from 960 px) is not a token: no component reads it (`Md1GridList` has its own `gutter` prop, ruling 5); the documented value lives in `spec/layout.md`.

### Theme definitions

`md1Colors` (light) and `md1DarkColors` (`satisfies Record<keyof typeof md1Colors, string>`) hold every role, ink, state and surface token above; `createMd1Plugin` registers them as `md1-light` and `md1-dark`. Scoped dark surfaces use v0's `Theme` component (`<Theme theme="md1-dark">`), which the adapter honours through `[data-theme="md1-dark"]`.

### The v0 bridge

The adapter also emits, on both theme blocks: `--v0-primary`, `--v0-on-primary`, `--v0-secondary` (= accent), `--v0-on-secondary`, `--v0-surface`, `--v0-on-surface` (= text-primary), `--v0-surface-variant` (= app-bar), `--v0-on-surface-variant` (= text-secondary), `--v0-surface-tint` (= `surface-tint`, a bridge-only key on the hue roles: the primary hue's 100 in the light theme, Indigo 100 `#C5CAE9`, and its 700 in the dark theme, Indigo 700 `#303F9F`, so kit code chips and table headers keep their contrast under white ink), `--v0-background`, `--v0-on-background`, `--v0-divider`, `--v0-border` (= divider), `--v0-pre` (= app-bar), `--v0-accent` (= accent) and `--v0-on-accent` (= on-accent; Genesis `GnDocsCallout` reads `--v0-accent` and would paint its purple fallback without it), `--v0-error` / `--v0-on-error`, and the kit severities `--v0-info` Blue 500 `#2196F3`, `--v0-success` Green 500 `#4CAF50`, `--v0-warning` Orange 600 `#FB8C00` with `--v0-on-info` / `--v0-on-success` / `--v0-on-warning` white (Vuetify 1.5's kit ink, `text.theme: white`, not the palette's recommendation: the colour page marks Green 500 and Orange 600 as black-ink swatches, and Blue 500 black on the 2018 page and white on the 2016 page, one of the six contested cells in `spec/color.md` 1.2) (bridge-only values from Vuetify 1.5's theme defaults, `moderate`; MD1 defines no such roles and Material Design 1 components never read them). The same keys go in the `V0_ALIAS_KEYS` / `V0_REMAP_KEYS` tables (`spec/house-style.md` 1.6 and 1.7). `{ v0Aliases: false }` turns the bridge off.

### Prebaked theme.css

`scripts/bake-theme.ts` writes `dist/theme.css`: foundations on `:root`, the light block on `[data-theme="md1-light"]` and `:root`, the dark block on `[data-theme="md1-dark"]`, `color-scheme` for both, every colour also as `-channels`. The bake throws on sanitizer hits, empty blocks and light / dark key drift. `theme.css` is kept in `package.json#exports` through `customExports` (see `spec/house-style.md` 1.6).

## Typography and elevation utilities

`style.css` ships two utility families and nothing else outside component classes:

- `.md1-type-<style>` for the 13 styles above (`md1-type-display-4` ... `md1-type-menu`): font family, size, weight, leading, tracking, case and the style's ink opacity, with the desktop and script switches built in.
- `.md1-elevation-<n>` for `n` 0 to 24: `box-shadow: var(--md1-elevation-<n>)` plus the elevation transition.

Both exist so the escape hatch composition renders in the system's type and depth without copying tokens. No spacing, colour or layout utilities ship. This is a declared deviation from ruling 3 (no utility classes in package source), listed below; if the lead rejects it, this section is deleted and the escape hatch points at the `--md1-type-*` and `--md1-elevation-*` tokens (open question 11).

## Deviations from DESIGN_SYSTEMS.md

| Deviation | Reason |
|---|---|
| DS-owned headless cores for `Md1DatePicker` and `Md1TimePicker` | v0's `createDatePicker` and `createTimePicker` are `draft` entries in `maturity.json` with no source and no export (`spec/v0-map.md`). Spec-in still ships (Emerald `EmCalendar` precedent); both graduate to v0 when the composables land |
| DS-owned headless `useRipple` | v0 has no ink primitive (zero matches for `ripple` in `packages/0/src`); the composable holds state only and the component binds the events, per the house rule |
| DS-owned non-modal surfaces (persistent and permanent drawers, persistent bottom sheet) | no v0 compound covers a non-modal sheet; built on `Atom`, `Portal` and `Collapsible` |
| `Md1Checkbox` `indeterminate` | extra-spec under ruling 7, declared here: MD1 has no mixed state, `Md1DataTable` select-all needs one and v0 provides it |
| `Md1ProgressCircular` `size` | the spec draws one size (about 40 dp); a numeric prop is a rendering knob for the FAB ring and the refresh indicator, not a spec variant |
| 38 utility classes (`md1-type-*`, `md1-elevation-*`) in `style.css` | the escape hatch (ruling 7) needs the type scale and depth without copying 13 x 5 tokens; no other utilities ship, so ruling 3 otherwise holds |
| Inline SVG geometry in `Md1ProgressCircular` and `Md1TimePicker` | the arc and the clock are drawings parameterised at runtime (`stroke-dasharray`, hand angle), not glyphs a consumer rebrands; every glyph still routes through `Md1Icon` (ruling 6) |

Everything else follows the contract: tokens on `theme.ts` through a `V0StyleSheetThemeAdapter` subclass; `dist/theme.css` prebaked; v0 compounds for behaviour and `Atom` for presentation; no native form controls (the text field's editable element is v0's `Input.Control`); unscoped styles; `data-*` state; own icon set through `createTokens`; installable without Vuetify; wrappable (every non-spec Vuetify prop is the wrapper's to translate).

## Known limitations

- **Pickers are DS-owned.** `Md1DatePicker` and `Md1TimePicker` carry their own cores until v0 ships the composables; min, max, disabled dates and ranges are not in MD1 and do not ship.
- **Native `<dialog>` versus the global `Scrim`.** Material Design 1 paints `::backdrop`; an app that also mounts v0's `<Scrim>` paints a second backdrop (#910).
- **Gestures.** Swipe to dismiss (cards, snackbars, bottom sheets, list leave-behinds), pick-up-and-move (cards, lists), swipe to refresh and edge-swipe drawer opening are not shipped; every one has a button, keyboard or scrim path. Tab panels change on tab activation; panel swipe is deferred.
- **Menus.** The simple-menu rule that aligns the selected item over the emitting element is not implemented; menus open below the activator. The desktop "More" dropdown for overflowing tabs is deferred in favour of pagination arrows.
- **Editable segmented dropdown button.** Definition only in the spec; deferred as an `Md1TextField` + `Md1DropdownButton` composition.
- **Values the spec never states**, filled by Vuetify 1.5's styling (Authority order) and tagged with its `file:line` in the component sections: hover overlays per component, scrim alpha, card, menu and tooltip radius, tooltip elevation and delays, chip fill, focus and icon gap, snackbar timeout, ripple timing, mini drawer width, speed-dial spacing and fill, expansion-panel elevations, dialog desktop width and body ink, toggle-button group, tab colours on surface bars, the stepper sheet, the floating toolbar, control-to-label gap, indeterminate cycle durations, the circular track, display and title tracking. Material Design 1 decisions remain only where Vuetify 1.5 has no equivalent: the grid-list bar scrim, the speed-dial labels, the long-press threshold, the stepper mobile bar, the feature-discovery geometry, the selection alpha, the card selection scrim. None is `high`.
- **Contrast shortfalls, MD1-faithful.** These gap values come from Vuetify 1.5 and miss the 4.5:1 text floor (or the 3:1 non-text floor); they ship as Vuetify rendered them. Primary 500 ink on dark surfaces (Lead decision 12, reverted): Indigo 500 on Grey 800 is about 1.5:1 (the `primary` `Md1Subheader`, the current item and open group of `Md1List`, the current destination of `Md1NavigationDrawer`, the active action of the surface `Md1BottomNavigation`). White digits on the dark slider pin (Pink 200) are about 2.2:1. The circular determinate track, black 10%, nearly vanishes on the dark theme. Unselected `Md1ToggleButtons` items at 40% opacity read at about 2.4:1 (light) and 3.1:1 (dark). Inactive surface tabs at about 61% black pass (about 5.9:1); disabled tabs at 26% / 30% are exempt as disabled. The 4% / 8% list hover and the 6% stepper hover are fainter state layers than the 6% / 10% they replace.
- **Measured geometry.** Selection controls, sliders, pickers, progress thickness and the snackbar line pitch come from the spec's own artwork at 2 px per dp (`measured`), not from text.
- **Text selection highlight.** `style.css` ships no `::selection` rule. The selection page's accent highlight covers every selectable text on the page, which a package stylesheet reaches only with a global rule, and the docs app loads `style.css` on every page; a rule scoped to Material Design 1 parts would give one page two highlight colours. The app sets it on its root, `::selection { background: var(--md1-selection); color: var(--md1-text-primary) }`, the recipe on the selection docs page.
- **List reorder handle.** `Md1List` ships no `reorder` handle: no keyboard move-up and move-down and no live region, and pick-up-and-move is a gesture (above). An app that reorders a list puts its own buttons in `Md1List.Action` and keeps the order in its state, for example v0's `createSortable`.
- **Desktop and dense mapping.** `(pointer: fine)` stands in for the spec's "mouse and keyboard"; a touch laptop gets device metrics. There is no runtime override in v1.
- **Vuetify 1.5 disagreements** with the spec (switch thumb 4 dp, bottom navigation single-layer shadow, bottom sheet at 24 dp, 300 px drawer, 64 dp "prominent", swing and fast-in-fast-out curves and their 0.3 / 0.4 s durations on dialogs, menus and snackbars, 7 px progress bar, 290 px picker, 42 px snackbar gap, 22 px dense list icons, the 300 px toolbar scroll threshold, the 20 px-only extended title, the 34 px selection-control ripple, the uncarded floating drawer, the raised button's white focus overlay, the accent A200 picker ink on dark) are resolved in the spec's favour; the notes list every one.
- **Bottom, floating and column toolbars.** The structure page names them and gives no metrics; `Md1Toolbar position="bottom"` and `floating` ship with the app bar heights, and `floating` with Vuetify 1.5's floating toolbar (own elevation, square, 16 px margin); the bottom toolbar shelf is an `Md1BottomSheet persistent` composition, not a component. `Md1BottomNavigation` is the bar for destinations.
- **Status bar.** The theme figure's status-bar colour (Grey 300 light, Black dark; the primary's 700 under a primary app bar) is not a token: a browser has no status bar and no component reads it (ruling 5). Consumers set `<meta name="theme-color">` themselves.
- **Feature discovery geometry.** The page states the edge rules and the 96% background and nothing about circle sizes or type; `Md1FeatureDiscovery` fills them with `low` decisions until the figures can be read.
- **Docs and release.** The first npm publish of a new scoped package is manual (`spec/house-style.md` 6).

## Lead decisions

The eleven questions the synthesis raised, answered by the lead on 2026-10-22, and the rulings the lead added after the integration sweeps (rows 12 and 13, 2026-10-23). Each answer is binding for the implementation; each is tagged with the confidence of its basis. On 2026-10-24 the Authority order superseded rows 3, 4 and 12 where the spec is silent; they stay here with the Vuetify 1.5 value that replaced them.

| # | Question | Decision | Basis |
|---|---|---|---|
| 1 | Default app bar colour | `Md1Toolbar` defaults to `variant="primary"` when `appBar` is set (status-bar 700 is not emitted, see Known limitations); a plain toolbar (`appBar` unset) defaults to `surface` | the colour page: large areas take the primary colour; every app-bar figure on the toolbars page is primary 500 (`high`) |
| 2 | Scrim alpha | two tokens: `--md1-scrim-sheet` = black 20% for `Md1BottomSheet` (the only stated value); `--md1-scrim` = `#212121` at 46% for `Md1Dialog` and the temporary `Md1NavigationDrawer` | bottom sheets page (`high`); Vuetify 1.5 `_overlay.styl` (`moderate`, declared decision) |
| 3 | Hover overlay | **Superseded.** Each component takes Vuetify 1.5's own hover: 12% `currentColor` on buttons, toggle buttons, bottom navigation (inactive actions) and picker days (`_buttons.styl:54,62-72`), black 12% on the year list (`_date-picker-years.styl:22-23`), 4% / 8% on lists, menus and their rows (th:51-52, 145-146, `--md1-list-hover`), 6% of the foreground on steppers in both themes (`_steppers.styl:27-28`, the steppers page's light value), none on chips and tabs. The buttons page's 12% focus and the raised button's 2 dp desktop lift stand; grid-list tiles keep 6% (no Vuetify equivalent) | Vuetify 1.5 (`moderate`); steppers and buttons pages (`high`) where they speak |
| 4 | Expanded expansion panel elevation | **Superseded.** 3 dp over a 1 dp group (`_expansion-panel.styl:34,75-80`); the 16 dp detachment stays, the page's figure | Vuetify 1.5 (`moderate`); expansion-panels figure (`high`) |
| 5 | `Md1SearchBar` | ships as a component; the expandable mode stays the `Search` part of `Md1Toolbar`; one Combobox core | rulings note judgment call 1, confirmed |
| 6 | Speed dial | stays on `Md1Fab` as `Action` children; no `Md1SpeedDial` | the FAB page treats it as a FAB transition |
| 7 | `dense` prop beside `(pointer: fine)` | confirmed as specified; no plugin-level device-class override in v1 | the three spec axes map once each (Units and device classes) |
| 8 | Snackbar timeout | 6000 ms default (`timeout` prop) | Vuetify 1.5 (`moderate`); MD1 states no duration |
| 9 | Material Icons artwork | master commit `49d4db35` ships as pinned; the two post-MD1 redraws stay | upstream parity over period fidelity |
| 10 | Persistent-drawer breakpoint | `type` is explicit; no default mapping in the plugin; the docs page shows the `useBreakpoints` composition (temporary under 600, persistent under 1280, permanent above) as the recommended recipe | the pattern page gives no pixel values |
| 11 | Utility classes | the 38 `md1-type-*` and `md1-elevation-*` classes ship in `style.css` as the declared deviation | the MD1 type scale is a set of named styles; the escape hatch needs them |
| 12 | Primary ink on dark surfaces | **Reverted.** Primary-coloured ink keeps the primary 500 on a dark surface, as Vuetify 1.5 renders it (the primary is applied by class and the dark theme leaves it alone; the captures show `rgb(24, 103, 192)` on dark): the `primary` `Md1Subheader`, the current item and the open group title of `Md1List`, the current destination of `Md1NavigationDrawer`, the active action of the surface `Md1BottomNavigation`. The resulting 1.5:1 is listed under Known limitations | Vuetify 1.5 (`moderate`); MD1 states no dark-theme primary ink |
| 13 | Dark active icon opacity | `--md1-icon-active` stays at 100% white on the dark theme (inactive 50%, focused 100%); the icons page's state table gives 70% for an active, unfocused icon, the rejected reading: 70% is the dark secondary-text value, so the cell is likely a transcription of that | the icons page's Color section and the 2016 and 2018 colour pages (`high`); Vuetify 1.5's `$material-dark.icons` active `#fff` agrees as a numeric cross-check (`moderate`) |

## Open rulings

What the integration and the docs sweeps of 2026-10-23 left open. Each line says what ships today and what is still undecided or still to do. Docs-shell items are tracked with the docs app, not here.

### Rulings

- **Text field tile heights.** Ships 72 dp plain and 84 dp with a helper, error or counter row, and the box keeps the 1 dp idle line under its fill; undecided: the page's 80 dp (error) and 88 dp (counter), and whether the box drops the line.
- **Selection-control halo.** Ships the 48 dp focus halo under every pointer and hides the press ripple under `pointer: fine`; the halo itself is measured from the page's sheets, so it is not replaced by Vuetify 1.5's 34 px ripple; undecided: whether desktop keeps the focus halo, which the `Md1Checkbox, Md1Radio, Md1Switch` section says is drawn only under `pointer: coarse`.
- **`--md1-accent-control`.** Ships the accent hue's 200 in dark for the switch, the slider and the pickers; the `Md1List` check mark and the `Md1DataTable` row checkbox follow `Md1Checkbox` in the accent (the checkbox stays Swatch 500 on dark, and Vuetify 1.5's `selectable.js:22` agrees); undecided: the Roles wording.
- **`Md1IconToggle` ink.** Ships off at `--md1-icon-inactive` (38% / 50%) and on at `--md1-icon-active`; undecided: whether the icons page's "inactive" means disabled, which would draw off at the active ink and leave the state to the glyph.
- **Chip delete anatomy.** Ships a `Button.Root` delete on a text chip and a `span` glyph inside the chip's button on a pressable or contact chip (buttons cannot nest), with `Addresses` teleported into an outlet beside the chip; undecided: whether that replaces the `button.md1-chip__delete` anatomy in the `Md1Chip` section.
- **`Md1ProgressLinear` exit.** Ships the enter animation only: the bar unmounts at once when the consumer's `v-if` drops it, so the 195 ms exit in the `Md1ProgressLinear` section never runs; undecided: an `active` model or a consumer transition.
- **Snackbar timeout.** Ships `timeout` (6000 ms) on `Md1Snackbar` for `v-model` and on `Md1Snackbar.Queue` for queued notifications, where a `send()` timeout wins; undecided: which part owns it.
- **Snackbar stacked action.** Ships the 112 dp stacked row when `multiline` is set and the action is wider than 128 px; undecided: whether it stays measured or becomes a prop.
- **Bottom-sheet 16:9 keyline.** Ships the initial height capped at the viewport width x 9 / 16, the keyline read as a height from the bottom edge, never over the app bar; undecided: whether the keyline is measured from the top of the screen instead.
- **Desktop menu metrics.** Ships the desktop rows (32 px, 15 px type, the 64 px width unit) on `Md1Menu` and `Md1DropdownButton` through a `desktop` prop, while the `Md1TextField` dropdown and the `Md1Autocomplete` list keep 48 dp rows under every pointer; undecided: one rule for all three, by prop or by `(pointer: fine)`.
- **DS-owned date and time headless.** Ships `createDatePickerCore`, `toIso`, `useClock`, `parseTime` and `formatTime` as public exports because v0's `createDatePicker` and `createTimePicker` are not on master yet; undecided: their public names, which may change when Material Design 1 migrates.
- **`Md1Stepper` mobile bar on dark.** Ships the Grey 900 bar with the active dot in the primary 500 (about 2.3:1) and a 30% primary progress track that barely shows; Vuetify 1.5 has no mobile bar to take a value from; undecided: an accent 200 or primary 100 rule, as for the pickers.

### Token gaps

- **Input line.** Ships the 42% black / 70% white line in `Md1TextField`, the `Md1DataTable` edit field and the `Md1Slider` value field, derived from the `--md1-text-primary` channel (`0.42 + 0.28 * r / 255`); `--md1-hover` times seven drifted to 41% / 71% and is no longer used; undecided: a `--md1-input-line` pair.
- **Switch.** Ships no switch role tokens; the dark track and thumb values sit under `[data-theme='md1-dark']` selectors, so a light region nested in a dark one keeps them; undecided: switch tokens.
- **Chip.** Ships the full-pill radius (16 px) and the 13 sp label as literals; undecided: chip tokens.
- **Bottom toolbar shadow.** Ships `Md1Toolbar position="bottom"` with the toolbar's downward 4 dp shadow; undecided: an upward elevation.

### Component follow-ups

- **`Md1Icon` in RTL.** Ships `data-mirror` flipping under a `[dir='rtl']` ancestor, so an LTR island inside an RTL page still mirrors; open: `:dir(rtl)`.
- **`Md1Card.Media` loading.** Ships the exposure step on `brightness`, with the load phases not staggered; open: contrast for exposure and staggered phases.
- **`Md1GridList.Tile` loading.** Ships the fade and saturation steps with no exposure phase (CSS has no gamma filter); open: an exposure approximation.
- **`Md1TextField` counter.** Ships counter fields at 84 dp; open: the page's extra 16 dp (see the tile-height ruling).
- **`Md1List.Action`.** Ships an icon-only `Md1Button` there in the icon-only button's 87% text ink; open: the list's 54% icon ink.
- **`Md1List` current text.** Ships the current item's primary colour on `__primary` and `__icon` only, so bare text in `__body` keeps the text ink outside `Md1NavigationDrawer`; open: colouring `__body`.
- **Icon-only `Md1Button`.** Ships Vuetify 1.5's 87% / white text ink (`_buttons.styl:5-6`) where cards and toolbars expect the 54% icon ink; the data-table header and toolbar rows override it; open: the 54% default elsewhere.
- **Grey flat `Md1Button`.** Ships no grey flat variant for the expansion panel's CANCEL; open: the variant.
- **Glyph roles.** Ships no volume or brightness roles (`offline-pin`, `cloud-off`, `feedback` and `help-outline` ship); open: those roles.
- **`Md1Dialog` around a picker.** Ships the standard action row around a picker; open: the picker action-layout metrics.
- **`Md1Toolbar.Contextual`.** Ships Escape only while focus is inside the bar, and a live-region count whose announcement timing is unsettled; open: both.
- **`Md1Stepper` completion.** Ships no announcement when the flow completes; open: a live-region message.
- **`Md1DataTable` row checkboxes.** Ships one accessible name for every row checkbox; open: a name per row.
- **Menu alignment.** Ships `Md1Menu.Content` start-aligned (`block-end span-inline-end`), flipping inline only at the viewport edge, so an overflow menu on an end-aligned app bar icon spills past any container narrower than the viewport; open: an end placement or a better flip.
- **Segmented `Md1DropdownButton`.** Ships the sheet anchored at the arrow's end and widened to the 56 dp unit with only `flip-block` to try, so near the start edge it passes the edge; open: `flip-inline` or anchoring to the root.

### Examples still on stand-ins

- **Dialog.** `simple` builds its rows from `Button.Root`, `confirmation` and `scrolling` use v0 `Radio`, and `full-screen` hand-builds its bar; open: `Md1List`, `Md1Radio` and `Md1Toolbar`.
- **Card.** The header and actions overflow buttons open nothing; open: an `Md1Menu`.
- **Tabs.** No example puts a primary tab bar inside `Md1Toolbar`; open: that example.
- **Text field.** No `picker` example; open: one.
- **FAB seam.** The example hosts the FAB on a hand-built header with `data-fab-host`; open: the `Md1Toolbar.Extension`, `Md1Card` and `Md1BottomSheet` hosts.

### Locale keys with inline English fallbacks

- **No catalogue.** Ships every key below through `useLocale().ti('Material Design 1.<key>')` with an inline English fallback, and `createMd1Plugin` registers no messages; undecided: an English catalogue in the plugin, or a published key list.
- **Text field and autocomplete:** `clear`, `optional`, `voice`, `hidePassword`, `showPassword`, `chooseDate`, `chooseTime`, `noResults`.
- **Search bar and toolbar:** `search`, `back`, `clear`, `voice`, `noResults`, `menu`, `actions`, `close`, `selectedCount`.
- **Data table:** `itemsSelected`, `selectAll`, `selectRow`, `rowsPerPage`, `pageText`, `previousPage`, `nextPage`, `edit`, `save`, `cancel`.
- **Dialog and snackbar:** `ok`, `cancel`, `discard`, `discardChanges`, `dismiss`.
- **Stepper:** `continue`, `back`, `next`, `cancel`, `optional`, `steps`, `stepCount`.
- **Pickers:** `hours`, `minutes`, `time`, `period`, `am`, `pm`, `chooseYear`, `year`, `previousMonth`, `nextMonth`.
- **Other parts:** `previousTabs` and `nextTabs` (tabs), `options` (dropdown button), `loading` and `buffered` (progress), `navigation` (drawer), `slider`, `delete` (chip), `selected` (card, grid list), `close` (bottom sheet).

### v0 upstream issues

- **`Menu.Item` activation.** v0 has no activation hook and its Enter and Space handler closes the menu without a click; ships `Md1Menu.Item` and `Md1Fab.Action` handling the two keys themselves; open upstream.
- **Renderless activators.** A renderless `Menu.Activator` or `Tooltip.Activator` gives v0 no anchor element; ships the anchor name on the slot `attrs` and `Md1Menu.Activator` returning focus by the trigger id; open upstream.
- **`Tooltip.Content` popover.** v0 opens it as `popover="auto"`, not `hint`; ships as v0 renders it; open upstream.
- **`Tour.Content`.** v0 always portals it and restores focus on complete; `Md1FeatureDiscovery` ships with both; open upstream.
- **`Toggle.Group`.** v0 ignores the model when the group is disabled at mount and puts `aria-orientation` on `role=group`; `Md1ToggleButtons` ships with both; open upstream.
- **`ClientComboboxAdapter`.** v0 filters object items on `String(value)`; `Md1Autocomplete`, `Md1SearchBar` and `Md1Toolbar.Search` ship with it; open upstream.
- **`Radio` disabled tabindex.** v0 is inconsistent about a disabled radio's tabindex; `Md1Radio` ships with it; open upstream.
- **`Combobox` `close()`.** v0 resets the query on close; `Md1Autocomplete`, `Md1SearchBar` and `Md1Toolbar.Search` ship with it; open upstream.
- **Bare boolean attributes.** v0 props typed `MaybeRefOrGetter<boolean>` (`Menu.Item`, `Checkbox.Root`, `Tabs.Item`, `Input.Root` and 19 more parts) compile to an untyped runtime prop, so a bare `disabled` arrives as `''` and does not disable; every `Md1*` part declares a plain `boolean` instead; open upstream.
