---
title: useProxyModel - Bidirectional v-model Binding for Vue 3
meta:
- name: description
  content: Bridge selection context to v-model with bidirectional sync. Supports single value or array modes with custom transform functions for Vue 3 components.
- name: keywords
  content: useProxyModel, v-model, two-way binding, selection, defineModel, composable, Vue 3, bidirectional
features:
  category: Composable
  label: 'E: useProxyModel'
  github: /composables/useProxyModel/
related:
  - /composables/selection/use-selection
  - /composables/selection/use-single
---

# useProxyModel

A composable for syncing refs bidirectionally with selection contexts, enabling seamless v-model integration with selection state.

<DocsPageFeatures :frontmatter />

## Usage

The `useProxyModel` composable syncs an existing ref (like from `defineModel()`) with a selection context bidirectionally. Changes in either direction automatically propagate.

```ts
import { ref } from 'vue'
import { createSelection, useProxyModel } from '@vuetify/v0'

const model = ref<string>()
const selection = createSelection({ events: true })

selection.onboard([
  { id: 'apple', value: 'Apple' },
  { id: 'banana', value: 'Banana' },
])

// Sync model with selection
const stop = useProxyModel(selection, model)

model.value = 'Apple'
console.log(selection.selectedIds) // Set { 'apple' }

selection.select('banana')
console.log(model.value) // 'Banana'
```

## With defineModel

Perfect for Vue components with v-model:

```vue UseProxyModel
<script setup lang="ts">
  import { createSelection, useProxyModel } from '@vuetify/v0'

  const model = defineModel<string>()
  const selection = createSelection({ events: true })

  selection.onboard([
    { id: '1', value: 'Option 1' },
    { id: '2', value: 'Option 2' },
  ])

  useProxyModel(selection, model)
</script>

<template>
  <div>
    <button
      v-for="item in selection.entries.value"
      :key="item[0]"
      @click="selection.toggle(item[0])"
    >
      {{ item[1].value }}
    </button>
  </div>
</template>
```

## API

| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | Selection system for syncing |
| [useForm](/composables/forms/use-form) | Form validation system |

### `useProxyModel`

- **Type**

  ```ts
  interface ProxyModelOptions {
    /** Whether to treat the model as an array (multi-select) */
    multiple?: boolean
    /** Transform function applied when setting model value */
    transformIn?: (val: unknown) => unknown
    /** Transform function applied when getting model value */
    transformOut?: (val: unknown) => unknown
  }

  function useProxyModel<Z extends SelectionTicket> (
    registry: SelectionContext<Z>,
    model: Ref<unknown>,
    options?: ProxyModelOptions,
  ): () => void
  ```

- **Details**

  - `registry`: The selection context to bind to. Must have `events: true` to enable registration event handling.
  - `model`: The ref to sync (from `defineModel()`, `ref()`, or `shallowRef()`).
  - `options.multiple`: Explicitly set array mode (multi-select). If not provided, inferred from `model.value` type.
  - `options.transformIn`: Custom function to transform values when setting the model.
  - `options.transformOut`: Custom function to transform values when reading the model.

  **Returns**: A function to stop the sync (like Vue's `watch()`).

  The composable uses synchronous watchers with pause/resume to:
  - **Model → Registry**: When model changes, updates `selectedIds` via `browse()` lookups
  - **Registry → Model**: When selection changes, updates model with values from `selectedValues`
  - **Late Registration**: Auto-selects items that register after initial sync
  - **Deep Watching**: Arrays are watched deeply for mutations like `push()`, `splice()`, etc.

### Single vs Multiple Modes

The composable supports both single-select and multi-select modes:

**Single mode** (default):
- Setting a new value clears the previous selection first
- Getting returns a single value (not an array)
- Use `options.multiple: false` or provide non-array initial value

**Multiple mode**:
- Setting a new array merges the selections (adds/removes as needed)
- Getting returns an array of all selected values
- Arrays are watched deeply for mutations
- Use `options.multiple: true` or provide array initial value

```ts
// Single mode
const model = ref<string>()
useProxyModel(selection, model)

// Multiple mode
const model = ref<string[]>([])
useProxyModel(selection, model, { multiple: true })
```

## Examples

### Multi-select with Array Mutations

```ts
const model = ref<string[]>([])
useProxyModel(selection, model, { multiple: true })

selection.onboard([
  { id: 'a', value: 'A' },
  { id: 'b', value: 'B' },
])

// Array mutations sync automatically
model.value.push('A')
console.log(selection.selectedIds) // Set { 'a' }

model.value.splice(0, 1, 'B')
console.log(selection.selectedIds) // Set { 'b' }
```

### Transform Functions

```ts
const model = ref<string>()

useProxyModel(selection, model, {
  transformIn: (val) => String(val).toUpperCase(),
  transformOut: (val) => String(val).toLowerCase(),
})

selection.onboard([
  { id: '1', value: 'HELLO' },
])

model.value = 'hello' // Transforms to 'HELLO' before lookup
console.log(selection.selectedIds) // Set { '1' }
console.log(model.value) // 'hello' (transformed output)
```

### Late Registration

```ts
const model = ref<string>('Item 2')
useProxyModel(selection, model)

// Item 2 doesn't exist yet, but will be auto-selected when registered
setTimeout(() => {
  selection.register({ id: '2', value: 'Item 2' })
  console.log(selection.selectedIds) // Set { '2' }
}, 1000)
```

### Manual Cleanup

```ts
const stop = useProxyModel(selection, model)

// Later, stop syncing
stop()

// Changes no longer sync
model.value = 'New Value'
// selection.selectedIds unchanged
```

<DocsRelated :frontmatter />
