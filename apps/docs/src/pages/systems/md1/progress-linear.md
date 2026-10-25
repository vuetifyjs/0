---
title: Md1ProgressLinear - Material Design 1 Linear Progress for Vue
meta:
- name: description
  content: The Material Design 1 linear progress indicator, a 4 dp bar at the edge of a header or sheet, in determinate, indeterminate, buffer and query forms. Built on Vuetify0's Progress and Presence.
- name: keywords
  content: md1 progress, linear progress, progress bar, buffer, query indicator, material design 1 progress, vue progress bar, vuetify0 progress, paper md1
features:
  category: Component
  label: 'C: Md1ProgressLinear'
  level: 2
  renderless: false
  group: feedback
  order: 1
related:
  - /systems/md1
  - /systems/md1/progress-circular
  - /components/semantic/progress
  - /components/primitives/presence
---

# Md1ProgressLinear

<DocsPageFeatures :frontmatter />

The Material Design 1 linear progress indicator. A 4 dp bar on the edge of a header or sheet that appears while content loads and disappears when it is done.

> [!NOTE]
> Reference: [Progress and activity, Material Design 1 guidelines](https://m1.material.io/components/progress-activity.html), the archived page Material Design 1 is pinned to. Types, placement and behavior. This page is the Vue.

## Usage

`Md1ProgressLinear` is a shell component with no slot content of its own. Leave `value` unset for the indeterminate bar; set it to a percentage for the determinate one. Mount it with `v-if` for the length of the operation, or keep it mounted and bind `active` when the bar should animate out as well as in.

::: ds-example
/systems/md1/progress-linear/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1ProgressLinear } from '@paper/md1'
</script>

<template>
  <Md1ProgressLinear />
