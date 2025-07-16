# useSingle

The `useSingle` composable is a wrapper around `useGroup` that provides a simplified API for single-selection scenarios. It adds singular selection properties (`selectedId`, `selectedItem`, `selectedValue`) and a streamlined `select` function.

## Usage

```vue
<script lang="ts" setup>
import { useSingle } from '@vuetify/0'
import { ref } from 'vue'

const [useTabSingle, provideTabSingle, tabSingle] = useSingle('tabs', {
  mandatory: true
})

const selectedTab = ref('home')
provideTabSingle(selectedTab, tabSingle)

const group = useTabSingle()
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
    
    <p>Selected: {{ tabSingle.selectedValue.value }}</p>
  </div>
</template>
```

## API Reference

### `useSingle(namespace, options?)`

Creates a single-selection group management system.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `namespace` | `string` | - | Unique identifier for the group context |
| `options` | `SingleOptions` | `{}` | Configuration options (excludes `multiple`) |

**Returns:**

A tuple containing:
- `useSingleContext`: Function to access group context in child components
- `provideSingleContext`: Function to provide group context to children
- `singleContext`: The single-selection context object

### SingleOptions

Extends `GroupOptions` but omits the `multiple` property (always `false`).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mandatory` | `boolean \| 'force'` | `false` | Whether at least one item must be selected |
| `returnObject` | `boolean` | `false` | Whether to return full objects instead of values |

### SingleContext

Extends `GroupContext` with additional singular selection properties:

| Property | Type | Description |
|----------|------|-------------|
| `selectedId` | `ComputedRef<ID \| undefined>` | ID of the selected item |
| `selectedItem` | `ComputedRef<SingleTicket \| undefined>` | The selected item ticket |
| `selectedValue` | `ComputedRef<unknown>` | Value of the selected item |
| `select` | `(id: ID) => void` | Simplified select function for single ID |

All other properties from `GroupContext` are inherited (including `selectedIds`, `selectedItems`, `selectedValues` for backward compatibility).

## TypeScript Support

The composable supports generic constraints similar to `useGroup`:

```typescript
import { useSingle } from '@vuetify/0'
import type { SingleContext, SingleItem, SingleTicket } from '@vuetify/0'

interface CustomSingleContext extends SingleContext {
  getCurrentLabel: () => string
}

export function useCustomSingle() {
  const [useSingle, provideSingle, single] = useSingle<CustomSingleContext>('custom-single')

  const context: CustomSingleContext = {
    ...single,
    getCurrentLabel() {
      return single.selectedItem.value?.label || 'None'
    }
  }

  return [useSingle, provideSingle, context]