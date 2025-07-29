---
meta:
  title: useRegistry
  description: A foundational composable for building registration-based systems, managing collections of registered items with automatic indexing, and lifecycle management.
  keywords: useRegistry, registry, composable, Vue, state management
category: Registration
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useRegistry

A foundational composable for building registration-based systems, managing collections of registered items with automatic indexing, and lifecycle management.

## API

- **Type**

  ```ts
  interface RegistryTicket {
    id: ID
    index: number
    value: unknown
  }

  interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
    collection: Map<ID, Z>
    catalog: Map<unknown, ID>
    directory: Map<number, ID>
    browse: (value: unknown) => ID | undefined
    lookup: (index: number) => ID | undefined
    find: (id: ID) => Z | undefined
    register: (item?: Partial<Z>, id?: ID) => Z
    unregister: (id: ID) => void
    reindex: () => void
  }
  ```
- **Details**

  - `collection`: A map of registered items by their unique ID.
  - `catalog`: A map of item values to their unique IDs.
  - `directory`: A map of item indices to their unique IDs.
  - `browse(value: unknown)`: Returns the ID of the first item matching the value, or `undefined` if not found.
  - `lookup(index: number)`: Returns the ID of the item at the given index, or `undefined` if not found.
  - `find(id: ID)`: Returns the registered item for the given ID, or `undefined` if not found.
  - `register(item?: Partial<Z>, id?: ID)`: Registers a new item, optionally with a specific ID. Returns the registered item; otherwise known as a **ticket**.
  - `unregister(id: ID)`: Unregisters an item by its ID.
  - `reindex()`: Rebuilds the index of items based on their current state.

- **Options**

  - `deep`: If `true`, the registered item will be wrapped in [reactive](https://vuejs.org/api/reactivity-core.html#reactive) instead of [shallowReactive](https://vuejs.org/api/reactivity-advanced.html#shallowreactive). Defaults to `false`.

## Usage

The `useRegistry` composable provides a powerful interface for managing collections of items in a registration-based system. It allows you to register, unregister, and look up items efficiently, while maintaining an index for quick access.

```ts
// src/composables/my-registry.ts
import { useRegistry } from '@vuetify/0'

export const [useMyRegistry, provideMyRegistry] = useRegistry('my-namespace')
```

```html
<!-- src/App.vue -->
<script lang="ts" setup>
  import { provideMyRegistry } from './composables/my-registry'

  provideMyRegistry()
</script>
```

## Performance

The `useRegistry` composable is designed to be efficient, leveraging Vue's reactivity system to minimize overhead. It uses maps for fast lookups and maintains an index for quick access to registered items. The composable also supports deep reactivity for complex objects, ensuring that changes are tracked efficiently.

The primary way that you will access information in the registry is to search for it by **ID** using the `find` method. If you don't know the ID what you're looking for, you can use one of the following methods to locate it:

- `browse(value: unknown)`: Searches for the first item that matches the given value and returns its ID.
- `lookup(index: number)`: Returns the ID of the item at the specified index.

In addition to the collection Map, the registry maintains a `catalog` Map that maps item values to their IDs, and a `directory` Map that maps item indices to their IDs. This allows for efficient lookups and indexing of registered items.

### Benchmarks

The following table shows performance metrics for various `useRegistry` operations:

| Operation | Performance | Average Time |
|-----------|-------------|--------------|
| Registration | 726 ops/sec | 1.38ms |
| Unregistration | 7,495 ops/sec | 0.13ms |
| Lookup | 34,766 ops/sec | 0.03ms |
| Reindexing | 3,697 ops/sec | 0.27ms |
| Browse | 19,278 ops/sec | 0.05ms |
| Find | 8,584 ops/sec | 0.12ms |

#### Batch Operations (100 items)

| Operation | Performance |
|-----------|-------------|
| Lookup | 445,286 ops/sec |
| Browse | 166,574 ops/sec |
| Find | 101,778 ops/sec |
| Reindex | 36,591 ops/sec |
| Register | 10,125 ops/sec |

#### Registration Performance by Collection Size

| Collection Size | Performance | Average Time |
|-----------------|-------------|--------------|
| 10 items | 124,701 ops/sec | 0.01ms |
| 100 items | 12,927 ops/sec | 0.08ms |
| 1,000 items | 1,446 ops/sec | 0.69ms |
| 5,000 items | 202 ops/sec | 4.96ms |

#### Registration Mode Comparison

| Mode | Performance | Average Time |
|------|-------------|--------------|
| Shallow Registration | 746 ops/sec | 1.34ms |
| Deep Registration | 1,072 ops/sec | 0.93ms |

## Example

The following example demonstrates creating a registry for reusable icon svg paths:

```ts
// src/composables/icons.ts

import { useRegistry } from '@vuetify/0'

const [useIconContext, _provideIconContext, registry] = useRegistry('icons')

export { useIconContext }

export function provideIconContext () {
  const icons = {
    collapse: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
    complete: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
    menu: 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z',
  }

  for (const [id, value] of Object.entries(icons)) {
    registry.register({ id, value })
  }

  _provideIconContext()
}
```

Provide the icon context in your main application file, typically `App.vue`:


```html
<!-- src/App.vue -->

<script lang="ts" setup>
  import { provideIconContext } from './composables/icons'

  provideIconContext()
</script>
```

Now in subsequent components, you use the `useIconContext` composable to access the registered icons:

```html
<!-- src/components/Icon.vue -->

<script lang="ts" setup>
  import { useIconContext } from '../composables/icons'
  import { computed } from 'vue'

  interface IconProps {
    name: string
  }

  const props = defineProps<IconProps>()

  const icons = useIconContext()

  const icon = computed(() => icons.find(props.name))
</script>

<template>
  <svg
    v-if="icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
  >
    <path :d="icon" />
  </svg>
</template>
```

Below is a mermaid diagram illustrating the above example:

<Mermaid code="
graph TD
    A[icons.ts] --> B(App.vue)
    B(App.vue) --> |provideIconContext| C{v0 Global Context}
    C --> |useIconContext| D(Icon.vue)
    C --> |useIconContext| E(AnotherComponent.vue)
" />
