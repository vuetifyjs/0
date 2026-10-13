---
title: Emerald - Vue design system on Vuetify0
meta:
- name: description
  content: Emerald is a Vue design system built on Vuetify0. It includes CSS tokens, a role-based icon set, and Em* components that wrap v0's headless compounds.
- name: keywords
  content: emerald, design system, vuetify0, paper, vue design system, design tokens, emerald components, figma, ui kit
features:
  category: Guide
  label: 'Emerald'
  level: 2
  order: 0
related:
  - /systems/emerald/button
  - /systems/emerald/icon
  - /systems/emerald/calendar
---

# Emerald

<DocsPageFeatures :frontmatter />

Emerald is a design system for Vue, built on [Vuetify0](/). It ships tokens, CSS, and `Em*` components. v0 handles behavior and accessibility. Emerald handles appearance.

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
  <DocsCard href="https://store.vuetifyjs.com/products/official-emerald-ui-kit-for-figma" hoverable>
    <div class="flex items-center gap-3 mb-2">
      <img src="https://cdn.vuetifyjs.com/docs/images/one/logos/vstore.svg" alt="" class="size-8 object-contain shrink-0 hue-rotate-[-58deg] saturate-[1.25]">
      <div class="text-lg font-semibold">Official Emerald UI Kit for Figma</div>
    </div>
    <div class="text-sm text-on-surface-variant">The Figma library for this package: tokens, icons, components, and dashboard layouts. The Vue package is MIT.</div>
  </DocsCard>
  <DocsCard href="/demo/emerald/" hoverable>
    <div class="flex items-center gap-3 mb-2">
      <img src="https://cdn.vuetifyjs.com/docs/images/one/logos/emerald.png" alt="" class="size-8 object-contain shrink-0">
      <div class="text-lg font-semibold">Dashboard</div>
    </div>
    <div class="text-sm text-on-surface-variant">A demo of these components, including the calendar and the kanban board.</div>
  </DocsCard>
</div>

<DocsSystemActivator />

## What Emerald is

Emerald has its own tokens, its own icon set, and its own component names. Selection, focus, popovers, validation, and keyboard behavior come from v0.

`EmSelect` is a short template and stylesheet on v0's `Select`. A keyboard fix in v0 reaches `EmSelect` without a separate Emerald release.

The Emerald component behaves like the Vuetify0 compound it wraps. Where Emerald has no prop for something, use the Vuetify0 component.

## Figma UI Kit

The Vue package is MIT. The Figma file is sold separately, and it uses the same `--emerald-*` token names, the same `Em*` parts, and the same `emerald-light` and `emerald-dark` themes. You can build from these docs and the source without the file.

The kit includes Figma variables named like the CSS tokens, every shipped `Em*` family with its variants and parts, the icon set (48 glyphs, 72 names), and layouts from the [dashboard](/demo/emerald/).

