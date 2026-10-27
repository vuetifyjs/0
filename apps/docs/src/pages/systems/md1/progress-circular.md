---
title: Md1ProgressCircular - Material Design 1 Circular Progress for Vue
meta:
- name: description
  content: The Material Design 1 circular progress indicator, a 4 dp arc on a 40 dp ring, determinate or indeterminate, with the ring around a floating action button and the swipe to refresh composition. Built on Vuetify0's Progress.
- name: keywords
  content: md1 progress, circular progress, spinner, activity indicator, swipe to refresh, fab progress, material design 1 progress, vue spinner, vuetify0 progress, paper md1
features:
  category: Component
  label: 'C: Md1ProgressCircular'
  level: 2
  renderless: false
  group: feedback
  order: 2
related:
  - /systems/md1
  - /systems/md1/progress-linear
  - /systems/md1/fab
  - /components/semantic/progress
---

# Md1ProgressCircular

<DocsPageFeatures :frontmatter />

The Material Design 1 circular progress indicator. An arc that grows around a ring as work completes, or spins while the wait has no known length.

<DocsMd1Reference
  href="https://m1.material.io/components/progress-activity.html"
  title="Progress and activity"
/>

## Usage

`Md1ProgressCircular` is a shell component with no slot content of its own. Leave `value` unset for the spinning indicator; set it to a percentage for the determinate arc.

::: ds-example
/systems/md1/progress-circular/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1ProgressCircular } from '@paper/md1'
</script>

<template>
  <Md1ProgressCircular />
