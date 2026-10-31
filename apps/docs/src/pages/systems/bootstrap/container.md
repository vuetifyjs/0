---
title: BContainer - Bootstrap 6 Container for Vue
meta:
- name: description
  content: Bootstrap 6 container markup for Vue. Choose container, container-fluid, or a breakpoint colon utility such as md:container — never the container-md form.
- name: keywords
  content: bootstrap 6 container, vue container, container-fluid, md:container, grid, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BContainer'
  level: 2
  renderless: false
  group: layout
related:
  - /systems/bootstrap
  - /systems/bootstrap/row
  - /systems/bootstrap/col
---

# BContainer

The width wrapper around a row. It is a container, a fluid container, or a container that stays full-bleed until a breakpoint.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/layout/containers/"
  title="Containers"
/>

## Usage

A container, a row, and three columns. The middle one is `sm:col-6`. The preview is narrower than 768px, so `md:col-6` would not change the width there. The container caps at 540px from 576px.

::: ds-example
/systems/bootstrap/container/basic
:::

### The markup Bootstrap documents

The HTML tab is the default container. The Vue tab is the same tree. Breakpoint containers use the colon class, not `container-md`.

::: code-group no-filename

```html Bootstrap collapse
<div class="container">
  <div class="row">
    <div class="col">One of three columns</div>
    <div class="col md:col-6">One of three columns</div>
    <div class="col">One of three columns</div>
  </div>
</div>
```

```vue Vue collapse
<template>
  <BContainer>
    <BRow>
      <BCol>One of three columns</BCol>

      <BCol :sm="6">One of three columns</BCol>

      <BCol>One of three columns</BCol>
    </BRow>
  </BContainer>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCol, BContainer, BRow } from '@paper/bootstrap'
</script>

<template>
  <BContainer>
    <BRow>
      <BCol />
    </BRow>
  </BContainer>
</template>
```

## Composed on v0

Nothing. v0 has no layout primitive. This component only maps props to Bootstrap's container classes.

## Examples

::: ds-example
/systems/bootstrap/container/fluid

### Fluid

`fluid` replaces `container` with `container-fluid`. It wins when `breakpoint` is also set.
:::

::: ds-example
/systems/bootstrap/container/breakpoint

### Breakpoint

`breakpoint="md"` renders `md:container`. That class stays full width until 768px, so this preview does not cap it. The default container on this page caps at 540px from 576px. The prop also accepts `sm`, `lg`, `xl`, and `2xl`. It does not render `container-md`.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fluid` | `boolean` | `false` | `container-fluid` instead of `container`. |
| `breakpoint` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | — | `{breakpoint}:container`. Ignored when `fluid` is set. |

## Accessibility

A container is not a landmark. Put a heading in the page if the region needs a name. The component adds no role of its own.
