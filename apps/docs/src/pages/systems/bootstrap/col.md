---
title: BCol - Bootstrap 6 Column for Vue
meta:
- name: description
  content: Bootstrap 6 column markup for Vue. The host is col or col-N, breakpoint widths use md:col-6 rather than col-md-6, and offset-N comes from the columns page.
- name: keywords
  content: bootstrap 6 column, vue column, md:col-6, offset, grid, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BCol'
  level: 2
  renderless: false
  group: layout
related:
  - /systems/bootstrap
  - /systems/bootstrap/container
  - /systems/bootstrap/row
---

# BCol

One column in a row. With no width it shares the row equally. A span, a breakpoint, or an offset pins it.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Columns on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/layout/columns/). Classes only. This component has no behavior.

## Usage

Three columns. The middle one is `sm:col-6`. The preview is narrower than 768px, so `md:col-6` would not change the width there. `sm` is the same colon class, and it applies from 576px.

::: ds-example
/systems/bootstrap/col/basic
:::

### The markup Bootstrap documents

The HTML tab uses the colon utility. `col-md-6` is the Bootstrap 5 name and is not what this renders.

::: code-group no-filename

```html Bootstrap collapse
<div class="col">One of three columns</div>
<div class="col md:col-6">One of three columns</div>
<div class="col">One of three columns</div>
```

```vue Vue collapse
<template>
  <BCol>One of three columns</BCol>

  <BCol :sm="6">One of three columns</BCol>

  <BCol>One of three columns</BCol>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCol } from '@paper/bootstrap'
</script>

<template>
  <BCol />
</template>
```

## Composed on v0

Nothing. v0 has no layout primitive. This component only maps props to column classes.

## Examples

::: ds-example
/systems/bootstrap/col/offset

### Span and offset

The first column's classes are `col-4`, `sm:col-6`, `lg:col-8`, and `offset-2`. `span` replaces `col`. Below 576px the width is `col-4`. From 576px it is `sm:col-6`. `lg:col-8` applies from 1024px. `offset-2` is the offset class from the columns page.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `span` | `number` | — | `col-{span}` instead of `col`. |
| `sm` | `number` | — | `sm:col-{sm}`. |
| `md` | `number` | — | `md:col-{md}`. |
| `lg` | `number` | — | `lg:col-{lg}`. |
| `offset` | `number` | — | `offset-{offset}`. |

## Accessibility

A column is presentational. It does not add a role. Keep the visual order and the DOM order the same.
