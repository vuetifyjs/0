---
meta:
  title: useSingle
  description: Creates a single selection context for managing collections where only one item can be selected.
  keywords: useSingle, single selection, composable, Vue, item management
category: Selection
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useSingle

A wrapper around `useGroup` that provides a simplified API for single-selection scenarios with singular selection properties and streamlined selection methods.

The `useSingle` composable creates a single selection context for managing collections where only one item can be selected at a time. This function extends the selection functionality provided by `useSelection` with single-selection constraints.


<Mermaid code="
flowchart TD
createContext --> useRegistrar
useRegistrar --> useGroup
useGroup --> useSingle
" />

## API

### `SingleTicket`

```ts
export interface SingleTicket extends SelectionTicket {}
```

Extends `SelectionTicket` and represents an item that can be part of a single selection.

### `SingleContext`

```ts
export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<Z | undefined>
  selectedValue: ComputedRef<unknown>
}
```

Extends `SelectionContext` with properties specific to single selection:
- `selectedId`: A computed property holding the ID of the currently selected item, or `undefined` if none is selected.
- `selectedIndex`: A computed property holding the index of the currently selected item, or `-1` if none is selected.
- `selectedItem`: A computed property holding the full `SingleTicket` object of the currently selected item, or `undefined`.
- `selectedValue`: A computed property holding the `value` of the currently selected item, or `undefined`.

### `useSingle(options?)`

* **Type**
    
  ```ts
  export interface SingleOptions extends SelectionOptions {}

  export function useSingle<
    Z extends SingleTicket = SingleTicket,
    E extends SingleContext<Z> = SingleContext<Z>,
  > (options?: SingleOptions): E
  ```
    
* **Details**
    
  - `options`: Optional configuration for single selection behavior. Extends `SelectionOptions` from `useSelection`.

  Returns a `SingleContext` object with properties and methods for managing a single selection. When `select` is called, it ensures that only the specified item becomes selected, deselecting any previously selected item.

## Examples

### Basic Usage

```html
<template>
  <div>
    <h3>Select a Color:</h3>
    <div v-for="color in colors" :key="color.id">
      <input
        type="radio"
        :id="color.id"
        :value="color.id"
        :checked="color.isActive.value"
        @change="color.toggle()"
      />
      <label :for="color.id">{{ color.value }}</label>
    </div>
    <p>Selected Color ID: {{ singleSelection.selectedId.value || 'None' }}</p>
    <p>Selected Color Value: {{ singleSelection.selectedValue.value || 'None' }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useSingle } from '@vuetify/v0/composables/useSingle'

  const colors = ref([
    { id: 'red', value: 'Red' },
    { id: 'green', value: 'Green' },
    { id: 'blue', value: 'Blue' },
  ])

  const singleSelection = useSingle()

  onMounted(() => {
    colors.value.forEach(color => singleSelection.register(color))
    // Optionally select an initial item
    singleSelection.select('green')
  })
</script>
```

### Using `mandatory` option with `useSingle`

```html
<template>
  <div>
    <h3>Mandatory Single Selection:</h3>
    <div v-for="option in options" :key="option.id">
      <input
        type="radio"
        :id="option.id"
        :value="option.id"
        :checked="option.isActive.value"
        @change="option.toggle()"
      />
      <label :for="option.id">{{ option.value }}</label>
    </div>
    <p>Selected Option: {{ mandatorySingleSelection.selectedValue.value }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useSingle } from '@vuetify/v0/composables/useSingle'

  const options = ref([
    { id: 'opt1', value: 'Option 1' },
    { id: 'opt2', value: 'Option 2' },
    { id: 'opt3', value: 'Option 3' },
  ])

  // 'mandatory: true' ensures one item is always selected
  const mandatorySingleSelection = useSingle({
    mandatory: true,
    enroll: true, // Enroll all items and select the first one by default
  })

  onMounted(() => {
    options.value.forEach(option => mandatorySingleSelection.register(option))
  })
</script>
```