Buy it on the [Vuetify Store](https://store.vuetifyjs.com/products/official-emerald-ui-kit-for-figma). Licenses are Personal, Commercial, and Unlimited. They cover the Figma file. The Vue package stays MIT.

## Installation

```bash
pnpm add @paper/emerald
```

The plugin registers the theme adapter, the two themes, and the icon set:

```ts main.ts
import { createApp } from 'vue'
import { createEmeraldPlugin } from '@paper/emerald'

import '@paper/emerald/theme.css'
import '@paper/emerald/style.css'

import App from './App.vue'

createApp(App)
  .use(createEmeraldPlugin())
  .mount('#app')
```

Use `createEmeraldPlugin()`. It constructs `EmeraldStyleSheetAdapter` for you.

Two options turn parts of that setup off:

| Option | Effect |
|--------|--------|
| `{ theme: false }` | Skips the theme plugin. Use this when the app already calls `createThemePlugin` and will attach `EmeraldStyleSheetAdapter` and `emeraldColors` itself |
| `{ icons: false }` | Skips installing the icon registry on the app. `EmIcon` still draws from the built-in set[^icons-bundle] |

[^icons-bundle]: `{ icons: false }` skips installation. It does not remove the glyph map from the bundle, because the plugin entry imports that map statically. Components that draw a glyph import `EmIcon`, so an app using Emerald controls already includes the map. To leave the map out, call `createEmeraldIconsPlugin` yourself and skip `createEmeraldPlugin`.

### Without the plugin

`theme.css` sets the light palette on `:root` and on `[data-theme="emerald-light"]`. Importing the stylesheets is enough for an app that only uses the light theme:

```ts main.ts
import '@paper/emerald/theme.css'
import '@paper/emerald/style.css'
```

Dark mode is opt-in either way. Set `data-theme="emerald-dark"` on an element and the `--emerald-*` colors and shadows inside it switch. Light stays the default. The attribute works on `<html>` or on a smaller subtree, such as a sidebar.

## Tokens

Visual values are CSS custom properties named `--emerald-*`, generated from `colors.ts` and `design-system.ts`, which mirror the Figma variables. Colors sit on the theme attribute. Spacing, radius, type, icon, and motion sit on `:root`. Light shadows sit on `:root` too, and `data-theme="emerald-dark"` replaces them.

| Family | Examples |
|--------|----------|
| Color | `--emerald-primary-600`, `--emerald-surface`, `--emerald-on-background`, `--emerald-danger-400` |
| Spacing | `--emerald-spacing-2xs` … `--emerald-spacing-m` |
| Radius, stroke | `--emerald-radius-m`, `--emerald-stroke-s` |
| Type | `--emerald-text-b2-size`, `--emerald-text-b2-height`, `--emerald-text-b2-weight` |
| Icon, shadow, motion | `--emerald-icon-m`, `--emerald-shadow-m`, `--emerald-motion-duration-fast` |

Each color is emitted as a hex value and as space-separated RGB channels. Use `--emerald-primary-600-channels` in `rgb(… / 0.4)` when you need a translucent overlay.

### The v0 bridge

Emerald also writes its color roles onto the `--v0-*` names that Vuetify0 kits read, so a kit written against those names picks up Emerald's colors.

Most names match: `--v0-primary` copies `--emerald-primary`. A few names differ: `--v0-error` reads `danger`, `--v0-warning` reads `alert`, and `--v0-accent` reads `primary`. Each of those is emitted with its foreground color.

Pass `{ v0Aliases: false }` to the adapter to skip the `--v0-*` names.

## Icons

Icons are named by role. Ask for `calendar` or `envelope`. The glyph is inline SVG, so there is no icon font and no sprite sheet to load. The set has 48 glyphs and 72 names. 24 names are aliases: `mail` uses the `envelope` glyph, and `finance` and `payments` both use `card`.

```vue
<template>
  <EmIcon name="calendar" />

  <EmIcon label="Unread mail" name="mail" />
</template>
```

Icons are decorative by default and hidden from assistive technology. Pass `label` when an icon should be announced. Roles, aliases, and the accessibility rules are on the [EmIcon page](/systems/emerald/icon).

## Components

Every component below is exported from `@paper/emerald` and has its own page. Two rules apply to all of them.

| Component | What it wraps | Page |
|-----------|---------------|------|
| `EmAlert` | v0 `Atom` | [Alert](/systems/emerald/alert) |
| `EmAvatar` | v0 `Avatar` | [Avatar](/systems/emerald/avatar) |
| `EmBadge` | v0 `Atom` | [Badge](/systems/emerald/badge) |
| `EmBreadcrumbs` | v0 `Breadcrumbs` | [Breadcrumbs](/systems/emerald/breadcrumbs) |
| `EmButton` | v0 `Button` | [Button](/systems/emerald/button) |
| `EmCalendar` | a private calendar core inside Emerald, ahead of a v0 graduation | [Calendar](/systems/emerald/calendar) |
| `EmCard` | v0 `Atom` | [Card](/systems/emerald/card) |
| `EmCheckbox` | v0 `Checkbox` | [Checkbox](/systems/emerald/checkbox) |
| `EmDialog` | v0 `Dialog` | [Dialog](/systems/emerald/dialog) |
| `EmDivider` | v0 `Atom` | [Divider](/systems/emerald/divider) |
| `EmExpansionPanel` | v0 `ExpansionPanel` | [ExpansionPanel](/systems/emerald/expansion-panel) |
| `EmIcon` | v0 `createTokens` | [Icon](/systems/emerald/icon) |
| `EmKanban` | v0 `createKanban` + `useDragDrop` | [Kanban](/systems/emerald/kanban) |
| `EmList` | v0 `Single` | [List](/systems/emerald/list) |
| `EmPagination` | v0 `Pagination` | [Pagination](/systems/emerald/pagination) |
| `EmPopover` | v0 `Popover` | [Popover](/systems/emerald/popover) |
| `EmProgress` | v0 `Progress` | [Progress](/systems/emerald/progress) |
| `EmRadio` | v0 `Radio` | [Radio](/systems/emerald/radio) |
| `EmSelect` | v0 `Select` | [Select](/systems/emerald/select) |
| `EmSlider` | v0 `Slider` | [Slider](/systems/emerald/slider) |
| `EmSnackbar` | v0 `Snackbar` | [Snackbar](/systems/emerald/snackbar) |
| `EmSpinner` | v0 `Atom` | [Spinner](/systems/emerald/spinner) |
| `EmStep` | v0 `Step` | [Step](/systems/emerald/step) |
| `EmSwitch` | v0 `Switch` | [Switch](/systems/emerald/switch) |
| `EmTabs` | v0 `Tabs` | [Tabs](/systems/emerald/tabs) |
| `EmTag` | v0 `Atom` | [Tag](/systems/emerald/tag) |
| `EmTextField` | v0 `Input` | [TextField](/systems/emerald/text-field) |
| `EmTextarea` | v0 `Input` | [Textarea](/systems/emerald/textarea) |
| `EmTooltip` | v0 `Tooltip` | [Tooltip](/systems/emerald/tooltip) |

**No named slots.** `EmButton`, `EmTextField`, and `EmCheckbox` have a fixed shape: props, and one default slot. Components whose tree changes are compounds of parts, such as `EmDialogTitle`, `EmSelectItem`, and `EmCalendarHeader`. A label is a prop or a part.

**Most parts take `namespace`.** It chooses which parent a part belongs to when two of the same compound are nested. Leave it off otherwise. Parts with no state of their own, such as `EmDialogFooter`, do not take `namespace`.

> [!NOTE]
> Emerald is in preview. Component APIs can change between minor versions. Prop tables on these pages are written by hand until generated API reference covers `@paper/*`.
