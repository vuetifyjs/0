---
title: EmProgress - Emerald Progress for Vue
meta:
- name: description
  content: Emerald's linear progress bar — determinate and indeterminate modes, three track sizes, and an optional label and value readout. Composed on Vuetify0's headless Progress.
- name: keywords
  content: emerald progress, vue progress bar, linear progress, indeterminate progress, vuetify0 progress, paper emerald
features:
  category: Component
  label: 'C: EmProgress'
  level: 2
  renderless: false
  order: 19
related:
  - /systems/emerald
  - /components/semantic/progress
  - /composables/semantic/create-progress
---

# EmProgress

<DocsPageFeatures :frontmatter />

A linear progress bar for uploads, tasks and syncs — determinate or indeterminate, with an optional label row and a live percentage readout.

## Usage

`EmProgress` is a shell component: fixed anatomy, no slots, everything is a prop. `v-model` is the current value as a number from `0` to `max`, and the fill animates between values with a short width transition, so a stream of updates reads as motion rather than jumps.

`label` and `show-value` share one meta row above the track — the label on the left, the rounded percentage on the right. Neither renders anything when unset, so the default is a bare track.

::: ds-example
/systems/emerald/progress/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmProgress } from '@paper/emerald'
</script>

<template>
  <EmProgress />
</template>
```

## Composed on Vuetify0

`EmProgress` renders v0's [Progress](/components/semantic/progress) compound — `Progress.Root`, `Progress.Label`, `Progress.Value`, `Progress.Track` and `Progress.Fill`.

The division of labor: v0 owns everything semantic — the `role="progressbar"` and its `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` attributes, `aria-busy` while indeterminate, the v-model bridge, the hidden input when `name` is set, and the `data-state` attributes on track and fill. Emerald owns everything visual — the meta row layout, the three track heights, the fill color and width transition, and the indeterminate sweep animation.

v0's Progress is segment-based underneath ([createProgress](/composables/semantic/create-progress) can sum multiple fills, plus a buffer). Emerald deliberately flattens that: it renders exactly one `Progress.Fill` and no `Progress.Buffer`, so the component is a single-value bar, and its model handler unwraps the array shape v0 can emit back into a plain number.

The naming logic is also split. When `label` is set, `Progress.Label` mounts and v0 points `aria-labelledby` at it; when it is not, `EmProgress` passes `ariaLabel` through — falling back to `'Progress'` — so the progressbar always has an accessible name.

## Examples

::: ds-example
/systems/emerald/progress/sizes

### Sizes

`size` changes only the track height — `sm` is 4px, `md` 8px, `lg` 12px. The label and value keep their type steps (`b2` and `b3`) across all three, so the meta row does not scale with the bar.

Pick by prominence, not importance. `sm` belongs inside dense surfaces — a table cell, a card footer, a list row — where the bar is one signal among many. `md` is the default for forms and panels. `lg` is for a surface whose whole point is the progress: an upload screen, an onboarding checklist, an installer.
:::

::: ds-example
/systems/emerald/progress/indeterminate

### Indeterminate

`indeterminate` is for waits with no measurable progress — connecting, syncing, waiting on a server. The fill becomes a fixed-width segment sweeping the track, and the percentage readout is hidden even when `show-value` is set, because there is no value to read. On a bar with no committed value — mounted indeterminate, or still at `0` — Vuetify0 reports the matching ARIA state too: `aria-busy` set, `aria-valuenow` dropped.

The prop is designed to be flipped on a bar whose `v-model` stays bound. While it is `true`, `EmProgress` withholds new values from Vuetify0 and ignores the model updates v0 echoes back, so you can leave the binding in place, turn `indeterminate` on while a request is in flight, and turn it off the moment real numbers start arriving — the bar picks up at whatever the model says. One caveat: withholding does not clear a value Vuetify0 has already committed, so a bar flipped to `indeterminate` after reporting real progress keeps its last `aria-valuenow` — the sweep there is Emerald's visual layer only. Flip the prop on before progress starts and the ARIA state is fully indeterminate as well.

> [!NOTE]
> Zero is indeterminate too. v0 derives the indeterminate state from its segment values, and a lone fill at exactly `0` counts as "no progress yet" — so a bar whose model is `0` reports `aria-busy`, drops `aria-valuenow`, and picks up the sweep animation just as if the prop were set. Treat `0` as "not started" rather than "0% done", and seed the model with a small value once work actually begins.
:::

::: ds-example
/systems/emerald/progress/max

### Custom max

`max` rescales the bar without you converting anything. Bind the raw count — steps completed, files processed, bytes received — set `max` to the total, and the fill width and the `show-value` readout are both computed against that range, the readout as a rounded percentage. The readout shows the percentage, never the raw count; render the count yourself when "2 of 6" is the number that matters, as this example does.

The range always starts at zero — there is no `min` prop. And the Reset button here demonstrates the zero caveat from the previous example: dropping the count back to `0` momentarily reads as indeterminate, so the bar shimmers until the first step completes again.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number` | — | Current value, from `0` to `max` |
| `max` | `number` | `100` | Upper bound of the range. The lower bound is always `0` |
| `indeterminate` | `boolean` | `false` | Unknown-duration wait. Animates the fill sweep, hides the value readout, and withholds model updates from Vuetify0 while active |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track height — 4, 8 or 12px. Label and value type steps are unaffected |
| `showValue` | `boolean` | `false` | Renders the rounded percentage in the meta row. Hidden while indeterminate |
| `label` | `string` | — | Visible label in the meta row; becomes the accessible name via `aria-labelledby` |
| `ariaLabel` | `string` | — | Accessible name when no `label` is rendered. Falls back to `'Progress'` |
| `name` | `string` | — | Form field name; v0 renders a hidden input so the value participates in native form submission |
| `namespace` | `string` | — | Which v0 `Progress` instance the parts bind to. Only needed when nesting |