</template>
```

## Composed on Vuetify0

`Md1ProgressLinear` renders v0's [Progress](/components/semantic/progress) compound, `Progress.Root` with `Progress.Track` and `Progress.Fill`, plus `Progress.Buffer` when `buffer` is set. `Progress.Root` renders through its renderless path and Material Design 1 binds the progressbar attributes onto its own element, because v0 reads a value of 0 as indeterminate while a Material Design 1 determinate bar starts at 0%. `data-state` therefore comes from Material Design 1's `value` prop: `determinate` whenever a number is set, `indeterminate` otherwise. The width `Progress.Fill` and `Progress.Buffer` write inline is the percentage the stylesheet draws.

The root sits inside a [Presence](/components/primitives/presence), which carries its lifecycle phase in `data-presence` (`mounted` for the one frame before paint, then `present`, and `leaving` while `active` turns off). The stylesheet hangs the entrance and the exit on it, and the exit's `animationend` tells Presence to unmount. `data-query` and `data-buffer` are Material Design 1's own hooks, and `data-complete` marks a bar at 100%.

## Examples

::: ds-example
/systems/md1/progress-linear/determinate

### Determinate

Use the determinate bar when the percentage complete is detectable: an upload, a download, a known number of steps. The fill is the primary colour (`--md1-primary`, Indigo 500 in the default theme) and the track behind it is the same colour at 30%, the opacity measured from the spec's own indicator sheet. The bar is 4 dp tall, a measurement from that sheet as well, and spans the full width of the edge it sits on.

The guidelines say a determinate indicator "fills from 0% to 100%, and never decreases in value". Material Design 1 eases each step over the standard duration on the standard curve, so uneven progress reports read as motion rather than jumps. The value only grows; a new operation is a new bar, mounted again with `v-if`. Keep one indicator for a sequence of operations rather than one per step: the bar represents the work as a whole.
:::

::: ds-example
/systems/md1/progress-linear/basic

### Indeterminate

Use the indeterminate bar when the wait has no measurable length. Two primary segments sweep along the 30% track, one long and one short, repeating until the bar is removed. The spec shows the sweep in video only and states no cycle length, so Material Design 1 takes Vuetify 1.5's: one sweep every 2.2 seconds on the standard curve, and every 2 seconds for the query sweep.

The guidelines place linear indicators "on the edge of a header or sheet" and say they "appear and disappear". The example hangs the bar below the header with an absolutely positioned wrapper, so mounting it never shifts the content. On mount the bar grows out of that edge over the 225 ms enter duration on the deceleration curve, the motion page's rule for an element entering the screen. With reduced motion requested, it appears in place and the sweep slows to half speed rather than stopping, because a frozen segment would read as stalled determinate progress.
:::

::: ds-example
/systems/md1/progress-linear/buffer

### Buffer

`buffer` adds the buffered extent ahead of the fill, the guidelines' example being a video that downloads faster than it plays. The buffered segment takes the track tint, and the unbuffered remainder past it is drawn as a dotted trail in the same tint. The spec shows the trail only in video; Material Design 1 draws 2 dp dots at an 8 dp pitch, a decision.

Both values are percentages from 0 to 100, clamped. Keep `buffer` at or above `value`: the fill paints over the buffer, so a buffer behind the fill is simply hidden. Assistive technology hears both extents in one `aria-valuetext`, "40%, 70% buffered" in English, translatable through the `Md1.buffered` locale key.
:::

::: ds-example
/systems/md1/progress-linear/query

### Query

The query indicator covers the time before progress is measurable, for example the request for a web page before its first byte arrives. Set `query` and leave `value` unset: the indeterminate sweep runs in reverse, from the end edge toward the start. When the answer arrives, pass the value and the same bar switches to determinate progress without remounting: the sweep stops and the fill grows from the start edge, never down from full width.

Under `dir="rtl"` the whole bar mirrors, so the determinate fill grows from the right, the indeterminate sweep runs right to left and the query sweep runs left to right.
:::

::: ds-example
/systems/md1/progress-linear/active

### Appear and disappear

The guidelines say linear indicators "appear and disappear" at the edge they sit on. A `v-if` can only show half of that: Vue removes the element before any exit can play. Bind `active` instead and leave the bar mounted. Turning it off shrinks the bar back into its edge over the 195 ms leave duration on the acceleration curve, the motion page's rule for an element leaving the screen, and the bar leaves the DOM when that animation ends. Turning it back on mid-exit reverses it in place. Vuetify 1.5 names the same switch `active`.

With reduced motion requested, the bar vanishes in place, as it appears in place.
:::

::: ds-example
/systems/md1/progress-linear/card-expansion

### Loading an expanding card

The guidelines recommend an indeterminate linear indicator when a card expands on a larger surface such as desktop: press a conversation and it lifts out of the list as a card at 8 dp, with the indicator running along the edge under its header while the thread loads. The card opens at once, so the reader sees where the content will land; the indicator leaves when the messages arrive. The 1.5 second load is simulated.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1ProgressLinear.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | | Percent complete, clamped to 0 to 100. Unset is the indeterminate bar; 0 is a determinate bar at its start |
| `buffer` | `number` | | Percent buffered, clamped to 0 to 100. Setting it turns on the buffer variant: the buffered extent in the track tint and a dotted trail past it |
| `query` | `boolean` | `false` | The query variant: while `value` is unset the sweep runs in reverse |
| `active` | `boolean` | `true` | Whether the bar is shown. Turning it off plays the 195 ms exit before the bar leaves the DOM |
| `ariaLabel` | `string` | | Accessible name. Defaults to the `Md1.loading` locale key, "Loading" in English |
| `namespace` | `string` | | The context key `Progress.Root` provides to its parts. Leave it unset unless a surrounding v0 `Progress` context must not collide with this one |

There is no slot content and there are no named slots. `v-if` still works and skips the exit.

| Hook | Values |
|------|--------|
| `data-state` | `determinate`, `indeterminate` |
| `data-presence` | `mounted`, `present`, `leaving` |
| `data-buffer` | present with `buffer` |
| `data-query` | present with `query` |
| `data-complete` | present at 100% |

## Accessibility

The root is a `progressbar` with `aria-valuemin="0"` and `aria-valuemax="100"`. A determinate bar adds `aria-valuenow` and `aria-valuetext`. An indeterminate one omits both, as the WAI-ARIA progressbar role specifies for an unknown value, and sets `aria-busy="true"`. The bar is not focusable and has no keyboard interaction.

### Naming

Every progress bar needs a name that says what is loading. The default, "Loading", is a fallback; pass `ariaLabel` with the operation ("Uploading photos") whenever there is one. If the region being loaded is marked up, set `aria-busy="true"` on it for the length of the operation and point the bar at it with `aria-describedby` or a visible label.

### Announcements

Screen readers do not announce progress changes on their own. For a long operation, mirror the milestones in a polite live region, as the examples do with `role="status"`, rather than announcing every step.

### Motion

The indeterminate sweep is continuous motion. Under `prefers-reduced-motion: reduce`, or the `createReducedMotionPlugin` body attribute, Material Design 1 drops the entrance and exit animations and halves the sweep speed. The plugin's setting wins over the operating system's.
