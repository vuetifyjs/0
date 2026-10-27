---
title: BFormText - Bootstrap 6 form help text for Vue
meta:
- name: description
  content: Bootstrap 6 form-text for Vue. Help text that sits under a control. Associate it with aria-describedby when a screen reader should read it aloud. Styled by CSS.
- name: keywords
  content: bootstrap 6 form text, vue help text, form-text, aria-describedby, paper bootstrap
features:
  category: Component
  label: 'C: BFormText'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-field
  - /systems/bootstrap/form-control
  - /systems/bootstrap/form-feedback
---

# BFormText

A `<div class="form-text">` for the hint under a control.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/form-control/"
  title="Form control"
/>

## Usage

Put it in [BFormField](/systems/bootstrap/form-field), after the control. Give it an id and set that id on the control's `aria-describedby` when the hint should be announced.

::: ds-example
/systems/bootstrap/form-text/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<div class="form-text">
  We’ll never share your email with anyone else.
</div>
```

```vue Vue collapse
<template>
  <BFormText>We’ll never share your email with anyone else.</BFormText>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFormText } from '@paper/bootstrap'
</script>

<template>
  <BFormText />
</template>
```

## Composed on v0

Help text is markup. It does not use a composable. [BFormControl](/systems/bootstrap/form-control) does not discover this node. Pass the id through `aria-describedby` on the control.

## Props

None. Attributes fall through to the div. The default slot is the hint.

## Accessibility

`.form-text` is not a live region. If the hint names or describes the control, give this div an id and add it to the control's `aria-describedby`.
