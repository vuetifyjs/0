---
title: BRadio - Bootstrap 6 radio for Vue
meta:
- name: description
  content: Bootstrap 6 radio for Vue. The radio class sits on the native input. A group shares one model and matches on value.
- name: keywords
  content: bootstrap 6 radio, vue radio, radio group, theme, paper bootstrap
features:
  category: Component
  label: 'C: BRadio'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/check
  - /systems/bootstrap/switch
  - /components/forms/radio
---

# BRadio

A radio. The radio class sits on the input. Several of them share one model, and the checked one is the radio whose value matches.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/radio/"
  title="Radio"
/>

## Usage

Pass the same `v-model` and the same `name` to each radio. `value` is that option. The model becomes that value on change.

::: ds-example
/systems/bootstrap/radio/basic
:::

### The markup Bootstrap documents

The class is on the input. Give every radio in a set the same `name` so the browser treats them as one group.

::: code-group no-filename

```html Bootstrap collapse
<div class="form-field">
  <input class="radio" name="radios" type="radio" id="radio1" value="first" checked />
  <label for="radio1">First example radio</label>
</div>
<div class="form-field">
  <input class="radio" name="radios" type="radio" id="radio2" value="second" />
  <label for="radio2">Second example radio</label>
</div>
<div class="form-field">
  <input class="radio" name="radios" type="radio" id="radio3" value="third" />
  <label for="radio3">Third example radio</label>
</div>
```

```vue Vue collapse
<template>
  <BRadio id="radio1" v-model="choice" name="radios" value="first" />
  <BRadio id="radio2" v-model="choice" name="radios" value="second" />
  <BRadio id="radio3" v-model="choice" name="radios" value="third" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BRadio } from '@paper/bootstrap'
</script>

<template>
  <BRadio />
</template>
```

## Composed on v0

[Radio](/components/forms/radio) renders a button inside a group. The radio class would not land on an input, so this component renders the input from the snippet. The shared model is the value match, not a selection registry. The id comes from `useId` when you do not pass one.

## Examples

::: ds-example
/systems/bootstrap/radio/sizes

### Sizes

`sm` adds `radio-sm`. `lg` adds `radio-lg`. Both classes are on the input, next to `radio`. Leave `size` off for the default. `theme` adds `theme-{theme}` on that same input, the same way a checkbox takes a theme.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string \| number \| null` | `null` | The group's selected value. |
| `value` | `string \| number` | — | This radio's value. Checked when it matches the model. |
| `name` | `string` | — | Native name. Radios in one group share it. |
| `disabled` | `boolean` | `false` | Native `disabled` on the input. |
| `id` | `string` | generated | Points a label's `for` at the input. |
| `size` | `'sm' \| 'lg'` | — | `radio-sm` or `radio-lg` on the input. |
| `theme` | `string` | — | `theme-{theme}` on the input. |

## Accessibility

The control is a native radio. Arrow keys move inside a group that shares a `name`. Point each `label` at that radio's `id`. Do not add `role="radio"`. The checked radio is the one whose `value` equals the model. Types have to match: a string `"1"` is not the number `1`.
