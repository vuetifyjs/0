---
title: Md1BottomSheet - Material Design 1 Bottom Sheet for Vue
meta:
- name: description
  content: The Material Design 1 bottom sheet, modal or persistent, in list and grid layouts with an optional header and a full-height expanded state. Built on Vuetify0's Dialog, Portal and Collapsible.
- name: keywords
  content: md1 bottom sheet, material design 1 bottom sheet, modal bottom sheet, persistent bottom sheet, action sheet, vue bottom sheet, vuetify0 dialog, paper md1
features:
  category: Component
  label: 'C: Md1BottomSheet'
  level: 2
  renderless: false
  group: overlay
  order: 3
related:
  - /systems/md1
  - /systems/md1/dialog
  - /systems/md1/menu
  - /components/disclosure/dialog
  - /components/primitives/portal
  - /components/disclosure/collapsible
---

# Md1BottomSheet

<DocsPageFeatures :frontmatter />

The Material Design 1 bottom sheet. A sheet of material that slides up from the bottom edge: modal, over a scrim, to offer a set of actions, or persistent, beside the content it supplements.

> [!NOTE]
> Reference: [Bottom sheets, Material Design 1 guidelines](https://m1.material.io/components/bottom-sheets.html), the archived page Material Design 1 is pinned to. Types, list and grid metrics, the 16:9 keyline, widths and dismissal. This page is the Vue.

## Usage

`Md1BottomSheet` is a compound. The root is the sheet; `Activator` is its trigger, and the rest of its children, a `Title`, `Item` rows and `Md1Divider` sections, are its content. A modal sheet is an alternative to a menu or a simple dialog on a handset; on a wide screen a menu or a dialog usually fits better.

::: ds-example
/systems/md1/bottom-sheet/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1BottomSheet } from '@paper/md1'
</script>

<template>
  <Md1BottomSheet>
    <Md1BottomSheet.Activator />

    <Md1BottomSheet.Title />

    <Md1BottomSheet.Item />
  </Md1BottomSheet>
