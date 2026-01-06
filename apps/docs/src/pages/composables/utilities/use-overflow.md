---
title: useOverflow - Responsive Container Capacity for Vue 3
meta:
- name: description
  content: Compute how many items fit in a container based on available width. Enables responsive truncation for pagination, breadcrumbs, and overflow menus.
- name: keywords
  content: useOverflow, overflow, responsive, truncation, capacity, ResizeObserver, composable, Vue 3
features:
  category: Composable
  label: 'U: useOverflow'
  github: /composables/useOverflow/
related:
  - /composables/utilities/use-virtual
---

# useOverflow

A composable for computing how many items fit in a container based on available width, enabling responsive truncation for pagination, breadcrumbs, and similar components.

<DocsPageFeatures :frontmatter />

## Usage

The `useOverflow` composable provides reactive container width tracking and capacity calculation. It supports two modes: variable-width (for items with different widths like breadcrumbs) and uniform-width (for same-width items like pagination buttons).

```ts
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
```

## Architecture

`useOverflow` uses ResizeObserver to compute container capacity:

```mermaid
flowchart LR
  ResizeObserver --> containerWidth
  containerWidth --> capacity
  itemWidths --> capacity
  capacity --> isOverflowing
```

<DocsApi />
