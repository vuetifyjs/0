---
title: Tokens - Emerald CSS variables and theme setup
meta:
- name: description
  content: Emerald names its tokens as CSS custom properties, --emerald-*. The plugin installs the theme and the icon set. Pass flags to skip either, or import the stylesheets alone.
- name: keywords
  content: emerald tokens, css variables, emerald theme, createEmeraldPlugin, v0 aliases, design tokens
features:
  category: Guide
  label: 'Tokens'
  level: 2
  order: 0
related:
  - /systems/emerald
  - /systems/emerald/figma
  - /systems/emerald/icon
---

# Tokens

<DocsPageFeatures :frontmatter />

Emerald stores visual values in `--emerald-*` custom properties. The theme plugin writes the color roles. Spacing, type, icons, and motion sit on `:root`.

The [Emerald](/systems/emerald) page shows the install commands and the default `createEmeraldPlugin()` call. This page covers the rest of that setup.

## Plugin

Two options turn parts of the default setup off:

| Option | Effect |
|--------|--------|
| `{ theme: false }` | Skips the theme plugin. Use this when the app already calls `createThemePlugin` and will attach `EmeraldStyleSheetAdapter` and `emeraldColors` itself |
| `{ icons: false }` | Skips installing the icon registry on the app. `EmIcon` still draws from the built-in set[^icons-bundle] |

[^icons-bundle]: `{ icons: false }` skips installation. It does not remove the glyph map from the bundle, because the plugin entry imports that map statically. Components that draw a glyph import `EmIcon`, so an app using Emerald controls already includes the map. To leave the map out, call `createEmeraldIconsPlugin` yourself and skip `createEmeraldPlugin`.

### Without the plugin

`theme.css` sets the light palette on `:root` and on `[data-theme="emerald-light"]`. Import the stylesheets alone when the app uses only the light theme:

```ts main.ts
import '@paper/emerald/theme.css'
import '@paper/emerald/style.css'
```

You opt in to dark mode either way. Set `data-theme="emerald-dark"` on an element and the `--emerald-*` colors and shadows inside it switch. Light stays the default. The attribute works on `<html>` or on a smaller subtree, such as a sidebar.

## Custom properties

`colors.ts` and `design-system.ts` generate the values, and they mirror the Figma variables. Colors sit on the theme attribute. Spacing, radius, type, icon, and motion sit on `:root`. Light shadows sit on `:root` too, and `data-theme="emerald-dark"` replaces them.

| Family | Examples |
|--------|----------|
| Color | `--emerald-primary-600`, `--emerald-surface`, `--emerald-on-background`, `--emerald-danger-400` |
| Spacing | `--emerald-spacing-2xs` … `--emerald-spacing-m` |
| Radius, stroke | `--emerald-radius-m`, `--emerald-stroke-s` |
| Type | `--emerald-text-b2-size`, `--emerald-text-b2-height`, `--emerald-text-b2-weight` |
| Icon, shadow, motion | `--emerald-icon-m`, `--emerald-shadow-m`, `--emerald-motion-duration-fast` |

The theme emits each color as a hex value and as space-separated RGB channels. Use `--emerald-primary-600-channels` in `rgb(… / 0.4)` when you need a translucent overlay.

## The v0 bridge

A behavior fix in a wrapped Vuetify0 component reaches the Emerald component without a separate Emerald release. Where Emerald has no prop for a behavior, use the Vuetify0 component the [catalog](/systems/emerald#components) lists.

Emerald also writes its color roles onto the `--v0-*` names that Vuetify0 kits read, so a kit that targets those names picks up Emerald's colors.

Most names match: `--v0-primary` copies `--emerald-primary`. A few names differ: `--v0-error` reads `danger`, `--v0-warning` reads `alert`, and `--v0-accent` reads `primary`. The theme emits each of those with its foreground color.

Pass `{ v0Aliases: false }` to the adapter to skip the `--v0-*` names.
