---
title: useVirtual - High-Performance Virtual Scrolling
meta:
- name: description
  content: Efficiently render large lists with virtual scrolling. Only renders visible items, supports dynamic heights, bidirectional scrolling, and infinite scroll.
- name: keywords
  content: virtual scroll, virtualization, large lists, performance, Vue 3, composable, infinite scroll
features:
  category: Composable
  label: 'C: useVirtual'
  github: /composables/useVirtual/
  level: 2
related:
  - /composables/utilities/create-filter
  - /composables/utilities/use-overflow
---

# useVirtual

Virtual scrolling composable for efficiently rendering large lists by only rendering visible items.

<DocsPageFeatures :frontmatter />

## Usage

The `useVirtual` composable efficiently renders large lists by only mounting visible items plus a small overscan buffer. Pass an array of items and configure the item height to get back sliced items, scroll handlers, and positioning values.

::: example
/composables/use-virtual/basic
:::

## Architecture

The rendering pipeline transforms scroll events into visible item ranges:

```mermaid "Virtual Rendering Pipeline"
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
