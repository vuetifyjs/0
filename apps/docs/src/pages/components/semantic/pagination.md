---
title: Pagination - Accessible Page Navigation for Vue 3
meta:
- name: description
  content: Accessible pagination component with responsive auto-sizing, ellipsis support, keyboard navigation, and full ARIA compliance. Compound component pattern for Vue 3.
- name: keywords
  content: pagination, navigation, Vue 3, headless, accessibility, ARIA, responsive, keyboard navigation
features:
  category: Component
  label: 'C: Pagination'
  github: /components/Pagination/
  renderless: false
  level: 2
related:
  - /composables/data/create-pagination
  - /composables/utilities/create-overflow
---

# Pagination

A headless component for creating page navigation with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The Pagination component provides a compound component pattern for building page navigation interfaces. It uses the `createPagination` and `createOverflow` composable internally.

::: example
/components/pagination/basic

### Pagination Controls

First, prev, next, and last buttons with ellipsis support across 200 items.

:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Pagination } from '@vuetify/v0'
</script>

<template>
  <Pagination.Root>
    <Pagination.Status />

    <Pagination.First />

    <Pagination.Prev />

    <Pagination.Ellipsis />

    <Pagination.Item />

    <Pagination.Next />

    <Pagination.Last />
  </Pagination.Root>
</template>
```

> [!WARNING]
> For responsive sizing to work accurately, **all pagination buttons must have the same width**. The component measures a sample button and uses that width to calculate how many buttons fit. If buttons have variable widths (e.g., single-digit "1" vs double-digit "50"), the calculation will be inaccurate and items may overflow or leave excess space.

## Accessibility

The Pagination component renders semantic HTML and manages ARIA attributes automatically:

- Wraps controls in a `<nav>` element with `aria-label="pagination"` for landmark navigation
- Current page button is marked with `aria-current="page"` so screen readers announce it as the active page
- Arrow keys navigate between page buttons; Enter and Space select the focused page
- Page changes are announced to screen readers via `aria-live` region updates

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to preserve all ARIA attributes:

```vue
<template>
  <Pagination.Root v-slot="{ attrs }" renderless>
    <nav v-bind="attrs">
      <!-- Custom pagination controls -->
    </nav>
  </Pagination.Root>
</template>
```

<DocsApi />
