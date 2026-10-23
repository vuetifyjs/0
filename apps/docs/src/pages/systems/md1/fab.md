---
title: Md1Fab - Material Design 1 Floating Action Button for Vue
meta:
- name: description
  content: The Material Design 1 floating action button in default and mini sizes, fixed at the keyline margin or attached to a seam, with the speed dial as a menu of mini FABs. Built on Vuetify0's Button and Menu.
- name: keywords
  content: md1 fab, floating action button, material design 1 fab, speed dial, mini fab, vue fab, vuetify0 button, vuetify0 menu, paper md1
features:
  category: Component
  label: 'C: Md1Fab'
  level: 2
  renderless: false
  group: actions
  order: 3
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/icon
  - /components/actions/button
  - /components/disclosure/menu
---

# Md1Fab

<DocsPageFeatures :frontmatter />

The Material Design 1 floating action button. A circled icon floating above the interface for the one promoted action on a screen, which can fling out a short set of related actions.

> [!NOTE]
> Reference: [Buttons: Floating Action Button, Material Design 1 guidelines](https://m1.material.io/components/buttons-floating-action-button.html), the archived page Material Design 1 is pinned to. Sizes, placement, elevation and transitions. This page is the Vue.

## Usage

`Md1Fab` is a shell component with one optional part. Every FAB needs `icon` and `aria-label`: the button carries no text, so the glyph is the whole face and the label is the whole name. By default it is fixed to the bottom end corner of the viewport.

Use one per screen, for a positive action such as create, share or navigate. Not every screen needs one.

::: ds-example
/systems/md1/fab/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Fab } from '@paper/md1'
</script>

<template>
  <Md1Fab />

  <Md1Fab>
    <Md1Fab.Action />
  </Md1Fab>
</template>
```

## Composed on Vuetify0

On its own, `Md1Fab` renders v0's [Button](/components/actions/button) compound, `Button.Root` with a renderless `Button.Icon` around a [Md1Icon](/systems/md1/icon). Activation, the native `disabled` attribute and the focus order come from `Button.Root`, which also emits the `data-disabled` attribute the stylesheet reads. `data-mini` and `data-position` are Material Design 1's own.

With `Md1Fab.Action` children it becomes a speed dial on v0's [Menu](/components/disclosure/menu). The FAB is the `Menu.Activator`, the actions sit in a `Menu.Content` native popover anchored above it, and each action is a `Menu.Item`. The menu button pattern, arrow-key focus, Escape, light dismiss and focus return are all v0's. Material Design 1 adds the root's `data-open`, the action count check and the `select` event.

The first child of the FAB and of every action is a [Md1Ripple](/systems/md1/ripple). There is no prop to remove it: the page describes the ripple as the force that causes changes to the interface.

## Examples

::: ds-example
/systems/md1/fab/mini

### Default and mini

The default FAB is a 56 dp circle; the mini FAB is 40 dp. Both carry the same 24 dp glyph, white on the accent colour (`--md1-accent`, Pink A200 in the default theme), the colour the colour page reserves for the primary action. Use the mini size only to create visual continuity with other elements on the screen, such as a row of 40 dp avatars.

The page makes the mini size mandatory on screens 460 dp wide or less, so Material Design 1 forces it there with a media query whatever `mini` says. The 40 dp circle still answers to the 48 dp minimum touch target: a transparent hit area extends 4 dp beyond it on every side without taking layout space.
:::

::: ds-example
/systems/md1/fab/position

### Placement

`position="end"`, the default, fixes the FAB 16 dp from the bottom and end edges of the viewport on a handset and 24 dp from 600 px up, the two keyline margins of the metrics page. `start` mirrors it to the start edge. Both follow the document direction, so an end FAB sits at the left edge under `dir="rtl"`. `static` leaves the button in the flow, for a FAB inside a layout of your own.

The elevation page says the FAB moves when a snackbar appears. A fixed FAB adds `--md1-snackbar-height` to its bottom inset, and `Md1Snackbar` publishes that property while it shows, so the FAB rises by the snackbar's height on the standard curve and settles back when it leaves. A list under a fixed FAB needs enough bottom padding that its last row is not covered; the page gives no number, so leave at least the FAB's height plus its margin.
:::

::: ds-example
/systems/md1/fab/seam

### Attached to a seam

On large screens the page lets the FAB attach to an extended app bar, to a toolbar inside a sheet, or to the edge of a sheet. `position="seam"` is that form. The FAB is positioned absolutely at the end keyline of its host and moved down by half its height, so its centre sits on the host's bottom edge and it straddles the two surfaces.

The host must be a positioned box: an element with `position: relative`, marked `data-fab-host` by convention, as the example's header is. The surfaces the page names are an extended app bar, a toolbar inside a sheet and the edge of a sheet. Attach the FAB only where it relates to both surfaces and blocks nothing on either, and leave room under the seam for the half that hangs below it.
:::

::: ds-example
/systems/md1/fab/speed-dial

### Speed dial

Put `Md1Fab.Action` children inside the FAB and pressing it flings out related actions as 40 dp mini FABs above it, each with its label at the start side. The FAB stays on screen; pressing it again closes the dial, and so does choosing an action, Escape or a press anywhere else. `v-model` holds the open state, and `select` reports the chosen action's `value` (its `label` when it has none). A press on a label counts as a press on its action.

The page limits a speed dial to three to six options including the FAB itself, so Material Design 1 warns in development for fewer than two or more than five actions. The options must be specific destinations reached in at most two taps; overflow menus and unrelated actions belong in the toolbar instead. Change `icon` from the `v-model` value when the open FAB should show a different glyph.

The page states no spacing, colour or label style for the actions, so these are Material Design 1 decisions: 16 dp between the 40 dp circles and between a label and its circle, white surface circles with the active icon ink, and labels in Body 1 on a small 2 dp sheet. The actions enter at 225 ms on the deceleration curve, the one nearest the FAB first and each one above it 20 ms later, the choreography page's stagger; they leave at 195 ms on the acceleration curve.
:::

::: ds-example
/systems/md1/fab/disabled

### Disabled

The page states no disabled appearance, so Material Design 1 gives the FAB the raised button's: a 12% black container (12% white on the dark theme), 26% ink (30% white on the dark theme) and no shadow, so it reads as part of the sheet beneath it. `disabled` sets the native attribute; the button leaves the tab order and draws no ink. A disabled speed dial does not open.

A FAB is the promoted action of its screen, so a disabled one is rare. Prefer hiding it while the action is unavailable, or keep it enabled and explain the precondition on press.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Fab.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Md1IconName` | | Required. The 24 dp glyph in the circle, an `Md1Icon` role |
| `ariaLabel` | `string` | | The accessible name, needed on every FAB because the glyph is `aria-hidden`. Missing, it warns in development. Write it as `aria-label` in templates |
| `mini` | `boolean` | `false` | The 40 dp FAB. Forced on at screen widths of 460 dp or less |
| `position` | `'end' \| 'start' \| 'static' \| 'seam'` | `'end'` | `end` and `start` fix the FAB 16 dp (24 dp from 600 px) from the bottom and that edge, rising with `--md1-snackbar-height`; `static` keeps it in the flow; `seam` straddles the bottom edge of its positioned host at the end keyline |
| `disabled` | `boolean` | `false` | Native `disabled`: out of the tab order, no activation, the raised button's disabled colours and no shadow. Keeps a speed dial shut |
| `modelValue` | `boolean` | `false` | Whether the speed dial is open (`v-model`). Inert without actions |
| `namespace` | `string` | | The context key of the v0 `Button.Root`, or of the `Menu.Root` when it is a speed dial. Leave it unset unless a surrounding v0 context of the same kind must not collide |

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `unknown` | A speed dial action was chosen: its `value`, or its `label` when it has none |
| `update:modelValue` | `boolean` | The speed dial opened or closed |

