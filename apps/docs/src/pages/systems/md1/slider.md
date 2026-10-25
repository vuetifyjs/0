---
title: Md1Slider - Material Design 1 Slider for Vue
meta:
- name: description
  content: The Material Design 1 slider, continuous or discrete, with intensity icons at the ends and an editable numeric value. Built on Vuetify0's Slider.
- name: keywords
  content: md1 slider, material design 1 slider, discrete slider, continuous slider, vue slider, vuetify0 slider, paper md1
features:
  category: Component
  label: 'C: Md1Slider'
  level: 2
  renderless: false
  group: forms
  order: 5
related:
  - /systems/md1
  - /systems/md1/icon
  - /systems/md1/ripple
  - /components/forms/slider
---

# Md1Slider

<DocsPageFeatures :frontmatter />

The Material Design 1 slider. Pick a value from a range by moving the thumb, continuously or snapped to evenly spaced ticks, with optional intensity icons and an editable numeric value.

> [!NOTE]
> Reference: [Sliders, Material Design 1 guidelines](https://m1.material.io/components/sliders.html), the archived page Material Design 1 is pinned to. Usage, colour and the measured spec sheets. This page is the Vue.

## Usage

`Md1Slider` is a shell component: fixed anatomy and props for everything. `v-model` is a number between `min` and `max`. Sliders suit settings that reflect an intensity, such as volume, brightness or colour saturation; the smallest value sits on the left and the largest on the right.

::: ds-example
/systems/md1/slider/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Slider } from '@paper/md1'
</script>

<template>
  <Md1Slider />
