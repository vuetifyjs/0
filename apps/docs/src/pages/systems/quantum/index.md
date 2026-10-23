---
title: Quantum - Material Design 1 for Vue on Vuetify0
meta:
- name: description
  content: Quantum is the Material Design 1 (2014 to 2017) design system for Vue, built on Vuetify0. Tokens, light and dark themes, the Material Icons set, and Qu* components that wrap v0's headless compounds.
- name: keywords
  content: quantum, material design 1, material design 2014, quantum paper, vue design system, vuetify0, paper, design tokens, quantum components, material icons
features:
  category: Guide
  label: 'Quantum'
  level: 2
  order: 0
related:
  - /systems/quantum/button
  - /systems/quantum/dialog
  - /systems/quantum/icon
  - /systems/quantum/color
  - /systems/quantum/typography
  - /systems/quantum/elevation
  - /systems/quantum/motion
  - /systems/quantum/layout
---

# Quantum

<DocsPageFeatures :frontmatter />

Quantum is a design system for Vue, built on [Vuetify0](/). It ships tokens, CSS, and `Qu*` components. v0 handles behavior and accessibility. Quantum handles appearance.

<DocsSystemActivator palette="quantum" />

## What Quantum is

Quantum is Material Design 1: the 2014 to 2017 Material Design guidelines, the language Google developed under the codename Quantum Paper. It is the older language in its own right, not a theme of the current one, and `@paper/material` stays reserved for Material Design 3. Every `Qu*` API is the spec's vocabulary rendered on v0, and nothing more. Where the guidelines say `dense`, `raised`, `mini` or `shifting`, the prop is that word.

Quantum has its own tokens, its own icon set, and its own component names. Selection, focus, popovers, dialogs, and validation come from v0. Keyboard behavior does too, except the date and time pickers, whose grids live in Quantum until v0 has them. A Quantum component behaves like the Vuetify0 compound it wraps, so a keyboard fix in v0 reaches `QuDialog` without a separate Quantum release.

### The pinned spec

