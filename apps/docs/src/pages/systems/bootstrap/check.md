---
title: BCheck - Bootstrap 6 checkbox for Vue
meta:
- name: description
  content: Bootstrap 6 checkbox for Vue. The check class sits on the native input, with a boolean model, sizes, theme, and indeterminate.
- name: keywords
  content: bootstrap 6 checkbox, vue checkbox, check, indeterminate, theme, paper bootstrap
features:
  category: Component
  label: 'C: BCheck'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/radio
  - /systems/bootstrap/switch
  - /components/forms/checkbox
---

# BCheck

A checkbox. The check class sits on the input. The label is the next element, not part of this component.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/checkbox/"
  title="Checkbox"
/>

## Usage

`v-model` is a boolean. Several checkboxes that share a `name` are the consumer's group. Each one keeps its own model.

::: ds-example
/systems/bootstrap/check/basic
:::

### The markup Bootstrap documents

The class is on the input. `data-bs-*` is not part of this control, and this package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<input type="checkbox" id="check" class="check" checked />
```

```vue Vue collapse
<template>
  <BCheck id="check" v-model="agreed" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCheck } from '@paper/bootstrap'
</script>

<template>
  <BCheck />
</template>
```

## Composed on v0

[Checkbox](/components/forms/checkbox) renders a button. The check class would not land on an input, so this component renders the input from the snippet and binds the model itself. The id comes from `useId` when you do not pass one.

## Examples

::: ds-example
/systems/bootstrap/check/sizes

### Sizes

`sm` adds `check-sm`. `lg` adds `check-lg`. Both classes are on the input, next to `check`. The default size is the input with no size class. The label stays outside the component, in a `form-field` if you want the pinned side-by-side layout.
:::

::: ds-example
/systems/bootstrap/check/indeterminate

### Indeterminate

There is no HTML attribute for the mixed state. `indeterminate` sets the IDL property on mount and again whenever the prop or the model changes, so a later checked update does not clear it. The DOM stays a plain checkbox. Browsers expose that property as mixed to assistive tech.
:::

::: ds-example
/systems/bootstrap/check/theme

### Theme

`theme` adds `theme-{theme}` on the input. `primary` is the usual token. The class recolors the checked background and border. It does not wrap the control.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Checked state. |
| `disabled` | `boolean` | `false` | Native `disabled` on the input. |
| `id` | `string` | generated | Points a label's `for` at the input. |
| `indeterminate` | `boolean` | `false` | IDL property. Not an attribute. |
| `name` | `string` | — | Native name. Grouping is yours. |
| `size` | `'sm' \| 'lg'` | — | `check-sm` or `check-lg` on the input. |
| `theme` | `string` | — | `theme-{theme}` on the input. |
| `value` | `string \| number` | — | Submitted value. The model stays a boolean. |

## Accessibility

The control is a native checkbox, so Space toggles it and the browser reports checked, unchecked, or mixed. Point a `label` at `id`. Do not add `role="checkbox"`. A disabled input uses the `disabled` attribute and is removed from the tab order by the browser. Grouped options share a `name`. Each option still has its own boolean model.
