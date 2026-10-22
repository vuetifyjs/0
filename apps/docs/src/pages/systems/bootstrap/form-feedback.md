---
title: BFormFeedback - Bootstrap 6 validation feedback for Vue
meta:
- name: description
  content: Bootstrap 6 validation feedback for Vue. Invalid feedback by default, or valid feedback when valid is set. Shown once the control carries matching state class.
- name: keywords
  content: bootstrap 6 validation, vue feedback, invalid-feedback, valid-feedback, is-invalid, paper bootstrap
features:
  category: Component
  label: 'C: BFormFeedback'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-control
  - /systems/bootstrap/form-field
  - /systems/bootstrap/form-text
---

# BFormFeedback

A `.invalid-feedback` message, or `.valid-feedback` when `valid` is set.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Validation on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/validation/). Classes and visual variants. This page is Vue.

## Usage

Place it after the control. Bootstrap shows `.invalid-feedback` when a previous sibling has `.is-invalid`, and `.valid-feedback` for `.is-valid`. Set `invalid` or `valid` on [BFormControl](/systems/bootstrap/form-control). The `<form data-bs-validate>` element is yours. This package does not emit `data-bs-toggle`.

::: ds-example
/systems/bootstrap/form-feedback/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<div id="validationCustom01Feedback" class="invalid-feedback">Full name is required</div>
```

```vue Vue collapse
<template>
  <BFormFeedback id="validationCustom01Feedback">Full name is required</BFormFeedback>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFormFeedback } from '@paper/bootstrap'
</script>

<template>
  <BFormFeedback />
</template>
```

## Composed on v0

Feedback is markup. It does not read [createInput](/composables/forms/create-input) errors. [BFormControl](/systems/bootstrap/form-control) turns `invalid` and `valid` into the state classes this stylesheet keys off. Give the feedback an id and add it to the control's `aria-describedby`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `valid` | `boolean` | `false` | Renders `.valid-feedback` instead of `.invalid-feedback`. |

## Accessibility

The message is hidden until the matching state class is present, which also hides it from some assistive tech. `aria-describedby` on the control is the link that still works when you want the message announced. `aria-invalid` comes from the control, not from this div.
