---
meta:
  title: useProxyModel
  description: Creates a proxy model for two-way binding with a selection context.
  keywords: useProxyModel, proxy, model, two-way binding, selection, composable, Vue
category: Registration
performance: 0
---

# useProxyModel

The `useProxyModel` composable creates a proxy model for two-way binding with various selection contexts (e.g., `SelectionContext`, `GroupContext`, `SingleContext`, `StepContext`). It allows you to synchronize a local `ref` or `shallowRef` with the state of a selection registry, providing a convenient way to manage selected items.

## API

### `useProxyModel(registry, initial?, options?, _transformIn?, _transformOut?)`

* **Type**
    
  ```ts
  export interface ProxyModelOptions {
    deep?: boolean
  }

  export function useProxyModel<Z extends SelectionTicket> (
    registry: SelectionContext<Z>,
    initial?: Z | Z[],
    options?: ProxyModelOptions,
    _transformIn?: (val: Z[] | Z) => Z[],
    _transformOut?: (val: Z[]) => Z | Z[],
  ): ComputedRef<Z | Z[] | undefined>
  ```
    
* **Details**
    
  - `registry`: The selection context (e.g., from `useSelection`, `useGroup`, `useSingle`, `useStep`) that this proxy model will synchronize with.
  - `initial?`: Optional initial value for the proxy model. Can be a single `SelectionTicket` or an array of `SelectionTicket`s. If provided, the proxy model will initialize the registry with these values.
  - `options?`: Optional configuration object:
      - `deep?: boolean`: If `true`, the internal model will use `ref` for deep reactivity; otherwise, it uses `shallowRef`.
  - `_transformIn?`: An optional function to transform the incoming value from the model into the format expected by the registry (an array of `SelectionTicket`s).
  - `_transformOut?`: An optional function to transform the outgoing value from the registry into the format expected by the model.

  Returns a `ComputedRef` that represents the two-way bound model. Changes to this computed ref will update the `registry`, and changes in the `registry` will update this computed ref.

## Examples

### Basic Usage

```html
<template>
  <div>
    <h3>Select Items:</h3>
    <div v-for="item in availableItems" :key="item.id">
      <input
        type="checkbox"
        :value="item.id"
        v-model="selectedModel"
      />
      {{ item.name }}
    </div>
    <p>Selected IDs (from model): {{ selectedModel.map(i => i.id).join(", ") }}</p>
    <p>Selected IDs (from registry): {{ Array.from(selection.selectedIds.value).join(", ") }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useSelection } from '@vuetify/v0/composables/useSelection'
  import { useProxyModel } from '@vuetify/v0/composables/useProxyModel'

  interface MyItem {
    id: string;
    name: string;
  }

  const availableItems = ref<MyItem[]>([
    { id: 'a', name: 'Item A' },
    { id: 'b', name: 'Item B' },
    { id: 'c', name: 'Item C' },
  ])

  const selection = useSelection<MyItem>()

  // Initialize with 'b' selected
  const selectedModel = useProxyModel(selection, [{ id: 'b', name: 'Item B' }])

  // Manually register items with the selection registry
  // In a real app, these might be registered by child components
  availableItems.value.forEach(item => selection.register(item))
</script>
```

### Using `useProxyModel` with `useSingle`

```html
<template>
  <div>
    <h3>Select a Single Item:</h3>
    <div v-for="item in availableItems" :key="item.id">
      <input
        type="radio"
        :value="item.id"
        v-model="selectedSingleModel"
      />
      {{ item.name }}
    </div>
    <p>Selected Item (from model): {{ selectedSingleModel?.name || 'None' }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useSingle } from '@vuetify/v0/composables/useSingle'
  import { useProxyModel } from '@vuetify/v0/composables/useProxyModel'

  interface MyItem {
    id: string;
    name: string;
  }

  const availableItems = ref<MyItem[]>([
    { id: 'x', name: 'Option X' },
    { id: 'y', name: 'Option Y' },
    { id: 'z', name: 'Option Z' },
  ])

  const singleSelection = useSingle<MyItem>()

  // Initialize with 'y' selected
  const selectedSingleModel = useProxyModel(singleSelection, { id: 'y', name: 'Option Y' })

  // Register items with the single selection registry
  availableItems.value.forEach(item => singleSelection.register(item))
</script>
```


