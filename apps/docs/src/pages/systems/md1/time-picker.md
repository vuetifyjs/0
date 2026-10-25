---
title: Md1TimePicker - Material Design 1 Time Picker for Vue
meta:
- name: description
  content: The Material Design 1 time picker, a primary header with the hour, minute and AM or PM over a clock face with a sweeping hand, in 12 and 24 hour formats and portrait and landscape layouts. Built on Vuetify0's Toggle and Radio.
- name: keywords
  content: md1 time picker, material design 1 time picker, clock picker, pickers, vue time picker, vuetify0 radio, paper md1
features:
  category: Component
  label: 'C: Md1TimePicker'
  level: 2
  renderless: false
  group: forms
  order: 8
related:
  - /systems/md1
  - /systems/md1/dialog
  - /systems/md1/text-field
  - /components/forms/radio
  - /components/actions/toggle
---

# Md1TimePicker

<DocsPageFeatures :frontmatter />

The Material Design 1 time picker. A header in the primary colour shows the time, and a clock face below it takes taps, drags and arrow keys, in the 12 and 24 hour formats and the portrait and landscape layouts.

> [!NOTE]
> Reference: [Pickers, Material Design 1 guidelines](https://m1.material.io/components/pickers.html), the archived page Material Design 1 is pinned to. Anatomy, both layouts and both themes. The page states no numbers: every size on this page is measured from its artwork at 2 px per dp. This page is the Vue.

## Usage

`Md1TimePicker` is a shell component: fixed anatomy, props for everything, no slots. `v-model` is a 24 hour `HH:mm` string whatever the picker displays. Tap the hour or minute in the header to switch rings, tap AM or PM to switch the half of the day, and tap or drag on the face to move the hand.

::: ds-example
/systems/md1/time-picker/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1TimePicker } from '@paper/md1'
</script>

<template>
  <Md1TimePicker />