</template>
```

## Composed on Vuetify0

`Md1ProgressCircular` renders v0's [Progress](/components/semantic/progress) `Progress.Root` through its renderless path for the progressbar semantics, and binds them onto its own element with Material Design 1's `data-state`: `determinate` whenever `value` is a number, including 0, which v0 alone would read as indeterminate. v0's track, fill and buffer parts are width-based, so the ring itself is an inline SVG drawn from the value: a circle whose `stroke-dasharray` is the percent. That SVG is runtime geometry, not a glyph, and is the one declared exception to Material Design 1's rule that every drawing goes through [Md1Icon](/systems/md1/icon).

`data-fab` is Material Design 1's own hook, and `data-complete` marks a ring at 100%.

## Examples

::: ds-example
/systems/md1/progress-circular/determinate

### Determinate

The determinate arc starts at the top of the ring and grows clockwise until the ring closes, as in the spec's indicator sheet. The arc is the primary colour (`--md1-primary-ink`, Indigo 500 in the default theme, and the lighter Indigo 100 on the dark theme so the arc holds 3:1 on the Grey 800 sheet) on a 4 dp stroke, and the ring measures about 40 dp across, both measured from that sheet. Each step eases over the standard duration on the standard curve.[^step] Like the linear bar, the value should only grow.

Behind the arc Material Design 1 draws the rest of the ring in black at 10%, so a small value still reads as a fraction of a whole. The spec's videos show no track, so this is Vuetify 1.5's underlay, the same in both themes:[^track] on the dark theme it nearly disappears. The indeterminate ring has none.
:::

::: ds-example
/systems/md1/progress-circular/basic

### Indeterminate

The indeterminate ring rotates while its arc grows and shrinks, the motion of the spec's indicator sheet. The spec states no cycle length; Material Design 1 turns once and completes one sweep every 1.4 seconds, Vuetify 1.5's cycle,[^cycle] with the rotation linear so its speed reads evenly and the sweep on the standard curve. Under reduced motion both slow to half speed rather than stopping.[^reduced-motion]

Use one indicator per operation. The guidelines' example is a refresh: show either a refresh bar or an activity circle, never both. Pair the circle with text when the wait is long enough that a reader needs to know what is happening.
:::

::: ds-example
/systems/md1/progress-circular/size

### Size

The guidelines draw one size, about 40 dp. `size` sets the outer diameter in px for the two places Material Design 1 needs another: the ring around a floating action button and the refresh indicator. The stroke stays 4 dp at every size, so a small ring reads heavier and a large one lighter.

`size` is a rendering knob, not a spec variant, and SPEC.md lists it under Deviations. Prefer the default wherever the indicator stands on its own.
:::

::: ds-example
/systems/md1/progress-circular/fab

### Around a floating action button

"A circular loader may be integrated with a floating action button." `fab` draws the ring around a sibling [Md1Fab](/systems/md1/fab): 64 dp across in the accent colour (`--md1-accent`), absolutely positioned 4 dp outside the 56 dp FAB, so the host wrapping both is `position: relative` and the FAB's own size. The ring ignores the pointer, so presses still reach the FAB beneath it.

In the spec's video the FAB fills with the accent colour and shows a check glyph when the operation completes. The completion is the FAB's, not the ring's: remove the ring and set the FAB's `icon` to `check`, as the example does. The ring geometry, a 4 dp stroke just outside the FAB's edge, is read from the video at low confidence.
:::

::: ds-example
/systems/md1/progress-circular/phases

### Loading in phases

The guidelines name two ways content arrives. In a one-phased load the ink, the copy and images, loads within an existing, unchanging container: the card on the left is on screen from the start and the indicator waits inside it. In a two-phased load the paper container is generated first and the ink then loads within it: on the right the indicator waits on the background, the card grows in, and the indicator moves inside it until the copy arrives.

Either way, content loading for the first time is loaded and displayed all at once: the title, the subtitle, the supporting text and the action replace the indicator together rather than filling in piece by piece. The card's size never changes once it is on screen, so nothing below it shifts when the ink lands. Each card carries `aria-busy` while it waits, and Replay runs both loads again. The loads are simulated.
:::

::: ds-example
/systems/md1/progress-circular/swipe-to-refresh

### Swipe to refresh

Swipe to refresh is a composition, not a component. Material Design 1 ships no gesture primitive and mobile browsers own pull-to-refresh on the page itself, so this pattern belongs inside a scrolling region of the app. The refresh indicator is this component inside a 40 dp disc on the surface colour at 3 dp elevation, the elevation page's value for the refresh indicator, centred horizontally near the top of the content it refreshes.

The example tracks the pull with pointer events on the list while it is scrolled to the top. As the pull grows, the disc slides out from under the app bar, its arc grows and it turns with the finger. Past the threshold, a 72 px pull and a Material Design 1 decision,[^pull] the disc reaches full opacity and moves and turns more slowly: the cue that releasing now refreshes. Reversing back above the threshold before letting go cancels. On release the indicator settles at its resting position and spins until the new content is in.

The guidelines keep swipe to refresh out of navigation drawers and out of content that pans. Always give the same action another path: the example's app bar has a refresh button for keyboard and pointer users who never swipe.
:::

::: ds-example
/systems/md1/progress-circular/load-more

### Loading more at the end of a list

The guidelines recommend an indeterminate circular indicator when a list loads more from below. Scroll to the end of the list and the indicator joins it, centred in a footer row, while the next page loads; the new rows then appear in its place. After three pages the footer says the list has ended instead. The indicator takes no disc of its own here, unlike swipe to refresh, because it sits in the list rather than over it. The load is simulated.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1ProgressCircular.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | | Percent complete, clamped to 0 to 100. Unset is the spinning indicator; 0 is an empty determinate ring |
| `size` | `number` | `40`, `64` with `fab` | Outer diameter in px. The stroke stays 4 dp |
| `fab` | `boolean` | `false` | The ring around a sibling 56 dp `Md1Fab`: 64 dp in the accent colour, positioned 4 dp outside the FAB |
| `ariaLabel` | `string` | | Accessible name. Defaults to the `Md1.loading` locale key, "Loading" in English |
| `namespace` | `string` | | The context key `Progress.Root` provides. Leave it unset unless a surrounding v0 `Progress` context must not collide with this one |

There is no slot content and there are no named slots.

| Hook | Values |
|------|--------|
| `data-state` | `determinate`, `indeterminate` |
| `data-fab` | present with `fab` |
| `data-complete` | present at 100% |

## Accessibility

The root is a `progressbar` with `aria-valuemin="0"` and `aria-valuemax="100"`. A determinate ring adds `aria-valuenow` and `aria-valuetext`; an indeterminate one omits both and sets `aria-busy="true"`. The SVG is `aria-hidden`. The indicator is not focusable and has no keyboard interaction.

### Naming

Every indicator needs a name that says what is loading. The default, "Loading", is a fallback; pass `ariaLabel` with the operation ("Downloading map") whenever there is one. A ring around a FAB is a second element beside the button: name it after the operation, and keep the FAB named after its action.

### Announcements

Screen readers do not announce progress changes on their own. Mirror the start and the end of the operation in a polite live region, as the examples do with `role="status"`. In the swipe to refresh composition the indicator is hidden from assistive technology while it only tracks the pull, and becomes a named progressbar once the refresh runs.

### Motion

The indeterminate ring is continuous motion. Under `prefers-reduced-motion: reduce`, or the `createReducedMotionPlugin` body attribute, Material Design 1 halves its speed. The plugin's setting wins over the operating system's.

[^step]: Our call: the page gives no timing for a value change; the standard duration is the motion page's default for on-screen changes.

[^track]: Vuetify 1.5.24, stylus/settings/_variables.styl:288. `$progress-circular-underlay-stroke` is black at 10%.

[^cycle]: Vuetify 1.5.24, stylus/settings/_variables.styl:285-286. The rotate and dash animations both run 1.4 s.

[^reduced-motion]: Our call: a stopped spinner reads as a hang, so reduced motion slows it instead.

[^pull]: Our call: the page gives no distance; 72 px is a deliberate pull on a phone without needing a long drag.
