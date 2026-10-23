---
title: QuTooltip - Quantum Tooltip for Vue
meta:
- name: description
  content: The Material Design 1 tooltip, a one-line Grey 700 label shown on hover, keyboard focus or press and hold, in desktop and touch metrics. Built on Vuetify0's Tooltip.
- name: keywords
  content: quantum tooltip, material design 1 tooltip, press and hold tooltip, icon button label, vue tooltip, vuetify0 tooltip, paper quantum
features:
  category: Component
  label: 'C: QuTooltip'
  level: 2
  renderless: false
  group: overlay
  order: 5
related:
  - /systems/quantum
  - /systems/quantum/button
  - /systems/quantum/menu
  - /components/disclosure/tooltip
---

# QuTooltip

<DocsPageFeatures :frontmatter />

The Material Design 1 tooltip: a short text label that identifies a control when the pointer rests on it, when it takes keyboard focus, or when a finger presses and holds it.

> [!NOTE]
> Reference: [Tooltips, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/tooltips.html), the archived page Quantum is pinned to. Metrics, colour, motion and the touch behavior. This page is the Vue.

## Usage

`QuTooltip` is a compound. The root holds the open state (`v-model`); `QuTooltip.Activator` hands its `attrs` to the control the tooltip describes, usually an icon-only `QuButton`; `QuTooltip.Content` is the label.

::: ds-example
/systems/quantum/tooltip/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuTooltip } from '@paper/quantum'
</script>

<template>
  <QuTooltip>
    <QuTooltip.Activator />

    <QuTooltip.Content />
  </QuTooltip>
