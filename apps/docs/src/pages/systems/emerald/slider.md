---
title: EmSlider - Emerald Slider for Vue
meta:
- name: description
  content: Emerald's slider — pointer drag, click-to-position, and the full slider keyboard map, with one thumb by default and more through the slot. Composed on Vuetify0's headless Slider.
- name: keywords
  content: emerald slider, vue slider, range slider vue, design system slider, vuetify0 slider, paper emerald
features:
  category: Component
  label: 'C: EmSlider'
  level: 2
  renderless: false
  order: 21
related:
  - /systems/emerald
  - /systems/emerald/select
  - /components/forms/slider
---

# EmSlider

<DocsPageFeatures :frontmatter />

A value slider with pointer drag, click-to-position, and the full slider keyboard map — one thumb by default, more through the slot.

## Usage

`v-model` is a plain `number` by default, and the value stays a number the whole way through — drag the thumb, click the track, or use the arrow keys, and the model updates with a number snapped to `step` and clamped to `min`/`max`. Bind an array instead and the slider switches to array-in, array-out; that is how a range slider works, covered under Examples.

Clicking anywhere on the track is not ignored: the nearest thumb jumps to the click point and the drag starts from there, so a reader can press-and-slide in one motion without first finding the 16-pixel thumb.

Always pass `label` — it is the accessible name for the slider, and without it a screen reader announces a generic "Slider".

::: ds-example
/systems/emerald/slider/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmSlider } from '@paper/emerald'
</script>

<template>
  <EmSlider />
</template>
```

## Composed on v0

`EmSlider` renders v0's [Slider](/components/forms/slider) compound — `Slider.Root` wrapping a default anatomy of `Slider.Track`, `Slider.Range` and a single `Slider.Thumb`.

The ownership split is clean: v0 owns every behavior, Emerald owns every pixel. Pointer drag (tracked on the document, so a drag that leaves the track keeps working), click-to-position on the track, the keyboard map, step snapping, the ARIA slider attributes, and the hidden form inputs all come from the v0 parts. Emerald contributes the wrapper element, the `emerald-slider__*` classes, and the stylesheet that turns v0's `data-orientation`, `data-disabled`, `data-readonly` and `data-state` attributes into a styled control — it never writes a state class of its own.

The default slot replaces the built-in track and thumb while keeping `Slider.Root` and its state. Anything you place there resolves the same slider context, which is how the range example supplies two thumbs. Emerald does not re-export the v0 parts, so slot content imports `Slider` from `@vuetify/v0` and borrows Emerald's classes — the stylesheet is global, so `emerald-slider__thumb` styles a v0 `Slider.Thumb` exactly as it styles the built-in one.

One consequence of the wrapper: `Slider.Root` emits `start` and `end` drag events, but `EmSlider` does not forward them — its root element is the wrapper `div`, not the v0 root. React to changes through `v-model`.

## Examples

::: ds-example
/systems/emerald/slider/steps

### Steps and bounds

`min`, `max` and `step` define the value space, and every input path respects it equally — a drag, a track click and an arrow key all land on the same quantized values. There is no "fine-grained while dragging" mode; the model only ever holds values the step allows.

Coarse steps change the feel of the control. With `step="50"` over a 0–1000 range there are only 21 positions, so the thumb visibly snaps and the keyboard becomes as fast as the pointer — one arrow press per position, Shift plus an arrow or PageUp/PageDown for ten steps at a time, Home and End for the bounds.

Pick the step by what the value means, not by what looks smooth. A price filter has no business emitting $317; a volume control does not need finer than 1. If a reader would never type the in-between value into a form, the slider should not produce it either.
:::

::: ds-example
/systems/emerald/slider/vertical

### Vertical orientation

`orientation="vertical"` stands the slider up: the track fills upward from the bottom, the wrapper takes a default height of 160px (override `.emerald-slider[data-orientation='vertical']` for a different one), and the range and thumb anchor to the bottom edge.

The keyboard does not rotate with the control. ArrowUp always increments and ArrowDown always decrements regardless of orientation, and the horizontal arrows keep working too — a vertical slider is operable with either pair. That matches what a reader expects: "up" means "more" whether the track is lying down or standing up.

Reach for vertical when the value itself is vertical — a gain fader, a brightness column, an equalizer band. Rotating a slider for layout convenience alone usually costs more comprehension than it saves in space.
:::

::: ds-example
/systems/emerald/slider/range

### Range with two thumbs

Bind an array and supply the anatomy through the default slot: v0's `Slider.Track` and `Slider.Range` plus one `Slider.Thumb` per array element, each wearing the matching `emerald-slider__*` class. The thumbs register in template order — the first thumb drives the first value — and `Slider.Range` automatically fills between the two thumbs instead of from the track's start.

The two thumbs cannot pass each other by default; each one clamps at its neighbor, and that boundary is also what each thumb reports as its own `aria-valuemin`/`aria-valuemax`. Two props tune the interaction: `minStepsBetweenThumbs` enforces a gap (in steps, not values) so the range can never collapse to zero width, and `crossover` removes the clamp entirely so thumbs may swap sides.

Give every thumb its own `ariaLabel` — "Minimum budget", "Maximum budget" — because the group's `label` names the pair, not the individuals. A screen-reader user tabs through both thumbs and needs to know which end of the range each one moves.

Track clicks still work in range mode: the click moves whichever thumb is nearest to the clicked value.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number \| number[]` | `0` | Current value. Number in, number out; bind an array when supplying multiple thumbs through the slot |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Increment every input path snaps to |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis. Vertical sliders fill upward |
| `inverted` | `boolean` | `false` | Flips the percent axis, so the maximum sits at the track's start. Horizontal arrow keys flip with it |
| `disabled` | `boolean` | `false` | Blocks pointer and keyboard edits and removes the thumb from the tab order |
| `readonly` | `boolean` | `false` | Blocks edits but keeps the thumb focusable and announced |
| `label` | `string` | — | Accessible name for the slider group; also names the default thumb |
| `ariaLabel` | `string` | — | Accessible name for the default thumb; wins over `label` on the thumb |
| `ariaLabelledby` | `string` | — | ID of an element that labels the group, instead of `label` |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum gap between adjacent thumbs, in steps |
| `crossover` | `boolean` | `false` | Lets thumbs pass through each other |
| `name` | `string` | — | Form field name. Renders one hidden input per thumb |
| `form` | `string` | — | Associates the hidden inputs with a form by ID |
| `id` | `string` | auto-generated | Identifier for the underlying slider context. Not rendered as a DOM id |
| `namespace` | `string` | — | Context the v0 slider parts resolve against. Leave unset except when nesting sliders |