</template>
```

## Composed on Vuetify0

The header's hour and minute digits are a v0 [Toggle](/components/actions/toggle) group: one pressed button per ring, so the active view is a `role="group"` of `aria-pressed` buttons. AM and PM are a v0 [Radio](/components/forms/radio) group, and so is the clock face: one `Radio.Root` per hour, or per minute, with the roving tabindex and the wrapping arrow keys v0 builds in. Material Design 1 adds no focus handling of its own.

The time itself lives in `useClock`, a Material Design 1 composable, because v0's `createTimePicker` is still a draft with no source. `useClock` holds one canonical 24 hour time, derives the period, the header digits, the ring of the current view and the hand angle, and maps a pointer angle to the nearest ring value. It never touches the DOM: the component binds the pointer events on the face and writes the model. When v0 ships its time picker, the core moves there and this page keeps its API.

The face and the hand are inline SVG, the one place besides the circular progress arc where Material Design 1 draws its own geometry: they are parameterised at runtime by the hand angle, not glyphs a consumer would rebrand. Every interactive button hosts a [Md1Ripple](/systems/md1/ripple). `data-view` (`hour` or `minute`), `data-period` (`am` or `pm`) and `data-landscape` sit on the root for styling.

## Examples

::: ds-example
/systems/md1/time-picker/dialog

### In a confirmation dialog

The guidelines put pickers in a confirmation dialog on mobile: the picker holds a choice, and nothing is written until OK. `Md1Dialog variant="confirmation"` is that dialog. Its slot hands the held value and a `commit` function to the picker, and `Md1Dialog.Confirm` writes it to `v-model:value` on OK while `Md1Dialog.Cancel` drops it. The picker never renders its own CANCEL and OK; the dialog's 52 dp action area supplies them, which is why the face ends 8 dp above the bottom of the picker.

The dialog sheet rests at 24 dp, the elevation table's value for a picker. Escape and an outside click cancel. A picker selects one value: the guidelines rule out choosing a date and a time in the same dialog, so a form that needs both opens a date picker and a time picker one after the other.
:::

::: ds-example
/systems/md1/time-picker/format

### 24 hour format

The guidelines say the picker follows the user's preferred clock, 12 hour or 24 hour, and draw only the 12 hour face. `format="24"` is Material Design 1's reading of the other: the outer ring keeps 12 and 1 to 11, and an inner ring at 62% of the radius carries 00 and 13 to 23, set in the 14 sp Body 1 size and the secondary ink so the outer hours lead.[^inner] The header shows zero-padded hours and drops AM and PM. The inner ring and its sizes are an interpretation (Vuetify 1.5's inner-ring scale), not spec values.[^scale]

A press near the centre picks from the inner ring and a press near the edge from the outer one; the hand shortens to reach the inner ring. The arrow keys walk the day in order, 11 to 12 to 13, so the keyboard never needs to know which ring an hour is on. `v-model` is the same `HH:mm` string in both formats, so switching the display never changes the value.
:::

::: ds-example
/systems/md1/time-picker/landscape

### Landscape

The guidelines adapt the picker to the device's orientation. `landscape` is that layout: the header becomes a 168 dp column at the start edge with the time at about 48 sp and AM and PM stacked beneath it, and the face drops to 224 dp, centred 60 dp from each side of the 344 dp body, with a 36 dp target. The sheet is 512 dp wide.

The orientation is a prop, not a media query, because the right layout depends on the space inside the dialog rather than on the viewport alone.[^land] Bind it to `useBreakpoints` or an `(orientation: landscape)` query in the app when the picker should follow the device. Inside a confirmation dialog the action area runs under both the header column and the face, so the header stops 52 dp short of the bottom edge the artwork draws it reaching.
:::

::: ds-example
/systems/md1/time-picker/dark

### Dark theme

The portrait and landscape pickers on the dark theme's #303030 canvas. The clock face turns Grey 700 and the hand and its target take the accent control colour with dark digits on the target. The landscape sheet scrolls sideways on a narrow screen rather than squeezing.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1TimePicker.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | | The time as `HH:mm` on a 24 hour clock (`'15:30'`), whatever `format` displays. An empty model shows 12:00 AM; a string that does not parse leaves the face where it is and warns in development |
| `format` | `'12' \| '24'` | `'12'` | `12`: 12 and 1 to 11 on the face with AM and PM in the header. `24`: an inner ring for 00 and 13 to 23 and zero-padded hours (an interpretation; the guidelines name the mode and do not draw it) |
| `landscape` | `boolean` | `false` | The landscape layout: a 168 dp header column, a 224 dp face and a 36 dp target in a 512 dp sheet |

There are no slots and no `disabled` prop: the guidelines define no disabled picker and no disabled times, and minimum and maximum times are not part of Material Design 1.

### Measurements

| Part | Portrait | Landscape |
|------|----------|-----------|
| Sheet width | 328 dp | 512 dp |
| Header | 96 dp band, primary colour | 168 dp column, primary colour |
| Time digits | about 60 sp, Regular | about 48 sp, Regular |
| AM and PM | 14 sp capitals, stacked 8 dp after the digits | 14 sp capitals, stacked under the time |
| Face | 296 dp, Grey 200 (Grey 700 dark), 32 dp under the header | 224 dp, 20 dp from the top |
| Number ring | 124 dp radius, 16 sp | 88 dp radius, 16 sp |
| Hand | 2 dp from a 6 dp dot to a 40 dp target | 2 dp to a 36 dp target |

The selected number reads white on the target in the light theme. In the dark theme the header and face are Grey 700, the sheet Grey 800, and the hand and target take the accent's 200 swatch (`--md1-accent-control`) with dark numbers on it. The inactive header segment and the unselected period read at 70% white.

## Accessibility

The header's hour and minute buttons are a `role="group"` of toggle buttons named for the time, so the pressed one announces which ring the face shows. AM and PM are a `radiogroup` named "AM or PM". The face is a `radiogroup` named "Hours" or "Minutes" holding one `radio` per value, each named by its number, including the minutes between the printed fives, so every value is reachable without a pointer. The SVG face and hand are `aria-hidden`.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves through the hour and minute buttons, the checked period, and the checked number on the face |
| Arrow Right, Arrow Down | On the face: selects the next value clockwise and turns the hand; wraps from 11 to 12 and from 59 to 00. On AM and PM: selects the other period |
| Arrow Left, Arrow Up | On the face: selects the previous value counterclockwise. On AM and PM: selects the other period |
| Enter | On the hour ring: commits the hour and moves focus to the minute ring. Elsewhere: activates the focused button |
| Space | Selects the focused number or period, or presses the focused header button |

### Pointer

The numbers do not take the pointer; the face does. A press anywhere on the face picks the value nearest the pointer's angle, a drag sweeps the hand round the ring, and releasing on the hour ring moves to the minutes, the transition the guidelines' video shows. A click that arrives without a pointer, from assistive technology, does the same through the radio.

### Focus

A focused number shows the 12% focus overlay as an 8 dp halo round its target; the header buttons show the overlay as a 12% fill of their own ink. The guidelines state no hover for pickers, so the header takes Vuetify 1.5's: no overlay, and an inactive segment rises from 70% to full white under the pointer.[^hover] The hand sweeps over the standard duration on the standard curve (300 ms on a handset, 200 ms under a mouse),[^sweep] holds still under the finger while dragging, and jumps when reduced motion is requested.

[^inner]: Our call: the page names the 24 hour clock but draws no inner ring; the type and ink are ours.

[^scale]: Vuetify 1.5.24, components/VTimePicker/VTimePickerClock.ts:86-87. `innerRadiusScale` is 0.62.

[^land]: Our call: the page adapts to orientation but leaves the trigger to the platform.

[^hover]: Vuetify 1.5.24, stylus/components/_pickers.styl:36-41. An inactive title button rises to full opacity on hover while not focused.

[^sweep]: Our call: the video shows the sweep without a duration; the standard duration is the motion page's default for on-screen changes.
