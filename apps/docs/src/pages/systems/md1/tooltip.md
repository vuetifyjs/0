---
title: Md1Tooltip - Material Design 1 Tooltip for Vue
meta:
- name: description
  content: The Material Design 1 tooltip, a one-line Grey 700 label shown on hover, keyboard focus or press and hold, in desktop and touch metrics. Built on Vuetify0's Tooltip.
- name: keywords
  content: md1 tooltip, material design 1 tooltip, press and hold tooltip, icon button label, vue tooltip, vuetify0 tooltip, paper md1
features:
  category: Component
  label: 'C: Md1Tooltip'
  level: 2
  renderless: false
  group: overlay
  order: 5
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/menu
  - /components/disclosure/tooltip
---

# Md1Tooltip

<DocsPageFeatures :frontmatter />

The Material Design 1 tooltip: a short text label that identifies a control when the pointer rests on it, when it takes keyboard focus, or when a finger presses and holds it.

<DocsMd1Reference
  href="https://m1.material.io/components/tooltips.html"
  title="Tooltips"
/>

## Usage

`Md1Tooltip` is a compound. The root holds the open state (`v-model`); `Md1Tooltip.Activator` hands its `attrs` to the control the tooltip describes, usually an icon-only `Md1Button`; `Md1Tooltip.Content` is the label.

::: ds-example
/systems/md1/tooltip/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Tooltip } from '@paper/md1'
</script>

<template>
  <Md1Tooltip>
    <Md1Tooltip.Activator />

    <Md1Tooltip.Content />
  </Md1Tooltip>
</template>
```

## Composed on Vuetify0

`Md1Tooltip` renders v0's [Tooltip](/components/disclosure/tooltip) compound and keeps its behavior: `Tooltip.Root` owns the open state and the open and close delays, `Tooltip.Activator` wires hover, keyboard focus, the click that dismisses and Escape, and `Tooltip.Content` is the native popover with `role="tooltip"` that the control points at through `aria-describedby`. The tile is anchored with CSS anchor positioning, centred below the control and flipped above it when the viewport has no room below.[^flip]

The delays come from v0's tooltip region. Install `createTooltipPlugin` to share a close delay and the skip window across an app; Material Design 1 sets its own 200 ms open and close delays, Vuetify 1.5's, because the tooltips page names none,[^delay] and leaves the skip window at the region's 300 ms. Pass `openDelay` or `closeDelay` to change them per tooltip.

Material Design 1 adds what v0 leaves out. v0 ignores touch pointers on purpose, so the press and hold of the tooltips page is Material Design 1's own: `Md1Tooltip.Activator` binds the pointer handlers that run it, and `data-touch` on the content is Material Design 1's attribute for the touch metrics. The lift lands outside the popover, which the browser's light dismiss would close at once, so the activator shows the label again in the same task and the 1.5 seconds hold. `data-state` (`closed`, `delayed-open`, `instant-open`) is v0's. The activator is renderless and leaves the control's own `disabled`, `type` and `aria-disabled` alone, so a disabled tooltip never disables the button it labels.

## Examples

::: ds-example
/systems/md1/tooltip/toolbar

### Icon buttons

The tooltips page names the job plainly: tooltips identify an element, and the typical element is an actionable icon. A row of icon-only buttons is the pattern this was written for. Each glyph is a guess until the label appears, so every button gets one, and the label is the same text as the button's `ariaLabel`. The tooltip shows what a sighted pointer user would otherwise have to discover by pressing.

The label shows once the pointer has rested for 200 ms and leaves 200 ms after it goes, with a 150 ms exit of its own. Moving along the row keeps the labels coming: the next tooltip opens inside the skip window of the last one. Keep the text to a word or two in sentence case; the tile is one line of 10 sp Roboto Medium on desktop and never wraps. A label longer than the screen allows is truncated with an ellipsis at the 16 dp screen margins, which is a sign the text belongs somewhere else.

A tooltip is not a substitute for a name. Assistive technology reads the tooltip as the control's description, after its name, so the icon button still needs its own `ariaLabel`.
:::

::: ds-example
/systems/md1/tooltip/touch

### Press and hold

On a touch screen there is no hover. The guidelines trigger the tooltip by tapping and holding the element: the label shows while the finger stays down and remains for 1.5 seconds after the lift, unless the user takes another action first. Material Design 1 shows it once the finger has rested for 500 ms, a threshold the page does not state,[^hold] so a quick tap stays a tap and reaches the button's own click (here, it shares).

A hold that showed the tooltip is not a tap. Material Design 1 cancels the browser's context menu during the hold and drops the click the lift would otherwise synthesise, so holding the share button labels it without sharing. A press anywhere, a key or a scroll during the 1.5 seconds hides the label at once.

A tooltip summoned this way takes the touch metrics: a 32 dp tile, 16 dp side padding, 14 sp Roboto Medium, 24 dp below the control, against the desktop 22 dp, 8 dp, 10 sp and 14 dp. A device that has a mouse and a touch screen picks per gesture, through `data-touch` on the content. Try it with the device toolbar of your browser's developer tools.
:::

::: ds-example
/systems/md1/tooltip/controlled

### Controlled

`v-model` on the root is the open state, in both directions: hover, focus, Escape and the press and hold write it, and writing it shows or hides the label. Use it when something other than the control itself should point at the control, such as a first-run hint that labels an unfamiliar icon once.

A controlled tooltip still follows the rest of the behavior. It closes when the pointer leaves the control or the control is clicked, and the browser's light dismiss closes it on a press elsewhere, which writes `false` back to the model. A label that must stay put while the user does other things is not a tooltip; the guidelines reserve tooltips for brief labels, and feature discovery or a snackbar carries a message that has to wait.
:::

::: ds-example
/systems/md1/tooltip/disabled

### Disabled

`disabled` turns the tooltip off: it does not show on hover, focus or a hold, a tooltip that is showing hides, and the control loses its `aria-describedby`. The control itself stays enabled. The activator never passes v0's `disabled` attribute through, because a tooltip that cannot show is no reason to switch off the action it labels.

The usual reason is that the control already says what it does. Here, showing the button's text label makes the tooltip redundant, so the example disables it. To make a control unavailable, disable the control; its tooltip has nothing to explain about a button the user cannot reach.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Tooltip.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Whether the label is showing, bound with `v-model` |
| `disabled` | `boolean` | `false` | Turns the tooltip off and hides it if it is showing. The control stays enabled and loses its `aria-describedby`. A region disabled through `createTooltipPlugin` disables it too |
| `openDelay` | `number` | `200` | Milliseconds between the pointer arriving and the label showing. Keyboard focus and the press and hold always show at once |
| `closeDelay` | `number` | `200` | Milliseconds between the pointer leaving and the label hiding |
| `namespace` | `string` | `'v0:tooltip'` | The context key `Tooltip.Root` provides; the parts read it from the root. Leave it unset unless two tooltips must not resolve the same v0 context |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Tooltip.Activator` | `namespace` | Renderless. The slot receives `attrs` (spread them onto the control), `isOpen` and `isDisabled`. `attrs` carries `aria-describedby`, `data-state`, the anchor name in `style`, v0's hover, focus, click and Escape handlers, and Material Design 1's press-and-hold handlers |
| `Md1Tooltip.Content` | `namespace` | The native popover with `role="tooltip"` around the tile. The default slot is the label: one line of plain text. Elements inside it log a development warning |

