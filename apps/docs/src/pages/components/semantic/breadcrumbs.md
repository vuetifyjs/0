---
title: Breadcrumbs - Responsive Navigation Trail for Vue 3
meta:
- name: description
  content: Responsive breadcrumb navigation with automatic overflow detection, ellipsis collapse, custom dividers, and WAI-ARIA compliance. Compound component pattern for Vue 3.
- name: keywords
  content: breadcrumbs, navigation, Vue 3, headless, accessibility, ARIA, overflow, responsive, compound component
features:
  category: Component
  label: 'C: Breadcrumbs'
  github: /components/Breadcrumbs/
  renderless: false
  level: 2
related:
  - /composables/utilities/create-breadcrumbs
  - /components/semantic/pagination
---

# Breadcrumbs

A headless component for creating responsive breadcrumb navigation with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The Breadcrumbs component provides a compound component pattern for building navigation trails. It uses the [createBreadcrumbs](/composables/utilities/create-breadcrumbs) and [createOverflow](/composables/utilities/create-overflow) composable internally.

::: example
/components/breadcrumbs/basic
:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Ellipsis />

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/about">About</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item>
        <Breadcrumbs.Page>Current</Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
```

<DocsApi />

## Features

::: example
/components/breadcrumbs/overflow

### Overflow Detection

The Root component uses [createOverflow](/composables/utilities/create-overflow) to measure item widths and determine how many fit. When items overflow, items from the beginning are hidden and the Ellipsis indicator appears.

:::

::: example
/components/breadcrumbs/custom-divider

### Custom Dividers

The default divider is `/`, set on the Root. Use the Divider slot for rich content like icons.

:::

### Links and Current Page

Use `Breadcrumbs.Link` for navigable items and `Breadcrumbs.Page` for the current (last) item. Page automatically applies `aria-current="page"`.

```vue
<template>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
  </Breadcrumbs.Item>

  <!-- Last item uses Page instead of Link -->
  <Breadcrumbs.Item>
    <Breadcrumbs.Page>Current</Breadcrumbs.Page>
  </Breadcrumbs.Item>
</template>
```

### With Vue Router

Use the `as` prop to render `Breadcrumbs.Link` as a `RouterLink`:

```vue
<template>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link :as="RouterLink" to="/products">
      Products
    </Breadcrumbs.Link>
  </Breadcrumbs.Item>
</template>
```

### Slot Props

The Root exposes navigation state and methods through its default slot:

```vue
<template>
  <Breadcrumbs.Root v-slot="{ isOverflowing, depth, isRoot, first, prev, select }">
    <!-- Use navigation methods and overflow state -->
  </Breadcrumbs.Root>
</template>
```

### Custom Ellipsis

Override the ellipsis globally on Root or per-instance:

```vue
<template>
  <Breadcrumbs.Root ellipsis="[more]">
    <!-- Ellipsis shows "[more]" instead of default -->
  </Breadcrumbs.Root>
</template>
```
