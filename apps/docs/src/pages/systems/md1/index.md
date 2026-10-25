---
title: Material Design 1 - Design System for Vue on Vuetify0
meta:
- name: description
  content: Material Design 1 is the 2014 to 2017 design system for Vue, built on Vuetify0. Tokens, light and dark themes, the Material Icons set, and Md1* components that wrap v0's headless compounds.
- name: keywords
  content: md1, material design 1, material design 2014, quantum paper, vue design system, vuetify0, paper, design tokens, md1 components, material icons
features:
  category: Guide
  label: 'Material Design 1'
  level: 2
  order: 0
related:
  - /systems/md1/button
  - /systems/md1/dialog
  - /systems/md1/icon
  - /systems/md1/color
  - /systems/md1/typography
  - /systems/md1/elevation
  - /systems/md1/motion
  - /systems/md1/layout
---

# Material Design 1

<DocsPageFeatures :frontmatter />

Material Design 1 is a design system for Vue, built on [Vuetify0](/). It ships tokens, CSS, and `Md1*` components. v0 handles behavior and accessibility. Material Design 1 handles appearance.

<DocsSystemActivator palette="md1" />

## What Material Design 1 is

Material Design 1 is the 2014 to 2017 Material Design guidelines, the language Google developed under the codename Quantum Paper. It is the older language in its own right, not a theme of the current one, and `@paper/material` stays reserved for Material Design 3. Every `Md1*` API is the spec's vocabulary rendered on v0, and nothing more. Where the guidelines say `dense`, `raised`, `mini` or `shifting`, the prop is that word.

Material Design 1 has its own tokens, its own icon set, and its own component names. Selection, focus, popovers, dialogs, and validation come from v0. Keyboard behavior does too, except the date and time pickers, whose grids live in Material Design 1 until v0 has them. A Material Design 1 component behaves like the Vuetify0 compound it wraps, so a keyboard fix in v0 reaches `Md1Dialog` without a separate Material Design 1 release.

### The pinned spec

