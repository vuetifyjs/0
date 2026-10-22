---
title: BProgress - Bootstrap 6 Progress for Vue
meta:
- name: description
  content: Bootstrap 6 progress markup for Vue. One progress bar whose width comes from the current value, with optional stripes and an animated stripe.
- name: keywords
  content: bootstrap 6 progress, vue progress bar, progress-bar-striped, progress-bar-animated, paper bootstrap
features:
  category: Component
  label: 'C: BProgress'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/spinner
  - /systems/bootstrap/placeholder
  - /composables/semantic/create-progress
---

# BProgress

A progress bar with a value, optional stripes, and an animated stripe.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Progress on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/progress/). Classes and visual variants. This page is Vue.

## Usage

`v-model` is the current value. The bar width is that value as a percent of `min` and `max` (0 and 100 unless you change them). `striped` adds `progress-bar-striped`. `animated` adds `progress-bar-animated`. The default slot is the label inside the bar.

::: ds-example
/systems/bootstrap/progress/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview. The Vue tab is the component that renders the same tree. The width is an inline style.

::: code-group no-filename

```html Bootstrap collapse
<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 25%"></div>
</div>
```

```vue Vue collapse
<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BProgress } from '@paper/bootstrap'

  const value = shallowRef(25)
</script>

<template>
  <BProgress v-model="value" label="Basic example" />
</template>
```

:::

Stacked bars (`progress-stacked`) are a separate preview pattern and are not part of this component.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BProgress } from '@paper/bootstrap'
</script>

<template>
  <BProgress />
</template>
```

## Composed on v0

The width percent comes from [createProgress](/composables/semantic/create-progress). `min` and `max` are that composable's extent, read when the bar is created. The model is registered as the one segment, and `fromValue` turns the current value into the percent. `aria-valuenow` is the model, not that percent.

This does not wrap [Progress](/components/semantic/progress). That tree is a track and a fill. The pin is `div.progress` around one `div.progress-bar`.

`striped` adds `progress-bar-striped`. `animated` adds `progress-bar-animated`, which moves that stripe. Without `striped`, the animation has no stripe to move. The height is the pin's `1rem`. A `theme-*` class on `BProgress` sets the bar color. `progress-stacked` is a separate preview pattern and is not this component.

## Examples

::: ds-example
/systems/bootstrap/progress/value

### Changing the value

Decrease and Increase step the model by 10, and they stop at 0 and 100. The label in the bar is the slot. The width is the percent of that model. Enter and Space activate the buttons.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number` | `0` | Current value. |
| `min` | `number` | `0` | Lowest value. Read when the bar is created. |
| `max` | `number` | `100` | Highest value. Read when the bar is created. |
| `label` | `string` | — | `aria-label` on the progress bar. |
| `striped` | `boolean` | `false` | Adds `progress-bar-striped`. |
| `animated` | `boolean` | `false` | Adds `progress-bar-animated`. Pair it with `striped`. |

## Accessibility

The root is `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. The name is `label`. Without it, the bar has no accessible name. The slot text is inside the bar. It is not a separate name. The bar is not a control. Decrease and Increase are buttons. Enter and Space activate them. Reduced motion drops the width transition and the stripe animation. There is no `data-bs-toggle`.