The default slot replaces the built-in track, range and thumb — see the range example. There are no named slots, and nothing is exposed through a template ref.

With `name` set, submission works like a native field: one `<input type="hidden">` per thumb, all sharing the name, each synced to its thumb's value and disabled together with the slider.

## Accessibility

The group element carries `role="group"` named by `label` (or `ariaLabelledby`), and each thumb is a `role="slider"` element with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-orientation` — the standard WAI-ARIA slider surface, kept in sync by v0 on every input path.

### Naming

The thumb's accessible name resolves as `ariaLabel`, else `label`, else a locale-provided "Slider" fallback. The fallback exists so the control is never anonymous, but a generic "Slider, 40" announcement helps nobody — pass `label`, and pass a per-thumb `ariaLabel` whenever there is more than one thumb, because the group name does not distinguish the ends of a range.

In a range, each thumb's announced `aria-valuemin` and `aria-valuemax` are its real limits — clamped at the neighboring thumb rather than the slider's bounds — so a screen reader hears the range the thumb can actually reach. With `crossover` enabled the full bounds are announced instead.

### Keyboard

Each thumb is a tab stop; all keys operate the focused thumb.

| Key | Behavior |
|-----|----------|
| Arrow Right | One step up — down when `inverted` |
| Arrow Left | One step down — up when `inverted` |
| Arrow Up | One step up |
| Arrow Down | One step down |
| Shift + Arrow | Ten steps in the arrow's direction |
| Page Up / Page Down | Ten steps up / down |
| Home / End | Jump to minimum / maximum |

Orientation does not remap the arrows — both pairs work on both axes, with up meaning more. The horizontal arrows also do not follow text direction: there is no RTL remap in the current source, so ArrowRight increments under RTL too.

### Disabled and readonly

Both stop edits — pointer, track click and keyboard alike — but they present differently:

| State | Thumb tabindex | Announced as | Edits |
|-------|----------------|--------------|-------|
| `disabled` | `-1` — skipped when tabbing | `aria-disabled` | Blocked |
| `readonly` | `0` — still focusable | `aria-readonly` | Blocked |

Prefer `readonly` when the value is information the reader should still be able to reach and hear — a keyboard user can focus the thumb and have the value announced. `disabled` removes the thumb from the tab order entirely, which is right only when the value is currently irrelevant.

### Focus

The thumb shows Emerald's focus ring on `:focus-visible` only, so keyboard focus gets an indicator and a pointer drag does not leave one behind. While dragging, the thumb carries `data-state="dragging"` and swaps to a grabbing cursor.
