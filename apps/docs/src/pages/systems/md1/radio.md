---
title: Md1Radio - Material Design 1 Radio Button for Vue
meta:
- name: description
  content: The Material Design 1 radio button, a 20 dp ring with a 10 dp dot in the accent colour, grouped in a radiogroup with roving focus and arrow-key selection. Built on Vuetify0's Radio.
- name: keywords
  content: md1 radio, material design 1 radio button, selection controls, radio group, vue radio, vuetify0 radio, paper md1
features:
  category: Component
  label: 'C: Md1Radio'
  level: 2
  renderless: false
  group: forms
  order: 3
related:
  - /systems/md1
  - /systems/md1/checkbox
  - /systems/md1/switch
  - /components/forms/radio
---

# Md1Radio

<DocsPageFeatures :frontmatter />

The Material Design 1 radio button. It selects exactly one option from a set that the user needs to see side by side.

> [!NOTE]
> Reference: [Selection controls, Material Design 1 guidelines](https://m1.material.io/components/selection-controls.html), the archived page Material Design 1 is pinned to. Colours and usage come from the page text; the geometry is measured from its spec sheets. This page is the Vue.

## Usage

`Md1Radio` is a shell that must sit inside `Md1Radio.Group`, which owns the `v-model`, the shared `name` and the keyboard model. Each radio takes a `value` and a `label`.

Use radio buttons when every option should stay visible. When space is short, the guidelines suggest a dropdown instead.

::: ds-example
/systems/md1/radio/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Radio } from '@paper/md1'
</script>

<template>
  <Md1Radio.Group>
    <Md1Radio />
  </Md1Radio.Group>
</template>
```

## Composed on Vuetify0

`Md1Radio.Group` renders v0's `Radio.Group`, a `<div role="radiogroup">` backed by single selection. Each `Md1Radio` renders `Radio.Root` and `Radio.Indicator` inside a native `<label>`: the root is a `<button role="radio">` that registers with the group, and the indicator is the dot, hidden while the radio is off. Selection, the roving tabindex, the arrow keys and the hidden form inputs are all v0's; Material Design 1 binds no handler of its own.

`Radio.Root` emits the `data-state` (`checked`, `unchecked`) and `data-disabled` attributes the stylesheet hangs off. An `Md1Radio` rendered outside a group throws, as v0's `Radio.Root` does, rather than rendering a control that can never be selected.

The first child of each button is an unbounded [Md1Ripple](/systems/md1/ripple), hidden under a fine pointer because the guidelines draw the radial reaction only where touch is favoured.

## Examples

::: ds-example
/systems/md1/radio/disabled

### Disabled options

The ring is 20 dp with a 2 dp stroke, centred in a 24 dp control; the dot is 10 dp and grows from the centre when the radio turns on. Off, the ring is 54% black (70% white on dark); on, ring and dot take the accent colour in both themes.

A disabled radio drops to 26% black (30% white on dark), its label takes the disabled text ink, and the arrow keys skip it. Set `disabled` on the group to disable the whole set. Prefer explaining why an option is unavailable in its label, as "sold out" does here.
:::

::: ds-example
/systems/md1/radio/form

### Form submission

`name` on the group gives every radio v0's hidden input under that name, so a native form submits the selected value. `mandatory="force"` selects the first enabled option on mount, for sets where no answer is not an answer.

Radio groups are mandatory by nature: once an option is chosen the user can change it but not clear it. Start with no selection when the choice must be deliberate, and force one only when there is a sensible default.
:::

::: ds-example
/systems/md1/radio/themes

### Light and dark themes

The same groups on each theme. The selected ring and its dot keep the accent on the dark theme, an unselected ring is 70% white, and the disabled group drops to 30% white. Arrow keys move the selection inside a group; on a touch screen a press draws the 48 dp halo around the ring.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Radio.vue and Md1RadioGroup.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `unknown` | | The value the group's model takes when this radio is selected |
| `label` | `string` | | The visible text beside the ring; the control's `aria-labelledby` points at it. The default slot replaces it |
| `disabled` | `boolean` | `false` | 26% ink (30% on dark), no selection, skipped by the arrow keys |
| `name` | `string` | | Overrides the group's `name` for this radio's hidden input |
| `ariaLabel` | `string` | | Accessible name for a radio with no visible label |
| `namespace` | `string` | | The context key `Radio.Root` provides to its indicator |
| `groupNamespace` | `string` | | The group to register with; match the group's `namespace` when it is set |

The default slot is the label. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Radio.Group` (`Md1RadioGroup`) | `modelValue`, `name`, `mandatory` (`boolean \| 'force'`), `activation` (`'automatic' \| 'manual'`, default `'automatic'`), `disabled`, `ariaLabel`, `ariaLabelledby`, `namespace` | `<div role="radiogroup">` in a column; each row is 48 dp tall, so the column has no gap. `ariaLabel` or `ariaLabelledby` names the set |

## Accessibility

The group is a `radiogroup` and each control a `<button role="radio">` with `aria-checked`, the WAI-ARIA Radio Group pattern. Each radio is named by its visible label through `aria-labelledby`. A radio with no visible label takes `ariaLabel`, or an `aria-labelledby` naming text elsewhere, which Material Design 1 moves from the `<label>` root onto the control. Material Design 1 warns in development when a radio has no name.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus into and out of the group: to the selected radio, or the first enabled one when none is selected |
| Arrow Down, Arrow Right | Moves to the next enabled radio, wrapping; selects it under `activation="automatic"` |
| Arrow Up, Arrow Left | Moves to the previous enabled radio, wrapping; selects it under `activation="automatic"` |
| Space, Enter | Selects the focused radio |

### Focus

Keyboard focus draws the 48 dp radial reaction around the ring: 6% black off (10% white on dark) and 10% of the accent on. Material Design 1 draws it for `:focus-visible` on every pointer type;[^halo] the touch-only rule of the guidelines applies to the press ink.

### Disabled

| State | Attributes set | Focusable | Activation |
|-------|----------------|-----------|------------|
| enabled | `tabindex="0"` on the selected radio (or the first enabled one), `-1` on the rest | Through the group's single tab stop | Click on the ring or label, Space, Enter, arrows |
| `disabled` | `aria-disabled="true"`, `data-disabled`, `tabindex="-1"` | No: Tab and the arrow keys skip it | Blocked |

`disabled` on `Md1Radio.Group` applies the disabled row to every radio and adds `data-disabled` to the group.

### Touch target

The 24 dp control answers to a 48 dp circle around it, and the whole label row is a click target.

[^halo]: Our call: the page draws the halo for touch; without it, desktop keyboard focus would have no indicator. Still an open ruling in SPEC.
