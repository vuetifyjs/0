---
title: Md1Divider - Material Design 1 Divider for Vue
meta:
- name: description
  content: The Material Design 1 divider, a 1 dp rule in the 12% divider ink, full bleed between distinct sections or inset to the 72 dp content keyline beside avatars and icons. Built on Vuetify0's Atom.
- name: keywords
  content: md1 divider, material design 1 divider, inset divider, full-bleed divider, list divider, vue divider, vuetify0 atom, paper md1
features:
  category: Component
  label: 'C: Md1Divider'
  level: 2
  renderless: false
  group: content
  order: 4
related:
  - /systems/md1
  - /systems/md1/subheader
  - /components/primitives/atom
---

# Md1Divider

<DocsPageFeatures :frontmatter />

The Material Design 1 divider. A 1 dp rule in the 12% divider ink, full bleed between distinct sections or inset to the content keyline beside the avatars and icons of related content.

> [!NOTE]
> Reference: [Dividers, Material Design 1 guidelines](https://m1.material.io/components/dividers.html), the archived page Material Design 1 is pinned to. Types, placement and the 12% ink. This page is the Vue.

## Usage

`Md1Divider` is a presentational component: one `hr`, one prop, no slot. The default is the full-bleed divider that runs edge to edge of its container; `inset` starts it at the content keyline.

Dividers group content in lists and page layouts. The guidelines warn that heavy use creates visual noise and dilutes their meaning: reach for white space and subheaders first, use full-bleed dividers when a list has no anchoring element and spacing alone does not separate its tiles, and use inset dividers only beside an anchoring avatar or icon.

::: ds-example
/systems/md1/divider/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Divider } from '@paper/md1'
</script>

<template>
  <Md1Divider />
</template>
```

## Composed on Vuetify0

`Md1Divider` renders v0's [Atom](/components/primitives/atom) as an `hr` and adds nothing to its behavior, because the guidelines describe a static rule and there is none to add. No v0 compound is composed and none is invented for it. `Atom` forwards every attribute to the `hr`, which is how `aria-hidden` or `role="presentation"` reach the element.

`data-inset` is Material Design 1's own hook; the stylesheet hangs the keyline off it. The divider has no states, so it has no other attributes: no `data-disabled`, no focus, no ripple. The ink is `--md1-divider`, 12% black on the light theme and 12% white on the dark one, drawn as a 1 px border rather than a fill.

## Examples

::: ds-example
/systems/md1/divider/inset

### Inset

An inset divider starts at the content keyline, 72 dp from the edge on handsets and 80 dp from 600 px, and runs to the end edge of the tile. The guidelines use it for related content: the sections of a contacts list, the emails of a conversation. It belongs beside an anchoring element, the avatar or icon the keyline aligns with; without one, a full-bleed divider is the right form. Material Design 1 draws the inset as a logical start margin, so it mirrors under `dir="rtl"`, and reads the same keyline token the lists use (`--md1-keyline-content`).

The example is the guidelines' contacts list: a 40 dp avatar at the margin keyline, 16 dp on handsets and 24 dp from 600 px, and the name at the content keyline, with an inset divider closing each tile. Overuse dilutes the meaning here as much as with the full-bleed form; one rule per related tile is the pattern, and tiles that are already separated by white space need none.
:::

::: ds-example
/systems/md1/divider/sections

### Full bleed between sections

A full-bleed divider separates distinct content: biographic details from contact information in the guidelines' example, or the tiles of a list that has no anchoring element. It can also mark a seam, the place where material will expand when content expands. The example is the guidelines' contact sheet: one rule between the person and the ways to reach them, and white space alone between the related tiles inside each section.

The rule is 1 dp and, in the guidelines' model, sits within the bottom edge of the tile it closes, so a 48 dp tile with a divider stays 48 dp. As a standalone element between sections, Material Design 1 adds exactly 1 dp and no margin; the space around it belongs to the surrounding layout, not to the divider.
:::

::: ds-example
/systems/md1/divider/subheader

### Above a subheader

When a divider is used with a subheader, the guidelines place it above the subheader, tying the subheader to the content below it rather than closing the content above. The pairing is an `Md1Divider` followed by a [Md1Subheader](/systems/md1/subheader); the guidelines' figure draws the divider full bleed.

Do not put the rule under the subheader. A rule between a heading and the content it names reads as a separation from that content, the opposite of what the subheader is for. Image-based grid lists take no dividers at all: white space and subheaders separate their sections.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Divider.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Starts the rule at the content keyline (72 dp, 80 dp from 600 px) instead of the edge. Full bleed otherwise |

The divider has no slot and no state. Attributes fall through to the `hr`.

## Accessibility

`Md1Divider` renders a native `hr`, whose implicit role is `separator`. Nothing is written over it, so a rule between two distinct sections announces as the separator it is.

A rule between list items that the markup already separates is decoration, and announcing it is noise. Hide those with `aria-hidden="true"` or `role="presentation"`; both fall through to the element.

```vue
<template>
  <Md1Divider aria-hidden="true" />
</template>
```

The rule is never focusable and has no keyboard interaction. The WAI-ARIA focusable separator is a movable splitter, which this component is not. In forced-colours mode the rule survives, because it is drawn as a border rather than a background.
