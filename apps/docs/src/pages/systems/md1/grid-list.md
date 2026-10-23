---
title: Md1GridList - Material Design 1 Grid List for Vue
meta:
- name: description
  content: The Material Design 1 grid list, image tiles in a grid of cells with header and footer bars, 4 dp or 1 dp gutters, the ratio keylines, spanning tiles, the horizontal gallery and selected tiles. Built on Vuetify0's Atom and Button.
- name: keywords
  content: md1 grid list, material design 1 grid list, image grid, gallery, grid tile, tile bar, vue grid list, vuetify0 atom, vuetify0 button, paper md1
features:
  category: Component
  label: 'C: Md1GridList'
  level: 2
  renderless: false
  group: content
  order: 6
related:
  - /systems/md1
  - /systems/md1/card
  - /systems/md1/subheader
  - /systems/md1/icon
  - /components/primitives/atom
  - /components/actions/button
---

# Md1GridList

<DocsPageFeatures :frontmatter />

The Material Design 1 grid list. A repeated pattern of cells holding image tiles, with an optional header or footer bar of text and one action icon on each tile.

> [!NOTE]
> Reference: [Grid lists, Material Design 1 guidelines](https://m1.material.io/components/grid-lists.html), the archived page Material Design 1 is pinned to. Types, metrics, behavior and the tile bars. This page is the Vue.

## Usage

`Md1GridList` is a compound. The root is the grid; `Md1GridList.Tile` is one tile and its image; `Md1GridList.Bar` is the band of text over that image. A tile with a click listener or an `href` becomes one action that fills the whole tile.

Reach for a grid list when the items are alike and the image is what tells them apart. When the text has to carry the content, use a list or cards instead.

::: ds-example
/systems/md1/grid-list/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'
</script>

<template>
  <Md1GridList>
    <Md1GridList.Tile>
      <Md1GridList.Bar />
    </Md1GridList.Tile>
  </Md1GridList>
</template>
```

## Composed on Vuetify0

`Md1GridList` is presentational. The root renders a `<ul>` through v0's [Atom](/components/primitives/atom), and each tile is an `<li>`. A tile's primary action is v0's [Button](/components/actions/button) `Button.Root` (an `Atom` rendering `<a>` when `href` is set), and the bar's action icon is a second `Button.Root` wrapping `Button.Icon` around a [Md1Icon](/systems/md1/icon). Activation, focus order and Enter and Space come from the native element.

The root publishes `data-gutter`, `data-ratio` and `data-horizontal`; a tile publishes `data-selected`; a bar publishes `data-position`, `data-lines` and `data-icon`. Every interactive element hosts a [Md1Ripple](/systems/md1/ripple) as its first child. The image loads through v0's `useImage`, which drives the fade-in.

## Examples

::: ds-example
/systems/md1/grid-list/bars

### Header and footer bars

The secondary content of a tile sits in a band over the image, at the bottom (`position="footer"`, the default) or at the top (`position="header"`). A `title` alone gives the single-line bar, 48 dp tall with the text in Subheading, 16 sp. Adding a `subtitle` gives the two-line bar, 68 dp tall, with the second line in Caption, 12 sp. The text starts 16 dp from the tile edge and is cut with an ellipsis when it does not fit, since the guidelines ask you to truncate rather than wrap.

The guidelines draw the band as a translucent dark layer and give no value for it. Material Design 1 uses `--md1-grid-list-bar`, 60% black, the upper end of the imagery page's scrim range, so white text stays readable on any photo. The title is white at 100% and the subtitle at 70%, the colour page's primary and secondary values for light text on a dark background. The band stays the same in the dark theme.

The guidelines also allow a 14 sp over 14 sp two-line bar. Material Design 1 ships the 16 sp over 12 sp form only.
:::

::: ds-example
/systems/md1/grid-list/icon

### Action icon

`icon` puts one secondary action in the bar: a 24 dp glyph in a 48 dp button, flush with the tile edge as in every figure on the page. The bar emits `action` when it is pressed, by pointer, Enter or Space, and the tile's own click does not fire. `iconSide` puts it at the end (the default) or the start of the bar; at the end there are 16 dp between the text and the glyph, and at the start the text begins at the edge of the 48 dp button.

The guidelines ask for actions that are immediate, consistent in kind and in place across one grid list: one icon per tile, the same icon on every tile, no menus. The glyph is hidden from assistive technology, so `iconLabel` is required and names the button. The example shows the two sides as two separate grid lists, each consistent within itself, because one grid list never mixes them.
:::

::: ds-example
/systems/md1/grid-list/gutter

### Gutter

The guidelines give the grid list two paddings between tiles, 4 dp and 1 dp. `gutter` is `4` by default; `:gutter="1"` closes the gaps to a near-seamless mosaic for imagery that reads as one surface. The page background shows through the gaps. There is no other value: the gutter is the spec's, not a spacing scale.
:::

::: ds-example
/systems/md1/grid-list/spans

### Columns, ratio and spans

`columns` fixes the column count. Without it, the grid fills its width with as many columns as fit at a minimum of two layout increments (112 dp, 128 dp from 600 px), a Material Design 1 decision where the page gives no number. `ratio` is the shape every one-cell tile keeps, one of the ratio keylines of the metrics page: 16:9, 3:2, 4:3, 1:1 (the default), 3:4 or 2:3.

A tile can span more than one cell with `span` (across) and `rowSpan` (down). A larger tile draws the eye, which the guidelines recommend for a featured item; consider whether it still needs secondary text once the image is that large. Tiles flow left to right, then top to bottom, and re-sort when the width changes; a grid list never turns into a list.
:::

::: ds-example
/systems/md1/grid-list/horizontal

### Horizontal gallery

Grid lists scroll vertically. The one exception the guidelines permit is a single-line gallery of images, and `horizontal` is that form: one row that scrolls sideways. Tiles are three increments wide (168 dp, 192 dp from 600 px), a Material Design 1 decision, so the last visible tile is cut off at the initial scroll position. That cut is how the guidelines ask a horizontal list to show that there is more; never align the last tile with the edge of the view. With `columns`, exactly that many tiles share the visible width instead.
:::

::: ds-example
/systems/md1/grid-list/selection

### Selected tiles

`selected` applies the selection pattern of the guidelines: a scrim and a check mark over the item. The scrim is `--md1-selection`, the accent at 30%, and the check is the `check-circle` glyph in white at the start corner, in the same 48 dp box as a bar icon. The scrim does not take pointer events, so the tile stays pressable and a second press can clear the selection.

Material Design 1 does not own the selection. Keep the selected ids in your own state, toggle them from the tile's click, and pass `selected` back, as this example does. The check mark is labelled "Selected" (`Md1.selected` in the locale) and describes the tile's action, so assistive technology announces the state with the tile.
:::

::: ds-example
/systems/md1/grid-list/sections

### Sections

The guidelines separate sections of a grid list with subheaders and white space, never dividers. Place a [Md1Subheader](/systems/md1/subheader) before each section and give each section its own `Md1GridList`. The subheader is a 48 dp row with the text 16 dp from the edge, in Body 2 at the secondary ink. Keeping the subheader outside the `<ul>` keeps the list markup valid: a list holds only its tiles.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1GridList*.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gutter` | `1 \| 4` | `4` | The padding between tiles, in dp |
| `columns` | `number` | | A fixed column count. Unset, columns fill the width at a minimum of two increments. Under `horizontal`, the number of tiles that share the visible width. A value that is not a positive integer warns in development and falls back to auto-fill |
| `ratio` | `'16:9' \| '3:2' \| '4:3' \| '1:1' \| '3:4' \| '2:3'` | `'1:1'` | The ratio keyline every one-cell tile keeps |
| `horizontal` | `boolean` | `false` | The single-line gallery: one row that scrolls sideways |

The default slot holds the tiles, in reading order.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1GridList.Tile` | `src`, `alt` (`''`), `span` (`1`), `rowSpan` (`1`), `href`, `selected` (`false`) | An `<li>`. `src` is the image, covering the tile; `alt` describes it, and empty marks it decorative. A click listener makes the whole tile a `<button>`; `href` makes it an `<a>`. Without either the tile is not interactive. `selected` lays the selection scrim and check mark over it and sets `data-selected`. The default slot holds the bar |
| `Md1GridList.Bar` | `position` (`'footer'`), `title`, `subtitle`, `icon`, `iconSide` (`'end'`), `iconLabel` | The band over the image. `position` is `'header'` or `'footer'`. `title` is the first line, and also the accessible name of the tile's action; `subtitle` makes it the 68 dp two-line bar. `icon` is an `Md1Icon` role drawn in a 48 dp button at the `iconSide` edge, named by `iconLabel`. Emits `action` when the icon is pressed. The default slot adds content under the text |

There are no named slots.

## Accessibility

The grid list is a `<ul>` and every tile is an `<li>`, so assistive technology announces how many items there are and where each one is.

### Naming

An interactive tile is one `<button>` or `<a>` that fills the tile. Its name comes from the bar's `title`, linked with `aria-labelledby`, or from the image's `alt` when there is no bar. Without either, Material Design 1 warns in development, because an image-only action has nothing to announce. The bar's action icon is a separate button named by `iconLabel`; its glyph is hidden.

A tile without a click listener or `href` renders no button at all. Give its image an `alt` when the picture carries meaning, and leave it empty when a bar title already says what it shows.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves through the tiles in reading order: the tile's action, then its bar icon |
| Enter | Activates the focused tile or icon |
| Space | Activates the focused button |

Each tile is its own tab stop, the link-per-tile list the guidelines' web notes describe. A collection that needs arrow-key navigation with one tab stop is a layout grid in the WAI-ARIA sense, which Material Design 1 does not ship; compose it with v0's `useRovingFocus`.

### Focus and hover

Keyboard focus lays a 12% overlay over the tile, the focus value of the buttons page; a mouse hover lays 6% (10% on the dark theme), Material Design 1's hover value where a page states none. Both are drawn for `:focus-visible` and `:hover` only. Pressing draws the ripple from the press point.

### Selected

A selected tile's check mark is a labelled image ("Selected") and describes the tile's action through `aria-describedby`, so the state is announced with the tile's name. The selection itself is your state: the tile does not toggle on its own.

### Motion

When a grid list mounts, the tiles fade and lift in left to right, then top to bottom, each 20 ms after the previous, over 225 ms on the decelerate curve, the stagger rule of the choreography page. Images fade in from 20% saturation as they load. Both are skipped under reduced motion.
