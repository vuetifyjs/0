# useGroup

The `useGroup` composable provides a powerful way to manage collections of items with selection capabilities. It's built on top of `useRegistrar` and handles group selection logic, including single/multiple selection modes, mandatory selection, and item management.

## Usage

```vue
<script lang="ts" setup>
import { useGroup } from '@vuetify/0'
import { ref } from 'vue'

const [useTabGroup, provideTabGroup, tabGroup] = useGroup('tabs', {
  mandatory: true,
  multiple: false
})

const selectedTab = ref('home')
provideTabGroup(selectedTab, tabGroup)

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

### `useGroup(namespace, options?)`

Creates a group management system with registration and selection capabilities.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `namespace` | `string` | - | Unique identifier for the group context |
| `options` | `GroupOptions` | `{}` | Configuration options |

**Returns:**

A tuple containing:
- `useGroupContext`: Function to access group context in child components
- `provideGroupContext`: Function to provide group context to children
- `groupContext`: The group context object

### GroupOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mandatory` | `boolean \| 'force'` | `false` | Whether at least one item must be selected |
| `multiple` | `boolean` | `false` | Whether multiple items can be selected |
| `returnObject` | `boolean` | `false` | Whether to return full objects instead of values |

### GroupContext

| Property | Type | Description |
|----------|------|-------------|
| `selectedItems` | `ComputedRef<Set<GroupTicket>>` | Currently selected items |
| `selectedIds` | `Reactive<Set<ID>>` | IDs of selected items |
| `selectedValues` | `ComputedRef<Set<unknown>>` | Values of selected items |
| `registeredItems` | `Reactive<Map<ID, GroupTicket>>` | All registered items |
| `register` | `Function` | Register a new item |
| `unregister` | `Function` | Unregister an item |
| `select` | `Function` | Select specific items |
| `reset` | `Function` | Reset selection |
| `mandate` | `Function` | Ensure mandatory selection |

### GroupTicket

| Property | Type | Description |
|----------|------|-------------|
| `id` | `ID` | Unique identifier |
| `index` | `number` | Item index |
| `value` | `unknown` | Item value |
| `disabled` | `boolean` | Whether item is disabled |
| `isActive` | `ComputedRef<boolean>` | Whether item is selected |
| `toggle` | `Function` | Toggle item selection |

## TypeScript Support

The composable is fully typed and supports generic constraints:

```typescript
import { useGroup } from '@vuetify/0'
import type { GroupContext, GroupItem, GroupTicket } from '@vuetify/0'

interface CustomGroupItem extends GroupItem {
  label: string
  category: string
}

interface CustomGroupTicket extends GroupTicket {
  label: string
  category: string
}

interface CustomGroupContext extends GroupContext<CustomGroupTicket, CustomGroupItem> {
  filterByCategory: (category: string) => void
}

export function useCustomGroup() {
  const [useGroup, provideGroup, group] = useGroup<CustomGroupContext>('custom-group')

  const context: CustomGroupContext = {
    ...group,
    filterByCategory(category: string) {
      // Custom filtering logic
    }
  }

  return [useGroup, provideGroup, context]
}
```
