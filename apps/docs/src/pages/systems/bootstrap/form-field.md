---
title: BFormField - Bootstrap 6 form field for Vue
meta:
- name: description
  content: Bootstrap 6 form-field for Vue. A wrapper for a label, control, help text, and feedback, with an optional floating label that can stay raised. Use your own CSS.
- name: keywords
  content: bootstrap 6 form field, vue form, floating label, form-floating, form-field, paper bootstrap
features:
  category: Component
  label: 'C: BFormField'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-control
  - /systems/bootstrap/form-label
  - /systems/bootstrap/form-text
  - /systems/bootstrap/form-feedback
---

# BFormField

A `.form-field` around the label, the control, the help text, and the feedback. It does not create those pieces for you.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/floating-labels/"
  title="Floating labels"
/>

## Usage

Put [BFormLabel](/systems/bootstrap/form-label), [BFormControl](/systems/bootstrap/form-control), [BFormText](/systems/bootstrap/form-text), and [BFormFeedback](/systems/bootstrap/form-feedback) in the slot. `floating` adds `.form-floating`. `always` adds `.form-floating-always`, and only when `floating` is also set. The pinned floating examples put the label first.

::: ds-example
/systems/bootstrap/form-field/basic
:::

### The markup Bootstrap documents

The HTML tab is a field from the v6 docs. The Vue tab is the same tree, with invalid state so the feedback is visible. The form element around a real field is yours: `<form data-bs-validate>`. This package does not ship a form component, and it does not emit `data-bs-toggle`.

::: code-group no-filename

```html Bootstrap collapse
<div class="form-field">
  <label for="fieldText" class="form-label">Email address</label>
  <input type="email" class="form-control" id="fieldText" placeholder="name@example.com">
  <div class="form-text">
    We’ll never share your email with anyone else.
  </div>
</div>
```

```vue Vue collapse
<template>
  <BFormField>
    <BFormLabel for="fieldText">Email address</BFormLabel>
    <BFormControl id="fieldText" v-model="email" aria-describedby="fieldTextHelp fieldTextFeedback" invalid type="email" placeholder="name@example.com" />
    <BFormText id="fieldTextHelp">We’ll never share your email with anyone else.</BFormText>
    <BFormFeedback id="fieldTextFeedback">Email is required</BFormFeedback>
  </BFormField>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFormControl, BFormFeedback, BFormField, BFormLabel, BFormText } from '@paper/bootstrap'
</script>

<template>
  <BFormField>
    <BFormLabel />

    <BFormControl />

    <BFormText />

    <BFormFeedback />
  </BFormField>
</template>
```

## Composed on v0

The field is markup. Value and dirty state live on [BFormControl](/systems/bootstrap/form-control), which uses [createInput](/composables/forms/create-input). The field does not inject a context and does not register the children.

The pin also shows a bare `.form-floating`, sometimes on a `<form>`, with a label that has no `.form-label`. This component always keeps `.form-field`. [BFormLabel](/systems/bootstrap/form-label) always renders `.form-label`.

Put the label before the control. The floating rule is `label:has(~ .form-control)`, so a label after the control never rises. Put [BFormFeedback](/systems/bootstrap/form-feedback) after the control. The pin shows it with `.is-invalid ~ .invalid-feedback`. A placeholder on the control is what keeps the label down while the value is empty. Without one, `:not(:placeholder-shown)` matches immediately and the label stays raised. `always` adds that raised state even while the placeholder is showing.

## Examples

::: ds-example
/systems/bootstrap/form-field/floating

### Floating label

`floating` adds `form-floating` next to `form-field`. The first field rests with the label over the control. Focus, or a value, raises it. The second field sets `always`, so `form-floating-always` keeps the label raised and the placeholder visible. Both need the label first and a placeholder.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `floating` | `boolean` | `false` | Adds `.form-floating`. |
| `always` | `boolean` | `false` | With `floating`, adds `.form-floating-always`. Ignored otherwise. |

## Accessibility

The wrapper is a `div`. It has no role. Name the control with [BFormLabel](/systems/bootstrap/form-label) and `for`. Help text and feedback are the siblings the pinned markup uses. Point the control at them with `aria-describedby` when you need that link.
