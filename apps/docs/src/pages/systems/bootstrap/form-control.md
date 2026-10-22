---
title: BFormControl - Bootstrap 6 form control for Vue
meta:
- name: description
  content: Bootstrap 6 form-control markup for Vue. Input, textarea, and select share one component, with sizes, plaintext, and valid or invalid state. Styled by your CSS.
- name: keywords
  content: bootstrap 6 form control, vue input, textarea, select, form-control, validation, paper bootstrap
features:
  category: Component
  label: 'C: BFormControl'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-field
  - /systems/bootstrap/form-label
  - /systems/bootstrap/form-feedback
  - /composables/forms/create-input
---

# BFormControl

An input, a textarea, or a select. All three use `.form-control`. `v-model` is the string value.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Form control on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/form-control/). Classes and visual variants. This page is Vue.

## Usage

`as` picks the element. It defaults to `input`. A select stays `.form-control`. It does not pick up `.form-select`. There is no form component. Write `<form data-bs-validate>` yourself. That attribute is the bundle's validation hook. This package does not emit it.

::: ds-example
/systems/bootstrap/form-control/basic
:::

### The markup Bootstrap documents

The HTML tab is the email field from the v6 docs. The Vue tab is the label and the control that render it. `data-bs-toggle` is not part of this package.

::: code-group no-filename

```html Bootstrap collapse
<label for="exampleFormControlInput" class="form-label mb-2">Email address</label>
<input type="email" class="form-control" id="exampleFormControlInput" placeholder="name@example.com">
```

```vue Vue collapse
<template>
  <BFormLabel class="mb-2" for="exampleFormControlInput">Email address</BFormLabel>
  <BFormControl id="exampleFormControlInput" v-model="email" type="email" placeholder="name@example.com" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFormControl } from '@paper/bootstrap'
</script>

<template>
  <BFormControl />
</template>
```

## Composed on v0

The string value, and whether it is dirty, focused, or touched, comes from [createInput](/composables/forms/create-input). That composable does not bind DOM events. This component renders the native element, writes the model from the `input` event, and updates focus on `focus` and `blur`.

`invalid` and `valid` are the pin's `.is-invalid` and `.is-valid` classes. They are not the result of `createInput` rules. Pair them with [BFormFeedback](/systems/bootstrap/form-feedback).

An empty model does not set the `value` attribute. The pinned markup omits it. The DOM property is still cleared when the model becomes empty.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | The control value. |
| `as` | `'input' \| 'textarea' \| 'select'` | `'input'` | Host element. Select stays `.form-control`. |
| `type` | `string` | — | Native input type. Omitted on textarea and select. |
| `size` | `'sm' \| 'lg' \| number` | — | `sm` / `lg` add `.form-control-sm` / `.form-control-lg`. A number is the native select `size`. |
| `id` | `string` | generated | Control id. Passed through to the label's `for`. |
| `invalid` | `boolean` | `false` | Adds `.is-invalid` and `aria-invalid`. |
| `valid` | `boolean` | `false` | Adds `.is-valid`. |
| `plaintext` | `boolean` | `false` | With `readonly`, adds `.form-control-plaintext`. |
| `readonly` | `boolean` | `false` | Native readonly. |
| `disabled` | `boolean` | `false` | Native disabled. |

The default slot is the option list when `as` is `select`. Other attributes (`placeholder`, `required`, `rows`, `name`) fall through to the element.

## Accessibility

The host is a native input, textarea, or select, so the keyboard behavior is the browser's. Set `id` and point [BFormLabel](/systems/bootstrap/form-label) at it with `for`. `invalid` sets `aria-invalid`. Put the feedback id on `aria-describedby` yourself. This component does not emit `data-bs-toggle`.
