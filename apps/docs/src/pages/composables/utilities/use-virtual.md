---
title: useVirtual - High-Performance Virtual Scrolling
meta:
- name: description
  content: Efficiently render large lists with virtual scrolling. Only renders visible items, supports dynamic heights, bidirectional scrolling, and infinite scroll for Vue 3.
- name: keywords
  content: virtual scroll, virtualization, large lists, performance, Vue 3, composable, infinite scroll
features:
  category: Composable
  label: 'C: useVirtual'
  github: /composables/useVirtual/
related:
  - /composables/utilities/use-filter
  - /composables/utilities/use-overflow
---

<script setup>
import VirtualListExample from '@/examples/composables/use-virtual/basic.vue'
import VirtualListExampleRaw from '@/examples/composables/use-virtual/basic.vue?raw'
</script>

# useVirtual

Virtual scrolling composable for efficiently rendering large lists by only rendering visible items.

<DocsPageFeatures :frontmatter />

## Usage

The `useVirtual` composable efficiently renders large lists by only mounting visible items plus a small overscan buffer. Pass an array of items and configure the item height to get back sliced items, scroll handlers, and positioning values.

<DocsExample file="basic.vue" title="Virtual List" :code="VirtualListExampleRaw">
  <VirtualListExample />
</DocsExample>

## Architecture

The rendering pipeline transforms scroll events into visible item ranges:

```mermaid
flowchart LR
  subgraph Inputs
    A[scroll event]
    B[viewport height]
    C[item height]
  end

  subgraph Calculate
    D[visible range]
    E[overscan buffer]
    F[offset position]
  end

  subgraph Output
    G[sliced items]
    H[transform style]
  end

  A --> D
  B --> D
  C --> D
  D --> E
  E --> F
  F --> G
  F --> H
```

<DocsApi />
