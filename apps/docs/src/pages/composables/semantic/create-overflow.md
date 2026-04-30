---
title: createOverflow - Responsive Container Capacity for Vue 3
meta:
- name: description
  content: Compute how many items fit in a container based on available width. Enables responsive truncation for pagination, breadcrumbs, and overflow menus.
- name: keywords
  content: createOverflow, overflow, responsive, truncation, capacity, ResizeObserver, composable, Vue 3
features:
  category: Composable
  label: 'E: createOverflow'
  github: /composables/createOverflow/
  level: 2
related:
  - /components/semantic/overflow
  - /components/semantic/breadcrumbs
  - /components/semantic/pagination
  - /composables/data/create-virtual
---

# createOverflow

A composable for computing how many items fit in a container based on available width, enabling responsive truncation for pagination, breadcrumbs, and similar components.

<DocsPageFeatures :frontmatter />

## Usage

The `createOverflow` composable provides reactive container width tracking and capacity calculation. It supports two modes: variable-width (for items with different widths like breadcrumbs) and uniform-width (for same-width items like pagination buttons).

```vue collapse
<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { createOverflow } from '@vuetify/v0'

  const containerRef = useTemplateRef('container')

  // Pass container as a ref or getter for proper reactive tracking
  const overflow = createOverflow({
    container: containerRef,
    gap: 8,
    reserved: 40,
  })

  // Check capacity
  console.log(overflow.capacity.value) // Number of items that fit
  console.log(overflow.isOverflowing.value) // true if items exceed container
</script>

<template>
  <div ref="container">
    <!-- Items go here -->
  </div>
</template>
```

## Context / DI

Use `createOverflowContext` to share an overflow instance across a component tree:

```ts
import { createOverflowContext } from '@vuetify/v0'

export const [useNavOverflow, provideNavOverflow, navOverflow] =
  createOverflowContext({ namespace: 'my:nav-overflow' })

// In parent component
provideNavOverflow()

// In child component
const overflow = useNavOverflow()
overflow.capacity.value  // number of items that fit
```

Use `useOverflow` to inject the default (unnamespaced) overflow context provided by a parent:

```ts
import { useOverflow } from '@vuetify/v0'

const overflow = useOverflow()  // Injects the nearest provided overflow context
```

## Architecture

`createOverflow` uses ResizeObserver to compute container capacity:

```mermaid "Overflow Detection Flow"
flowchart LR
  ResizeObserver --> containerWidth
  containerWidth --> capacity
  itemWidths --> capacity
  capacity --> isOverflowing
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `container` | <AppSuccessIcon /> | ShallowRef, assign element for tracking |
| `width` | <AppSuccessIcon /> | ShallowRef, readonly (from ResizeObserver) |
| `capacity` | <AppSuccessIcon /> | Computed from width and measurements |
| `total` | <AppSuccessIcon /> | Computed, sum of all item widths |
| `isOverflowing` | <AppSuccessIcon /> | Computed from total vs available width |
| `gap` | <AppSuccessIcon /> | Accepts MaybeRefOrGetter |
| `reserved` | <AppSuccessIcon /> | Accepts MaybeRefOrGetter |
| `itemWidth` | <AppSuccessIcon /> | Accepts MaybeRefOrGetter (uniform mode) |

## Examples

::: example
/composables/create-overflow/tag-overflow

### Tag Overflow

A tag list that hides tags when they overflow the container, showing a count badge for hidden items, driven by the reactive `capacity` value.

:::

<DocsApi />
