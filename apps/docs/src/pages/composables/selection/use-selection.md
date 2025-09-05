---
meta:
  title: useSelection
  description: A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.
  keywords: useSelection, selection, composable, Vue, state management
category: Selection
performance: 0
---

# useSelection

A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.

<DocsPageFeatures />

## Usage

useSelection extends the functionality of useRegistry to manage selection states for a collection of items. It is reactive, supports both single and multi-select patterns, and provides helper properties for working with selected IDs, values, and items.

```ts
import { useSelection } from '@vuetify/v0'

const selection = useSelection()

selection.select({ id: 'apple', value: 'Apple' })
selection.select({ id: 'banana', value: 'Banana' })

console.log(selection.selectedIds) // ['apple', 'banana']
console.log(selection.selectedValues) // ['Apple', 'Banana']
console.log(selection.has('apple')) // true
```

## API

- **Type**

  ```ts
  export interface SelectionTicket extends RegistryTicket {
    disabled: boolean
    isSelected: Readonly<Ref<boolean, boolean>>
    select: () => void
    unselect: () => void
    toggle: () => void
  }

  export interface SelectionContext<Z extends SelectionTicket> extends RegistryContext<Z> {
    selectedIds: Reactive<Set<ID>>
    selectedItems: ComputedRef<Set<Z>>
    selectedValues: ComputedRef<Set<unknown>>
    reset: () => void
    select: (id: ID) => void
    unselect: (id: ID) => void
    toggle: (id: ID) => void
    selected: (id: ID) => boolean
    mandate: () => void
  }

  export interface SelectionOptions extends RegistryOptions {
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```
- **Details**

  - `selectedIds`: Reactive set of all currently selected IDs.
  - `selectedItems`: Computed set of all selected items (full objects).
  - `selectedValues`: Computed set of the value fields from all selected items.
  - `reset()`: Clears all selected IDs and reindexes the registry.
  - `select(id)`: Marks the given ID as selected.
  - `unselect(id)`: Marks the given ID as unselected.
  - `toggle(id)`: Switches the given ID between selected and unselected.
  - `selected(id)`: Checks if the given ID is currently selected.
  - `mandate()`: Enforces selection rules when mandatory mode is active.

- **Options**

  - `enroll`: If `true`, new items are auto-selected when registered (unless disabled).
  - `mandatory `: If `true` or `force`, at least one item must always remain selected.

### `selectedIds`

- **Type**
  ```ts
  ID[]
  ```

- **Details**
  An array of IDs for all currently selected items.
  Automatically updates when selection changes.

- **Example**
  ```ts
  selection.select('apple')
  console.log(selection.selectedIds) // ['apple']
  ```

### `selectedItems`

- **Type**
  ```ts
  Z[]
  ```

- **Details**
  An array containing the full item objects for all selected items.

- **Example**
  ```ts
  selection.select({ id: 'apple', value: 'Apple' })
  console.log(selection.selectedItems)
  // [{ id: 'apple', value: 'Apple', selected: true }]
  ```

### `selectedValues`

- **Type**
  ```ts
  unknown[]
  ```

- **Details**
  An array of only the value fields from each selected item.

- **Example**
  ```ts
  selection.select({ id: 'apple', value: 'Apple' })
  console.log(selection.selectedValues) // ['Apple']
  ```

### `reset`

- **Type**
  ```ts
  function reset(): void
  ```

- **Details**
  Clears all selections and resets the selection state.

- **Example**
  ```ts
  selection.select('apple')
  selection.reset()
  console.log(selection.selectedIds) // []
  ```

### `select`

- **Type**
  ```ts
  function select(id: ID | Partial<Z>): void
  ```

- **Details**
  Selects the given ID or item. Adds it to the registry if it doesn’t already exist.

- **Example**
  ```ts
  selection.select('apple')
  console.log(selection.has('apple')) // true
  ```

### `unselect`

- **Type**
  ```ts
  function unselect(id: ID): void
  ```

- **Details**
  Removes the given ID from the selection list.

- **Example**
  ```ts
  selection.select('apple')
  selection.unselect('apple')
  console.log(selection.has('apple')) // false
  ```

### `toggle`

- **Type**
  ```ts
  function toggle(id: ID): void
  ```

- **Details**
  Toggles the selection state of the given ID:
    - If selected, it becomes unselected.
    - If unselected, it becomes selected.

- **Example**
  ```ts
  selection.toggle('apple') // selects apple
  selection.toggle('apple') // unselects apple
  ```

### `selected`

- **Type**
  ```ts
  function selected(id: ID): boolean
  ```

- **Details**
  Returns whether the provided ID is currently in the selected set.

- **Example**
  ```ts
  selection.select('apple')
  console.log(selection.selected('apple')) // true
  console.log(selection.selected('banana')) // false
  ```

### `mandate`

- **Type**
  ```ts
  function mandate(): void
  ```

- **Details**
  Enforces the mandatory selection rule when mandatory mode is active.
  If no items are currently selected, it will automatically select the first available (non-disabled) item in the registry.
  If at least one item is already selected, it does nothing.
  This function does not take an id and is typically used internally to ensure that the selection state always meets the mandatory rule.

- **Example**
  ```ts
  // Suppose mandatory mode is enabled
  selection.unselect('apple')
  selection.unselect('banana')

  // Now no items are selected, so mandate() will pick one automatically
  selection.mandate()

  console.log(selection.selectedIds) // e.g., ['apple'] if apple was the first available
  ```
