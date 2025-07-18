````markdown
# useGroup

The `useGroup` composable provides a powerful way to manage collections of items with selection capabilities. It's built on top of `useRegistrar` and handles group selection logic, including single/multiple selection modes, mandatory selection, and item management.

## Usage

```vue
<script lang="ts" setup>
import { useGroup } from 'v0'
import { ref } from 'vue'

const [useTabGroup, provideTabGroup] = useGroup('tabs', {
  mandatory: true,
  multiple: false
})

const selectedTab = ref('home')
provideTabGroup(selectedTab)

const group = useTabGroup()
const homeTab = group.register({ value: 'home', disabled: false })
const aboutTab = group.register({ value: 'about', disabled: false })
</script>

<template>
  <div>
    <button @click="homeTab.toggle()" :disabled="homeTab.disabled">
      Home {{ homeTab.isActive ? '(active)' : '' }}
    </button>
    <button @click="aboutTab.toggle()" :disabled="aboutTab.disabled">
      About {{ aboutTab.isActive ? '(active)' : '' }}
    </button>
  </div>
</template>
```

## API Reference

### `useGroup<T, U>(namespace, options?)`

Creates a group management system with registration and selection capabilities.

**Generic Parameters:**

| Parameter | Description |
|-----------|-------------|
| `T` | Type extending `GroupContext` for the context |
| `U` | Type extending `GroupContext` for the context |

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `namespace` | `string` | - | Unique identifier for the group context |
| `options` | `GroupOptions` | `{}` | Configuration options |

**Returns:**

A tuple containing:
- `useGroupContext`: Function to access group context in child components
- `provideGroupContext`: Function to provide group context to children with model binding
- `groupContext`: The group context object

### GroupOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mandatory` | `boolean \| 'force'` | `false` | Whether at least one item must be selected. `'force'` selects first item immediately |
| `multiple` | `boolean` | `false` | Whether multiple items can be selected simultaneously |
| `returnObject` | `boolean` | `false` | Whether to return full objects instead of values in model |

### GroupContext

Extends `RegistrarContext` with selection-specific functionality:

| Property | Type | Description |
|----------|------|-------------|
| `selectedItems` | `ComputedRef<Set<GroupTicket \| undefined>>` | Currently selected items |
| `selectedIds` | `Reactive<Set<ID>>` | IDs of selected items |
| `selectedValues` | `ComputedRef<Set<unknown>>` | Values of selected items |
| `registeredItems` | `Reactive<Map<ID, Reactive<GroupTicket>>>` | All registered items |
| `register` | `(item?: Partial<GroupTicket>, id?: ID) => Reactive<GroupTicket>` | Register a new item |
| `unregister` | `(id: ID) => void` | Unregister an item |
| `select` | `(ids: ID \| ID[]) => void` | Select specific items |
| `reset` | `() => void` | Reset selection and reindex |
| `mandate` | `() => void` | Ensure mandatory selection |
| `reindex` | `() => void` | Reindex all items |

### GroupTicket

Extends `RegistrarTicket` with selection-specific properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `ID` | Unique identifier |
| `index` | `number` | Item index |
| `value` | `unknown` | Item value (defaults to index if not provided) |
| `valueIsIndex` | `boolean` | Whether value was auto-generated from index |
| `disabled` | `boolean` | Whether item is disabled |
| `isActive` | `Readonly<ComputedGetter<boolean>>` | Whether item is selected |
| `toggle` | `() => void` | Toggle item selection |

## Provider Function

The provider function supports model binding and automatic synchronization:

```typescript
provideGroupContext(
  model?: Ref<unknown | unknown[]>,
  context?: T,
  app?: App
): T
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | `Ref<unknown \| unknown[]>` | Optional reactive model to bind selections |
| `context` | `T` | Optional custom context (defaults to generated context) |
| `app` | `App` | Optional app instance for context injection |

## Model Binding

When a model is provided, the group automatically synchronizes between the model and selection state:

```vue
<script setup>
import { useGroup } from 'v0'
import { ref } from 'vue'

const selectedValues = ref(['home', 'about'])

const [useTabGroup, provideTabGroup] = useGroup('tabs', {
  multiple: true,
  returnObject: false
})

// Bind model to group
provideTabGroup(selectedValues)

const group = useTabGroup()
group.register({ value: 'home' })
group.register({ value: 'about' })
group.register({ value: 'contact' })

// selectedValues automatically updates when selection changes
// Selection automatically updates when selectedValues changes
</script>
```

## Selection Behavior

### Single Selection Mode (`multiple: false`)
- Only one item can be selected at a time
- Selecting a new item automatically deselects the previous one
- If `mandatory: true`, the last item cannot be deselected

### Multiple Selection Mode (`multiple: true`)
- Multiple items can be selected simultaneously
- Clicking an item toggles its selection state
- If `mandatory: true`, at least one item must remain selected

### Mandatory Selection
- `mandatory: true`: Ensures at least one item is selected, prevents deselecting the last item
- `mandatory: 'force'`: Immediately selects the first available item when registered

## TypeScript Support

The composable is fully typed and supports generic constraints:

```typescript
import { useGroup } from 'v0'
import type { GroupContext, GroupTicket } from 'v0'

interface CustomGroupTicket extends GroupTicket {
  label: string
  category: string
}

interface CustomGroupContext extends GroupContext {
  filterByCategory: (category: string) => void
}

export function useCustomGroup() {
  const [useGroup, provideGroup, group] = useGroup<CustomGroupTicket, CustomGroupContext>('custom-group')

  const context: CustomGroupContext = {
    ...group,
    filterByCategory(category: string) {
      // Custom filtering logic
    }
  }

  return [useGroup, provideGroup, context] as const
}
```

## Integration with useRegistrar

`useGroup` is built on top of `useRegistrar` and extends its functionality:

```typescript
// useGroup extends useRegistrar's capabilities
const [useRegistrarContext, provideRegistrarContext, registrar] = useRegistrar<T, U>(namespace)

// Enhances registration with group-specific features
function register(registrant: Partial<T>, id: ID = genId()): Reactive<T> {
  const groupItem: Partial<T> = {
    disabled: false,
    value: registrant?.value ?? registrar.registeredItems.size,
    valueIsIndex: registrant?.value == null,
    ...registrant,
  }

  const ticket = registrar.register(groupItem, id)

  // Add group-specific reactive properties
  Object.assign(ticket, {
    isActive: toRef(() => selectedIds.has(ticket.id)),
    toggle: () => toggle(ticket.id),
  })

  return ticket
}
```
````