The default slot of each part is its content. There are no named slots.

## Accessibility

`Md1Tooltip.Content` has `role="tooltip"` and an id the control references through `aria-describedby`, so a screen reader announces the label as the control's description after its name. It never takes focus; the guidelines say tooltip labels do not receive input focus, and the tile lets the pointer pass through to whatever lies beneath it.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moving keyboard focus onto the control shows the label at once; moving it away hides it |
| Escape | Hides the label; focus stays on the control |
| Enter, Space | Activate the control as usual, which also hides the label |

Keyboard focus is a trigger in its own right on the tooltips page, so the label shows for `:focus-visible` only:[^focus-visible] a mouse click that happens to move focus does not leave a label behind.

### Touch

| Gesture | Behavior |
|---------|----------|
| Tap | Activates the control; no label |
| Press and hold for 500 ms | Shows the label, in the touch metrics, for as long as the finger stays down. No context menu, and no click on the lift |
| Lift | Keeps the label for 1.5 seconds |
| Press, key or scroll during those 1.5 seconds | Hides the label at once |

### Naming

The tooltip describes; it does not name. An icon-only control still needs an accessible name of its own (`ariaLabel` on `Md1Button`), or assistive technology announces a nameless button followed by its description. Keep the label plain text: the guidelines rule out images and formatted text, and a description is read as flat text anyway.

[^flip]: Our call: the page places the tooltip below its target and says nothing about a full viewport.

[^delay]: Vuetify 1.5.24, components/VTooltip/VTooltip.js:21-37. `openDelay` and `closeDelay` both default to 200.

[^hold]: Our call: Vuetify 1.5 has no touch hold; 500 ms is the common long-press threshold.

[^focus-visible]: Our call: the page makes focus a trigger but does not separate keyboard focus from a click.
