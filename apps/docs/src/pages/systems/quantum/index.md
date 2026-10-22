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
| `{ reducedMotion: false }` | Skips `createReducedMotionPlugin`. Use this when the host installs it itself. `QuRipple` reads it, and with no plugin installed at all the ripple keeps animating; the CSS stays gated on `prefers-reduced-motion` either way |

[^icons-bundle]: `{ icons: false }` skips installation. It does not remove the glyph map from the bundle, because the plugin entry imports that map statically. Components that draw a glyph import `QuIcon`, so an app using Quantum controls already includes the map. To leave the map out, call `createQuantumIconsPlugin` yourself and skip `createQuantumPlugin`.

### Without the plugin

`theme.css` sets the light theme on `:root` and on `[data-theme="quantum-light"]`. Importing the stylesheets is enough for an app that only uses the light theme:

```ts main.ts
import '@paper/quantum/theme.css'
import '@paper/quantum/style.css'
```

Dark mode is opt-in either way. Set `data-theme="quantum-dark"` on an element and the `--quantum-*` colors inside it switch to the dark surfaces and ink. Light stays the default. The attribute works on `<html>` or on a smaller subtree, such as a drawer.

## Tokens

Visual values are CSS custom properties named `--quantum-*`, generated from `colors.ts` and `design-system.ts`. Colors, ink and state overlays sit on the theme attribute. The palette, spacing, keylines, radius, type, elevation and motion sit on `:root`.

| Family | Examples |
|--------|---------|
| Palette | `--quantum-indigo-500`, `--quantum-grey-50`, `--quantum-black`, `--quantum-white`: the 2014 palette, 19 hues by 50 to 900 plus the A100 to A700 accents, from `@vuetify/v0/palettes/md1` |
| Roles | `--quantum-primary`, `--quantum-primary-dark`, `--quantum-primary-light`, `--quantum-accent`, `--quantum-accent-light`, `--quantum-accent-control`, `--quantum-on-primary`, `--quantum-error`, `--quantum-app-bar`, `--quantum-background`, `--quantum-surface` |
| Ink and state | `--quantum-text-primary`, `--quantum-text-secondary`, `--quantum-text-disabled`, `--quantum-divider`, `--quantum-icon-active`, `--quantum-focus`, `--quantum-pressed`, `--quantum-hover`, `--quantum-scrim` |
| Typography | `--quantum-font-family`, `--quantum-type-title-size`, `--quantum-type-body-1-leading`, `--quantum-type-button-weight`, `--quantum-type-button-transform` |
| Elevation | `--quantum-elevation-0` to `--quantum-elevation-24`, `--quantum-shadow-umbra` |
| Motion | `--quantum-duration-standard`, `--quantum-duration-enter`, `--quantum-easing-decelerate`, `--quantum-stagger`, `--quantum-ripple-duration` |
| Layout | `--quantum-spacing-1` to `--quantum-spacing-5`, `--quantum-keyline-margin`, `--quantum-keyline-content`, `--quantum-increment`, `--quantum-touch-target`, `--quantum-radius`, `--quantum-icon-size` |

Each color is emitted as its value and as space-separated RGB channels. Use `--quantum-primary-channels` in `rgb(... / 0.4)` when you need a translucent overlay. The ink tokens are already translucent: black at 87%, 54%, 38% and 12% on the light theme, white at 100%, 70%, 50% and 12% on the dark one.

Breakpoints are not custom properties. They ship as the documented table and as the `quantumBreakpoints` map for `useBreakpoints`.

### The v0 bridge

Quantum also writes its color roles onto the `--v0-*` names that Vuetify0 kits read, so a kit written against those names picks up Quantum's colors.

Most names match: `--v0-primary` copies `--quantum-primary` and `--v0-background` copies `--quantum-background`. The rest are translations into the kit vocabulary. `--v0-secondary` and `--v0-accent` read the accent, `--v0-surface-variant` and `--v0-pre` read the app bar color, `--v0-surface-tint` reads the light primary, `--v0-on-surface` reads the primary ink, `--v0-on-surface-variant` the secondary ink, and `--v0-border` the divider. Material Design 1 defines no info, success or warning roles, so the bridge supplies the Vuetify 1.5 defaults (Blue 500, Green 500, Orange 600) for `--v0-info`, `--v0-success` and `--v0-warning`; no Quantum component reads them.

Pass `{ v0Aliases: false }` to the adapter to skip the `--v0-*` names.

## Icons

Icons are named by role. Ask for `menu`, `search` or `close`; the glyph is inline SVG on the 24 dp grid, filled, so there is no icon font and no sprite sheet to load. The set has 80 glyphs and 107 names. 27 names are aliases: `clear` draws the `close` glyph and `calendar` draws `event`, and overriding a role moves every alias with it.