</template>
```

## Composed on Vuetify0

`QuTooltip` renders v0's [Tooltip](/components/disclosure/tooltip) compound and keeps its behavior: `Tooltip.Root` owns the open state and the open and close delays, `Tooltip.Activator` wires hover, keyboard focus, the click that dismisses and Escape, and `Tooltip.Content` is the native popover with `role="tooltip"` that the control points at through `aria-describedby`. The tile is anchored with CSS anchor positioning, centred below the control and flipped above it when the viewport has no room below.

The delays come from v0's tooltip region. Install `createTooltipPlugin` to share a close delay and the skip window across an app; Quantum leaves both at the region's values (150 ms and 300 ms by default) and sets its own open delay of 0 ms, because the tooltips page names no delay before showing. Pass `openDelay` to change that per tooltip.

Quantum adds what v0 leaves out. v0 ignores touch pointers on purpose, so the press and hold of the tooltips page is Quantum's own: `QuTooltip.Activator` binds the pointer handlers that run it, and `data-touch` on the content is Quantum's attribute for the touch metrics. The lift lands outside the popover, which the browser's light dismiss would close at once, so the activator shows the label again in the same task and the 1.5 seconds hold. `data-state` (`closed`, `delayed-open`, `instant-open`) is v0's. The activator is renderless and leaves the control's own `disabled`, `type` and `aria-disabled` alone, so a disabled tooltip never disables the button it labels.

## Examples

::: ds-example
/systems/quantum/tooltip/toolbar

### Icon buttons

The tooltips page names the job plainly: tooltips identify an element, and the typical element is an actionable icon. A row of icon-only buttons is the pattern this was written for. Each glyph is a guess until the label appears, so every button gets one, and the label is the same text as the button's `ariaLabel`. The tooltip shows what a sighted pointer user would otherwise have to discover by pressing.

The label shows as soon as the pointer arrives and leaves after v0's 150 ms close delay, with a 150 ms exit of its own. Moving along the row keeps the labels coming: the next tooltip opens inside the skip window of the last one. Keep the text to a word or two in sentence case; the tile is one line of 10 sp Roboto Medium on desktop and never wraps. A label longer than the screen allows is truncated with an ellipsis at the 16 dp screen margins, which is a sign the text belongs somewhere else.

A tooltip is not a substitute for a name. Assistive technology reads the tooltip as the control's description, after its name, so the icon button still needs its own `ariaLabel`.
:::

::: ds-example
/systems/quantum/tooltip/touch

### Press and hold

On a touch screen there is no hover. The guidelines trigger the tooltip by tapping and holding the element: the label shows while the finger stays down and remains for 1.5 seconds after the lift, unless the user takes another action first. Quantum shows it once the finger has rested for 500 ms, a threshold the page does not state, so a quick tap stays a tap and reaches the button's own click (here, it shares).

A hold that showed the tooltip is not a tap. Quantum cancels the browser's context menu during the hold and drops the click the lift would otherwise synthesise, so holding the share button labels it without sharing. A press anywhere, a key or a scroll during the 1.5 seconds hides the label at once.

A tooltip summoned this way takes the touch metrics: a 32 dp tile, 16 dp side padding, 14 sp Roboto Medium, 24 dp below the control, against the desktop 22 dp, 8 dp, 10 sp and 14 dp. A device that has a mouse and a touch screen picks per gesture, through `data-touch` on the content. Try it with the device toolbar of your browser's developer tools.
:::

::: ds-example
/systems/quantum/tooltip/controlled

### Controlled

`v-model` on the root is the open state, in both directions: hover, focus, Escape and the press and hold write it, and writing it shows or hides the label. Use it when something other than the control itself should point at the control, such as a first-run hint that labels an unfamiliar icon once.

A controlled tooltip still follows the rest of the behavior. It closes when the pointer leaves the control or the control is clicked, and the browser's light dismiss closes it on a press elsewhere, which writes `false` back to the model. A label that must stay put while the user does other things is not a tooltip; the guidelines reserve tooltips for brief labels, and feature discovery or a snackbar carries a message that has to wait.
:::

::: ds-example
/systems/quantum/tooltip/disabled

### Disabled

`disabled` turns the tooltip off: it does not show on hover, focus or a hold, a tooltip that is showing hides, and the control loses its `aria-describedby`. The control itself stays enabled. The activator never passes v0's `disabled` attribute through, because a tooltip that cannot show is no reason to switch off the action it labels.

The usual reason is that the control already says what it does. Here, showing the button's text label makes the tooltip redundant, so the example disables it. To make a control unavailable, disable the control; its tooltip has nothing to explain about a button the user cannot reach.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuTooltip.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Whether the label is showing |
| `disabled` | `boolean` | `false` | Turns the tooltip off and hides it if it is showing. The control stays enabled and loses its `aria-describedby`. A region disabled through `createTooltipPlugin` disables it too |
| `openDelay` | `number` | `0` | Milliseconds between the pointer arriving and the label showing. Keyboard focus and the press and hold always show at once |
| `closeDelay` | `number` | the region's (150) | Milliseconds between the pointer leaving and the label hiding; unset, it follows `createTooltipPlugin` |
| `namespace` | `string` | `'v0:tooltip'` | The context key `Tooltip.Root` provides; the parts read it from the root. Leave it unset unless two tooltips must not resolve the same v0 context |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `QuTooltip.Activator` | `namespace` | Renderless. The slot receives `attrs` (spread them onto the control), `isOpen` and `isDisabled`. `attrs` carries `aria-describedby`, `data-state`, the anchor name in `style`, v0's hover, focus, click and Escape handlers, and Quantum's press-and-hold handlers |
| `QuTooltip.Content` | `namespace` | The native popover with `role="tooltip"` around the tile. The default slot is the label: one line of plain text. Elements inside it log a development warning |

The default slot of each part is its content. There are no named slots.

## Accessibility

`QuTooltip.Content` has `role="tooltip"` and an id the control references through `aria-describedby`, so a screen reader announces the label as the control's description after its name. It never takes focus; the guidelines say tooltip labels do not receive input focus, and the tile lets the pointer pass through to whatever lies beneath it.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moving keyboard focus onto the control shows the label at once; moving it away hides it |
| Escape | Hides the label; focus stays on the control |
| Enter, Space | Activate the control as usual, which also hides the label |

Keyboard focus is a trigger in its own right on the tooltips page, so the label shows for `:focus-visible` only: a mouse click that happens to move focus does not leave a label behind.

### Touch

| Gesture | Behavior |
|---------|----------|
| Tap | Activates the control; no label |
| Press and hold for 500 ms | Shows the label, in the touch metrics, for as long as the finger stays down. No context menu, and no click on the lift |
| Lift | Keeps the label for 1.5 seconds |
| Press, key or scroll during those 1.5 seconds | Hides the label at once |

### Naming

The tooltip describes; it does not name. An icon-only control still needs an accessible name of its own (`ariaLabel` on `QuButton`), or assistive technology announces a nameless button followed by its description. Keep the label plain text: the guidelines rule out images and formatted text, and a description is read as flat text anyway.
