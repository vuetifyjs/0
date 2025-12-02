---
meta:
  title: useGroup
  description: A composable for managing grouped selections of items with support for selecting, unselecting, toggling, tri-state (mixed/indeterminate), and tracking selected indexes.
  keywords: useGroup, selection, group selection, composable, Vue, state management, indeterminate, tri-state, checkbox tree
features:
  category: Composable
  label: 'E: useGroup'
  github: /composables/useGroup/
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

```vue
<script setup>
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
- **`isIndeterminate`**: True when some but not all are selected
- **`selectAll()`**: Selects all non-disabled items
- **`unselectAll()`**: Unselects all items (respects mandatory option)
- **`toggleAll()`**: Toggles between all selected and none selected

See the [Group component](/components/group#select-all) for a complete example.

## API

| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | Base selection system that useGroup extends |
| [useSingle](/composables/selection/use-single) | Single-selection variant |
| [useFeatures](/composables/plugins/use-features) | Feature flags system (extends useGroup) |
| [useRegistry](/composables/registration/use-registry) | Base registry system |

- **Type**

  ```ts
  export interface GroupTicket extends SelectionTicket {
    isMixed: Readonly<Ref<boolean>>
    mix: () => void
    unmix: () => void
  }

  export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
    selectedIndexes: ComputedRef<Set<number>>
    select: (ids: ID | ID[]) => void
    unselect: (ids: ID | ID[]) => void
    toggle: (ids: ID | ID[]) => void
    mixedIds: Reactive<Set<ID>>
    mixedItems: ComputedRef<Set<Z>>
    mix: (ids: ID | ID[]) => void
    unmix: (ids: ID | ID[]) => void
    mixed: (id: ID) => boolean
    isNoneSelected: ComputedRef<boolean>
    isAllSelected: ComputedRef<boolean>
    isIndeterminate: ComputedRef<boolean>
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
  }

  export interface GroupOptions extends SelectionOptions {}
  ```

- **Details**

  - `selectedIndexes`: Computed Set of numeric indexes for all currently selected items.
  - `select(ids)`: Marks one or more items as selected. Clears mixed state.
  - `unselect(ids)`: Marks one or more items as unselected.
  - `toggle(ids)`: Switches selection state. Mixed items become selected.
  - `mixedIds`: Reactive Set of IDs in mixed/indeterminate state.
  - `mixedItems`: Computed Set of tickets in mixed state.
  - `mix(ids)`: Sets items to mixed state. Clears selected state.
  - `unmix(ids)`: Clears mixed state from items.
  - `mixed(id)`: Returns true if the item is in mixed state.
  - `isNoneSelected`: True when no items are selected.
  - `isAllSelected`: True when all selectable (non-disabled) items are selected.
  - `isIndeterminate`: True when some but not all selectable items are selected.
  - `selectAll()`: Selects all non-disabled items. Clears mixed state on selected items.
  - `unselectAll()`: Clears selection. Respects mandatory option (keeps one item).
  - `toggleAll()`: Selects all if not all selected, otherwise unselects all.

### `selectedIndexes`

- **Type**
  ```ts
  ComputedRef<Set<number>>
  ```

- **Details**
  A Set of numeric indexes for all currently selected items.
  Useful when selection state is tied to the order of registered items.

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })
  group.select(['apple', 'banana'])
  console.log(group.selectedIndexes.value) // Set { 0, 1 }
  ```

### `select`

- **Type**
  ```ts
  function select(ids: ID | ID[]): void
  ```

- **Details**
  Selects the given item(s). Clears any mixed state on the items before selecting.

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })

  group.select('apple')
  group.select(['banana'])
  console.log(group.selectedIndexes.value) // Set { 0, 1 }
  ```

### `unselect`

- **Type**
  ```ts
  function unselect(ids: ID | ID[]): void
  ```

- **Details**
  Unselects the given item(s), removing them from the active selection.

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })
  group.select(['apple', 'banana'])

  group.unselect('banana')
  console.log(group.selectedIndexes.value) // Set { 0 }
  ```

### `toggle`

- **Type**
  ```ts
  function toggle(ids: ID | ID[]): void
  ```

- **Details**
  Flips the selection state of the given item(s):

  - If selected, becomes unselected.
  - If unselected, becomes selected.
  - If mixed, becomes selected (resolves indeterminate state positively).

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'apple', value: 'Apple' })

  group.toggle('apple')
  console.log(group.selectedIds.has('apple')) // true

  group.toggle('apple')
  console.log(group.selectedIds.has('apple')) // false
  ```

### `mix`

- **Type**
  ```ts
  function mix(ids: ID | ID[]): void
  ```

- **Details**
  Sets the given item(s) to mixed/indeterminate state. Clears selected state if set.
  Works on disabled items since mixed state is typically computed, not user-driven.

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'parent', value: 'Parent' })

  group.mix('parent')
  console.log(group.mixed('parent')) // true
  console.log(group.mixedIds) // Set { 'parent' }
  ```