There are no slots and nothing is exposed on the template ref — the anatomy is fixed, and every rendered part is driven by the props above.

## Accessibility

`Progress.Root` renders the `role="progressbar"` element with the full numeric contract: `aria-valuemin="0"`, `aria-valuemax` from `max`, `aria-valuenow` at the current value, and `aria-valuetext` as the rounded percentage — so a screen reader announces "40%" rather than a raw number in an unstated range.

### Naming

The bar always has an accessible name. With `label`, the visible text is the name via `aria-labelledby`. Without it, `ariaLabel` becomes `aria-label`, and if you pass neither, the name falls back to a generic `'Progress'`. Prefer a specific name — especially when several bars share a view, as in a table of per-row completion bars, where each one should say *whose* progress it is — bind `ariaLabel` to something like ``:aria-label="`${item.name} progress`"``.

### Indeterminate and zero

v0 derives its indeterminate state from the value it holds, not from the `indeterminate` prop. While that state is indeterminate — the bar mounted with no value, or the value sits at exactly `0` — `aria-valuenow` and `aria-valuetext` are removed and `aria-busy` is set: the standard signal for "working, amount unknown". A determinate bar at exactly `0` therefore reads as indeterminate too (see the note under Examples), so assistive technology hears "busy" rather than "0%". The converse also holds: flipping the `indeterminate` prop on after real progress has been reported does not clear the committed value, so the bar keeps announcing its last `aria-valuenow` while the sweep animation runs.

### Announcements

The component sets no live region, and `progressbar` value changes are announced at each screen reader's discretion — most stay quiet while the value climbs. That is usually right for a bar that updates several times a second, but it means completion is silent too. When the outcome matters, say what happened when the wait ends: put the result in an `aria-live` region or move focus to it.

### Focus

The bar is a status readout, not a control — it is not focusable, takes no keyboard interaction, and never enters the tab order.
