# useRegistrar

A Vue composable that provides generic registration and unregistration functionality, serving as a foundational layer for more complex composables like `useGroup` and `useStep`.

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
useStep (step navigation)
```

## API

### Types

```typescript
// Generic types for extensibility
export type RegistrarItem<T extends Record<string, any> = {}> = {
  id: string | number
  index: number
} & T

export type RegistrarTicket<T extends Record<string, any> = {}> = {
  id: string | number
  index: number
} & T

// Context interface for dependency injection
export interface RegistrarContext<U extends Record<string, any> = {}> {
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: string | number) => void
}

// State interface returned by useRegistrar
export interface RegistrarState<U extends Record<string, any> = {}> {
  registeredItems: Reactive<Map<string | number, RegistrarItem<U>>>
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: string | number) => void
  reindex: () => void
}
```

### Usage

```typescript
import { useRegistrar, type RegistrarContext } from '#v0/composables/useRegistrar'

// Define your specific context that extends RegistrarContext
interface TabsContext extends RegistrarContext {
  orientation?: 'horizontal' | 'vertical'
}

// Create the registrar with generic types
const [useTabsContext, provideTabsContext, registrarState] = useRegistrar<{}, TabsContext>('Tabs')
```

### Provider Component

```vue
<script lang="ts" setup>
// Provide the context with additional properties
const tabsContext = provideTabsContext({
  orientation: 'horizontal',
})
</script>

<template>
  <div class="tabs-root">
    <slot />
  </div>
</template>
```

### Consumer Component

```vue
<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

const tabsContext = useTabsContext()
let ticket: ReturnType<typeof tabsContext.register> | undefined

onMounted(() => {
  // Register this item
  ticket = tabsContext.register()
})

onUnmounted(() => {
  // Clean up on unmount
  if (ticket) {
    tabsContext.unregister(ticket.id)
  }
})
</script>
```

## Features

### Automatic ID Generation
If no `id` is provided during registration, a unique ID is automatically generated using `crypto.randomUUID()`.

### Index Management
Items are automatically assigned indices based on their registration order. When items are unregistered, all remaining items are reindexed.

### Reactive State
The `registeredItems` map is reactive, so any changes to registered items automatically trigger reactivity updates.

### Context Methods

#### `register(item?: Partial<RegistrarItem<U>>): RegistrarTicket<U>`
Registers a new item and returns a ticket with the item's details.

#### `unregister(id: string | number): void`
Unregisters an item by ID and triggers reindexing.

### State Methods

#### `reindex(): void`
Manually triggers reindexing of all registered items. Called automatically during unregistration.

## Integration with Other Composables

The `useRegistrar` composable is designed to be composed by other composables using a clean composition pattern:

```typescript
// useGroup extends useRegistrar
export function useGroup<T extends GroupContext>(namespace: string, options?: GroupOptions) {
  const [
    useGroupContext,
    provideGroupContext,
    registrar,
  ] = useRegistrar<GroupItemExtension, GroupContext>(namespace)

  // Use registrar's functions with clean naming
  const { registeredItems, register: _register, unregister: _unregister, reindex } = registrar

  // Enhance registration with group-specific logic
  function register(item?: Partial<GroupItem>): GroupTicket {
    const groupItem = {
      ...item,
      disabled: item?.disabled ?? false,
      value: item?.value ?? registeredItems.size,
      valueIsIndex: item?.valueIsIndex ?? item?.value == null,
    }

    // Use base registrar's register function
    const ticket = _register(groupItem)

    // Add group-specific post-registration logic
    // ... selection logic, initial value handling, etc.

    return {
      isActive: toRef(() => selectedIds.has(ticket.id)),
      index: toRef(() => {
        const item = registeredItems.get(ticket.id)
        return item?.index ?? 0
      }),
      toggle: () => toggle(ticket.id),
    }
  }

  function unregister(id: GroupItem['id']) {
    selectedIds.delete(id) // Group-specific logic
    _unregister(id)        // Use base registrar's function
  }

  // Return enhanced context with group functionality
  const group = {
    register,
    unregister,
    reset,
    mandate,
    select,
    ...context,
  } as T

  provideGroupContext(group)
}
```

### **Composition Benefits**
- **No Duplication**: Higher-level composables don't reimplement registration logic
- **Single Responsibility**: Each layer adds its specific functionality
- **Easy Testing**: Each layer can be tested independently
- **Type Safety**: Full type checking through the composition chain
- **Clean Naming**: Internal delegation uses `_` prefix while public API uses natural names

## Benefits

1. **Generic Design**: Supports extension via TypeScript generics for any item type
2. **Separation of Concerns**: Registration logic is isolated from other functionality
3. **Reusability**: Can be used by any composable that needs registration functionality
4. **Consistency**: Provides a consistent registration interface across different use cases
5. **Maintainability**: Registration bugs only need to be fixed in one place
6. **Type Safety**: Full TypeScript support with generic context types
7. **Performance**: Efficient reactive state management and reindexing
