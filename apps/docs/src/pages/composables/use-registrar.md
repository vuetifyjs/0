# useRegistrar

The `useRegistrar` composable provides a foundation for building registration-based systems in Vue applications. It's built on top of `useContext` and manages collections of registered items with automatic indexing, lifecycle management, and type-safe registration callbacks.

## Usage

```vue
<script lang="ts" setup>
import { useRegistrar } from '@vuetify/0'

const [useItemRegistry, provideItemRegistry, registry] = useRegistrar('items')

provideItemRegistry(registry)
const itemRegistry = useItemRegistry()
const item1 = itemRegistry.register({ name: 'Item 1' })
const item2 = itemRegistry.register({ name: 'Item 2' })
</script>

<template>
  <div>
    <h3>Registered Items:</h3>
    <ul>
      <li v-for="item in registry.registeredItems" :key="item.id">
        {{ item.name }} (Index: {{ item.index }})
      </li>
    </ul>
  </div>
</template>
```

## API Reference

### `useRegistrar(namespace)`

Creates a registration system for managing collections of items.

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
| `registeredItems` | `Reactive<Map<ID, Ticket>>` | Map of all registered items |
| `register` | `Function` | Register a new item |
| `unregister` | `Function` | Unregister an item by ID |
| `intake` | `Function` | Process item data during registration |
| `reindex` | `Function` | Reindex all items |

### RegistrarItem

Base interface for items that can be registered:

```typescript
interface RegistrarItem {
  id?: ID  // Optional ID (auto-generated if not provided)
}
```

### RegistrarTicket

Interface for registered items with system-managed properties:

```typescript
interface RegistrarTicket extends Required<RegistrarItem> {
  index: number  // Auto-assigned index
}
```