The guidelines are archived, so the spec cannot move under the package. Quantum is pinned to the Wayback Machine capture of the archived guidelines taken on 2018-12-25 at 00:22:55 UTC: [material.io/archive/guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/). The archive's own changelog ends with September 2017, which dates the frozen content. Google's mirror at [m1.material.io](https://m1.material.io/) carries the same pages. The glyphs are Material Icons at commit `49d4db35`, and Vuetify 1.5.24 is used only as a numeric cross-check, never as a source of API.

Pinned means complete and exclusive. Every component, variant and state on the component pages ships, and nothing the guidelines do not contain does, even where v0 has the primitive: there is no `QuBreadcrumbs`, no `QuAlert`, and no `QuRating`. The pages with no web surface (widgets, notifications, launch screens, toasts, split screen) are listed as out, with the reason, in the package's `SPEC.md`.

### The escape hatch

A missing piece is yours to compose. Take the v0 primitive, style it with the `--quantum-*` tokens and the `quantum-type-*` and `quantum-elevation-*` classes, and add `QuRipple` for the ink. The result is supported as v0 and as Quantum tokens. It is not a Quantum component, and the hole stays listed under the package's known limitations rather than being filled with an unspecified extra.

## Installation

::: code-group no-filename

```bash pnpm
pnpm add @paper/quantum
```

```bash npm
npm install @paper/quantum
```

```bash yarn
yarn add @paper/quantum
```

```bash bun
bun add @paper/quantum
```

:::

The plugin registers the theme adapter, the two themes, the icon set, and reduced-motion detection:

```ts main.ts
import { createApp } from 'vue'
import { createQuantumPlugin } from '@paper/quantum'

import '@paper/quantum/theme.css'
import '@paper/quantum/style.css'

import App from './App.vue'

createApp(App)
  .use(createQuantumPlugin())
  .mount('#app')
```

Use `createQuantumPlugin()`. It constructs `QuantumStyleSheetAdapter` for you, registers `quantum-light` as the default, and follows the operating system into `quantum-dark` until you call `useTheme().select`.

Three options turn parts of that setup off. Each key also accepts that plugin's own options when you want to configure it rather than skip it.

| Option | Effect |
|--------|--------|
| `{ theme: false }` | Skips the theme plugin. Use this when the app already calls `createThemePlugin` and will attach `QuantumStyleSheetAdapter`, `quantumColors` and `quantumDarkColors` itself |
| `{ icons: false }` | Skips installing the icon registry on the app. `QuIcon` still draws from the built-in set[^icons-bundle] |
| `{ reducedMotion: false }` | Skips `createReducedMotionPlugin`. Use this when the host installs it itself. `QuRipple` reads it; with no plugin installed, `QuRipple` follows the operating system's `prefers-reduced-motion` setting, and the CSS stays gated on it either way |

[^icons-bundle]: `{ icons: false }` skips installation. It does not remove the glyph map from the bundle, because the plugin entry imports that map statically. Components that draw a glyph import `QuIcon`, so an app using Quantum controls already includes the map. To leave the map out, call `createQuantumIconsPlugin` yourself and skip `createQuantumPlugin`.

### Without the plugin

`theme.css` sets the light theme on `:root` and on `[data-theme="quantum-light"]`. Importing the stylesheets is enough for an app that only uses the light theme:

```ts main.ts
import '@paper/quantum/theme.css'
import '@paper/quantum/style.css'
```

Dark mode is opt-in either way. Set `data-theme="quantum-dark"` on an element and the `--quantum-*` colors inside it switch to the dark surfaces and ink. Light stays the default. The attribute works on `<html>` or on a smaller subtree, such as a drawer.

## Tokens

Visual values are CSS custom properties named `--quantum-*`, generated from `colors.ts` and `design-system.ts`. Colors, ink, state overlays and the elevation and shadow tokens sit on the theme attribute. The palette, spacing, keylines, radius, type and motion sit on `:root`.

| Family | Examples |
|--------|---------|
| Palette | `--quantum-indigo-500`, `--quantum-grey-50`, `--quantum-black`, `--quantum-white`: the 2014 palette, 19 hues by 50 to 900 plus the A100 to A700 accents, from `@vuetify/v0/palettes/md1` |
| Roles | `--quantum-primary`, `--quantum-primary-dark`, `--quantum-primary-light`, `--quantum-accent`, `--quantum-accent-light`, `--quantum-accent-control`, `--quantum-on-primary`, `--quantum-error`, `--quantum-app-bar`, `--quantum-background`, `--quantum-surface` |
| Ink and state | `--quantum-text-primary`, `--quantum-text-secondary`, `--quantum-text-disabled`, `--quantum-divider`, `--quantum-icon-active`, `--quantum-focus`, `--quantum-pressed`, `--quantum-hover`, `--quantum-scrim` |
| Typography | `--quantum-font-family`, `--quantum-type-title-size`, `--quantum-type-body-1-leading`, `--quantum-type-button-weight`, `--quantum-type-button-transform` |
| Elevation | `--quantum-elevation-0` to `--quantum-elevation-24`, `--quantum-shadow-umbra` |
| Motion | `--quantum-duration-standard`, `--quantum-duration-enter`, `--quantum-easing-decelerate`, `--quantum-stagger`, `--quantum-ripple-duration` |
| Layout | `--quantum-spacing-1` to `--quantum-spacing-5`, `--quantum-keyline-margin`, `--quantum-keyline-content`, `--quantum-increment`, `--quantum-touch-target`, `--quantum-radius`, `--quantum-icon-size` |

The [Color](/systems/quantum/color), [Typography](/systems/quantum/typography), [Elevation](/systems/quantum/elevation), [Motion](/systems/quantum/motion) and [Layout](/systems/quantum/layout) guides list every token in each family.

Each color is emitted as its value and as space-separated RGB channels. Use `--quantum-primary-channels` in `rgb(... / 0.4)` when you need a translucent overlay. The ink tokens are already translucent: black at 87%, 54%, 38% and 12% on the light theme, white at 100%, 70%, 50% and 12% on the dark one.

Breakpoints are not custom properties. They ship as `quantumBreakpoints`, the documented dp table in JS: 480, 600, 840, 960, 1280, 1440, 1600 and 1920, keyed by the nominal width, with the 16 px desktop reduction on 1280 and above (the 1024 row, 1008 px effective, is in the documented table only). Vuetify0's `useBreakpoints` has its own named breakpoints and takes no Quantum input, so map the table onto those names yourself when a layout needs the spec's widths.

### The v0 bridge

Quantum also writes its color roles onto the `--v0-*` names that Vuetify0 kits read, so a kit written against those names picks up Quantum's colors.

Most names match: `--v0-primary` copies `--quantum-primary` and `--v0-background` copies `--quantum-background`. The rest are translations into the kit vocabulary. `--v0-secondary` and `--v0-accent` read the accent, `--v0-surface-variant` and `--v0-pre` read the app bar color, `--v0-surface-tint` reads a bridge-only tint (the primary's 100 on the light theme, its 700 on the dark one, so code chips and table headers keep their contrast under white ink), `--v0-on-surface` reads the primary ink, `--v0-on-surface-variant` the secondary ink, and `--v0-border` the divider. Material Design 1 defines no info, success or warning roles, so the bridge supplies the Vuetify 1.5 defaults (Blue 500, Green 500, Orange 600) for `--v0-info`, `--v0-success` and `--v0-warning`; no Quantum component reads them.

Pass `{ v0Aliases: false }` to the adapter to skip the `--v0-*` names.

## Icons

Icons are named by role. Ask for `menu`, `search` or `close`; the glyph is inline SVG on the 24 dp grid, filled, so there is no icon font and no sprite sheet to load. The set has 80 glyphs and 107 names. 27 names are aliases: `clear` draws the `close` glyph and `calendar` draws `event`, and overriding a role moves every alias with it.

```vue
<template>
  <QuIcon name="menu" />

  <QuIcon label="Open navigation" name="menu" />
</template>
```

Icons are decorative by default and hidden from assistive technology. Pass `label` when an icon should be announced. The 11 directional roles (the back and forward arrows, arrow-right, the left and right chevrons, first and last page, send, sort, open-in-new and label) mirror under `dir="rtl"`; `help` mirrors except in Hebrew. Glyphs that represent time, physical objects or the search handle do not. Roles, aliases, mirroring and the accessibility rules are on the [QuIcon page](/systems/quantum/icon).

The artwork is Material Icons at commit `49d4db35`, used under the Apache License 2.0; the package ships the notice as `LICENSE-ICONS`. The Vue package is MIT.

## Components

Every component below is exported from `@paper/quantum` and has its own page. The second column is the Material Design 1 page it implements, at its archived capture; the third is the Vuetify0 feature it is built on. Two rules apply to all of them.

| Component | MD1 page | Composes | Page |
|-----------|----------|----------|------|
| `QuAutocomplete` | [Text fields](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/text-fields.html) | v0 [Combobox](/components/forms/combobox) + the `QuTextField` anatomy; [QuChip](/systems/quantum/chip) under `multiple` | [Autocomplete](/systems/quantum/autocomplete) |
| `QuBottomNavigation` | [Bottom navigation](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-navigation.html) | v0 [createSingle](/composables/selection/create-single) + [useProxyModel](/composables/reactivity/use-proxy-model) + [Button](/components/actions/button) | [Bottom navigation](/systems/quantum/bottom-navigation) |
| `QuBottomSheet` | [Bottom sheets](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-sheets.html) | v0 [Dialog](/components/disclosure/dialog); [Portal](/components/primitives/portal) + [Collapsible](/components/disclosure/collapsible) when persistent | [Bottom sheet](/systems/quantum/bottom-sheet) |
| `QuButton` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Button](/components/actions/button) | [Button](/systems/quantum/button) |
| `QuCard` | [Cards](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/cards.html) | v0 [Atom](/components/primitives/atom) + [Collapsible](/components/disclosure/collapsible) | [Card](/systems/quantum/card) |
| `QuCheckbox` | [Selection controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/selection-controls.html) | v0 [Checkbox](/components/forms/checkbox) | [Checkbox](/systems/quantum/checkbox) |
| `QuChip` | [Chips](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/chips.html) | v0 [Atom](/components/primitives/atom) or [Button](/components/actions/button); [Popover](/components/disclosure/popover) for the open contact chip | [Chip](/systems/quantum/chip) |
| `QuDataTable` | [Data tables](http://web.archive.org/web/20181225002253/https://material.io/archive/guidelines/components/data-tables.html) | v0 [DataTable](/components/data/data-table) + [createPagination](/composables/data/create-pagination) (through [createDataTable](/composables/data/create-data-table)); [Checkbox](/components/forms/checkbox), [Button](/components/actions/button), [Tooltip](/components/disclosure/tooltip), [Select](/components/forms/select), [Popover](/components/disclosure/popover), [Input](/components/forms/input) and [Dialog](/components/disclosure/dialog) for its parts | [Data table](/systems/quantum/data-table) |
| `QuDatePicker` | [Pickers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/pickers.html) | a Quantum core on v0 [useRovingFocus](/composables/system/use-roving-focus) + [Button](/components/actions/button); [useDate](/composables/plugins/use-date) formats when installed. The core moves to v0 when v0 ships a date picker | [Date picker](/systems/quantum/date-picker) |
| `QuDialog` | [Dialogs](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/dialogs.html) | v0 [Dialog](/components/disclosure/dialog); [AlertDialog](/components/disclosure/alert-dialog) for the alert variant | [Dialog](/systems/quantum/dialog) |
| `QuDivider` | [Dividers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/dividers.html) | v0 [Atom](/components/primitives/atom) | [Divider](/systems/quantum/divider) |
| `QuDropdownButton` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Menu](/components/disclosure/menu) (RadioGroup + RadioItem); [Button](/components/actions/button) for the segmented state | [Dropdown button](/systems/quantum/dropdown-button) |
| `QuExpansionPanel` | [Expansion panels](http://web.archive.org/web/20181225002242/https://material.io/archive/guidelines/components/expansion-panels.html) | v0 [ExpansionPanel](/components/disclosure/expansion-panel) | [Expansion panel](/systems/quantum/expansion-panel) |
| `QuFab` | [Floating action button](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons-floating-action-button.html) | v0 [Button](/components/actions/button); [Menu](/components/disclosure/menu) for the speed dial | [FAB](/systems/quantum/fab) |
| `QuFeatureDiscovery` | [Feature discovery](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/growth-communications/feature-discovery.html) | v0 [Tour](/components/disclosure/tour) + [Portal](/components/primitives/portal) | [Feature discovery](/systems/quantum/feature-discovery) |
| `QuGridList` | [Grid lists](http://web.archive.org/web/20181225002209/https://material.io/archive/guidelines/components/grid-lists.html) | v0 [Atom](/components/primitives/atom) + [Button](/components/actions/button); [useImage](/composables/system/use-image) for the tile image | [Grid list](/systems/quantum/grid-list) |
| `QuIcon` | [Icons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/icons.html) | v0 [createTokens](/composables/registration/create-tokens) | [Icon](/systems/quantum/icon) |
| `QuIconToggle` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Toggle](/components/actions/toggle) | [Icon toggle](/systems/quantum/icon-toggle) |
| `QuList` | [Lists](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/lists.html), [Lists: controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/lists-controls.html) | v0 [Atom](/components/primitives/atom) + [createSelection](/composables/selection/create-selection) + [useRovingFocus](/composables/system/use-roving-focus); [Collapsible](/components/disclosure/collapsible) for `QuList.Group` | [List](/systems/quantum/list) |
| `QuMenu` | [Menus](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/menus.html) | v0 [Menu](/components/disclosure/menu) | [Menu](/systems/quantum/menu) |
| `QuNavigationDrawer` | [Navigation drawer](http://web.archive.org/web/20181225002300/https://material.io/archive/guidelines/patterns/navigation-drawer.html) | v0 [Dialog](/components/disclosure/dialog) when temporary; [Atom](/components/primitives/atom) otherwise. Nested levels come from `QuList.Group` | [Navigation drawer](/systems/quantum/navigation-drawer) |
| `QuProgressCircular` | [Progress and activity](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/progress-activity.html) | v0 [Progress](/components/semantic/progress) | [Progress circular](/systems/quantum/progress-circular) |
| `QuProgressLinear` | [Progress and activity](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/progress-activity.html) | v0 [Progress](/components/semantic/progress) + [Presence](/components/primitives/presence) | [Progress linear](/systems/quantum/progress-linear) |
| `QuRadio` | [Selection controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/selection-controls.html) | v0 [Radio](/components/forms/radio) | [Radio](/systems/quantum/radio) |
| `QuRipple` | every component page | a Quantum composable on v0 [useEventListener](/composables/system/use-event-listener) + [useReducedMotion](/composables/plugins/use-reduced-motion) | [Ripple](/systems/quantum/ripple) |
| `QuSearchBar` | [Search](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/search.html) | v0 [Combobox](/components/forms/combobox), through the search core it shares with `QuToolbar.Search`; [QuButton](/systems/quantum/button) for the actions | [Search bar](/systems/quantum/search-bar) |
| `QuSlider` | [Sliders](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/sliders.html) | v0 [Slider](/components/forms/slider); [Input](/components/forms/input) for the editable value | [Slider](/systems/quantum/slider) |
| `QuSnackbar` | [Snackbars and toasts](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/snackbars-toasts.html) | v0 [Snackbar](/components/semantic/snackbar) + [Presence](/components/primitives/presence) | [Snackbar](/systems/quantum/snackbar) |
| `QuStepper` | [Steppers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/steppers.html) | v0 [Step](/components/providers/step) + [Collapsible](/components/disclosure/collapsible) + [Button](/components/actions/button) for the step headers + [Progress](/components/semantic/progress) for the mobile bar | [Stepper](/systems/quantum/stepper) |
| `QuSubheader` | [Subheaders](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/subheaders.html) | v0 [Atom](/components/primitives/atom) | [Subheader](/systems/quantum/subheader) |
| `QuSwitch` | [Selection controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/selection-controls.html) | v0 [Switch](/components/forms/switch) | [Switch](/systems/quantum/switch) |
| `QuTabs` | [Tabs](http://web.archive.org/web/20181225002217/https://material.io/archive/guidelines/components/tabs.html) | v0 [Tabs](/components/disclosure/tabs) + [createOverflow](/composables/semantic/create-overflow); [Button](/components/actions/button) for the pagination arrows | [Tabs](/systems/quantum/tabs) |
| `QuTextField` | [Text fields](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/text-fields.html) | v0 [Input](/components/forms/input) + [Button](/components/actions/button); [Select](/components/forms/select) under `dropdown`; [QuDialog](/systems/quantum/dialog) under `picker` | [Text field](/systems/quantum/text-field) |
| `QuTimePicker` | [Pickers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/pickers.html) | v0 [Radio](/components/forms/radio) + [Toggle](/components/actions/toggle) around a Quantum clock core | [Time picker](/systems/quantum/time-picker) |
| `QuToggleButtons` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Toggle](/components/actions/toggle) | [Toggle buttons](/systems/quantum/toggle-buttons) |
| `QuToolbar` | [Toolbars](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/toolbars.html) | v0 [Atom](/components/primitives/atom); [Combobox](/components/forms/combobox) for the search part, [useRovingFocus](/composables/system/use-roving-focus) for the actions | [Toolbar](/systems/quantum/toolbar) |
| `QuTooltip` | [Tooltips](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/tooltips.html) | v0 [Tooltip](/components/disclosure/tooltip) + [useTimer](/composables/system/use-timer) for press and hold | [Tooltip](/systems/quantum/tooltip) |

**No named slots.** `QuButton`, `QuTextField`, and `QuCheckbox` have a fixed shape: props, and one default slot. Components whose tree changes are compounds of parts, such as `QuDialogTitle`, `QuListItem`, and `QuToolbarNav`, and every part is also reachable from its root, as `QuDialog.Title`. A label is a prop or a part.

**Most parts take `namespace`.** It chooses which parent a part belongs to when two of the same compound are nested. Leave it off otherwise. Layout-only parts, such as `QuDialogActions`, do not take `namespace`.

## Style

The style guides document the token families and the type and elevation classes. They render with the same tokens the components read.

| Guide | MD1 page | Covers | Page |
|-------|----------|--------|------|
| Color | [Color](http://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html) | The palette, the role, ink and state tokens, and `quantumHueTheme` for another primary and accent | [Color](/systems/quantum/color) |
| Typography | [Typography](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/typography.html) | The 13 type styles, the `quantum-type-*` classes, desktop sizes and script rules | [Typography](/systems/quantum/typography) |
| Elevation | [Elevation and shadows](http://web.archive.org/web/20181225002223/https://material.io/archive/guidelines/material-design/elevation-shadows.html) | The 25 elevation tokens, the `quantum-elevation-*` classes and each component's resting depth | [Elevation](/systems/quantum/elevation) |
| Motion | [Duration and easing](http://web.archive.org/web/20181225002212/https://material.io/archive/guidelines/motion/duration-easing.html) | The four curves, the device-class durations, the stagger and reduced motion | [Motion](/systems/quantum/motion) |
| Layout | [Metrics and keylines](http://web.archive.org/web/20181225002221/https://material.io/archive/guidelines/layout/metrics-keylines.html) | Spacing, keylines, increments, the touch target and the breakpoint table | [Layout](/systems/quantum/layout) |

## Patterns

The pattern pages compose the components above. None of them adds a `Qu*` export: where the guidelines describe a pattern, Quantum ships an example built from existing parts, not a new component.

| Pattern | MD1 page | Built from | Page |
|---------|----------|------------|------|
| Selection | [Selection](http://web.archive.org/web/20181225002148/https://material.io/archive/guidelines/patterns/selection.html) | `QuList` multiple selection, selected `QuGridList` tiles and `QuCard`s, the contextual `QuToolbar`, a selectable `QuDataTable` | [Selection](/systems/quantum/selection) |
| Errors | [Errors](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/errors.html) | `QuTextField` helper and error text, `QuDialog`, `QuSnackbar` with a retry action | [Errors](/systems/quantum/errors) |
| Empty states | [Empty states](http://web.archive.org/web/20181225002248/https://material.io/archive/guidelines/patterns/empty-states.html) | `QuIcon` with a tagline, starter `QuList` content, an educational `QuCard` | [Empty states](/systems/quantum/empty-states) |
| Confirmation and acknowledgement | [Confirmation and acknowledgement](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/confirmation-acknowledgement.html) | An alert `QuDialog` and a `QuSnackbar` with Undo | [Confirmation](/systems/quantum/confirmation) |
| Navigation | [Navigation](http://web.archive.org/web/20181225002243/https://material.io/archive/guidelines/patterns/navigation.html) | `QuTabs`, `QuBottomNavigation`, `QuNavigationDrawer`, `QuList.Group` and the Up button of `QuToolbar.Nav` | [Navigation](/systems/quantum/navigation) |
| Settings | [Settings](http://web.archive.org/web/20181225002157/https://material.io/archive/guidelines/patterns/settings.html) | `QuList` with `QuSwitch` and `QuCheckbox` controls, `QuSubheader`, `QuDivider`, a confirmation `QuDialog` with `QuRadio` | [Settings](/systems/quantum/settings) |
| Loading images | [Loading images](http://web.archive.org/web/20181225002216/https://material.io/archive/guidelines/patterns/loading-images.html) | The fade, saturation and exposure recipe on `QuCard.Media` and `QuGridList.Tile` | [Loading images](/systems/quantum/loading-images) |
| Offline states | [Offline states](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/offline-states.html) | `QuList`, `QuProgressCircular` for the download, `QuSnackbar` | [Offline states](/systems/quantum/offline-states) |
| Help and feedback | [Help and feedback](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/help-feedback.html) | Placement in `QuNavigationDrawer` and the `QuMenu` overflow, a help screen, a feedback form on `QuTextField`, `QuTooltip` | [Help and feedback](/systems/quantum/help-feedback) |
| Onboarding | [Onboarding](http://web.archive.org/web/20181225002225/https://material.io/archive/guidelines/growth-communications/onboarding.html) | Quickstart, self-select and top-benefits flows of `QuButton`, `QuList` and `QuCard` | [Onboarding](/systems/quantum/onboarding) |

> [!NOTE]
> Quantum is in preview. Component APIs can change between minor versions. Prop tables on these pages are written by hand until generated API reference covers `@paper/*`.
