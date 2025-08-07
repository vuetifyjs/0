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

## Usage

The `useRegistry` composable provides a powerful interface for managing collections of items in a registration-based system. It allows you to register, unregister, and look up items efficiently, while maintaining an index for quick access.

```ts
import { useRegistry } from '@vuetify/v0'

const registry = useRegistry()

const ticket1 = registry.register()
const ticket2 = registry.register()
const ticket3 = registry.register()

console.log(registry.size) // 3
```

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
    clear: () => void
    has: (id: ID) => boolean
    keys: () => ID[]
    browse: (value: unknown) => ID | ID[] | undefined
    lookup: (index: number) => ID | undefined
    get: (id: ID) => Z | undefined
    values: () => Z[]
    entries: () => [ID, Z][]
    register: (item?: Partial<Z>) => Z
    unregister: (id: ID) => void
    reindex: () => void
    on: (event: string, cb: Function) => void
    off: (event: string, cb: Function) => void
    emit: (event: string, data: any) => void
    size: number
  }

  interface RegistryOptions {
    events?: boolean
  }
  ```
- **Details**

- `collection`: A [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that holds registered items, indexed by their unique IDs.
- `clear()`: Clears the entire registry, removing all registered items.
- `has(id: ID)`: Checks if an item with the given ID exists in the registry.
- `keys()`: Returns an array of all registered IDs.
- `browse(value: unknown)`: Searches for an ID by its value. Returns a single ID if found, or an array of IDs if multiple items match.
- `lookup(index: number)`: Looks up an ID by its index number.
- `get(id: ID)`: Retrieves a ticket by its ID, returning `undefined` if not found.
- `values()`: Returns an array of all registered tickets.
- `entries()`: Returns an array of entries, each being a tuple of [ID, ticket].
- `register(item?: Partial<Z>)`: Registers a new item, returning the created ticket. If `item` is provided, it will be merged with the default ticket structure.
- `unregister(id: ID)`: Unregisters an item by its ID, removing it from the registry.
- `reindex()`: Rebuilds the index of registered items, useful if the order of items has changed.
- `on(event: string, cb: Function)`: Registers an event listener for a specific event.
- `off(event: string, cb: Function)`: Unregisters an event listener for a specific event.
- `emit(event: string, data: any)`: Emits an event with the provided data, triggering all registered listeners for that event.
- `size`: Returns the number of registered items in the registry.

- **Options**

  - `events`: If `true`, enables event emission for registry operations like `register` and `unregister`. Defaults to `false`.

### `register`

- **Type**
  ```ts
  function register (item?: Partial<Z>): Z
  ```

- **Details**
  Registers a new item in the registry. If an item is provided, it will be merged with the default ticket structure. Returns the created ticket.

- **Example**
  ```ts
  const registry = useRegistry()

  const ticket = registry.register({ id: 'foo', value: 'bar' })

  console.log(ticket) // { id: 'foo', index: 0, value: 'bar', valueIsIndex: false }
  ```

### `get`

- **Type**
  ```ts
  function get (id: ID): Z | undefined
  ```

- **Details**
  Retrieves a registered item by its ID. Returns `undefined` if the item does not exist

- **Example**
  ```ts
  const registry = useRegistry()

  registry.register({ id: 'foo' })

  const found = registry.get('foo')
  const notfound = registry.get('bar')
  ```
