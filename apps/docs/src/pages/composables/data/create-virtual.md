---
title: createVirtual - High-Performance Virtual Scrolling
meta:
- name: description
  content: Efficiently render large lists with virtual scrolling. Only renders visible items, supports dynamic heights, bidirectional scrolling, and infinite scroll.
- name: keywords
  content: createVirtual, virtual scroll, virtualization, large lists, performance, Vue 3, composable, infinite scroll
features:
  category: Composable
  label: 'E: createVirtual'
  github: /composables/createVirtual/
  level: 2
related:
  - /composables/data/create-filter
  - /composables/utilities/create-overflow
---

# createVirtual

Virtual scrolling composable for efficiently rendering large lists by only rendering visible items.

<DocsPageFeatures :frontmatter />

## Usage

The `createVirtual` composable efficiently renders large lists by only mounting visible items plus a small overscan buffer. Pass an array of items and configure the item height to get back sliced items, scroll handlers, and positioning values.

::: example
/composables/create-virtual/basic
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

## API Pattern

| Function | Purpose |
|----------|---------|
| `createVirtual(items, options)` | Factory - returns a virtual scrolling context |
| `createVirtualContext(items, options)` | Factory with DI - returns `[useVirtual, provideVirtual, virtual]` trinity |
| `useVirtual(namespace?)` | Injection getter - retrieves provided virtual context |

### Basic Usage

```ts
import { ref } from 'vue'
import { createVirtual } from '@vuetify/v0'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i })))
const virtual = createVirtual(items, { itemHeight: 40 })
```

### With Dependency Injection

```ts
// Create context with DI support
const [useVirtual, provideVirtual, virtual] = createVirtualContext(items, {
  namespace: 'app:virtual',
  overscan: 10,
})

// In parent component
provideVirtual()

// In child component
const virtual = useVirtual()
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `element` | <AppSuccessIcon /> | Ref, assign scroll container |
| `items` | <AppSuccessIcon /> | Computed, visible items with index |
| `offset` | <AppSuccessIcon /> | ShallowRef, readonly (top spacer height) |
| `size` | <AppSuccessIcon /> | ShallowRef, readonly (bottom spacer height) |
| `state` | <AppSuccessIcon /> | ShallowRef (`'loading'` \| `'empty'` \| `'error'` \| `'ok'`) |

> [!TIP] Source items
> The `items` ref passed to `createVirtual()` is watched for changes. When items change, the virtual scroller updates automatically.

<DocsApi />