</template>
```

## Composed on Vuetify0

The modal sheet is v0's [Dialog](/components/disclosure/dialog): `Dialog.Root` owns the open state, `Dialog.Activator` is the trigger, `Dialog.Content` is the native `<dialog>` opened with `showModal()`, and `Dialog.Title` gives the sheet its accessible name. The browser contains focus, closes on Escape and paints `::backdrop`, which Material Design 1 fills with the sheet's scrim. Material Design 1 never mounts v0's `Scrim`: every `Dialog.Content` it renders passes `scrim: false`.

The persistent sheet is not a dialog, and v0 has no non-modal sheet, so Material Design 1 assembles one. A v0 [Portal](/components/primitives/portal) mounts it while it is open and gives it a stack z-index, and a [Collapsible](/components/disclosure/collapsible) root renders the `<aside>` and owns the expanded state. `Item` is a v0 [Button](/components/actions/button) root, or an anchor when it has an `href`.

The root's one slot holds both the trigger and the content. Material Design 1 renders the `Activator` children outside the sheet, where a closed `<dialog>` cannot hide them, and everything else inside. That is why `Activator` must be a direct child of the root rather than wrapped in a component of your own.

## Examples

::: ds-example
/systems/md1/bottom-sheet/title

### Header and sections

A list sheet with a header: the `Title` row is 56 dp tall, set in Regular 16 sp at 54% (`--md1-text-secondary`), with a 1 dp divider under it and 8 dp before the first action. The title also names the sheet for assistive technology, through `Dialog.Title` on a modal sheet and `aria-labelledby` on a persistent one, so a sheet with a header needs no other label.

Each `Item` is a 48 dp row on the 16 dp keyline: a 24 dp icon in the active icon ink (54%), 32 dp of space, then the label in Regular 16 sp at 87%. An `Md1Divider` between items starts a new section and takes 8 dp above and below. `disabled` drops the row to 38% ink and removes it from the tab order; `href` makes the row a link, as the page's "open the application" action is.

The guidelines state no hover, focus or pressed values for the rows, so they take Vuetify 1.5's list tile: a 4% hover overlay (8% white on the dark theme), no fill for keyboard focus, where the browser's focus ring marks the row, and the ripple on press.
:::

::: ds-example
/systems/md1/bottom-sheet/grid

### Grid

`grid` lays the items out as tiles: a 48 dp icon with a 16 dp label 8 dp below it, the icons spread evenly across each row. The grid keeps 24 dp of margin on every side and 24 dp between rows (the 2016 page said 16 dp; Material Design 1 follows the 2018 page). A header runs across the grid, flush with the sheet's edges, with 8 dp between its divider and the first row.

The page sizes the label row and not its type. Material Design 1 sets the label in Caption, 12 sp, on the 16 dp line, centred under the icon; that choice is a decision. Use a grid for a share sheet or an app chooser, where the icons carry recognition; use the list when the labels need room or subtext.
:::

::: ds-example
/systems/md1/bottom-sheet/expanded

### Expanded

A sheet opens at the height of its content, capped at the 16:9 ratio keyline: the width times 9/16, 202 dp on a 360 dp phone. It never reaches the app bar either; an increment and 8 dp stay clear above it so there is always somewhere to tap and dismiss. A longer list scrolls inside the sheet.

`v-model:expanded` lifts the cap: the sheet fills the screen, its content scrolls internally, and an X appears in a bar at the top. The X dismisses the sheet, as the page specifies, and every dismissal returns the next opening to the initial height. On a handset the guidelines expand the sheet with an upward swipe. Material Design 1 ships no gestures, so the expanded state is a model and the root's `expand` slot prop, here bound to a footer button.
:::

::: ds-example
/systems/md1/bottom-sheet/persistent

### Persistent

`persistent` makes the sheet part of the layout: no scrim, no focus trap, and the content beside it stays interactive. It rests at the app's own elevation, so it casts no shadow; Material Design 1 draws a 1 dp divider seam along its top edge, a decision where the page states only the elevation. The sheet is an `<aside>`, a complementary landmark named by its title. Its `Activator` is a disclosure button with `aria-expanded` and `aria-controls`, and Escape from inside the sheet dismisses it.

Choosing an item in a modal sheet dismisses the sheet; choosing one in a persistent sheet leaves it in place, which is the point of a persistent sheet: playback controls that stay, place details beside a map. A persistent sheet portals to the stack target by default. This example passes `:teleport="false"` so the sheet stays inside the preview, where `md1-docs-screen` is the containing block of its fixed position.
:::

::: ds-example
/systems/md1/bottom-sheet/inset

### Inset persistent

On a phone a persistent sheet spans the full width. On tablet and desktop the guidelines allow it "full width or inset, as determined by content width, overall UI, underlying content, and stylistic choices", so the choice is yours: `inset` applies the modal sheet's increment rule to a persistent one from 960 px. The sheet stays at least 1 increment (64 dp) from each side edge and at least 6 increments wide at 960 dp, 2 and 8 at 1280 dp, 3 and 9 at 1440 dp, and the content sets the width in between. Inset, the sheet no longer meets the side edges, so its 1 dp seam runs up both sides as well as along the top.

Widen the window past 960 px to see the inset. The breakpoints are viewport media queries, so the sheet measures the window, not the preview.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1BottomSheet.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Whether the sheet is open (`v-model`) |
| `expanded` | `boolean` | `false` | Full height with internal scrolling and an X bar (`v-model:expanded`). Reset to `false` on every dismissal |
| `persistent` | `boolean` | `false` | The non-modal sheet: an `<aside>` at the app's elevation with no scrim or focus trap. Unset, the sheet is a modal `<dialog>` at 16 dp (14 dp under a fine pointer) over a 20% black scrim |
| `inset` | `boolean` | `false` | Persistent only. From 960 px, insets the sheet by layout increments like the modal sheet instead of spanning the full width |
| `grid` | `boolean` | `false` | Lays the items out as 48 dp icon tiles with labels instead of 48 dp rows |
| `teleport` | `boolean` | `true` | Persistent only. `false` renders the sheet where it is declared instead of at the stack target |
| `id` | `string` | | The sheet element's id; generated when unset |

Attributes such as `class` and `aria-label` land on the sheet element, the `<dialog>` or the `<aside>`. The root's default slot receives `isOpen`, `isExpanded`, `open`, `close` and `expand`.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1BottomSheet.Activator` | | Renderless. Spread its `attrs` slot prop onto an `Md1Button`. Opens a modal sheet (`aria-haspopup="dialog"`) or toggles a persistent one (`aria-controls`). Must be a direct child of the root |
| `Md1BottomSheet.Title` | | The 56 dp header row and its divider; an `<h2>` that names the sheet |
| `Md1BottomSheet.Item` | `icon?: Md1IconName`, `href?: string`, `disabled?: boolean` | A 48 dp row, or a grid tile under `grid`. A `<button>`, or an `<a>` with `href`. Dismisses a modal sheet when chosen |

Sections are separated with a [Md1Divider](/systems/md1/divider). There are no named slots.

## Accessibility

The modal sheet is the APG modal dialog pattern on a native `<dialog>`: `role="dialog"`, `aria-modal="true"`, focus moved to the first item on open and contained in the sheet, and returned to the trigger on close. The rest of the page is inert while it is open, so the underlying content cannot scroll or take focus.

The persistent sheet is a `complementary` landmark. It traps nothing and moves no focus on open; its trigger reports `aria-expanded` and points at it with `aria-controls`. When it closes with focus inside it, by Escape or the X, focus returns to the element that held it when the sheet opened, usually the trigger, rather than dropping to the document.

### Naming

Give every sheet a `Title`, or an `aria-label` on the root when it has no header: the title is the accessible name of the dialog or the landmark. Items are named by their label text; their icons are `aria-hidden`. The X of the expanded sheet is named from the `Md1.close` locale key, "Close" in English.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | On the activator: opens the modal sheet, or toggles the persistent one. On an item: chooses it |
| Tab, Shift+Tab | Moves between the items and, when expanded, the X. Focus stays inside a modal sheet |
| Escape | Dismisses the sheet: the modal sheet from anywhere, the persistent sheet when focus is inside it |

### Dismissal

The guidelines dismiss a sheet by swiping it down, tapping outside it, tapping the X or pressing Back. Swipe gestures are not shipped; tapping the scrim above a modal sheet, the X of the expanded sheet, and Escape are the paths, and every one of them is reachable without a pointer gesture.
