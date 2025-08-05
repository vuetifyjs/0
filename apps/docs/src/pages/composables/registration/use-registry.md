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
    valueIsIndex: boolean
  }

  interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
    collection: Map<ID, Z>
    catalog: Map<unknown, ID | ID[]>
    directory: Map<number, ID>
    clear: () => void
    has: (id: ID) => boolean
    browse: (value: unknown) => ID | ID[] | undefined
    lookup: (index: number) => ID | undefined
    find: (id: ID) => Z | undefined
    register: (item?: Partial<Z>) => Z
    unregister: (ids: ID | ID[]) => void
    reindex: () => void
    on: (event: string, cb: Function) => void
    off: (event: string, cb: Function) => void
  }

  interface RegistryOptions {
    events?: boolean
  }
  ```
- **Details**

  - `collection`: A map of registered items by their unique ID.
  - `catalog`: A map of item values to their unique IDs. When multiple items share the same value, the catalog intelligently stores an array of IDs; when reduced to a single item, it converts back to a primitive ID.
  - `directory`: A map of item indices to their unique IDs.
  - `clear()`: Removes all items from the registry, clearing the collection, catalog, and directory.
  - `has(id: ID)`: Returns `true` if an item with the given ID exists in the registry, `false` otherwise.
  - `browse(value: unknown)`: Returns the ID(s) associated with the given value. Returns a single ID if only one item has that value, an array of IDs if multiple items share the value, or `undefined` if not found.
  - `lookup(index: number)`: Returns the ID of the item at the given index, or `undefined` if not found.
  - `find(id: ID)`: Returns the registered item for the given ID, or `undefined` if not found.
  - `register(item?: Partial<Z>)`: Registers a new item. Returns the registered item; otherwise known as a **ticket**.
  - `unregister(ids: ID | ID[])`: Unregisters one or more items by their ID(s). Accepts either a single ID or an array of IDs for efficient batch removal. After processing all items, reindexes the remaining items.
  - `reindex()`: Rebuilds the index of items based on their current state.
  - `on(event: string, cb: Function)`: Listens for registry events (requires `events: true` option).
  - `off(event: string, cb: Function)`: Stops listening for registry events.

- **Options**

  - `events`: If `true`, enables event emission for registry operations like `register` and `unregister`. Defaults to `false`.

## Usage

The `useRegistry` composable provides a powerful interface for managing collections of items in a registration-based system. It allows you to register, unregister, and look up items efficiently, while maintaining an index for quick access.

```ts
// src/composables/my-registry.ts
import { useRegistry } from '@vuetify/v0'
import { createContext } from '@vuetify/v0'

// Simple usage
export const useMyRegistry = () => useRegistry()

// Or with context injection
export const [useMyRegistryContext, provideMyRegistryContext] = createContext('my-registry')

// With events enabled
export const useMyRegistryWithEvents = () => useRegistry({ events: true })
```

```html
<!-- src/App.vue -->
<script lang="ts" setup>
  import { provideMyRegistryContext, useMyRegistry } from './composables/my-registry'

  // Simple usage without context
  const registry = useMyRegistry()

  // Or with context
  const registryContext = useMyRegistry()
  provideMyRegistryContext(registryContext)
</script>
```

## Registry Tickets

Each registered item returns a **ticket** that contains metadata about the registration:

```ts
interface RegistryTicket {
  id: ID                    // Unique identifier for the item
  index: number            // Position in the registry (0-based)
  value: unknown           // The actual value stored
  valueIsIndex: boolean    // Whether value was auto-assigned from index
}
```

The `valueIsIndex` property indicates whether the item's value was automatically assigned based on its index position. This is useful for understanding the registration behavior:

```ts
const registry = useRegistry()

// Auto-assigned value
const ticket1 = registry.register()
console.log(ticket1.valueIsIndex) // true
console.log(ticket1.value === ticket1.index) // true

// Explicit value
const ticket2 = registry.register({ value: 'custom-value' })
console.log(ticket2.valueIsIndex) // false
console.log(ticket2.value) // 'custom-value'
```

## Advanced Features

### Event System

When the `events` option is enabled, the registry emits events for registration and unregistration operations:

```ts
const registry = useRegistry({ events: true })

// Listen for registration events
registry.on('register', (ticket) => {
  console.log('Item registered:', ticket)
})

// Listen for unregistration events
registry.on('unregister', (ticket) => {
  console.log('Item unregistered:', ticket)
})

// Register an item (triggers 'register' event)
const ticket = registry.register({ value: 'example' })

// Unregister the item (triggers 'unregister' event)
registry.unregister(ticket.id)

// Stop listening to events
registry.off('register', callback)
```

### Registry Management

The registry provides several utility methods for managing the collection:

```ts
const registry = useRegistry()

// Register some items
const ticket1 = registry.register({ id: 'item1', value: 'value1' })
const ticket2 = registry.register({ id: 'item2', value: 'value2' })
const ticket3 = registry.register({ id: 'item3', value: 'value3' })

// Check if items exist
console.log(registry.has('item1')) // true
console.log(registry.has('item3')) // false

// Unregister a single item
registry.unregister('item1')

// Unregister multiple items efficiently (reindex only runs once)
registry.unregister(['item2', 'item3'])

