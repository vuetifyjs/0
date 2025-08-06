---
meta:
  title: useGroup
  description: Creates a group selection context for managing collections of items where multiple selections can be made.
  keywords: useGroup, group, selection, composable, Vue
category: Selection
performance: 0
---

# useGroup

The `useGroup` composable creates a group selection context for managing collections of items where multiple selections can be made. This function extends the selection functionality provided by `useSelection` with group selection capabilities.

## API

### `useGroup(options?)`

* **Type**
    
  ```ts
  export function useGroup<
    Z extends GroupTicket = GroupTicket,
    E extends GroupContext<Z> = GroupContext<Z>,
  > (options?: GroupOptions): E
  ```
    
* **Details**
    
  - `options`: Optional configuration for group selection behavior. Extends `SelectionOptions` from `useSelection`.

  Returns a group selection context object (`GroupContext`) that includes properties and methods for managing group selections, such as `selectedIndexes` (a computed property containing a `Set` of selected item indexes) and `select` (a function to select items by their IDs).

## Examples

### Basic Usage

```html
<template>
  <div>
    <h3>Select Items:</h3>
    <div v-for="item in items" :key="item.id">
      <input type="checkbox" :checked="isSelected(item.id)" @change="toggleSelection(item.id)" />
      {{ item.name }}
    </div>
    <p>Selected IDs: {{ Array.from(selected.value).join(", ") }}</p>
    <p>Selected Indexes: {{ Array.from(selectedIndexes).join(", ") }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useGroup } from '@vuetify/v0/composables/useGroup'

  const items = ref([
    { id: 'a', name: 'Item A', index: 0 },
    { id: 'b', name: 'Item B', index: 1 },
    { id: 'c', name: 'Item C', index: 2 },
  ])

  const { selected, select, selectedIndexes } = useGroup()

  const isSelected = (id: string) => selected.value.has(id)

  const toggleSelection = (id: string) => {
    if (isSelected(id)) {
      selected.value.delete(id)
    } else {
      select(id)
    }
  }
</script>
```


