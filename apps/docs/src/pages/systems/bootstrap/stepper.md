---
title: BStepper - Bootstrap 6 Stepper for Vue
meta:
- name: description
  content: Bootstrap 6 stepper markup for Vue. An ordered list where active means every reached step, a click selects the current step, and overflow wraps a long list.
- name: keywords
  content: bootstrap 6 stepper, vue stepper, steps, stepper-overflow, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BStepper'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/carousel
  - /components/providers/step
---

# BStepper

An ordered list of steps. Every step up through the current one is active. Click a step to make it the current one.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Stepper on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/stepper/). Classes and visual variants. This page is Vue.

## Usage

`v-model` is the current index. `1` marks the first two items active, which is the first example on the Bootstrap page.

::: ds-example
/systems/bootstrap/stepper/basic
:::

### The markup Bootstrap documents

The HTML tab is that first example. Active is not only the current step. The Vue tab is the same list.

::: code-group no-filename

```html Bootstrap collapse
<ol class="stepper">
  <li class="stepper-item active">Create account</li>
  <li class="stepper-item active">Confirm email</li>
  <li class="stepper-item">Update profile</li>
  <li class="stepper-item">Finish</li>
</ol>
```

```vue Vue collapse
<template>
  <BStepper v-model="step">
    <BStepperItem>Create account</BStepperItem>

    <BStepperItem>Confirm email</BStepperItem>

    <BStepperItem>Update profile</BStepperItem>

    <BStepperItem>Finish</BStepperItem>
  </BStepper>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BStepper, BStepperItem } from '@paper/bootstrap'
</script>

<template>
  <BStepper>
    <BStepperItem />
  </BStepper>
</template>
```

## Composed on v0

The current step comes from [Step](/components/providers/step). Step renders no element, so the ordered list and each item are the Bootstrap tags. Reached steps follow the model index, because a step item only reports whether it is the selected one. `aria-current="step"` is that selected index. `.active` is every step up through it.

## Examples

::: ds-example
/systems/bootstrap/stepper/overflow

### Overflow

`overflow` wraps the list in `stepper-overflow`. On the pinned page that class is the wrapper, not a class on the list. The list itself stays `stepper`.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number` | `0` | Index of the current step. Every item at or before it gets `.active`. |
| `overflow` | `boolean` | `false` | Wraps the list in `div.stepper-overflow`. |

## Accessibility

The host is an ordered list. Each item is `role="button"` and is in the tab order. A click, Enter, or Space selects it. `aria-current="step"` is the current index. `.active` is every reached step, so earlier steps stay active. This is not a tablist. There is no `data-bs-toggle`.
