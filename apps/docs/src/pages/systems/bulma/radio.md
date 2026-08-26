---
title: BuRadio - Bulma Radio for Vue
meta:
- name: description
  content: Bulma's radio for Vue — native radios grouped by name, sharing a v-model, with the documented label disabled treatment and Vuetify0 validation.
- name: keywords
  content: bulma radio, vue radio, native radio, radio group, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuRadio'
  level: 2
  renderless: false
  order: 17
related:
  - /systems/bulma
  - /systems/bulma/field
  - /systems/bulma/checkbox
---

# BuRadio

<DocsPageFeatures :frontmatter />

A native radio wrapped in `label.radio`. `value` is required. Radios that share a `name` and a `v-model` are the group — there is no group component in Tier 1.

> [!NOTE]
> Reference: [Radio on bulma.io](https://bulma.io/documentation/form/radio/) — classes and visual variants. This page is the JavaScript.

## Usage

The value lives on each radio, not on a parent. `v-model` is compared to `value`; the matching radio is checked. Give every radio in the question the same `name` so the UA groups them for form submission and arrow-key movement.

The default slot is the label text. Selection only ever moves, it never clears: clicking the checked radio keeps it checked, which is the native contract.

::: ds-example
/systems/bulma/radio/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuRadio } from '@paper/bulma'
</script>

<template>
  <BuRadio />
</template>
```

## Composed on v0

`BuRadio` calls [createInput](/composables/forms/create-input) for validation, form registration, the generated id and `aria-invalid`. The element is a native `<input type="radio">` inside `<label class="radio">`.

It does **not** wrap v0's Radio compound. That compound is a `role="radio"` button inside a `Radio.Group`, with roving tabindex and an indicator slot. Bulma styles a visible native radio, and a button gets none of your CSS. This is the Ruling 2 deviation: Tier 1 wraps the native where the stylesheet demands it. Grouping is the native `name` attribute, not a group part.

Fallthrough is split. `class` and `style` merge onto the wrapping label; every other attribute lands on the native input.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/radio/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<div class="control">
  <label class="radio">
    <input type="radio" name="answer" />
    Yes
  </label>
  <label class="radio">
    <input type="radio" name="answer" />
    No
  </label>
</div>
```

```vue Vue
<template>
  <BuControl>
    <BuRadio v-model="answer" name="answer" value="yes">Yes</BuRadio>
    <BuRadio v-model="answer" name="answer" value="no">No</BuRadio>
  </BuControl>
</template>
```

:::

Siblings sit inside a `BuControl` (inline) or a `.radios` wrapper (Bulma 1.0 list layout). Pick one; they are layout, not state.

## Examples

::: ds-example
/systems/bulma/radio/disabled

### Disabled options

`disabled` on one radio withdraws that option the same way [BuCheckbox](/systems/bulma/checkbox) does: `disabled` on the native input **and** on the wrapping label. The input's `disabled` is the real one — out of the tab order, not togglable, skipped by form submit. The label's `disabled` is the non-standard attribute Bulma documents and styles.

There is no "disable the group" prop, because there is no group component. Omit the radios, or disable each of them. A disabled option still occupies the group: the shared `name` and `v-model` keep working for the ones that remain.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with BuRadio.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T` | — | Selected value. This radio is checked when it equals `value` |
| `value` | `T` | required | Comparison value written to the model when this radio is checked |
| `disabled` | `boolean` | `false` | Disables the input **and** puts `disabled` on the wrapping label |
| `error` | `boolean` | `false` | Force the invalid state (`aria-invalid`, no color class) |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `form` | `string` | — | Id of the form to associate with. Snapshotted at setup |
| `id` | `string \| number` | auto | Input id; generated when omitted. Snapshotted at setup |
| `name` | `string` | — | Native radio grouping. Snapshotted at setup |
| `required` | `boolean` | — | Marks the field required. Snapshotted at setup; the DOM attr stays reactive |
| `rules` | `ValidationRule[]` | `[]` | Validation rules. Snapshotted at setup |
| `validate-on` | `ValidateOn` | `'blur'` | When validation runs |

`T` defaults to `string`. The default slot is the label text. Slot props: `errors`, `isChecked`, `isFocused`, `isValid`.

`id`, `name`, `form`, `required` and `rules` are snapshotted at setup because `createInput` takes plain values for those options. The `name` you pass is also bound reactively on the DOM input, so grouping still updates if you change it.

## Accessibility

The widget is a native radio. The wrapping `<label>` is the name and the hit target. The UA groups radios that share `name` and moves selection with the arrow keys; there is no roving tabindex of our own.

### Naming

Put the name in the default slot. An empty slot is an unnamed radio. Every radio in a question needs its own text — "Yes" / "No" / "Maybe", not a single group label standing in for all three. A group label is a sibling `BuLabel` (or a `<fieldset>` / `<legend>`) in addition to, not instead of, the per-radio text.

### Grouping

`name` is the group. Two radios with different names are two questions, even if they share a `v-model`. Two radios with the same name and different `v-model` refs will fight the UA. Share both.

### Disabled

Same quirk as `BuCheckbox`: `input[disabled]` is native; `label[disabled]` is the non-standard attribute Bulma's CSS selects on. Expect axe and validator discussion. Declared SPEC limitation, kept for fixture fidelity. Assistive technology respects the input.

### Validation

`aria-invalid` when `isValid === false`. No color class. Each radio has its own `createInput` instance, so a rule on one radio does not validate the group. Put group-level rules on a surrounding form, or accept that this is a native radio and required means "this particular input must be checked."
