---
title: EmRadio - Emerald Radio for Vue
meta:
- name: description
  content: Emerald's radio — a group and its radios over Vuetify0's headless Radio compound, with roving focus, arrow-key selection, and three control sizes.
- name: keywords
  content: emerald radio, vue radio group, radio button vue, design system radio, vuetify0 radio, paper emerald
features:
  category: Component
  label: 'C: EmRadio'
  level: 2
  renderless: false
  order: 20
related:
  - /systems/emerald
  - /systems/emerald/select
  - /components/forms/radio
---

# EmRadio

<DocsPageFeatures :frontmatter />

A single-selection group of radios. `EmRadioGroup` owns the value; each `EmRadio` is one choice, with its label in the default slot and three sizes on the shared control scale.

## Usage

The value lives on the group. `v-model` on `EmRadioGroup` holds the `value` of whichever `EmRadio` is checked, and each radio's `value` is required — it is what group selection and form submission identify the choice by.

A radio's label is its default slot. Leave the slot empty — an icon-adjacent radio, a table cell — and the control has no visible text, so pass `label` instead; an unlabelled radio is an unnamed control. Selection only ever moves, it never clears: clicking the checked radio again keeps it checked, which is the native radio contract.

::: ds-example
/systems/emerald/radio/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmRadio } from '@paper/emerald'
</script>

<template>
  <EmRadio.Group>
    <EmRadio />
  </EmRadio.Group>
