---
title: BFormLabel - Bootstrap 6 form label for Vue
meta:
- name: description
  content: Bootstrap 6 form-label for Vue. A label whose for attribute names the matching control, so the accessible name is the label text. Styled by your Bootstrap CSS.
- name: keywords
  content: bootstrap 6 form label, vue label, form-label, accessible name, paper bootstrap
features:
  category: Component
  label: 'C: BFormLabel'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-control
  - /systems/bootstrap/form-field
  - /systems/bootstrap/file
---

# BFormLabel

A `<label class="form-label">`. `for` is the control id.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/form-control/"
  title="Form control"
/>

## Usage

Match `for` to the control `id`. Extra classes, such as `mb-2` in the docs, are yours.

::: ds-example
/systems/bootstrap/form-label/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<label for="exampleFormControlInput" class="form-label mb-2">Email address</label>
```

```vue Vue collapse
<template>
  <BFormLabel class="mb-2" for="exampleFormControlInput">Email address</BFormLabel>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFormLabel } from '@paper/bootstrap'
</script>

<template>
  <BFormLabel />
</template>
```

## Composed on v0

The label is the element. It does not use a composable. The control it names is [BFormControl](/systems/bootstrap/form-control) or [BFile](/systems/bootstrap/file). Floating labels in the pin omit `.form-label`. This component always renders it.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | — | Id of the control. Written to the `for` attribute. |

## Accessibility

The label text is the accessible name of the control whose id matches `for`, unless that control sets `aria-label` or `aria-labelledby`. A click focuses the control either way.
