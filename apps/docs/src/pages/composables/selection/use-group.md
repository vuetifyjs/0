---
title: useGroup - Multi-Selection with Tri-State Support
meta:
- name: description
  content: Multi-selection composable with tri-state support. Manage checkbox trees with indeterminate states, batch operations, and select-all patterns for Vue 3 apps.
- name: keywords
  content: useGroup, selection, group selection, composable, Vue 3, indeterminate, tri-state, checkbox tree, select all
features:
  category: Composable
  label: 'E: useGroup'
  github: /composables/useGroup/
related:
  - /composables/selection/use-selection
  - /components/providers/group
---

# useGroup

The `useGroup` composable is designed to manage a group of related components, allowing for shared state and behavior across them. It supports tri-state (mixed/indeterminate) for checkbox trees and similar use cases where items can be selected, unselected, or in a mixed state.

<DocsPageFeatures :frontmatter />

## Usage

The `useGroup` composable manages a group of selectable items, letting you work with both their IDs and their position indexes.
It supports selecting, unselecting, toggling, and reading the indexes of selected items.

```ts
import { createGroup } from '@vuetify/v0'

// Instantiate group
const group = createGroup()

// Register items
group.register({ id: 'apple', value: 'Apple' })
group.register({ id: 'banana', value: 'Banana' })
group.register({ id: 'cherry', value: 'Cherry' })
group.register({ id: 'date', value: 'Date' })

// Select some items
group.select(['apple', 'banana'])
console.log(group.selectedIndexes.value) // Set { 0, 1 }

// Toggle an item (banana will become unselected)
group.toggle('banana')
console.log(group.selectedIndexes.value) // Set { 0 }

// Unselect apple
group.unselect('apple')
console.log(group.selectedIndexes.value) // Set {}
```

## Tri-State (Mixed/Indeterminate)

Items can be in one of three states: **selected**, **mixed** (indeterminate), or **unselected**. This is useful for checkbox trees where a parent's state depends on its children.

```ts
import { createGroup } from '@vuetify/v0'

const group = createGroup()

group.onboard([
  { id: 'parent', value: 'All Items' },
  { id: 'child-1', value: 'Item 1' },
  { id: 'child-2', value: 'Item 2' },
])

// Set parent to mixed state (some children selected)
group.mix('parent')
console.log(group.mixed('parent')) // true
console.log(group.mixedIds) // Set { 'parent' }

// Selecting clears mixed state
group.select('parent')
console.log(group.mixed('parent')) // false
console.log(group.selectedIds.has('parent')) // true

// Toggle on a mixed item selects it
group.mix('parent')
group.toggle('parent')
console.log(group.selectedIds.has('parent')) // true
```

### Tri-State Checkbox Tree Example

```vue UseGroup
<script setup lang="ts">
  import { createGroup } from '@vuetify/v0'
  import { computed, ref, watchEffect } from 'vue'

  const group = createGroup()

  const parent = group.register({ id: 'parent', value: 'All Items' })
  const children = group.onboard([
    { id: 'child-1', value: 'Item 1' },
    { id: 'child-2', value: 'Item 2' },
    { id: 'child-3', value: 'Item 3' },
  ])

  // Compute parent state based on children
  const allSelected = computed(() => children.every(c => c.isSelected.value))
  const someSelected = computed(() => children.some(c => c.isSelected.value) && !allSelected.value)

  // Sync parent state with children
  watchEffect(() => {
    if (allSelected.value) {
      group.select('parent')
    } else if (someSelected.value) {
      group.mix('parent')
    } else {
      group.unselect('parent')
      group.unmix('parent')
    }
  })

  // Parent checkbox ref for indeterminate property
  const parentCheckbox = ref()
  watchEffect(() => {
    if (parentCheckbox.value) {
      parentCheckbox.value.indeterminate = parent.isMixed.value
    }
  })

  function toggleParent() {
    if (parent.isSelected.value) {
      group.unselect(children.map(c => c.id))
    } else {
      group.select(children.map(c => c.id))
    }
  }
</script>

<template>
  <div>
    <label>
      <input
        ref="parentCheckbox"
        type="checkbox"
        :checked="parent.isSelected.value"
        @change="toggleParent"
      >
      {{ parent.value }}
    </label>

    <div style="margin-left: 1.5rem">
      <label v-for="child in children" :key="child.id">
        <input
          type="checkbox"
          :checked="child.isSelected.value"
          @change="child.toggle()"
        >
        {{ child.value }}
      </label>
    </div>
  </div>
</template>
```

## Select All

For simpler "select all" checkbox patterns, `useGroup` provides context-level helpers that work on all selectable (non-disabled) items at once:

- **`isNoneSelected`**: True when no items are selected
- **`isAllSelected`**: True when all selectable items are selected
- **`isMixed`**: True when some but not all are selected
- **`selectAll()`**: Selects all non-disabled items
- **`unselectAll()`**: Unselects all items (respects mandatory option)
- **`toggleAll()`**: Toggles between all selected and none selected

See the [Group component](/components/group#select-all) for a complete example.


<DocsApi />
