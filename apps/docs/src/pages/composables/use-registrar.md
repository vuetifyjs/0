````markdown
# useRegistrar

The `useRegistrar` composable provides a foundation for building registration-based systems in Vue applications. It's built on top of `useContext` and manages collections of registered items with automatic indexing, lifecycle management, and type-safe registration callbacks.

## Purpose

`useRegistrar` is designed to be a foundational composable that handles the core registration logic needed by more complex composables. It provides:

- Generic registration of items with automatic ID generation
- Unregistration with automatic reindexing
- Reactive state management
- Context injection/provision
- Type-safe extensibility through generics

## Hierarchy

```
useContext (base context injection/provision)
    ↓
useRegistrar (registration/unregistration)
    ↓
useGroup (selection management)
    ↓
useSingle (single selection)
```

## Usage

```vue
<script lang="ts" setup>
import { useRegistrar } from 'v0'

const [useItemRegistry, provideItemRegistry, registry] = useRegistrar('items')

provideItemRegistry()
const itemRegistry = useItemRegistry()
const item1 = itemRegistry.register({ name: 'Item 1' })
const item2 = itemRegistry.register({ name: 'Item 2' })
</script>

<template>
  <div>
    <h3>Registered Items:</h3>
    <ul>
      <li v-for="[id, item] in registry.registeredItems" :key="id">
        {{ item.name }} (Index: {{ item.index }})
      </li>
    </ul>
  </div>
</template>
```

## API Reference

### `useRegistrar<T, U>(namespace)`

Creates a registration system for managing collections of items.

**Generic Parameters:**

| Parameter | Description |
|-----------|-------------|
| `T` | Type extending `RegistrarTicket` for registered items |
| `U` | Type extending `RegistrarContext` for the context |

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `namespace` | `string` | Unique identifier for the registrar context |

**Returns:**

A tuple containing:
- `useRegistrarContext`: Function to access registrar context in child components
- `provideRegistrarContext`: Function to provide registrar context to children
- `registrarContext`: The registrar context object

### RegistrarContext

| Property | Type | Description |
|----------|------|-------------|
| `registeredItems` | `Reactive<Map<ID, Reactive<T>>>` | Map of all registered items |
| `register` | `(item: any, id?: ID) => Reactive<T>` | Register a new item |
| `unregister` | `(id: ID) => void` | Unregister an item by ID |
| `reindex` | `() => void` | Reindex all items |

### RegistrarTicket

Interface for registered items with system-managed properties:

```typescript
interface RegistrarTicket {
  id: ID          // Unique identifier (auto-generated if not provided)
  index: number   // Auto-assigned index based on registration order
}
```

## Features

### Automatic ID Generation
If no `id` is provided during registration, a unique ID is automatically generated using `genId()`.

### Index Management
Items are automatically assigned indices based on their registration order. When items are unregistered, all remaining items are reindexed.

### Reactive State
The `registeredItems` map is reactive, so any changes to registered items automatically trigger reactivity updates.

### Context Methods

#### `register(item: any, id?: ID): Reactive<T>`
Registers a new item and returns a reactive ticket with the item's details.

#### `unregister(id: ID): void`
Unregisters an item by ID and triggers reindexing.

#### `reindex(): void`
Manually triggers reindexing of all registered items. Called automatically during unregistration.

## Integration with Other Composables

The `useRegistrar` composable is designed to be composed by other composables:

```typescript
// useGroup extends useRegistrar
export function useGroup<
  T extends GroupTicket,
  U extends GroupContext,
> (namespace: string, options?: GroupOptions) {
  const [
    useRegistrarContext,
    provideRegistrarContext,
    registrar,
  ] = useRegistrar<T, U>(namespace)

  // Use registrar's functions with enhanced functionality
  function register(registrant: Partial<T>, id: ID = genId()): Reactive<T> {
    const groupItem: Partial<T> = {
      disabled: false,
      value: registrant?.value ?? registrar.registeredItems.size,
      valueIsIndex: registrant?.value == null,
      ...registrant,
    }

    const ticket = registrar.register(groupItem, id)

    // Add group-specific functionality
    Object.assign(ticket, {
      isActive: toRef(() => selectedIds.has(ticket.id)),
      toggle: () => toggle(ticket.id),
    })

    return ticket
  }

  function unregister(id: ID) {
    selectedIds.delete(id) // Group-specific logic
    registrar.unregister(id) // Use base registrar's function
  }

  // Return enhanced context
  const context = {
    ...registrar,
    register,
    unregister,
    // ... other group-specific methods
  } as U

  return [
    useRegistrarContext,
    function (
      model?: Ref<unknown | unknown[]>,
      _context: U = context,
      app?: App,
    ) {
      // ...
    },
    context,
  ] as const
}
```

## Benefits

1. **Generic Design**: Supports extension via TypeScript generics for any item type
2. **Separation of Concerns**: Registration logic is isolated from other functionality
3. **Reusability**: Can be used by any composable that needs registration functionality
4. **Consistency**: Provides a consistent registration interface across different use cases
5. **Maintainability**: Registration bugs only need to be fixed in one place
6. **Type Safety**: Full TypeScript support with generic context types
7. **Performance**: Efficient reactive state management and reindexing
````
