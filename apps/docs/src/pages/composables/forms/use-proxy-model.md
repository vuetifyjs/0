---
meta:
  title: useProxyModel
  description: A composable for creating proxy models that synchronize bidirectionally with selection contexts, enabling seamless v-model integration with selection state.
  keywords: useProxyModel, proxy model, v-model, two-way binding, selection, composable, Vue
features:
  category: Composable
  label: 'E: useProxyModel'
  github: /composables/useProxyModel/
---

# useProxyModel

A composable for creating proxy models that synchronize bidirectionally with selection contexts, enabling seamless v-model integration with selection state.

<DocsPageFeatures :frontmatter />

## Usage

The `useProxyModel` composable creates a computed ref that acts as a two-way proxy between a v-model binding and a selection context. It automatically synchronizes changes in both directions, allowing you to use familiar v-model syntax with selection-based components.

```ts
import { useSelection, useProxyModel } from '@vuetify/v0'

const selection = useSelection({ events: true })
selection.onboard([
  { id: 'apple', value: 'Apple' },
  { id: 'banana', value: 'Banana' },
])

const model = useProxyModel(selection, 'Apple')

console.log(model.value) // 'Apple'
console.log(selection.selectedIds) // Set { 'apple' }
```

## API


| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | Selection system for syncing |
| [useForm](/composables/forms/use-form) | Form validation system |
| [toReactive](/composables/transformers/to-reactive) | Convert MaybeRef to reactive |
### `useProxyModel`

- **Type**

  ```ts
  interface ProxyModelOptions {
    deep?: boolean
  }

  function useProxyModel<Z extends SelectionTicket> (
    registry: SelectionContext<Z>,
    initial?: unknown | unknown[],
    options?: ProxyModelOptions,
    transformIn?: (val: unknown[] | unknown) => unknown[],
    transformOut?: (val: unknown[]) => unknown | unknown[],
  ): ComputedRef<unknown | unknown[]>
  ```

- **Details**

  - `registry`: The selection context to bind to. Must have `events: true` to enable registration event handling.
  - `initial`: Initial value(s) for the model. Can be a single value or an array.
  - `options.deep`: Use deep reactivity for the internal model state. Defaults to `false` (shallow).
  - `transformIn`: Custom function to transform incoming values before storing internally (always as array).
  - `transformOut`: Custom function to transform outgoing values before returning from the computed getter.

  The returned computed ref:
  - **Getting**: Returns the selected value(s) from the registry, transformed via `transformOut`
  - **Setting**: Updates the registry selection to match the new value(s), transformed via `transformIn`
  - **Synchronization**: Watches both the model and registry for changes, keeping them in sync
  - **Auto-selection**: Listens for item registration events and auto-selects if the value matches the current model

- **Options**

  - `deep`: Enable deep reactivity for nested object changes. Defaults to `false`.

### Single vs Array Models

The composable automatically detects whether you're using single-value or multi-value mode based on the `initial` parameter:

- If `initial` is an array, the model operates in **array mode** (multi-select)
- If `initial` is not an array, the model operates in **single mode** (single-select)

In **single mode**:
- Setting a new value clears the previous selection first
- Getting returns the first selected value (not an array)

In **array mode**:
- Setting a new array merges the selections (adds/removes as needed)
- Getting returns an array of all selected values
