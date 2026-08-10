---
title: Emerald - A Rich Design System on Vuetify0
meta:
- name: description
  content: Emerald is a complete design system built on Vuetify0 — Figma-derived tokens, an icon set addressed by role, and Em* components that compose v0's headless compounds.
- name: keywords
  content: emerald, design system, vuetify0, paper, vue design system, design tokens, emerald components
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

Emerald is a design system built on [Vuetify0](/): tokens, CSS, and a set of `Em*` components that wrap v0's headless compounds. v0 supplies the behavior and the accessibility; Emerald decides what it looks like.

## What Emerald is

A design system here is a **complete framework**, not a theme. Emerald does not restyle someone else's components — it brings its own tokens, its own icon set, and its own component vocabulary, and it reaches down to v0 for every piece of logic underneath. Selection, focus management, popover positioning, validation, keyboard interaction: none of that is reimplemented, and none of it is Emerald's to get wrong.

That split is the whole point of the layering. An `EmSelect` is a few dozen lines of template and CSS over v0's `Select` compound. When v0 fixes a listbox keyboard bug, Emerald inherits the fix without a release of its own.

The practical consequence for you: everything you learn about a v0 compound applies to the Emerald component that wraps it, and anything Emerald does not expose is still reachable by dropping to the v0 component underneath.

## Installation

> [!IMPORTANT]
> `@paper/emerald` is not published yet. The commands and imports below are the shape the install will take when it ships — they will not resolve from npm today. Emerald currently builds inside the [vuetifyjs/0](https://github.com/vuetifyjs/0) monorepo.

```bash
pnpm add @paper/emerald
```

The plugin wires the theme adapter, registers the two shipped themes, and installs the icon set:

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

That is the entire install. Do not construct `EmeraldStyleSheetAdapter` yourself — the plugin owns it.

Both halves of the install are independently optional:

| Option | Effect |
|--------|--------|
| `{ theme: false }` | Skips the theme plugin. For hosts that already run `createThemePlugin` and will attach `EmeraldStyleSheetAdapter` and `emeraldColors` themselves |
| `{ icons: false }` | Skips the app-level icon registry. `EmIcon` still draws — it falls back to the built-in set on its own[^icons-bundle] |

[^icons-bundle]: `{ icons: false }` skips the *install*, not the bundle. Static imports cannot be conditional, so composing the icon plugin in the entry pins the glyph map either way. In practice nothing is lost: every `Em*` component that draws a glyph imports `EmIcon`, so any app using Emerald's controls already carries it. To leave the map out entirely, install `createEmeraldIconsPlugin` yourself and skip `createEmeraldPlugin`.

### Without the plugin

`theme.css` carries the light palette on `:root` as well as on `[data-theme="emerald"]`, so a bare CSS import is a complete install for a single-theme app — no plugin, no JavaScript:

```ts main.ts
import '@paper/emerald/theme.css'
import '@paper/emerald/style.css'
```

Dark is opt-in on either path. Set `data-theme="emerald-dark"` on any element and every `--emerald-*` color and shadow flips beneath it; light stays the default. That is a plain attribute, so it scopes to a subtree as happily as to `<html>` — a dark sidebar over a light page needs no second theme instance.

## Tokens

Every visual decision is a CSS custom property under `--emerald-*`, generated from the same `colors.ts` and `design-system.ts` the Figma library exports to. Colors live on the theme attribute; everything dimensional lives on `:root`, because a spacing scale does not have a dark variant.

| Family | Examples |
|--------|----------|
| Color | `--emerald-primary-600`, `--emerald-surface`, `--emerald-on-background`, `--emerald-danger-400` |
| Spacing | `--emerald-spacing-2xs` … `--emerald-spacing-m` |
| Radius, stroke | `--emerald-radius-m`, `--emerald-stroke-s` |
| Type | `--emerald-text-b2-size`, `--emerald-text-b2-height`, `--emerald-text-b2-weight` |
| Icon, shadow, motion | `--emerald-icon-m`, `--emerald-shadow-m`, `--emerald-motion-duration-fast` |

Colors are emitted twice: as the hex value and as space-separated RGB channels, so `--emerald-primary-600-channels` can be dropped into an `rgb(… / 0.4)` for a translucent overlay without a second token.

### The v0 bridge

Alongside its own namespace, Emerald mirrors its color roles onto the `--v0-*` names that v0 kits read. Anything built against the generic kit vocabulary picks up Emerald's brand colors with no adapter of its own.

The mapping is mostly one-to-one (`--v0-primary` ← `--emerald-primary`), with a few renames where the two vocabularies disagree about severity: `--v0-error` reads Emerald's `danger`, `--v0-warning` reads `alert`, and `--v0-accent` reads `primary`. Each is emitted with its paired foreground, so a kit never gets a background without the `on-` color that is legible against it.

Pass `{ v0Aliases: false }` to the adapter to suppress the mirror entirely.

## Icons

Emerald's icon set is addressed by **role**, not by drawing. You ask for `calendar` or `envelope`; you never name a file, and there is no icon font or sprite sheet to load. 48 glyphs answer to 72 names, because 24 of those names are aliases pointing at a shared drawing — `mail` resolves to the `envelope` glyph, `finance` and `payments` both resolve to `card`.

```vue
<template>
  <EmIcon name="calendar" />

  <EmIcon label="Unread mail" name="mail" />
</template>
```

Icons are decorative by default and hidden from assistive technology; passing `label` is what promotes one to a labelled image. The full role list, the alias table, and the accessibility contract are on the [EmIcon page](/systems/emerald/icon).

## Components

The pages below are the documented pilot. The package ships considerably more than this — alerts, cards, tabs, tooltips, snackbars, kanban boards and the rest — and those pages are being written; the components themselves are already exported from `@paper/emerald`.

| Component | What it wraps | Page |
|-----------|---------------|------|
| `EmButton` | v0 `Button` | [Button](/systems/emerald/button) |
| `EmTextField` | v0 `Input` | [TextField](/systems/emerald/text-field) |
| `EmSelect` | v0 `Select` | [Select](/systems/emerald/select) |
| `EmDialog` | v0 `Dialog` | [Dialog](/systems/emerald/dialog) |
| `EmCalendar` | an incubating v0 calendar core | [Calendar](/systems/emerald/calendar) |
| `EmIcon` | v0 `createTokens` | [Icon](/systems/emerald/icon) |

Two conventions hold across all of them, and knowing them removes most of the guesswork about an undocumented component:

**No named slots.** A component with fixed anatomy — `EmButton`, `EmTextField`, `EmCheckbox` — takes props and one default slot. A component with a variable tree ships as a compound of express parts instead: `EmDialogTitle`, `EmSelectItem`, `EmCalendarHeader`. If you are looking for a `#label` slot, the answer is either a prop or a part.

**Nearly every part takes `namespace`.** It selects which instance a part talks to, and you only need it when two of the same compound are nested. Otherwise leave it alone. The exceptions are the parts that hold no state of their own — `EmDialogFooter` is pure layout and takes no `namespace` at all.

> [!NOTE]
> Emerald is in preview. Component APIs may change between minor versions, and the prop tables on these pages are hand-authored ahead of generated API reference.
