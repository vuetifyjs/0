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

<DocsMd1Reference
  href="https://m1.material.io/components/buttons-floating-action-button.html"
  title="Buttons: Floating Action Button"
/>

> [!NOTE]
> Reference: [Buttons: Floating Action Button, Material Design 1 guidelines](https://m1.material.io/components/buttons-floating-action-button.html), the archived page Material Design 1 is pinned to. Sizes, placement, elevation and transitions. This page is the Vue.

## Usage

`Md1Fab` is a shell component with one optional part. Every FAB needs `icon` and `aria-label`: the button carries no text, so the glyph is the whole face and the label is the whole name. By default it is fixed to the bottom end corner of the viewport.

Use one per screen, for a positive action such as create, share or navigate. Not every screen needs one. Here the inbox's promoted action is Compose: each press starts a draft at the top of the list, its delete button removes it, and the messages scroll beneath the FAB while it holds its corner.

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

The page states no spacing, colour or label style for the actions. The circles take Vuetify 1.5's: 12 dp apart, its 6 dp button margins on each side,[^pitch] filled with the app bar colour (Grey 100, Grey 900 on the dark theme) and drawn in the active icon ink.[^fill] Vuetify 1.5 has no labels, so they are Material Design 1 decisions: Body 1 on a small 2 dp sheet, 16 dp from the circle.[^labels] The actions enter at 225 ms on the deceleration curve, the one nearest the FAB first and each one above it 20 ms later, the choreography page's stagger; they leave at 195 ms on the acceleration curve.
:::

::: ds-example
/systems/md1/fab/full-screen

### Full-screen transform

The page's full-screen transition: on a phone the FAB becomes a sheet that spans the screen, for creating content. Here the FAB is the `Md1Dialog.Activator` of a `full-screen` dialog, and `useMorph` plays the transform as the dialog opens. The FAB's circle leaves its corner on an arc and grows into the screen: a circular clip on the dialog's sheet starts at the FAB's radius and ends past the farthest corner, while the dialog travels from the FAB's centre to its own.

The FAB's colour comes along. A veil in the accent colour, carrying the FAB's glyph, covers the sheet: the glyph fades in the first 20% of the transform and the veil between 20% and 70%, so the colour hands over to the app bar and the sheet underneath and the content arrives late.[^veil] The FAB's shadow follows the circle as a `drop-shadow()` and fades as the sheet takes the screen.

It takes 375 ms, the duration page's value for a large, complex, full-screen transition. The page calls this transform usually not reversible, so closing is the dialog's own exit: Discard, Send and Escape fade the sheet out over 195 ms and focus returns to the FAB.

From 600 px the full-screen variant is a 560 dp sheet, and the full-screen pattern belongs to handsets, so the example checks `(max-width: 599.98px)` and plays no transform there: the dialog enters with its own 225 ms fade and scale.[^handset] Under reduced motion it appears at once on any screen.
:::

::: ds-example
/systems/md1/fab/toolbar

### Toolbar transform

The FAB can transform into a toolbar of related actions, and the toolbar turns back into the FAB when the content scrolls. The transform has two phases. First the circle travels to the bar's centre and grows to its height; then it stretches to the bar's full width as its corners square off. The toolbar keeps the FAB's accent colour, and the veil carries the glyph through the first phase, so the actions appear while the bar widens.

`useMorph` runs it as a rectangular transform with `lead: 'height'` and `lag: 0.5`: height and movement take the first half of the duration and the width the second.[^phase-split] The FAB stays in the layout with `visibility: hidden` while the toolbar stands in for it, so the reverse transform can measure the spot it returns to. Close, or any scroll of the content, plays the same keyframes backwards and only then removes the toolbar.

The page states no duration for this transform. It runs on `--md1-duration-standard`, 300 ms on a phone and 200 ms under a mouse, on the standard curve, the motion page's value for surface transformations on screen.[^duration]
:::

::: ds-example
/systems/md1/fab/sheet

### Morph into a sheet

The FAB can also transform into a sheet of material that becomes part of the screen's structure, here a short card of people to share with. The circle travels on an arc from the FAB to the card's centre and opens into it, the accent veil fading to the card's surface and the FAB's 6 dp shadow handing over to the card's own. The page asks for a path that is logical and does not pass through other sheets: the card sits in the corner the FAB occupied, so the path is short and crosses nothing.

Unlike the full-screen transform, this one is reversible. Choosing a person, or pressing the screen outside the card, plays the transform backwards and the card folds back into the FAB.
:::

::: ds-example
/systems/md1/fab/trigger

### Trigger

The FAB's touch ripple can be the force that changes the screen: here pressing it starts a recording, and the header turns red outward from the FAB. The FAB stays on screen and changes its glyph. The new colour is a layer in the header revealed by a circular clip centred on the FAB, `move: false` so it grows in place and `hide: false` so the FAB stays visible. Pressing again plays it backwards into the FAB.

This is the radial reaction of the choreography page: reactions start at the point of input and spread from it. Red 500 is this example's colour for a live recording; the page names no colour.
:::

::: ds-example
/systems/md1/fab/list

### Over a list

A list that scrolls under a floating action button needs room beneath its last row, or the button covers it for good. Pad the list by the button's 56 dp plus its 16 dp margin on each side;[^padding] scroll to the end and the last note clears the button.
:::

::: ds-example
/systems/md1/fab/disabled

### Disabled

The page states no disabled appearance, so Material Design 1 gives the FAB the raised button's:[^disabled] a 12% black container (12% white on the dark theme), 26% ink (30% white on the dark theme) and no shadow, so it reads as part of the sheet beneath it. `disabled` sets the native attribute; the button leaves the tab order and draws no ink. A disabled speed dial does not open.

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

### useMorph

The composable behind the transforms above, exported for any surface that becomes another: a FAB into a sheet, a toolbar or a full-screen dialog, a card into its detail, an image into a header. Lay the destination out in its final place, then call `morph`. It measures the source and the destination, clips the destination back to the source's shape and plays it forward on the Web Animations API. It hides the source while it runs and resolves when the transform lands, with a cleanup that drops the held last frame.

```ts no-filename
import { useMorph } from '@paper/md1'

const { morph } = useMorph()

open.value = true
await nextTick()

const done = await morph({ from: fab, to: sheet, clip: '.md1-dialog__sheet' })

done()
```

A reverse transform resolves with the source's shape still held on screen: change the state that removes the destination, wait a tick, then call the cleanup, so nothing flashes between the last frame and the DOM catching up.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `from` | element, component, ref or `DOMRect` | | Where the transform starts. An element is hidden while it runs and lends its colour, glyph and shadow |
| `to` | element, component or ref | | The element that moves. It carries the `transform` and the `drop-shadow()` filter, so it must not be the clipped element when the shadow should show |
| `clip` | element, component, ref or selector | `to` | The surface the clip reveals: `to`, a descendant, or a selector inside `to` |
| `shape` | `'circle' \| 'rect'` | `'circle'` | `circle` grows a `circle()` clip from a circular source; `rect` an `inset()` clip between two rectangles. The transforming-material page forbids a radial transform between rectangles |
| `move` | `boolean` | `true` | The surface travels from the source on an arc. `false` keeps it in place and grows the shape over it: a circle stays centred on the source |
| `scale` | `boolean` | `false` | `rect` only: scale the surface uniformly from the source's width instead of cropping it, for a shared element |
| `duration` | `number \| 'enter' \| 'leave' \| 'standard' \| 'complex'` | `'standard'` | Milliseconds, or a duration token read from the surface so the device scale applies |
| `lead` | `'width' \| 'height'` | `'width'` | `rect` only: the axis that changes first. The movement runs with it |
| `lag` | `number` | `0` | `rect` only: the fraction of the duration the other axis starts late |
| `veil` | `boolean` | `shape === 'circle'` | Cover the surface in the source's colour and glyph, fading the glyph over the first 20% and the veil from 20% to 70% |
| `hide` | `boolean` | `true` | Hide the source while the transform runs |
| `reverse` | `boolean` | `false` | Play from the surface back into the source |

| Member | Type | Description |
|--------|------|-------------|
| `morph(options)` | `(MorphOptions) => Promise<() => void>` | Plays one transform and resolves with its cleanup |
| `isReduced` | `Readonly<Ref<boolean>>` | `true` while transforms are skipped: the reduced-motion context, or the operating system's preference while the mode is `system`. `morph` then resolves at once |

The timing is Material Design 1's, and most of it is a decision because the pages give no numbers for transforms:

| Value | Source |
|-------|--------|
| All on-screen surface transformations on the standard curve, `cubic-bezier(0.4, 0, 0.2, 1)` | Movement and transforming-material pages |
| Two-axis movement follows an arc, shallow first when rising and steep first when falling; one-axis movement is straight | Movement page |
| The arc: the leading axis on the deceleration curve, the other on the standard curve | Decision |
| 375 ms for the full-screen transform | Duration page, large and complex full-screen transitions |
| `--md1-duration-standard` (300 ms on a phone, 200 ms under a mouse) for the toolbar, sheet, trigger and card transforms | Decision; the pages state no transform duration |
| An expanding rectangle starts its width before its height | Transforming-material page |
| The card's 15% lag and the toolbar's 50% two-phase split | Decision |
| Glyph out by 20%, veil from 20% to 70% | Decision |

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

The FAB enters as an expanding piece of material, scaling from its centre over 225 ms on the deceleration curve, and lifts from 6 dp to 12 dp on press (4 dp at rest and 6 dp on hover where the pointer is a mouse, the elevation page's desktop rule). Under reduced motion the entrance and the dial's fly-out are dropped, and `useMorph` plays no transform, so a destination appears in place; the elevation change and the ink stay.

### Touch target

The 56 dp FAB exceeds the 48 dp minimum. The mini FAB and every speed dial action extend a transparent hit area to 48 dp around their 40 dp circles.

[^pitch]: Vuetify 1.5.24, stylus/settings/_variables.styl:169-171. `$button-margin-y` is 6 px, so stacked buttons sit 12 px apart.

[^fill]: Vuetify 1.5.24, stylus/components/_buttons.styl:18-19. An uncoloured floating button fills with `app-bar`.

[^labels]: Our call: Vuetify 1.5's speed dial has no labels; a small Body 1 sheet keeps each label legible over any content.

[^veil]: Our call: the page gives no timings for the hand-over; glyph first, then veil, lets the content arrive last.

[^handset]: Our call: full-screen dialogs are a handset pattern, and from 600 px the variant is a 560 dp sheet.

[^phase-split]: Our call: the page says height leads width but gives no split; half and half keeps both phases readable.

[^duration]: Our call: no transform duration on the page, so it takes the standard duration for on-screen changes.

[^padding]: Our call: the page asks for enough padding without a number; this clears the FAB and its margins.

[^disabled]: Vuetify 1.5.24, stylus/components/_buttons.styl:8-16. A disabled floating button takes `buttons.disabled` ink and the 12% `buttons.focused` fill, the same values as a raised button.
