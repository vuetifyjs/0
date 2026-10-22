---
title: BButtonGroup - Bootstrap 6 button group for Vue
meta:
- name: description
  content: Bootstrap 6 button group for Vue. A div.btn-group with role group. Vertical replaces that class. Styled by your CSS.
- name: keywords
  content: bootstrap 6 button group, vue button group, btn-group, btn-group-vertical, paper bootstrap
features:
  category: Component
  label: 'C: BButtonGroup'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/button
---

# BButtonGroup

A row of buttons that read as one control. The slot is the buttons.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Button group on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/button-group/). Classes and visual variants. This page is the markup.

## Usage

The host is `div.btn-group`. `vertical` replaces that class with `btn-group-vertical`. It does not add both. `divider` adds `btn-group-divider`.

::: ds-example
/systems/bootstrap/button-group/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn-solid theme-primary">Left</button>
  <button type="button" class="btn-solid theme-primary">Middle</button>
  <button type="button" class="btn-solid theme-primary">Right</button>
</div>
```

```vue Vue collapse
<template>
  <BButtonGroup label="Basic example">
    <BButton theme="primary" variant="solid">Left</BButton>
    <BButton theme="primary" variant="solid">Middle</BButton>
    <BButton theme="primary" variant="solid">Right</BButton>
  </BButtonGroup>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BButton, BButtonGroup } from '@paper/bootstrap'
</script>

<template>
  <BButtonGroup>
    <BButton>Left</BButton>
  </BButtonGroup>
</template>
```

## Composed on v0

The group is a div. Each button is a [BButton](/systems/bootstrap/button). There is no selection model. Checks or radios in the slot stay independent controls.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | | Sets `aria-label` when it is not empty. |
| `vertical` | `boolean` | `false` | `btn-group-vertical` instead of `btn-group`. |
| `divider` | `boolean` | `false` | Adds `.btn-group-divider`. |

## Accessibility

The host is `role="group"`. Pass `label` so the group has a name. The buttons keep their own names.
