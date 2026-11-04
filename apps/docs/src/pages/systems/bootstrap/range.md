---
title: BRange - Bootstrap 6 Range for Vue
meta:
- name: description
  content: Bootstrap 6 range markup with Vuetify0 slider math — min, max, step, and a numeric v-model on form-range-input, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 range, vue range input, slider, form-range, createSlider, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BRange'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /composables/forms/create-slider
---

# BRange

A native range input. `v-model` is the number. Step snapping is the slider, not the browser alone.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/range/"
  title="Range"
/>

## Usage

`min` defaults to 0, `max` to 100, and `step` to 1. `disabled` disables the input.

::: ds-example
/systems/bootstrap/range/basic
:::

### The markup Bootstrap documents

The HTML tab is the pin. The Vue tab is the same two elements. `data-bs-bubble` is the bundle's value bubble. The pin has no bubble element, so this package does not render one and does not emit that attribute.

::: code-group no-filename

```html Bootstrap collapse
<div class="form-range">
  <input type="range" class="form-range-input" id="range1">
</div>
```

```vue Vue collapse
<template>
  <BRange id="volume" v-model="volume" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BRange } from '@paper/bootstrap'
</script>

<template>
  <BRange />
</template>
```

## Composed on v0

[createSlider](/composables/forms/create-slider) holds one thumb. `min`, `max`, and `step` are that slider's. Moving the input calls `set`, which snaps to the step and clamps to the ends. The track fill is `--bs-range-fill` on the input, the fraction from `min` to `max`. The pin's stylesheet reads that property. There is no tick-mark engine. A `datalist` stays in your markup, pointed at the input.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number` | | Thumb value. |
| `min` | `number` | `0` | Minimum. Read when the range is created. |
| `max` | `number` | `100` | Maximum. Read when the range is created. |
| `step` | `number` | `1` | Snap increment. Read when the range is created. |
| `disabled` | `boolean` | `false` | Disables the input and the thumb. |
| `id` | `string` | generated | Input id, for a label's `for`. An empty string is omitted. |

## Accessibility

The control is a native range input. Give it a label with `for` matching `id`. Disabled uses the `disabled` attribute, so it leaves the tab order.
