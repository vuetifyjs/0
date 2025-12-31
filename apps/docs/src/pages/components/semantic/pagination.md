---
title: Pagination - Accessible Page Navigation for Vue 3
meta:
- name: description
  content: Accessible pagination component with responsive auto-sizing, ellipsis support, keyboard navigation, and full ARIA compliance. Compound component pattern for Vue 3.
- name: keywords
  content: pagination, navigation, Vue 3, headless, accessibility, ARIA, responsive, keyboard navigation
features:
  category: Component
  label: 'P: Pagination'
  github: /components/Pagination/
  renderless: false
related:
  - /composables/utilities/use-pagination
---

<script setup>
import BasicExample from '@/examples/components/pagination/basic.vue'
import BasicExampleRaw from '@/examples/components/pagination/basic.vue?raw'
</script>

# Pagination

A headless component for creating page navigation with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The Pagination component provides a compound component pattern for building page navigation interfaces. It uses the [usePagination](/composables/utilities/use-pagination) and [useOverflow](/composables/utilities/use-overflow) composable internally.

<DocsExample file="basic.vue" title="Basic Pagination" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Pagination } from '@vuetify/v0'
</script>

<template>
  <Pagination.Root v-slot="{ items }">
    <Pagination.First />

    <Pagination.Prev />

    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />

      <Pagination.Item v-else :value="item.value" />
    </template>

    <Pagination.Next />

    <Pagination.Last />
  </Pagination.Root>
</template>
```

> For responsive sizing to work accurately, **all pagination buttons must have the same width**. The component measures a sample button and uses that width to calculate how many buttons fit. If buttons have variable widths (e.g., single-digit "1" vs double-digit "50"), the calculation will be inaccurate and items may overflow or leave excess space.

<DocsApi />

## Recipes

Examples of common Pagination structures:

### RouterLink

Use the **as** prop to render pagination items as `RouterLink` components.

```vue RouterLink
<script setup lang="ts">
  import { Pagination } from '@vuetify/v0'
  import { RouterLink } from 'vue-router'
</script>

<template>
  <Pagination.Root :size="200" v-slot="{ items }">
    <Pagination.First :as="RouterLink" to="...">«</Pagination.First>

    <Pagination.Prev :as="RouterLink" to="...">‹</Pagination.Prev>

    <template v-for="(item, index) in items" :key="index">
      <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />

      <Pagination.Item
        v-else
        :as="RouterLink"
        :value="item.value"
        to="..."
      >
        {{ item.value }}
      </Pagination.Item>
    </template>

    <Pagination.Next :as="RouterLink" to="...">›</Pagination.Next>

    <Pagination.Last :as="RouterLink" to="...">»</Pagination.Last>
  </Pagination.Root>
</template>
```

### Unordered list

Pagination example with nav, ul, and li elements.

```vue UnorderedList
<script setup lang="ts">
  import { Pagination } from '@vuetify/v0'
</script>

<template>
  <Pagination.Root :size="200" v-slot="{ items }">
    <ul>
      <li>
        <Pagination.First as="a" href="...">«</Pagination.First>
      </li>

      <li>
        <Pagination.Prev as="a" href="...">‹</Pagination.Prev>
      </li>

      <li v-for="(item, index) in items" :key="index">
        <Pagination.Ellipsis v-if="item.type === 'ellipsis'" />

        <Pagination.Item
          v-else
          as="a"
          :value="item.value"
          href="..."
        >
          {{ item.value }}
        </Pagination.Item>
      </li>

      <li>
        <Pagination.Next as="a" href="...">›</Pagination.Next>
      </li>

      <li>
        <Pagination.Last as="a" href="...">»</Pagination.Last>
      </li>
    </ul>
  </Pagination.Root>
</template>
```

