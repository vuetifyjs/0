---
meta:
  title: useSelection
  description: Creates a selection context for managing collections of selectable items.
  keywords: useSelection, selection, composable, Vue, item management
category: Selection
performance: 0
---

# useSelection

The `useSelection` composable creates a selection context for managing collections of selectable items. This function extends the registry functionality provided by `useRegistry` with selection state management, allowing you to track which items are currently selected.

## API

### `SelectionTicket`

```ts
export interface SelectionTicket extends RegistryTicket {
  disabled: boolean
  isActive: Readonly<Ref<boolean, boolean>>
  toggle: () => void
}
```

Extends `RegistryTicket` with properties for selection state:
- `disabled`: A boolean indicating if the item is disabled and cannot be selected.
- `isActive`: A readonly `Ref` indicating whether the item is currently selected.
- `toggle`: A function to toggle the selection state of the item.

### `SelectionContext`

```ts
export interface SelectionContext<Z extends SelectionTicket> extends RegistryContext<Z> {
  selectedIds: Reactive<Set<ID>>
  selectedItems: ComputedRef<Set<Z>>
  selectedValues: ComputedRef<Set<unknown>>
  reset: () => void
  select: (id: ID) => void
  mandate: () => void
}
```

Extends `RegistryContext` with properties and methods for managing selections:
- `selectedIds`: A reactive `Set` containing the IDs of all currently selected items.
- `selectedItems`: A computed `Set` containing the full `SelectionTicket` objects of selected items.
- `selectedValues`: A computed `Set` containing the `value` properties of selected items.
- `reset()`: Clears all selected IDs and reindexes the registry.
- `select(id: ID)`: Toggles the selection state of the item with the given `id`.
- `mandate()`: Ensures that at least one item is selected if `mandatory` option is enabled.

### `useSelection(options?)`

* **Type**
    
  ```ts
  export interface SelectionOptions extends RegistryOptions {
    enroll?: boolean
    mandatory?: boolean | 'force'
  }

  export function useSelection<
    Z extends SelectionTicket = SelectionTicket,
    E extends SelectionContext<Z> = SelectionContext<Z>,
  > (options?: SelectionOptions): E
  ```
    
* **Details**
    
  - `options`: Optional configuration for selection behavior. Extends `RegistryOptions`.
      - `enroll?: boolean`: If `true`, newly registered items are automatically selected if not disabled. Defaults to `false`.
      - `mandatory?: boolean | 'force'`: If `true`, at least one item must always be selected. If `'force'`, it ensures the first item is selected if nothing else is.

  Returns a `SelectionContext` object with properties and methods for managing selections.

## Examples

### Basic Usage

```html
<template>
  <div>
    <h3>Selectable Items:</h3>
    <div v-for="item in items" :key="item.id">
      <input type="checkbox" :checked="item.isActive.value" @change="item.toggle()" :disabled="item.disabled" />
      {{ item.value }} (ID: {{ item.id }})
    </div>
    <p>Selected IDs: {{ Array.from(selection.selectedIds).join(", ") }}</p>
    <p>Selected Values: {{ Array.from(selection.selectedValues).join(", ") }}</p>
    <button @click="selection.reset()">Reset Selection</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useSelection } from '@vuetify/v0/composables/useSelection'

  const items = ref([
    { id: 'item-1', value: 'Apple', disabled: false },
    { id: 'item-2', value: 'Banana', disabled: false },
    { id: 'item-3', value: 'Cherry', disabled: true }, // Disabled item
    { id: 'item-4', value: 'Date', disabled: false },
  ])

  const selection = useSelection()

  onMounted(() => {
    // Register items with the selection registry
    items.value.forEach(item => selection.register(item))
  })
</script>
```

### Using `enroll` and `mandatory` options

```html
<template>
  <div>
    <h3>Mandatory Selection:</h3>
    <div v-for="item in mandatoryItems" :key="item.id">
      <input type="checkbox" :checked="item.isActive.value" @change="item.toggle()" />
      {{ item.value }}
    </div>
    <p>Selected IDs: {{ Array.from(mandatorySelection.selectedIds).join(", ") }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useSelection } from '@vuetify/v0/composables/useSelection'

  const mandatoryItems = ref([
    { id: 'opt-a', value: 'Option A' },
    { id: 'opt-b', value: 'Option B' },
    { id: 'opt-c', value: 'Option C' },
  ])

  // 'enroll: true' will select all items by default
  // 'mandatory: true' ensures at least one item is always selected
  const mandatorySelection = useSelection({
    enroll: true,
    mandatory: true,
  })

  onMounted(() => {
    mandatoryItems.value.forEach(item => mandatorySelection.register(item))
  })
</script>
```