// Clear all items
registry.clear()
console.log(registry.collection.size) // 0
```

### Integration with Context Factories

The `useRegistry` composable works seamlessly with the factory functions for creating context providers:

```ts
import { useRegistry } from '@vuetify/v0'
import { createContext, createTrinity } from '@vuetify/v0'

// Simple context approach
const [useMyContext, provideMyContext] = createContext('my-registry')

export function setupRegistry() {
  const registry = useRegistry({ events: true })
  provideMyContext(registry)
  return registry
}

// Trinity approach (advanced)
export function createRegistryTrinity() {
  const [useContext, provideContext] = createContext('my-registry')
  const registry = useRegistry({ events: true })

  return createTrinity(useContext, provideContext, registry)
}
```

### Automatic Value Assignment

When registering items without explicit values, the registry automatically assigns the current collection size as both the value and index. The `valueIsIndex` property tracks this behavior:

```ts
const registry = useRegistry()

const ticket1 = registry.register() // { id: 'generated-id', index: 0, value: 0, valueIsIndex: true }
const ticket2 = registry.register({ value: 'custom' }) // { id: 'generated-id', index: 1, value: 'custom', valueIsIndex: false }
```

### Duplicate Value Handling

The catalog intelligently handles duplicate values by automatically converting between single IDs and arrays:

```ts
const registry = useRegistry()

registry.register({ id: 'item1', value: 'value' })

console.log(registery.browse('value')) // 'item1'

registry.register({ id: 'item2', value: 'value' })

console.log(registery.browse('value')) // ['item1', 'item2']

registry.unregister('item1')

console.log(registery.browse('value')) // 'item2'
```

## Performance

The `useRegistry` composable is designed to be efficient, leveraging Vue's reactivity system to minimize overhead. It uses maps for fast lookups and maintains an index for quick access to registered items. The composable also supports deep reactivity for complex objects, ensuring that changes are tracked efficiently.

The primary way that you will access information in the registry is to search for it by **ID** using the `find` method. If you don't know the ID what you're looking for, you can use one of the following methods to locate it:

- `browse(value: unknown)`: Searches for item(s) that match the given value and returns their ID(s). Returns a single ID, array of IDs, or `undefined`.
- `lookup(index: number)`: Returns the ID of the item at the specified index.

In addition to the collection Map, the registry maintains a `catalog` Map that maps item values to their IDs (or arrays of IDs for duplicate values), and a `directory` Map that maps item indices to their IDs. This allows for efficient lookups and indexing of registered items.

The catalog automatically handles duplicate values by:
- Storing a single ID when only one item has a particular value
- Converting to an array when multiple items share the same value
- Converting back to a single ID when reduced to one item

### Batch Operations

For improved performance when removing multiple items, the `unregister` method accepts both single IDs and arrays of IDs. When multiple items are unregistered at once, the expensive reindexing operation is performed only once at the end, rather than after each individual removal.

### Benchmarks

The following table shows performance metrics for various `useRegistry` operations:

| Operation | Performance | Average Time |
|-----------|-------------|--------------|
| Registration | 2,736 ops/sec | 0.38ms |
| Unregistration | 17,355 ops/sec | 0.06ms |
| Find (by ID) | 15,639 ops/sec | 0.07ms |
| Lookup (by index) | 24,288 ops/sec | 0.04ms |
| Browse (by value) | 17,374 ops/sec | 0.06ms |
| Has (existence check) | 16,625 ops/sec | 0.06ms |
| Clear | 4,152 ops/sec | 0.24ms |
| Reindex | 38,500 ops/sec | 0.03ms |

*Performance metrics based on benchmark tests with 1,000 items and will vary based on collection size.*

## Example

The following example demonstrates creating a registry for reusable icon svg paths with event handling:

```ts
// src/composables/icons.ts

import { useRegistry } from '@vuetify/v0'
import { createContext } from '@vuetify/v0'

const [useIconContext, provideIconContext] = createContext('icons')

export { useIconContext }

export function createIconRegistry () {
  const registry = useRegistry({ events: true })

  const icons = {
    collapse: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
    complete: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
    menu: 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z',
  }

  // Listen for new icon registrations
  registry.on('register', (ticket) => {
    console.log(`Icon "${ticket.id}" registered with value: ${ticket.value}`)
  })

  // Register initial icons
  for (const [id, value] of Object.entries(icons)) {
    registry.register({ id, value })
  }

  return registry
}

export function setupIconContext () {
  const iconRegistry = createIconRegistry()
  provideIconContext(iconRegistry)
  return iconRegistry
}
```

Provide the icon context in your main application file, typically `App.vue`:


```html
<!-- src/App.vue -->

<script lang="ts" setup>
  import { setupIconContext } from './composables/icons'

  setupIconContext()
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

  const iconRegistry = useIconContext()

  const icon = computed(() => {
    const iconId = iconRegistry.browse(props.name) || props.name
    return iconRegistry.get(iconId)
  })
</script>

<template>
  <svg
    v-if="icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
  >
    <path :d="icon.value" />
  </svg>
</template>
```

Below is a mermaid diagram illustrating the above example:

<Mermaid code="
graph TD
    A[icons.ts] --> B(App.vue)
    B --> |setupIconContext| C{Registry with Events}
    C --> |useIconContext| D(Icon.vue)
    C --> |useIconContext| E(AnotherComponent.vue)
    C --> F[Event Listeners]
    F --> |register events| G[Console Logs]
" />