The guidelines are archived, so the spec cannot move under the package. Material Design 1 is pinned to [m1.material.io](https://m1.material.io/), the Material Design 1 guidelines Google hosts as an archive. The archive's own changelog ends with September 2017, which dates the frozen content. The glyphs are Material Icons at commit `49d4db35`, and Vuetify 1.5.24 is used only as a numeric cross-check, never as a source of API.

Pinned means complete and exclusive. Every component, variant and state on the component pages ships, and nothing the guidelines do not contain does, even where v0 has the primitive: there is no `Md1Breadcrumbs`, no `Md1Alert`, and no `Md1Rating`. The pages with no web surface (widgets, notifications, launch screens, toasts, split screen) are listed as out, with the reason, in the package's `SPEC.md`.

### The escape hatch

A missing piece is yours to compose. Take the v0 primitive, style it with the `--md1-*` tokens and the `md1-type-*` and `md1-elevation-*` classes, and add `Md1Ripple` for the ink. The result is supported as v0 and as Material Design 1 tokens. It is not a Material Design 1 component, and the hole stays listed under the package's known limitations rather than being filled with an unspecified extra.

## Installation

::: code-group no-filename

```bash pnpm
pnpm add @paper/md1
```

```bash npm
npm install @paper/md1
```

```bash yarn
yarn add @paper/md1
```

```bash bun
bun add @paper/md1
```

:::

The plugin registers the theme adapter, the two themes, the icon set, and reduced-motion detection:

```ts main.ts
import { createApp } from 'vue'
import { createMd1Plugin } from '@paper/md1'

import '@paper/md1/theme.css'
import '@paper/md1/style.css'

import App from './App.vue'

createApp(App)
  .use(createMd1Plugin())
  .mount('#app')
```

Use `createMd1Plugin()`. It constructs `Md1StyleSheetAdapter` for you, registers `md1-light` as the default, and follows the operating system into `md1-dark` until you call `useTheme().select`.

Three options turn parts of that setup off. Each key also accepts that plugin's own options when you want to configure it rather than skip it.

| Option | Effect |
|--------|--------|
| `{ theme: false }` | Skips the theme plugin. Use this when the app already calls `createThemePlugin` and will attach `Md1StyleSheetAdapter`, `md1Colors` and `md1DarkColors` itself |
| `{ icons: false }` | Skips installing the icon registry on the app. `Md1Icon` still draws from the built-in set[^icons-bundle] |
| `{ reducedMotion: false }` | Skips `createReducedMotionPlugin`. Use this when the host installs it itself. `Md1Ripple` reads it; with no plugin installed, `Md1Ripple` follows the operating system's `prefers-reduced-motion` setting, and the CSS stays gated on it either way |

[^icons-bundle]: `{ icons: false }` skips installation. It does not remove the glyph map from the bundle, because the plugin entry imports that map statically. Components that draw a glyph import `Md1Icon`, so an app using Material Design 1 controls already includes the map. To leave the map out, call `createMd1IconsPlugin` yourself and skip `createMd1Plugin`.

### Without the plugin

`theme.css` sets the light theme on `:root` and on `[data-theme="md1-light"]`. Importing the stylesheets is enough for an app that only uses the light theme:

```ts main.ts
import '@paper/md1/theme.css'
import '@paper/md1/style.css'
```

Dark mode is opt-in either way. Set `data-theme="md1-dark"` on an element and the `--md1-*` colors inside it switch to the dark surfaces and ink. Light stays the default. The attribute works on `<html>` or on a smaller subtree, such as a drawer.

## Tokens

Visual values are CSS custom properties named `--md1-*`, generated from `colors.ts` and `design-system.ts`. Colors, ink, state overlays and the elevation and shadow tokens sit on the theme attribute. The palette, spacing, keylines, radius, type and motion sit on `:root`.

| Family | Examples |
|--------|---------|
| Palette | `--md1-indigo-500`, `--md1-grey-50`, `--md1-black`, `--md1-white`: the 2014 palette, 19 hues by 50 to 900 plus the A100 to A700 accents, from `@vuetify/v0/palettes/md1` |
| Roles | `--md1-primary`, `--md1-primary-dark`, `--md1-primary-light`, `--md1-accent`, `--md1-accent-light`, `--md1-accent-control`, `--md1-on-primary`, `--md1-error`, `--md1-app-bar`, `--md1-background`, `--md1-surface` |
| Ink and state | `--md1-text-primary`, `--md1-text-secondary`, `--md1-text-disabled`, `--md1-divider`, `--md1-icon-active`, `--md1-focus`, `--md1-pressed`, `--md1-hover`, `--md1-scrim` |
| Typography | `--md1-font-family`, `--md1-type-title-size`, `--md1-type-body-1-leading`, `--md1-type-button-weight`, `--md1-type-button-transform` |
| Elevation | `--md1-elevation-0` to `--md1-elevation-24`, `--md1-shadow-umbra` |
| Motion | `--md1-duration-standard`, `--md1-duration-enter`, `--md1-easing-decelerate`, `--md1-stagger`, `--md1-ripple-duration` |
| Layout | `--md1-spacing-1` to `--md1-spacing-5`, `--md1-keyline-margin`, `--md1-keyline-content`, `--md1-increment`, `--md1-touch-target`, `--md1-radius`, `--md1-icon-size` |

The [Color](/systems/md1/color), [Typography](/systems/md1/typography), [Elevation](/systems/md1/elevation), [Motion](/systems/md1/motion) and [Layout](/systems/md1/layout) guides list every token in each family.

Each color is emitted as its value and as space-separated RGB channels. Use `--md1-primary-channels` in `rgb(... / 0.4)` when you need a translucent overlay. The ink tokens are already translucent: black at 87%, 54%, 38% and 12% on the light theme, white at 100%, 70%, 50% and 12% on the dark one.

Breakpoints are not custom properties. They ship as `md1Breakpoints`, the documented dp table in JS: 480, 600, 840, 960, 1280, 1440, 1600 and 1920, keyed by the nominal width, with the 16 px desktop reduction on 1280 and above (the 1024 row, 1008 px effective, is in the documented table only). Vuetify0's `useBreakpoints` has its own named breakpoints and takes no Material Design 1 input, so map the table onto those names yourself when a layout needs the spec's widths.

### The v0 bridge

Material Design 1 also writes its color roles onto the `--v0-*` names that Vuetify0 kits read, so a kit written against those names picks up Material Design 1's colors.

Most names match: `--v0-primary` copies `--md1-primary` and `--v0-background` copies `--md1-background`. The rest are translations into the kit vocabulary. `--v0-secondary` and `--v0-accent` read the accent, `--v0-surface-variant` and `--v0-pre` read the app bar color, `--v0-surface-tint` reads a bridge-only tint (the primary's 100 on the light theme, its 700 on the dark one, so code chips and table headers keep their contrast under white ink), `--v0-on-surface` reads the primary ink, `--v0-on-surface-variant` the secondary ink, and `--v0-border` the divider. Material Design 1 defines no info, success or warning roles, so the bridge supplies the Vuetify 1.5 defaults (Blue 500, Green 500, Orange 600) for `--v0-info`, `--v0-success` and `--v0-warning`; no Material Design 1 component reads them.[^bridge-severities]

Pass `{ v0Aliases: false }` to the adapter to skip the `--v0-*` names.

## Icons

Icons are named by role. Ask for `menu`, `search` or `close`; the glyph is inline SVG on the 24 dp grid, filled, so there is no icon font and no sprite sheet to load. The set has 80 glyphs and 107 names. 27 names are aliases: `clear` draws the `close` glyph and `calendar` draws `event`, and overriding a role moves every alias with it.

```vue
<template>
  <Md1Icon name="menu" />

  <Md1Icon label="Open navigation" name="menu" />
</template>
```

Icons are decorative by default and hidden from assistive technology. Pass `label` when an icon should be announced. The 11 directional roles (the back and forward arrows, arrow-right, the left and right chevrons, first and last page, send, sort, open-in-new and label) mirror under `dir="rtl"`; `help` mirrors except in Hebrew. Glyphs that represent time, physical objects or the search handle do not. Roles, aliases, mirroring and the accessibility rules are on the [Md1Icon page](/systems/md1/icon).

The artwork is Material Icons at commit `49d4db35`[^icons-commit], used under the Apache License 2.0; the package ships the notice as `LICENSE-ICONS`. The Vue package is MIT.

## Components

Every component below is exported from `@paper/md1` and has its own page. The second column is the Material Design 1 page it implements, on the archived guidelines; the third is the Vuetify0 feature it is built on. Two rules apply to all of them.

| Component | MD1 page | Composes | Page |
|-----------|----------|----------|------|
| `Md1Autocomplete` | [Text fields](https://m1.material.io/components/text-fields.html) | v0 [Combobox](/components/forms/combobox) + the `Md1TextField` anatomy; [Md1Chip](/systems/md1/chip) under `multiple` | [Autocomplete](/systems/md1/autocomplete) |
| `Md1BottomNavigation` | [Bottom navigation](https://m1.material.io/components/bottom-navigation.html) | v0 [createSingle](/composables/selection/create-single) + [useProxyModel](/composables/reactivity/use-proxy-model) + [Button](/components/actions/button) | [Bottom navigation](/systems/md1/bottom-navigation) |
| `Md1BottomSheet` | [Bottom sheets](https://m1.material.io/components/bottom-sheets.html) | v0 [Dialog](/components/disclosure/dialog); [Portal](/components/primitives/portal) + [Collapsible](/components/disclosure/collapsible) when persistent | [Bottom sheet](/systems/md1/bottom-sheet) |
| `Md1Button` | [Buttons](https://m1.material.io/components/buttons.html) | v0 [Button](/components/actions/button) | [Button](/systems/md1/button) |
| `Md1Card` | [Cards](https://m1.material.io/components/cards.html) | v0 [Atom](/components/primitives/atom) + [Collapsible](/components/disclosure/collapsible) | [Card](/systems/md1/card) |
| `Md1Checkbox` | [Selection controls](https://m1.material.io/components/selection-controls.html) | v0 [Checkbox](/components/forms/checkbox) | [Checkbox](/systems/md1/checkbox) |
| `Md1Chip` | [Chips](https://m1.material.io/components/chips.html) | v0 [Atom](/components/primitives/atom) or [Button](/components/actions/button); [Popover](/components/disclosure/popover) for the open contact chip | [Chip](/systems/md1/chip) |
| `Md1DataTable` | [Data tables](https://m1.material.io/components/data-tables.html) | v0 [DataTable](/components/data/data-table) + [createPagination](/composables/data/create-pagination) (through [createDataTable](/composables/data/create-data-table)); [Checkbox](/components/forms/checkbox), [Button](/components/actions/button), [Tooltip](/components/disclosure/tooltip), [Select](/components/forms/select), [Popover](/components/disclosure/popover), [Input](/components/forms/input) and [Dialog](/components/disclosure/dialog) for its parts | [Data table](/systems/md1/data-table) |
| `Md1DatePicker` | [Pickers](https://m1.material.io/components/pickers.html) | a Material Design 1 core on v0 [useRovingFocus](/composables/system/use-roving-focus) + [Button](/components/actions/button); [useDate](/composables/plugins/use-date) formats when installed. The core moves to v0 when v0 ships a date picker | [Date picker](/systems/md1/date-picker) |
| `Md1Dialog` | [Dialogs](https://m1.material.io/components/dialogs.html) | v0 [Dialog](/components/disclosure/dialog); [AlertDialog](/components/disclosure/alert-dialog) for the alert variant | [Dialog](/systems/md1/dialog) |
| `Md1Divider` | [Dividers](https://m1.material.io/components/dividers.html) | v0 [Atom](/components/primitives/atom) | [Divider](/systems/md1/divider) |
| `Md1DropdownButton` | [Buttons](https://m1.material.io/components/buttons.html) | v0 [Menu](/components/disclosure/menu) (RadioGroup + RadioItem); [Button](/components/actions/button) for the segmented state | [Dropdown button](/systems/md1/dropdown-button) |
| `Md1ExpansionPanel` | [Expansion panels](https://m1.material.io/components/expansion-panels.html) | v0 [ExpansionPanel](/components/disclosure/expansion-panel) | [Expansion panel](/systems/md1/expansion-panel) |
| `Md1Fab` | [Floating action button](https://m1.material.io/components/buttons-floating-action-button.html) | v0 [Button](/components/actions/button); [Menu](/components/disclosure/menu) for the speed dial | [FAB](/systems/md1/fab) |
| `Md1FeatureDiscovery` | [Feature discovery](https://m1.material.io/growth-communications/feature-discovery.html) | v0 [Tour](/components/disclosure/tour) + [Portal](/components/primitives/portal) | [Feature discovery](/systems/md1/feature-discovery) |
| `Md1GridList` | [Grid lists](https://m1.material.io/components/grid-lists.html) | v0 [Atom](/components/primitives/atom) + [Button](/components/actions/button); [useImage](/composables/system/use-image) for the tile image | [Grid list](/systems/md1/grid-list) |
| `Md1Icon` | [Icons](https://m1.material.io/style/icons.html) | v0 [createTokens](/composables/registration/create-tokens) | [Icon](/systems/md1/icon) |
| `Md1IconToggle` | [Buttons](https://m1.material.io/components/buttons.html) | v0 [Toggle](/components/actions/toggle) | [Icon toggle](/systems/md1/icon-toggle) |
| `Md1List` | [Lists](https://m1.material.io/components/lists.html), [Lists: controls](https://m1.material.io/components/lists-controls.html) | v0 [Atom](/components/primitives/atom) + [createSelection](/composables/selection/create-selection) + [useRovingFocus](/composables/system/use-roving-focus); [Collapsible](/components/disclosure/collapsible) for `Md1List.Group` | [List](/systems/md1/list) |
| `Md1Menu` | [Menus](https://m1.material.io/components/menus.html) | v0 [Menu](/components/disclosure/menu) | [Menu](/systems/md1/menu) |
| `Md1NavigationDrawer` | [Navigation drawer](https://m1.material.io/patterns/navigation-drawer.html) | v0 [Dialog](/components/disclosure/dialog) when temporary; [Atom](/components/primitives/atom) otherwise. Nested levels come from `Md1List.Group` | [Navigation drawer](/systems/md1/navigation-drawer) |
| `Md1ProgressCircular` | [Progress and activity](https://m1.material.io/components/progress-activity.html) | v0 [Progress](/components/semantic/progress) | [Progress circular](/systems/md1/progress-circular) |
| `Md1ProgressLinear` | [Progress and activity](https://m1.material.io/components/progress-activity.html) | v0 [Progress](/components/semantic/progress) + [Presence](/components/primitives/presence) | [Progress linear](/systems/md1/progress-linear) |
| `Md1Radio` | [Selection controls](https://m1.material.io/components/selection-controls.html) | v0 [Radio](/components/forms/radio) | [Radio](/systems/md1/radio) |
| `Md1Ripple` | every component page | a Material Design 1 composable on v0 [useEventListener](/composables/system/use-event-listener) + [useReducedMotion](/composables/plugins/use-reduced-motion) | [Ripple](/systems/md1/ripple) |
| `Md1SearchBar` | [Search](https://m1.material.io/patterns/search.html) | v0 [Combobox](/components/forms/combobox), through the search core it shares with `Md1Toolbar.Search`; [Md1Button](/systems/md1/button) for the actions | [Search bar](/systems/md1/search-bar) |
| `Md1Slider` | [Sliders](https://m1.material.io/components/sliders.html) | v0 [Slider](/components/forms/slider); [Input](/components/forms/input) for the editable value | [Slider](/systems/md1/slider) |
| `Md1Snackbar` | [Snackbars and toasts](https://m1.material.io/components/snackbars-toasts.html) | v0 [Snackbar](/components/semantic/snackbar) + [Presence](/components/primitives/presence) | [Snackbar](/systems/md1/snackbar) |
| `Md1Stepper` | [Steppers](https://m1.material.io/components/steppers.html) | v0 [Step](/components/providers/step) + [Collapsible](/components/disclosure/collapsible) + [Button](/components/actions/button) for the step headers + [Progress](/components/semantic/progress) for the mobile bar | [Stepper](/systems/md1/stepper) |
| `Md1Subheader` | [Subheaders](https://m1.material.io/components/subheaders.html) | v0 [Atom](/components/primitives/atom) | [Subheader](/systems/md1/subheader) |
| `Md1Switch` | [Selection controls](https://m1.material.io/components/selection-controls.html) | v0 [Switch](/components/forms/switch) | [Switch](/systems/md1/switch) |
| `Md1Tabs` | [Tabs](https://m1.material.io/components/tabs.html) | v0 [Tabs](/components/disclosure/tabs) + [createOverflow](/composables/semantic/create-overflow); [Button](/components/actions/button) for the pagination arrows | [Tabs](/systems/md1/tabs) |
| `Md1TextField` | [Text fields](https://m1.material.io/components/text-fields.html) | v0 [Input](/components/forms/input) + [Button](/components/actions/button); [Select](/components/forms/select) under `dropdown`; [Md1Dialog](/systems/md1/dialog) under `picker` | [Text field](/systems/md1/text-field) |
| `Md1TimePicker` | [Pickers](https://m1.material.io/components/pickers.html) | v0 [Radio](/components/forms/radio) + [Toggle](/components/actions/toggle) around a Material Design 1 clock core | [Time picker](/systems/md1/time-picker) |
| `Md1ToggleButtons` | [Buttons](https://m1.material.io/components/buttons.html) | v0 [Toggle](/components/actions/toggle) | [Toggle buttons](/systems/md1/toggle-buttons) |
| `Md1Toolbar` | [Toolbars](https://m1.material.io/components/toolbars.html) | v0 [Atom](/components/primitives/atom); [Combobox](/components/forms/combobox) for the search part, [useRovingFocus](/composables/system/use-roving-focus) for the actions | [Toolbar](/systems/md1/toolbar) |
| `Md1Tooltip` | [Tooltips](https://m1.material.io/components/tooltips.html) | v0 [Tooltip](/components/disclosure/tooltip) + [useTimer](/composables/system/use-timer) for press and hold | [Tooltip](/systems/md1/tooltip) |

**No named slots.** `Md1Button`, `Md1TextField`, and `Md1Checkbox` have a fixed shape: props, and one default slot. Components whose tree changes are compounds of parts, such as `Md1DialogTitle`, `Md1ListItem`, and `Md1ToolbarNav`, and every part is also reachable from its root, as `Md1Dialog.Title`. A label is a prop or a part.

**Most parts take `namespace`.** It chooses which parent a part belongs to when two of the same compound are nested. Leave it off otherwise. Layout-only parts, such as `Md1DialogActions`, do not take `namespace`.

## Style

The style guides document the token families and the type and elevation classes. They render with the same tokens the components read.

| Guide | MD1 page | Covers | Page |
|-------|----------|--------|------|
| Color | [Color](https://m1.material.io/style/color.html) | The palette, the role, ink and state tokens, and `md1HueTheme` for another primary and accent | [Color](/systems/md1/color) |
| Typography | [Typography](https://m1.material.io/style/typography.html) | The 13 type styles, the `md1-type-*` classes, desktop sizes and script rules | [Typography](/systems/md1/typography) |
| Elevation | [Elevation and shadows](https://m1.material.io/material-design/elevation-shadows.html) | The 25 elevation tokens, the `md1-elevation-*` classes and each component's resting depth | [Elevation](/systems/md1/elevation) |
| Motion | [Duration and easing](https://m1.material.io/motion/duration-easing.html) | The four curves, the device-class durations, the stagger and reduced motion | [Motion](/systems/md1/motion) |
| Layout | [Metrics and keylines](https://m1.material.io/layout/metrics-keylines.html) | Spacing, keylines, increments, the touch target and the breakpoint table | [Layout](/systems/md1/layout) |

## Patterns

The pattern pages compose the components above. None of them adds an `Md1*` export: where the guidelines describe a pattern, Material Design 1 ships an example built from existing parts, not a new component.

| Pattern | MD1 page | Built from | Page |
|---------|----------|------------|------|
| Selection | [Selection](https://m1.material.io/patterns/selection.html) | `Md1List` multiple selection, selected `Md1GridList` tiles and `Md1Card`s, the contextual `Md1Toolbar`, a selectable `Md1DataTable` | [Selection](/systems/md1/selection) |
| Errors | [Errors](https://m1.material.io/patterns/errors.html) | `Md1TextField` helper and error text, `Md1Dialog`, `Md1Snackbar` with a retry action | [Errors](/systems/md1/errors) |
| Empty states | [Empty states](https://m1.material.io/patterns/empty-states.html) | `Md1Icon` with a tagline, starter `Md1List` content, an educational `Md1Card` | [Empty states](/systems/md1/empty-states) |
| Confirmation and acknowledgement | [Confirmation and acknowledgement](https://m1.material.io/patterns/confirmation-acknowledgement.html) | An alert `Md1Dialog` and an `Md1Snackbar` with Undo | [Confirmation](/systems/md1/confirmation) |
| Navigation | [Navigation](https://m1.material.io/patterns/navigation.html) | `Md1Tabs`, `Md1BottomNavigation`, `Md1NavigationDrawer`, `Md1List.Group` and the Up button of `Md1Toolbar.Nav` | [Navigation](/systems/md1/navigation) |
| Settings | [Settings](https://m1.material.io/patterns/settings.html) | `Md1List` with `Md1Switch` and `Md1Checkbox` controls, `Md1Subheader`, `Md1Divider`, a confirmation `Md1Dialog` with `Md1Radio` | [Settings](/systems/md1/settings) |
| Loading images | [Loading images](https://m1.material.io/patterns/loading-images.html) | The fade, saturation and exposure recipe on `Md1Card.Media` and `Md1GridList.Tile` | [Loading images](/systems/md1/loading-images) |
| Offline states | [Offline states](https://m1.material.io/patterns/offline-states.html) | `Md1List`, `Md1ProgressCircular` for the download, `Md1Snackbar` | [Offline states](/systems/md1/offline-states) |
| Help and feedback | [Help and feedback](https://m1.material.io/patterns/help-feedback.html) | Placement in `Md1NavigationDrawer` and the `Md1Menu` overflow, a help screen, a feedback form on `Md1TextField`, `Md1Tooltip` | [Help and feedback](/systems/md1/help-feedback) |
| Onboarding | [Onboarding](https://m1.material.io/growth-communications/onboarding.html) | Quickstart, self-select and top-benefits flows of `Md1Button`, `Md1List` and `Md1Card` | [Onboarding](/systems/md1/onboarding) |

> [!NOTE]
> Material Design 1 is in preview. Component APIs can change between minor versions. Prop tables on these pages are written by hand until generated API reference covers `@paper/*`.

[^bridge-severities]: Vuetify 1.5.24, components/Vuetify/mixins/theme.ts:9-11. The info, success and warning defaults; the white ink on them is Vuetify's `text.theme`, stylus/settings/_theme.styl:25.

[^icons-commit]: Our call: the pinned commit is a current master, so two glyphs redrawn after 2017 ship as redrawn; upstream parity wins over period fidelity.
