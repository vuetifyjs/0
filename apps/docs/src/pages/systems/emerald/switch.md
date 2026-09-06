---
title: EmSwitch - Emerald Switch for Vue
meta:
- name: description
  content: Emerald's switch — a two-state toggle with three sizes and a click-anywhere label, composed on Vuetify0's headless Switch compound.
- name: keywords
  content: emerald switch, vue switch, design system switch, toggle switch, vuetify0 switch, paper emerald
features:
  category: Component
  label: 'C: EmSwitch'
  level: 2
  renderless: false
  order: 25
related:
  - /systems/emerald
  - /systems/emerald/checkbox
  - /components/forms/switch
---

# EmSwitch

<DocsPageFeatures :frontmatter />

The on/off control — a sliding toggle in three sizes with a label that is part of the control, so clicking the text flips the switch.

## Usage

`EmSwitch` is a shell component: fixed anatomy, so everything is a prop and the default slot is the label. `v-model` is the on/off state as a plain `boolean`.

The whole component is one `<label>` — track, thumb and text — so the entire surface is a click target and the cursor says so. Reach for a switch over a [checkbox](/systems/emerald/checkbox) when the toggle takes effect immediately — a setting that applies the moment it flips — and for a checkbox when the choice is collected now and submitted later.

::: ds-example
/systems/emerald/switch/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmSwitch } from '@paper/emerald'
</script>

<template>
  <EmSwitch />
</template>
```

## Composed on Vuetify0

`EmSwitch` renders v0's [Switch](/components/forms/switch) compound — `Switch.Root`, `Switch.Track` and `Switch.Thumb` — and adds nothing to its behavior.

The split is clean. `Switch.Root` owns the state machine: `role="switch"` on a native button host, `aria-checked`, the Space handler, the `data-state` / `data-disabled` attributes every Emerald style rule hangs off, and the hidden native input that appears when `name` is set. `Switch.Track` and `Switch.Thumb` are decorative `aria-hidden` spans whose only job is to carry `data-state` down to something styleable. Emerald owns everything you can see: the pill, the thumb and its travel distance, the sizing tokens, and the hover and disabled palettes.

One deliberate quirk lives in the track: v0 renders it with a hardcoded `dir="ltr"`, so the thumb's travel is physical, not logical — on is always thumb-right, even under an RTL document. Emerald's CSS honors that and does not reverse the travel under `[dir=rtl]`; the checked state is carried by the fill color either way.

Two inherited capabilities are not surfaced. `Switch.Root` supports an `indeterminate` state, which `EmSwitch` does not pass — an Emerald switch is strictly two-state. And the root is dual-mode: rendered inside a Vuetify0 `Switch.Group` it registers with the group and defers its checked state to it, ignoring the `v-model`. Emerald does not ship a group part, so treat that as a Vuetify0 escape hatch rather than a documented Emerald surface.

## Examples

::: ds-example
/systems/emerald/switch/sizes

### Sizes

`size` steps the control geometry through Emerald's switch tokens — a 28×16px track for `sm`, 36×20 for `md`, 44×24 for `lg` — and scales the thumb and its travel with it, so the proportions hold at every step.

What `size` does **not** change is the label. The text stays on the `b1` body step at every size, so a small switch is a smaller toggle beside the same text, not a smaller row. Pick `sm` for dense surfaces — table rows, filter panels — and `lg` where the toggle is the point of the surface.
:::

::: ds-example
/systems/emerald/switch/label

### Label prop

When the visible text lives outside the control — a settings row with the name on the left and the toggle on the right — there is no slot content to name the switch, and an unnamed `role="switch"` is announced as just "switch". `label` covers that case: it becomes the root's `aria-label`, giving assistive technology a name with nothing rendered.

Keep the `label` text identical to the visible text it stands in for. A reader using voice control targets the switch by what they can see, and a name that diverges from the on-screen text breaks that match. When the switch does have slot content, prefer the slot — the two mechanisms both work, but the slot names by reference to the actual rendered text, so it can never drift.
:::

::: ds-example
/systems/emerald/switch/disabled

### Disabled

`disabled` blocks the toggle in every form it can arrive — click, label click, Space — and drops the whole control to Emerald's neutral tokens: greyed track, greyed text, `not-allowed` cursor across the entire label.

The state is preserved, not erased. A disabled switch keeps showing on or off exactly as it was, just without the color that invites interaction — which is what you want when a setting is locked by a precondition rather than discarded by one.

One behavior to know: a disabled `EmSwitch` stays in the tab order. The root is a native button with no `disabled` attribute — the block happens in the state layer — so keyboard users can still reach it and hear it announced as disabled, they just cannot flip it. See [Accessibility](#accessibility) for why that is the announced-but-inert pattern rather than a gap.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | — | On/off state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control geometry step. Scales the track, thumb and travel; the label stays on the body scale |
| `disabled` | `boolean` | `false` | Blocks toggling and greys the control. The root stays focusable and announces `aria-disabled` |
| `label` | `string` | — | Accessible name when no default-slot label is rendered |
| `name` | `string` | — | Form field name; renders a hidden native checkbox when set |
| `value` | `unknown` | — | Submitted value for the hidden input (`'on'` when unset; objects are JSON-serialized) |
| `namespace` | `string` | — | Which v0 `Switch` instance the parts bind to. Only needed when nesting |

The default slot is the visible label. There are no named slots.

## Accessibility

`Switch.Root` renders a native `<button type="button">` carrying `role="switch"`, so the state is announced through `aria-checked` — `true` or `false`, matching the visual `data-state` one for one.

### Naming

A wrapping `<label>` does not name a `<button>` the way it names an `<input>`, so Emerald names the control by reference instead: the slot text renders in a sibling span with a generated id, and the root points at it with `aria-labelledby`. The result is the same as a native pairing — one accessible name, one click target — without relying on an association the platform does not provide for buttons.

When there is no visible text, pass `label`; it becomes the root's `aria-label`. An `EmSwitch` with neither slot content nor `label` is an unnamed control, and a screen reader will announce only "switch" with no hint of what it governs.

### Keyboard

Space toggles — that is the switch pattern's key, and `Switch.Root` handles it directly. Because the host is a native button, Enter activates it as well; the extra key is a platform bonus, not something to design around.

Clicking the label text toggles too: the wrapper is a real `<label>` and the platform forwards its activation to the button inside.

### Disabled

`disabled` sets `aria-disabled` and `data-disabled` and blocks activation in the state layer — click, label forwarding and Space all hit the same guard. What it does **not** set is the native `disabled` attribute, so the control keeps its place in the tab order. A keyboard user tabbing through a form still encounters the switch and hears it announced as disabled, rather than having it silently vanish from navigation; the trade is one extra tab stop for a state that stays discoverable.

### Forms

When `name` is set, v0 renders a visually hidden native `<input type="checkbox">` — `inert`, `tabindex="-1"`, never focusable — that mirrors the on/off and disabled state and submits `value` (or `'on'`) with the surrounding form. It exists purely for form serialization; assistive technology interacts with the `role="switch"` button, never the mirror.

### Right-to-left

The thumb's travel does not mirror under RTL — the track is rendered `dir="ltr"` by v0, so on is always thumb-right. The announced state comes from `aria-checked` and the visual state from the track's fill, neither of which depends on which side the thumb sits.

### Focus

The focus ring is a pill-shaped outline around the toggle, shown only for `:focus-visible` — keyboard focus draws it, a mouse click does not leave a ring behind.