```vue
<template>
  <QuIcon name="menu" />

  <QuIcon label="Open navigation" name="menu" />
</template>
```

Icons are decorative by default and hidden from assistive technology. Pass `label` when an icon should be announced. Directional glyphs (the arrows, the chevrons, first and last page) mirror under `dir="rtl"`; glyphs that represent time, physical objects or the search handle do not. Roles, aliases, mirroring and the accessibility rules are on the [QuIcon page](/systems/quantum/icon).

The artwork is Material Icons at commit `49d4db35`, used under the Apache License 2.0; the package ships the notice as `LICENSE-ICONS`. The Vue package is MIT.

## Components

Every component below is exported from `@paper/quantum` and has its own page. The second column is the Material Design 1 page it implements, at the pinned capture; the third is the Vuetify0 feature it is built on. Two rules apply to all of them.

| Component | MD1 page | Composes | Page |
|-----------|----------|----------|------|
| `QuAutocomplete` | [Text fields](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/text-fields.html) | v0 [Combobox](/components/forms/combobox) | [Autocomplete](/systems/quantum/autocomplete) |
| `QuBottomNavigation` | [Bottom navigation](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-navigation.html) | v0 [createSingle](/composables/selection/create-single) + [Button](/components/actions/button) | [Bottom navigation](/systems/quantum/bottom-navigation) |
| `QuBottomSheet` | [Bottom sheets](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-sheets.html) | v0 [Dialog](/components/disclosure/dialog); [Portal](/components/primitives/portal) + [Collapsible](/components/disclosure/collapsible) when persistent | [Bottom sheet](/systems/quantum/bottom-sheet) |
| `QuButton` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Button](/components/actions/button) | [Button](/systems/quantum/button) |
| `QuCard` | [Cards](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/cards.html) | v0 [Atom](/components/primitives/atom) + [Collapsible](/components/disclosure/collapsible) | [Card](/systems/quantum/card) |
| `QuCheckbox` | [Selection controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/selection-controls.html) | v0 [Checkbox](/components/forms/checkbox) | [Checkbox](/systems/quantum/checkbox) |
| `QuChip` | [Chips](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/chips.html) | v0 [Atom](/components/primitives/atom) or [Button](/components/actions/button); [Popover](/components/disclosure/popover) for the contact chip | [Chip](/systems/quantum/chip) |
| `QuDataTable` | [Data tables](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/data-tables.html) | v0 [DataTable](/components/data/data-table) + [createPagination](/composables/data/create-pagination) | [Data table](/systems/quantum/data-table) |
| `QuDatePicker` | [Pickers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/pickers.html) | a Quantum core on v0 [useRovingFocus](/composables/system/use-roving-focus) + [useDate](/composables/plugins/use-date), ahead of a v0 graduation | [Date picker](/systems/quantum/date-picker) |
| `QuDialog` | [Dialogs](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/dialogs.html) | v0 [Dialog](/components/disclosure/dialog); [AlertDialog](/components/disclosure/alert-dialog) for the alert variant | [Dialog](/systems/quantum/dialog) |
| `QuDivider` | [Dividers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/dividers.html) | v0 [Atom](/components/primitives/atom) | [Divider](/systems/quantum/divider) |
| `QuDropdownButton` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Menu](/components/disclosure/menu) | [Dropdown button](/systems/quantum/dropdown-button) |
| `QuExpansionPanel` | [Expansion panels](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/expansion-panels.html) | v0 [ExpansionPanel](/components/disclosure/expansion-panel) | [Expansion panel](/systems/quantum/expansion-panel) |
| `QuFab` | [Floating action button](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons-floating-action-button.html) | v0 [Button](/components/actions/button); [Menu](/components/disclosure/menu) for the speed dial | [FAB](/systems/quantum/fab) |
| `QuFeatureDiscovery` | [Feature discovery](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/growth-communications/feature-discovery.html) | v0 [Tour](/components/disclosure/tour) | [Feature discovery](/systems/quantum/feature-discovery) |
| `QuGridList` | [Grid lists](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/grid-lists.html) | v0 [Atom](/components/primitives/atom) + [Button](/components/actions/button) | [Grid list](/systems/quantum/grid-list) |
| `QuIcon` | [Icons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/icons.html) | v0 [createTokens](/composables/registration/create-tokens) | [Icon](/systems/quantum/icon) |
| `QuIconToggle` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Toggle](/components/actions/toggle) | [Icon toggle](/systems/quantum/icon-toggle) |
| `QuList` | [Lists](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/lists.html), [Lists: controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/lists-controls.html) | v0 [Atom](/components/primitives/atom) + [createSingle](/composables/selection/create-single) or [createSelection](/composables/selection/create-selection) | [List](/systems/quantum/list) |
| `QuMenu` | [Menus](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/menus.html) | v0 [Menu](/components/disclosure/menu) | [Menu](/systems/quantum/menu) |
| `QuNavigationDrawer` | [Navigation drawer](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/navigation-drawer.html) | v0 [Dialog](/components/disclosure/dialog) when temporary; [Atom](/components/primitives/atom) + [Collapsible](/components/disclosure/collapsible) otherwise | [Navigation drawer](/systems/quantum/navigation-drawer) |
| `QuProgressCircular` | [Progress and activity](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/progress-activity.html) | v0 [Progress](/components/semantic/progress) | [Progress circular](/systems/quantum/progress-circular) |
| `QuProgressLinear` | [Progress and activity](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/progress-activity.html) | v0 [Progress](/components/semantic/progress) + [Presence](/components/primitives/presence) | [Progress linear](/systems/quantum/progress-linear) |
| `QuRadio` | [Selection controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/selection-controls.html) | v0 [Radio](/components/forms/radio) | [Radio](/systems/quantum/radio) |
| `QuRipple` | every component page | a Quantum composable on v0 [useEventListener](/composables/system/use-event-listener) + [useReducedMotion](/composables/plugins/use-reduced-motion) | [Ripple](/systems/quantum/ripple) |
| `QuSearchBar` | [Search](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/patterns/search.html) | v0 [Combobox](/components/forms/combobox) + `QuTextField` | [Search bar](/systems/quantum/search-bar) |
| `QuSlider` | [Sliders](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/sliders.html) | v0 [Slider](/components/forms/slider) | [Slider](/systems/quantum/slider) |
| `QuSnackbar` | [Snackbars and toasts](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/snackbars-toasts.html) | v0 [Snackbar](/components/semantic/snackbar) + [Presence](/components/primitives/presence) | [Snackbar](/systems/quantum/snackbar) |
| `QuStepper` | [Steppers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/steppers.html) | v0 [Step](/components/providers/step) + [Collapsible](/components/disclosure/collapsible) | [Stepper](/systems/quantum/stepper) |
| `QuSubheader` | [Subheaders](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/subheaders.html) | v0 [Atom](/components/primitives/atom) | [Subheader](/systems/quantum/subheader) |
| `QuSwitch` | [Selection controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/selection-controls.html) | v0 [Switch](/components/forms/switch) | [Switch](/systems/quantum/switch) |
| `QuTabs` | [Tabs](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/tabs.html) | v0 [Tabs](/components/disclosure/tabs) + [createOverflow](/composables/semantic/create-overflow) | [Tabs](/systems/quantum/tabs) |
| `QuTextField` | [Text fields](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/text-fields.html) | v0 [Input](/components/forms/input); [Select](/components/forms/select) under `dropdown` | [Text field](/systems/quantum/text-field) |
| `QuTimePicker` | [Pickers](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/pickers.html) | v0 [Radio](/components/forms/radio) + [Toggle](/components/actions/toggle) around a Quantum clock core | [Time picker](/systems/quantum/time-picker) |
| `QuToggleButtons` | [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) | v0 [Toggle](/components/actions/toggle) | [Toggle buttons](/systems/quantum/toggle-buttons) |
| `QuToolbar` | [Toolbars](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/toolbars.html) | v0 [Atom](/components/primitives/atom); [Combobox](/components/forms/combobox) for the search part, [useRovingFocus](/composables/system/use-roving-focus) for the actions | [Toolbar](/systems/quantum/toolbar) |
| `QuTooltip` | [Tooltips](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/tooltips.html) | v0 [Tooltip](/components/disclosure/tooltip) | [Tooltip](/systems/quantum/tooltip) |

**No named slots.** `QuButton`, `QuTextField`, and `QuCheckbox` have a fixed shape: props, and one default slot. Components whose tree changes are compounds of parts, such as `QuDialogTitle`, `QuListItem`, and `QuToolbarNav`, and every part is also reachable from its root, as `QuDialog.Title`. A label is a prop or a part.

**Most parts take `namespace`.** It chooses which parent a part belongs to when two of the same compound are nested. Leave it off otherwise. Layout-only parts, such as `QuDialogActions`, do not take `namespace`.

> [!NOTE]
> Quantum is in preview. Component APIs can change between minor versions. Prop tables on these pages are written by hand until generated API reference covers `@paper/*`.
