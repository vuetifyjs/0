---
title: BSwitch - Bootstrap 6 switch for Vue
meta:
- name: description
  content: Bootstrap 6 switch for Vue. A checkbox inside div.switch, with role switch and the boolean switch attribute.
- name: keywords
  content: bootstrap 6 switch, vue switch, role switch, paper bootstrap
features:
  category: Component
  label: 'C: BSwitch'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/check
  - /systems/bootstrap/radio
  - /components/forms/switch
---

# BSwitch

A switch. The class switch is the wrapper. Inside it, a checkbox carries role switch and the boolean switch attribute.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/switch/"
  title="Switch"
/>

## Usage

`v-model` is a boolean. The label sits beside the wrapper and points at the input's `id`.

::: ds-example
/systems/bootstrap/switch/basic
:::

### The markup Bootstrap documents

`switch` on the input is a boolean attribute. Browsers that support it use it for haptic feedback. This is not the class `check`, and the input does not get that class.

::: code-group no-filename

```html Bootstrap collapse
<div class="switch">
  <input type="checkbox" value="" id="switch" role="switch" switch>
</div>
```

```vue Vue collapse
<template>
  <BSwitch id="switch" v-model="on" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BSwitch } from '@paper/bootstrap'
</script>

<template>
  <BSwitch />
</template>
```

## Composed on v0

[Switch](/components/forms/switch) renders a button with role switch. The pinned tree is a div around a checkbox, so this component renders that tree and binds the model itself. The id comes from `useId` when you do not pass one.

## Examples

::: ds-example
/systems/bootstrap/switch/sizes

### Sizes

`sm` adds `switch-sm` on the wrapper. `lg` adds `switch-lg` on the wrapper. The input is unchanged. `theme` adds `theme-{theme}` on the wrapper as well, which is where the pinned theme class sits, not on the checkbox.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Checked state. |
| `disabled` | `boolean` | `false` | Native `disabled` on the input. |
| `id` | `string` | generated | Points a label's `for` at the input. |
| `name` | `string` | — | Native name. |
| `size` | `'sm' \| 'lg'` | — | `switch-sm` or `switch-lg` on the wrapper. |
| `theme` | `string` | — | `theme-{theme}` on the wrapper. |
| `value` | `string \| number` | `''` | Submitted value. The pin uses an empty string. |

## Accessibility

The input is a checkbox with `role="switch"`, which is the pinned markup. Space toggles it. Point a `label` at `id` on the input, not at the wrapper. The boolean `switch` attribute is present for browsers that use it. Do not add the class `check`. A disabled switch sets `disabled` on the input.
