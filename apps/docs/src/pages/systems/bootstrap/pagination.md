---
title: BPagination - Bootstrap 6 Pagination for Vue
meta:
- name: description
  content: Bootstrap 6 pagination markup for Vue. A 1-based page model, page links inside list items, and sm or lg sizes when you ask for them.
- name: keywords
  content: bootstrap 6 pagination, vue pagination, page-item, page-link, pagination-sm, paper bootstrap
features:
  category: Component
  label: 'C: BPagination'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/breadcrumb
  - /systems/bootstrap/list-group
  - /components/semantic/pagination
---

# BPagination

A pagination list. The page model is 1-based.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/pagination/"
  title="Pagination"
/>

## Usage

`v-model` is the current page, starting at 1. It is the same number v0 Pagination uses, not a converted index. `total` is the item count and `perPage` defaults to 1, so `total` is the page count. `size` is only `sm` or `lg`. Active and disabled classes sit on `li.page-item`. A class on `BPagination` is added to the `ul`.

::: ds-example
/systems/bootstrap/pagination/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview. The Vue tab is the component that renders the same tree. A disabled control drops `href`.

::: code-group no-filename

```html Bootstrap collapse
<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item disabled"><a class="page-link">Previous</a></li>
    <li class="page-item active"><a class="page-link" href="#" aria-current="page">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
```

```vue Vue collapse
<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BPagination } from '@paper/bootstrap'

  const page = shallowRef(1)
</script>

<template>
  <BPagination v-model="page" :total="3" label="Page navigation example">
    <BPagination.Prev>Previous</BPagination.Prev>
    <BPagination.Item :value="1">1</BPagination.Item>
    <BPagination.Item :value="2">2</BPagination.Item>
    <BPagination.Item :value="3">3</BPagination.Item>
    <BPagination.Next>Next</BPagination.Next>
  </BPagination>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BPagination } from '@paper/bootstrap'
</script>

<template>
  <BPagination>
    <BPagination.Prev />

    <BPagination.Item />

    <BPagination.Next />
  </BPagination>
</template>
```

## Composed on v0

The page is [Pagination](/components/semantic/pagination), renderless, so the document shows `nav` > `ul.pagination` > `li.page-item` > `a.page-link`. [createPagination](/composables/data/create-pagination) holds the 1-based page. `total` is that composable's item count. An item calls `select`. Previous and next call `prev` and `next`, which stop on the first and last page.

## Examples

::: ds-example
/systems/bootstrap/pagination/sizes

### Sizes and alignment

`size="sm"` adds `pagination-sm`. `size="lg"` adds `pagination-lg`. Leave `size` off for the default control. The words in each link are the slot.

A class on `BPagination` lands on `ul.pagination`. `justify-content-center` centers that list. It is not a prop.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number` | `1` | Current page, starting at 1. |
| `total` | `number` | `1` | Item count. With `perPage` at 1, this is the page count. |
| `perPage` | `number` | `1` | Items per page. |
| `size` | `'sm' \| 'lg'` | — | `pagination-sm` or `pagination-lg`. |
| `label` | `string` | `Page navigation` | `aria-label` on the nav. `Pagination.label` replaces the default. |
| `value` (item) | `number` | — | Page this link selects. |
| `disabled` | `boolean` | `false` | `.disabled` on the `li`. The link drops `href`. Prev and next also disable on the ends. |
| `href` | `string` | `'#'` | Link target. The click does not follow it. |

## Accessibility

The nav is named `Page navigation` unless `label` or `Pagination.label` replaces it. The current link sets `aria-current="page"`. A disabled control drops `href`, and its `li` has `.disabled`. The pin sets `pointer-events: none` on that link, and without `href` it is not in the tab order. Enter activates a link. The click changes the page and does not follow `href`. There is no `data-bs-toggle`.