</template>
```

## Composed on Vuetify0

`Md1Slider` renders v0's [Slider](/components/forms/slider) compound: `Slider.Root` is the `div.md1-slider` group, `Slider.Track` the 48 dp band you press, `Slider.Range` the active portion of the line, and `Slider.Thumb` the focusable `role="slider"` element. Value maths, step snapping, the keyboard map, pointer dragging and the hidden form input when `name` is set all come from v0. The discrete value pin binds the thumb's `value` slot prop. The editable numeric field is v0's [Input](/components/forms/input), `Input.Root` and `Input.Control`, bound to the same value.

`Slider.Root` emits `data-disabled`, and the thumb emits `data-state="dragging"`. `data-discrete`, `data-zero`, `data-dragging` and `data-editable` on the root are Material Design 1's own. Material Design 1 never writes a state class; it styles the attributes.

The thumb hosts no [Md1Ripple](/systems/md1/ripple): the sliders page draws none, and neither does Vuetify 1.5, so the thumb growing to 18 dp and its halo are the press feedback. Intensity icons draw through [Md1Icon](/systems/md1/icon). Range and vertical sliders are not part of Material Design 1 and do not ship.

## Examples

::: ds-example
/systems/md1/slider/icons

### Intensity icons

The guidelines let a slider carry an icon at either end of the bar to show what the value means: a quiet speaker at the minimum and a loud one at the maximum. `iconStart` and `iconEnd` name roles from the Material Design 1 icon set and draw them at 24 dp, 16 dp from the track, in the active icon ink (54% black, 100% white on dark). They are decoration: hidden from assistive technology, because the slider's own name already says what it controls.

Either end can stand alone. The track takes whatever width is left between the icons and any editable field, so a slider in a narrow settings row keeps its proportions. When the slider is disabled, the icons drop to the 26% disabled ink with the rest of the control.
:::

::: ds-example
/systems/md1/slider/discrete

### Discrete

A discrete slider picks one value from a set the guidelines call predetermined: the thumb snaps to evenly spaced tick marks, and each tick must change the setting by an amount the user can perceive. `discrete` turns it on, and `step` sets the spacing. Every reachable value, `min` plus a whole number of steps, then gets a 2 x 2 dp tick on the track, drawn in full black (white on dark) while the slider is pressed and hidden otherwise.

On keyboard focus and while dragging, a 26 x 32 dp value pin replaces the thumb. The pin's point sits 8 dp above the track's centreline, its fill is the control accent (grey at the minimum), and the value inside is white, about 10 sp, the size measured from the spec sheet. White holds on the dark theme too, as in Vuetify 1.5, though it reads at about 2.2:1 on the Pink 200 pin. Use the discrete form when the exact value matters to the user; the guidelines keep its values out of reach of typing, so `discrete` does not pair with `editable`.
:::

::: ds-example
/systems/md1/slider/editable

### Editable numeric value

For settings where the user must land on an exact value, the guidelines pair a continuous slider with a text field. `editable` adds a 24 dp wide numeric field 16 dp after the track, right-aligned and underlined. The value updates live as the thumb moves, and the underline turns to the accent while the thumb is pressed or the field is focused.

Typing sets the value directly. Material Design 1 clamps the number to `min` and `max` and snaps it to `step` as you type, and puts the committed value back in the field when it loses focus, so an out-of-range entry like 150 settles at 100. The field shares the slider's accessible name. Pairing `editable` with `discrete` logs a development warning, because discrete values are not user-editable on the guidelines' terms.
:::

::: ds-example
/systems/md1/slider/zero

### The zero state

At its minimum a slider shows a hollow thumb: a 12 dp ring with a 2 dp stroke in the inactive ink (26% black, 30% white on dark) instead of a filled accent dot. The active portion of the line has no length, and the inactive line stops at the ring's edge rather than showing through it. The guidelines draw it this way so an empty setting reads as off at a glance.

The state follows the value, not a prop: Material Design 1 marks the root `data-zero` whenever the value equals `min`. Pressing grows the ring to 18 dp and lifts its ink to 38%, and keyboard focus draws the 32 dp halo in the 12% focus overlay rather than the accent.

The discrete slider is drawn differently at its minimum. Its sheets show no ring: the thumb is a filled 12 dp dot in the primary text ink, 87% black (white on dark), sitting on the start of the line, and the value pin that replaces it on focus turns grey.
:::

::: ds-example
/systems/md1/slider/disabled

### Disabled

`disabled` takes the thumb out of the tab order and ignores keys and presses. The guidelines draw the disabled thumb disconnected from the track: an 8 dp dot with a 2 dp gap on each side, the line stopping where the 12 dp thumb would end. Thumb, line and icons all take the disabled ink, 26% black on the light theme and 30% white on the dark one.

An editable field disables with the slider: its underline turns dotted and its value drops to the same disabled ink. As with any disabled control, explain the precondition nearby, because a keyboard user never reaches the thumb to discover why it does not move.
:::

::: ds-example
/systems/md1/slider/themes

### Light and dark themes

A continuous and a discrete slider on each theme. On the dark theme the filled track and the thumb take the accent control colour and the unfilled track is 30% white; the discrete pin keeps its white value text. Drag or use the arrow keys to compare the pressed thumb and the pin on both canvases.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Slider.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `0` | The value, bound with `v-model` |
| `min` | `number` | `0` | The smallest value, at the left end (the right end under RTL) |
| `max` | `number` | `100` | The largest value |
| `step` | `number` | `1` | The increment the thumb snaps to; under `discrete`, the tick spacing |
| `discrete` | `boolean` | `false` | Tick marks while pressed and the 26 x 32 dp value pin on focus and while dragging |
| `iconStart` | `Md1IconName` | | A 24 dp intensity glyph 16 dp before the track |
| `iconEnd` | `Md1IconName` | | A 24 dp intensity glyph 16 dp after the track |
| `editable` | `boolean` | `false` | A 24 dp numeric field 16 dp after the track, live while dragging; typed values are clamped and snapped. Not a discrete form; pairing them warns in development |
| `disabled` | `boolean` | `false` | Out of the tab order, inert to keys and presses; an 8 dp disconnected thumb in the disabled ink |
| `label` | `string` | | Accessible name for the group, and for the thumb and field when `ariaLabel` is unset |
| `ariaLabel` | `string` | | Accessible name for the thumb and the numeric field |
| `name` | `string` | | Form field name; v0 renders a hidden input carrying the value |
| `namespace` | `string` | | The context key `Slider.Root` provides to its parts. Leave it unset unless a surrounding v0 `Slider` context must not collide with this one |

There are no slots.

## Accessibility

The thumb is a WAI-ARIA slider: `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-orientation="horizontal"`, inside a `role="group"` root. The guidelines say nothing about the keyboard, so Material Design 1 follows the pattern v0 implements.

### Naming

Pass `label` or `ariaLabel`. Without either the thumb falls back to a generic, translatable "Slider", which tells a screen reader user nothing about what moves. The editable field carries the same name as the thumb, so the two controls announce as one setting in two forms.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the thumb, then the numeric field when `editable`. A disabled slider is skipped |
| Right Arrow, Up Arrow | Increases the value by one step (Right Arrow decreases it under RTL) |
| Left Arrow, Down Arrow | Decreases the value by one step (Left Arrow increases it under RTL) |
| Shift+Arrow, Page Up, Page Down | Moves by ten steps |
| Home, End | Jumps to `min` or `max` |

### Focus

Keyboard focus draws the 32 dp halo around the thumb, 16% of the control accent, and lifts the inactive line from 26% to 38% (from 30% white, it stays at 30% on the dark theme, Vuetify 1.5's value and close to the dark sheet's). At the minimum the halo is the 12% focus overlay instead. A discrete slider shows its value pin rather than a halo. The halo is drawn for `:focus-visible` only, so a mouse press does not leave it behind.

### Direction

Under RTL (v0's `useRtl`) the axis mirrors: the minimum moves to the right, the start icon sits on the right, and the horizontal arrows follow the visual direction. The root carries an explicit `dir` so the geometry and the stylesheet always agree.

### Touch target

The track answers to presses anywhere in a 48 dp tall band, the minimum touch target of the metrics page, and the thumb's grab area is its 32 dp halo footprint, wider than the 12 dp dot it draws.
