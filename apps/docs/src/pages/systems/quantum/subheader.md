---
title: QuSubheader - Quantum Subheader for Vue
meta:
- name: description
  content: The Material Design 1 subheader, a 48 dp tile in Roboto Medium 14 sp that names a section of a list, grid list or menu, in the secondary ink or the primary colour, pinned while scrolling. Built on Vuetify0's Atom.
- name: keywords
  content: quantum subheader, material design 1 subheader, list subheader, sticky subheader, pinned subheader, vue subheader, vuetify0 atom, paper quantum
features:
  category: Component
  label: 'C: QuSubheader'
  level: 2
  renderless: false
  group: content
  order: 7
related:
  - /systems/quantum
  - /systems/quantum/divider
  - /components/primitives/atom
---

# QuSubheader

<DocsPageFeatures :frontmatter />

The Material Design 1 subheader. A 48 dp tile that names a section of a list, grid list or menu, in Roboto Medium 14 sp at the secondary ink or in the primary colour, pinned to the top of its scroll container until the next subheader pushes it off.

> [!NOTE]
> Reference: [Subheaders, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/subheaders.html), the archived page Quantum is pinned to. Metrics, alignment, colour and the scrolling rule. This page is the Vue.

## Usage

`QuSubheader` is a presentational component: fixed anatomy, three props, and the default slot is the title. It is a heading for the section that follows it, so one subheader opens each section and the sections are the list's filtering or sorting groups.

Left-align the subheader with the avatar or icon of the list: the margin keyline, 16 dp on handsets and 24 dp from 600 px, is the default. When a left-aligned floating action button occupies that column, `inset` moves the title to the text keyline instead.

::: ds-example
/systems/quantum/subheader/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuSubheader } from '@paper/quantum'
</script>

<template>
  <QuSubheader />
</template>
```

## Composed on Vuetify0

`QuSubheader` renders v0's [Atom](/components/primitives/atom) as a `div` with `role="heading"` and adds nothing to its behavior: a subheader is static text, so no v0 compound is composed and none is invented for it. `Atom` forwards every attribute to the element, which is how a different `aria-level` or an `id` reaches it.

`data-inset`, `data-primary` and `data-sticky` are Quantum's own hooks; the stylesheet hangs the keyline, the colour and the pinning off them. The type is the Body 2 token set (`--quantum-type-body-2-*`), the ink is `--quantum-text-secondary` or `--quantum-primary`, and the keylines are `--quantum-keyline-margin` and `--quantum-keyline-content`, so a theme that moves any of them moves the subheader with it.

## Examples

::: ds-example
/systems/quantum/subheader/inset

### Inset

The subheader normally aligns with the avatar or icon column at the margin keyline. When a left-aligned floating action button occupies that column, the guidelines align the subheader with the text content instead: the content keyline, 72 dp from the edge on handsets and 80 dp from 600 px, which the guidelines also give as the width of the floating action button's tile. `inset` is that layout decision made explicit, rather than something the component detects.

The example stands a 56 dp accent disc in for the floating action button, centred in its column, with the subheader and the tiles below it at the content keyline. The inset is a logical start padding, so it mirrors under `dir="rtl"`, and it reads the same `--quantum-keyline-content` token the lists and dividers use.
:::

::: ds-example
/systems/quantum/subheader/primary

### Coloured subheaders

A subheader is normally set in the secondary ink, 54% black on the light theme and 70% white on the dark one. In long lists of complex information, the guidelines suggest coloured subheaders to delineate content, with the Android settings screen as the example and a files app as the figure. `primary` sets the title in the app's primary colour, Indigo 500 in the default theme, and leaves everything else unchanged: the tile stays 48 dp, the type stays Body 2, the fill stays absent.

Use it when the sections are the point of the screen rather than a convenience, and use it consistently: a list that mixes grey and coloured subheaders reads as two different kinds of section.
:::

::: ds-example
/systems/quantum/subheader/sticky

### Pinned while scrolling

Upon scrolling, the guidelines pin a subheader to the top of the screen until the next subheader pushes it off. Quantum maps that to `position: sticky` at the top of the scroll container, the default; `:sticky="false"` turns it off (the bound form: a bare `sticky="false"` passes the string `"false"`, which is truthy). The push comes from the containing block: give each section its own element, as the example does, and the pinned subheader leaves with its section when the next one arrives. Subheaders that are direct siblings in one container each pin at the top instead, the later one covering the earlier.

A subheader has no fill of its own, so while pinned it inherits its parent's background colour; the sections in the example carry the surface colour for that reason. It also sits above the tiles that scroll under it, so a list whose tiles are positioned, as every ripple host is, still scrolls beneath the pinned title.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuSubheader.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Moves the title from the avatar keyline (16 dp, 24 dp from 600 px) to the content keyline (72 dp, 80 dp from 600 px), for a list whose avatar column holds a left-aligned floating action button |
| `primary` | `boolean` | `false` | Sets the title in the primary colour instead of the secondary ink |
| `sticky` | `boolean` | `true` | Pins the tile to the top of its scroll container until the next subheader pushes it off |

The default slot is the title, one line; longer text truncates with an ellipsis. There are no named slots.

## Accessibility

`QuSubheader` renders a `div` with `role="heading"` and `aria-level="2"`, so a screen reader lists it among the headings of the page and heading navigation reaches it. A heading needs a level and user agents assume 2 when none is given; Quantum sets it explicitly. Pass `aria-level` to place the subheader in the document's hierarchy, for instance `aria-level="3"` under a level 2 section title.

```vue
<template>
  <QuSubheader aria-level="3">Folders</QuSubheader>
</template>
```

The subheader is never focusable and has no keyboard interaction; the guidelines say nothing about keyboard because there is nothing to operate. A pinned subheader is a visual behaviour only: the reading order is unchanged.

### Contrast

The secondary ink clears the 4.5:1 floor of the guidelines' accessibility page on both themes: 54% black on white is about 4.6:1, and 70% white on the Grey 800 surface about 5.9:1. The primary variant, Indigo 500 on white, is about 6.9:1. The guidelines give no dark-theme value for the coloured subheader, and Quantum keeps the primary role there: Indigo 500 on the Grey 800 surface is about 1.5:1, far below the floor. On the dark theme, keep the secondary ink or theme a primary hue that clears 4.5:1 against the surface it sits on.