### `unmix`

- **Type**
  ```ts
  function unmix(ids: ID | ID[]): void
  ```

- **Details**
  Clears mixed/indeterminate state from the given item(s).

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'parent', value: 'Parent' })

  group.mix('parent')
  group.unmix('parent')
  console.log(group.mixed('parent')) // false
  ```

### `mixed`

- **Type**
  ```ts
  function mixed(id: ID): boolean
  ```

- **Details**
  Returns true if the given item is in mixed/indeterminate state.

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'parent', value: 'Parent' })

  console.log(group.mixed('parent')) // false
  group.mix('parent')
  console.log(group.mixed('parent')) // true
  ```

### `mixedIds`

- **Type**
  ```ts
  Reactive<Set<ID>>
  ```

- **Details**
  A reactive Set containing the IDs of all items currently in mixed/indeterminate state.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B' },
  ])

  group.mix(['a', 'b'])
  console.log(group.mixedIds) // Set { 'a', 'b' }
  ```

### `mixedItems`

- **Type**
  ```ts
  ComputedRef<Set<GroupTicket>>
  ```

- **Details**
  A computed Set containing the ticket objects for all items in mixed state.

- **Example**
  ```ts
  const group = createGroup()
  group.register({ id: 'parent', value: 'Parent' })

  group.mix('parent')
  const items = Array.from(group.mixedItems.value)
  console.log(items[0].value) // 'Parent'
  ```

### Ticket Properties

Each registered ticket has these mixed-related properties:

- **`isMixed`**: `Readonly<Ref<boolean>>` - Reactive property indicating mixed state.
- **`mix()`**: `() => void` - Sets this ticket to mixed state.
- **`unmix()`**: `() => void` - Clears mixed state from this ticket.

```ts
const group = createGroup()
const ticket = group.register({ id: 'item', value: 'Item' })

ticket.mix()
console.log(ticket.isMixed.value) // true

ticket.unmix()
console.log(ticket.isMixed.value) // false
```

### `isNoneSelected`

- **Type**
  ```ts
  ComputedRef<boolean>
  ```

- **Details**
  Returns true when no items are currently selected. Useful for determining if a "select all" checkbox should be unchecked.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B' },
  ])

  console.log(group.isNoneSelected.value) // true

  group.select('a')
  console.log(group.isNoneSelected.value) // false
  ```

### `isAllSelected`

- **Type**
  ```ts
  ComputedRef<boolean>
  ```

- **Details**
  Returns true when all selectable (non-disabled) items are selected. Returns false when the registry is empty or all items are disabled.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B', disabled: true },
  ])

  group.select('a')
  console.log(group.isAllSelected.value) // true (disabled items don't count)
  ```

### `isIndeterminate`

- **Type**
  ```ts
  ComputedRef<boolean>
  ```

- **Details**
  Returns true when some but not all selectable items are selected. This is useful for setting the indeterminate state on a "select all" checkbox.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B' },
    { id: 'c', value: 'C' },
  ])

  group.select('a')
  console.log(group.isIndeterminate.value) // true

  group.selectAll()
  console.log(group.isIndeterminate.value) // false
  ```

### `selectAll`

- **Type**
  ```ts
  function selectAll(): void
  ```

- **Details**
  Selects all selectable (non-disabled) items. Also clears any mixed state on the selected items.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B', disabled: true },
    { id: 'c', value: 'C' },
  ])

  group.selectAll()
  console.log(group.selectedIds.size) // 2 (disabled item excluded)
  console.log(group.isAllSelected.value) // true
  ```

### `unselectAll`

- **Type**
  ```ts
  function unselectAll(): void
  ```

- **Details**
  Clears all selections. When `mandatory` option is set, keeps one item selected.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B' },
  ])

  group.selectAll()
  group.unselectAll()
  console.log(group.isNoneSelected.value) // true
  ```

### `toggleAll`

- **Type**
  ```ts
  function toggleAll(): void
  ```

- **Details**
  Toggles between all selected and none selected. If all items are currently selected, unselects all. Otherwise, selects all.

- **Example**
  ```ts
  const group = createGroup()
  group.onboard([
    { id: 'a', value: 'A' },
    { id: 'b', value: 'B' },
  ])

  group.toggleAll()
  console.log(group.isAllSelected.value) // true

  group.toggleAll()
  console.log(group.isNoneSelected.value) // true
  ```