The default slot holds `Md1Fab.Action` parts. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Fab.Action` | `icon` (required), `label` (required), `value` | One speed dial action: a 40 dp `Menu.Item` button named by `label`, with the label sheet beside it. Rendered outside an `Md1Fab`, it warns in development and renders nothing |

## Accessibility

Alone, the FAB is a native `<button type="button">` named by `ariaLabel`. As a speed dial it follows the WAI-ARIA menu button pattern: the FAB has `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`, the actions sit in a `role="menu"` labelled by the FAB, and each action is a `role="menuitem"` button named by its `label`. The visible label sheet is `aria-hidden`, so the name is announced once.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the FAB. Inside an open dial, Tab closes it |
| Enter, Space | Activates the FAB. On a speed dial, opens it with focus on the first action |
| Arrow Down, Arrow Up | On the FAB of a speed dial, opens it on the first or the last action. Inside the dial, moves between actions, wrapping at either end |
| Enter, Space (in the dial) | Chooses the focused action and closes the dial |
| Escape | Closes the dial and returns focus to the FAB |

### Focus

The page says the FAB changes colour on focus. Material Design 1 lays the 12% focus overlay (`--md1-focus`) over the accent for `:focus-visible` only, so keyboard focus shows it and a press does not. Under forced colours, where backgrounds are dropped, a 2 px outline draws in its place.

### Motion

The FAB enters as an expanding piece of material, scaling from its centre over 225 ms on the deceleration curve, and lifts from 6 dp to 12 dp on press (4 dp at rest and 6 dp on hover where the pointer is a mouse, the elevation page's desktop rule). Under reduced motion the entrance and the dial's fly-out are dropped; the elevation change and the ink stay.

### Touch target

The 56 dp FAB exceeds the 48 dp minimum. The mini FAB and every speed dial action extend a transparent hit area to 48 dp around their 40 dp circles.
