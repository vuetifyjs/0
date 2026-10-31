---
title: BRow - Bootstrap 6 Row for Vue
meta:
- name: description
  content: Bootstrap 6 row markup for Vue. The host is a div.row, and cols adds row-cols-N only for an integer from 1 to 6. Gutter classes are left on the caller.
- name: keywords
  content: bootstrap 6 row, vue row, row-cols, grid, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BRow'
  level: 2
  renderless: false
  group: layout
related:
  - /systems/bootstrap
  - /systems/bootstrap/container
  - /systems/bootstrap/col
---

# BRow

The flex row inside a container. Columns sit in the default slot. An optional count splits the row into equal tracks.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/layout/grid/"
  title="Grid"
/>

## Usage

Three columns in one row. The middle one is `sm:col-6`. The preview is narrower than 768px, so `md:col-6` would not change the width there.

::: ds-example
/systems/bootstrap/row/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<div class="row">
  <div class="col">One of three columns</div>
  <div class="col md:col-6">One of three columns</div>
  <div class="col">One of three columns</div>
</div>
```

```vue Vue collapse
<template>
  <BRow>
    <BCol>One of three columns</BCol>

    <BCol :sm="6">One of three columns</BCol>

    <BCol>One of three columns</BCol>
  </BRow>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCol, BRow } from '@paper/bootstrap'
</script>

<template>
  <BRow>
    <BCol />
  </BRow>
</template>
```

## Composed on v0

Nothing. v0 has no layout primitive. This component only maps `cols` to `row-cols-N`.

## Examples

::: ds-example
/systems/bootstrap/row/cols

### Equal columns

`cols` adds `row-cols-{n}` for an integer from 1 to 6. `2` is two equal tracks, and the columns wrap onto the next line. Any other number leaves the class at `row`. Gutters are not a prop — add Bootstrap's gutter class yourself.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `number` | — | `row-cols-{n}` when `n` is an integer from 1 to 6. |

## Accessibility

A row is presentational. It does not add a role. Reading order is the order of the columns in the slot.
