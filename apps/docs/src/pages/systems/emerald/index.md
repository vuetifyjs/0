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
  - /systems/emerald/figma
  - /systems/emerald/tokens
  - /systems/emerald/button
---

# Emerald

<DocsPageFeatures :frontmatter />

Emerald is a design system for Vue, built on [Vuetify0](/). It ships tokens, CSS, and `Em*` components. v0 handles behavior and accessibility. Emerald handles appearance.

<DocsSystemActivator />

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

> [!NOTE]
> Reference: [Figma kit](/systems/emerald/figma). The Vue package is MIT. The file is sold separately.

## Installation

::: code-group no-filename

```bash pnpm
pnpm add @paper/emerald
```

```bash npm
npm install @paper/emerald
```

```bash yarn
yarn add @paper/emerald
```

```bash bun
bun add @paper/emerald
```

:::

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

Options that skip the theme or the icon registry, importing the stylesheets without the plugin, and the `--v0-*` color bridge are on the [tokens](/systems/emerald/tokens) page.

## Components

Every component below is exported from `@paper/emerald` and has its own page.

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

There are no named slots. Each region is its own component. Pass `namespace` only when two of the same compound are nested.

> [!NOTE]
> Emerald is in preview. Component APIs can change between minor versions. Prop tables on these pages are written by hand until generated API reference covers `@paper/*`.