</template>
```

## Composed on v0

`EmRadioGroup` renders v0's [Radio](/components/forms/radio) compound — `Radio.Group` directly, while each `EmRadio` wraps `Radio.Root` with a `Radio.Indicator` inside. All of the behavior is v0's: `Radio.Group` runs the single-selection registry and the `v-model` bridge, and `Radio.Root` owns the roving tabindex, the arrow-key handling and the `role="radio"` semantics. Emerald adds the two spans that make it look like a radio — the circle behind, the dot inside the indicator — and the stylesheet.

The split shows in the markup. `Radio.Root` renders a `<button>`, and a wrapping `<label>` does not name a button the way it names an `<input>` — so `EmRadio` renders the label text in a sibling span and points the button at it with `aria-labelledby`. The wrapping `.emerald-radio` label still exists, but only so clicking the text activates the control; the accessible name travels by reference.

State never travels through classes. `Radio.Root` publishes `data-state="checked" | "unchecked"` and `data-disabled`, `Radio.Indicator` hides itself while unchecked, and Emerald's stylesheet hangs every checked, hover and disabled rule off those attributes. The wrapper adds two attributes of its own — `data-size` for the scale and `data-disabled` mirroring the radio's own `disabled` prop — and those are Emerald's, not v0's.

Form participation is v0's too. Give `EmRadioGroup` a `name` and it flows through context to every radio, and `Radio.Root` renders v0's `Radio.HiddenInput` — an inert, visually hidden native `<input type="radio">` kept in sync with the checked state — so the group submits with a plain `<form>` without any of the visible controls being inputs. Object values are JSON-serialized for submission.

## Examples

::: ds-example
/systems/emerald/radio/sizes

### Sizes

`size` sits on each `EmRadio` rather than on the group, and moves the control across the same scale the checkbox uses: `sm` is 16px, `md` — the default — is 20px, and `lg` is 24px, with the dot stepping along with the circle. The label text does not change size; only the control does.

Set the same size on every radio in a group. The prop is per-radio only because the radio owns its own control box, not because mixed sizes within one group are a supported layout — a group with three control sizes reads as three different questions.

Pick by the surface's density, the same way you would for [EmButton](/systems/emerald/button): `sm` inside tables and dense settings panels, `md` for ordinary forms, `lg` where the choice is the page's main event and the target needs to be generous.
:::

::: ds-example
/systems/emerald/radio/disabled

### Disabled radios and disabled groups

`disabled` exists at both levels and means the same thing at different scopes. On one `EmRadio` it withdraws a single option — it stays visible, dims, and cannot be selected by pointer or keyboard; the arrow keys skip straight over it. On `EmRadioGroup` it freezes the whole question: every radio dims and the group drops out of the tab order entirely.

Neither is the native `disabled` attribute. The radio is a `<button>` that v0 marks with `aria-disabled` and `tabindex="-1"` and whose activation is guarded in the handler, so assistive technology still perceives the option and announces it as unavailable — which is the point of showing a disabled choice at all. A choice that should not be perceived should be removed, not disabled.

One asymmetry to know: a radio disabled by its own prop dims both its control and its label text, while a group-wide disable dims the controls only. When the reason for the lock matters, put it in the group's name rather than relying on the dimming — this example bakes it into the `label` prop, which screen readers announce; to show the same words to sighted readers, render a visible heading and point `ariaLabelledby` at it instead.
:::

## Props

### EmRadioGroup

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `unknown` | — | Value of the checked radio |
| `disabled` | `boolean` | `false` | Disables every radio and removes the group from the tab order |
| `name` | `string` | — | Form field name, shared with every radio. Each radio renders a hidden native input when set |
| `mandatory` | `boolean \| 'force'` | `false` | `'force'` auto-selects the first non-disabled radio on mount. Selection can never be cleared through the UI either way, so `'force'` is the meaningful option |
| `label` | `string` | — | Accessible name for the radiogroup when no visible label element is associated |
| `ariaLabelledby` | `string` | — | ID of an existing element that labels the radiogroup |
| `namespace` | `string` | — | Which v0 `Radio.Group` context to provide. Only needed when nesting |

The default slot holds the radios. There are no named slots.

### EmRadio

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `unknown` | — | **Required.** Value this radio contributes to the group model and to form submission |
| `disabled` | `boolean` | `false` | Withdraws this option — unselectable, skipped by arrow keys, removed from the tab order |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size on the shared checkbox scale — 16, 20 or 24px |
| `label` | `string` | — | Accessible name when the default slot is empty |
| `namespace` | `string` | — | Which v0 `Radio.Root` context this radio provides. Only needed when nesting |
| `groupNamespace` | `string` | — | Which v0 `Radio.Group` this radio registers with. Only needed when nesting |

The default slot is the visible label. There are no named slots.

## Accessibility

`Radio.Group` renders `role="radiogroup"` and `Radio.Root` renders a `<button role="radio">` with `aria-checked`, so the group announces as a set of exclusive choices with one of them selected.

### Naming

Name the group. `label` becomes `aria-label`; `ariaLabelledby` points at a heading or legend you already render, and wins when both are set. A radiogroup without a name announces as an anonymous cluster of options with no question attached.

Each radio is named by its slot text — via `aria-labelledby` to the sibling span, since a wrapping label does not name a button — and by the `label` prop when the slot is empty. The circle and dot are `aria-hidden`; they contribute nothing to the name.

### Keyboard

The group is a single tab stop with a roving tabindex. Tab lands on the checked radio, or on the first enabled radio when nothing is checked yet; a fully disabled group is skipped entirely.

| Key | Behavior |
|-----|----------|
| Tab / Shift + Tab | Into the group at the checked radio, then out — never between radios |
| Arrow Down / Arrow Right | Focus **and select** the next enabled radio, wrapping from last to first |
| Arrow Up / Arrow Left | Focus **and select** the previous enabled radio, wrapping from first to last |
| Enter, Space | Select the focused radio |

Selection follows focus — arrowing through the group selects as it moves, which is the APG default for radio groups. v0's `Radio.Group` has a manual activation mode, but `EmRadioGroup` does not expose it, so the automatic behavior is the only one here. Disabled radios are skipped by the arrow keys, not landed on.

Enter selecting is a small extension over native radios, which only respond to Space; since both keys are handled explicitly, nothing double-fires.

### Disabled

Disabled radios use `aria-disabled` with `tabindex="-1"` rather than the native `disabled` attribute — perceivable and announced as dimmed, unreachable by Tab, activation guarded. Group-level `disabled` applies the same treatment to every radio at once, which removes the whole group from keyboard reach; when the reason for the lock matters, put it in the group's name — the `label` prop for what is announced, or a visible element referenced by `ariaLabelledby` so sighted readers get the same words.

### Focus

The focus ring is an outline on the circle, and it only appears for `:focus-visible` — keyboard focus draws it, a pointer click does not leave a ring behind.
