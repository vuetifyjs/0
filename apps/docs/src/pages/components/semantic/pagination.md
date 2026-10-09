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
  - /composables/semantic/create-overflow
---

# Pagination

A headless component for creating page navigation with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The Pagination component provides a compound component pattern for building page navigation interfaces. It adjusts how many page buttons it shows to fit the available width, collapsing the overflow behind ellipses.

The two core props are `size` (total item count) and `items-per-page` (items per page, default `10`). Together they determine the page count:

```vue
<template>
  <!-- 200 items at 10 per page = 20 pages -->
  <Pagination.Root :size="200" :items-per-page="10" v-model="page" />

  <!-- 200 items at 25 per page = 8 pages -->
  <Pagination.Root :size="200" :items-per-page="25" v-model="page" />
</template>
```

::: gn-example
/components/pagination/basic
:::

## Anatomy

```vue Anatomy no-filename
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

- Wraps controls in a `<nav>` element whose `aria-label` defaults to `"Pagination"` (localizable via the `Pagination.label` key) for landmark navigation
- Current page button is marked with `aria-current="page"` so screen readers announce it as the active page
- Enter and Space select the focused page. Arrow keys do not move between page buttons
- Page changes are announced only if you render `Pagination.Status`, which carries `aria-live="polite"`

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

## FAQ

::: faq

??? How is the page count determined?

From `size` (total item count) divided by `items-per-page` (default `10`) — for example, 200 items at 25 per page yields 8 pages.

??? Why is my responsive pagination overflowing or miscounting buttons?

Responsive sizing measures one sample button's width, so variable-width buttons (single-digit "1" vs double-digit "50") throw off the fit calculation. Give every page button the same width.

??? How do I keep the ARIA attributes when rendering custom controls?

Root `attrs` carry the landmark label (and `role="navigation"` when the host is not a `<nav>`). `aria-current` is on `Pagination.Item`. `aria-live` is on `Pagination.Status`.

??? How do I navigate pages with the keyboard?

Enter or Space selects the focused page. There is no arrow-key roving. `aria-live` comes from `Pagination.Status`.

??? How do I localize the pagination label?

The `<nav>` landmark's `aria-label` defaults to `"Pagination"` and is localizable via the `Pagination.label` key.

:::

<DocsApi />
