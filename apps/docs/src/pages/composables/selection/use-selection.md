---
title: useSelection Composable
meta:
- name: description
  content: A composable for managing the selection of items in a collection with automatic
    indexing and lifecycle management.
- name: keywords
  content: useSelection, selection, composable, Vue, state management
features:
  category: Composable
  label: 'E: useSelection'
  github: /composables/useSelection/
---

# useSelection

A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.

<DocsPageFeatures :frontmatter />

## Usage

useSelection extends the functionality of useRegistry to manage selection states for a collection of items. It is reactive, supports both single and multi-select patterns, and provides helper properties for working with selected IDs, values, and items.

```ts
import { useSelection } from '@vuetify/v0'

const selection = useSelection()

selection.register({ id: 'apple', value: 'Apple' })
selection.register({ id: 'banana', value: 'Banana' })

selection.select('apple')
selection.select('banana')

console.log(selection.selectedIds) // Set(2) { 'apple', 'banana' }
console.log(selection.selectedValues) // ComputedRef<Set> { value: Set(2) { 'Apple', 'Banana' } }
console.log(selection.has('apple')) // true
```

## API


| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | Base registry system that useSelection extends |
| [useSingle](/composables/selection/use-single) | Single-selection variant |
| [useGroup](/composables/selection/use-group) | Multi-selection variant with batch operations |
| [useStep](/composables/selection/use-step) | Navigation through items based on useSingle |
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
  Reactive<Set<ID>>
  ```

- **Details**
  A reactive Set containing the IDs of all currently selected items.
  Automatically updates when selection changes.

- **Example**
  ```ts
  selection.register({ id: 'apple', value: 'Apple' })
  selection.select('apple')
  console.log(selection.selectedIds) // Set(1) { 'apple' }
  console.log(selection.selectedIds.has('apple')) // true
  ```

### `selectedItems`

- **Type**
  ```ts
  ComputedRef<Set<Z>>
  ```

- **Details**
  A computed Set containing the full ticket objects for all selected items.

- **Example**
  ```ts
  selection.register({ id: 'apple', value: 'Apple' })
  selection.select('apple')
  console.log(selection.selectedItems.value)
  // Set(1) { { id: 'apple', value: 'Apple', isSelected: ..., ... } }

  // Iterate over selected items
  for (const item of selection.selectedItems.value) {
    console.log(item.value) // 'Apple'
  }
  ```

### `selectedValues`

- **Type**
  ```ts
  ComputedRef<Set<unknown>>
  ```

- **Details**
  A computed Set containing only the value fields from each selected item.

- **Example**
  ```ts
  selection.register({ id: 'apple', value: 'Apple' })
  selection.register({ id: 'banana', value: 'Banana' })
  selection.select('apple')
  selection.select('banana')
  console.log(selection.selectedValues.value) // Set(2) { 'Apple', 'Banana' }

  // Convert to array if needed
  const valuesArray = Array.from(selection.selectedValues.value)
  console.log(valuesArray) // ['Apple', 'Banana']
  ```

### `reset`

- **Type**
  ```ts
  function reset(): void
  ```

- **Details**
  Clears all selections and resets the selection state. Also clears the registry.

- **Example**
  ```ts
  selection.register({ id: 'apple', value: 'Apple' })
  selection.select('apple')
  selection.reset()
  console.log(selection.selectedIds) // Set(0) {}
  console.log(selection.size) // 0
  ```

### `select`

- **Type**
  ```ts
  function select(id: ID): void
  ```

- **Details**
  Marks the item with the given ID as selected. The item must already be registered in the registry. If the item is disabled or doesn't exist, this method does nothing.

- **Example**
  ```ts
  selection.register({ id: 'apple', value: 'Apple' })
  selection.select('apple')
  console.log(selection.selected('apple')) // true
  console.log(selection.selectedIds.has('apple')) // true
  ```

### `unselect`

- **Type**
  ```ts
  function unselect(id: ID): void
  ```

- **Details**
  Removes the given ID from the selection. If `mandatory` mode is enabled and this is the only selected item, the operation is ignored to maintain at least one selection.

- **Example**
  ```ts
  selection.register({ id: 'apple', value: 'Apple' })
  selection.select('apple')
  console.log(selection.selected('apple')) // true

  selection.unselect('apple')
  console.log(selection.selected('apple')) // false
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
  selection.register({ id: 'apple', value: 'Apple' })

  selection.toggle('apple') // selects apple
  console.log(selection.selected('apple')) // true

  selection.toggle('apple') // unselects apple
  console.log(selection.selected('apple')) // false
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
  selection.register({ id: 'apple', value: 'Apple' })
  selection.register({ id: 'banana', value: 'Banana' })

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
  const selection = useSelection({ mandatory: true })

  selection.register({ id: 'apple', value: 'Apple' })
  selection.register({ id: 'banana', value: 'Banana' })

  selection.select('apple')
  selection.unselect('apple') // Won't work - mandatory mode prevents last item deselection

  console.log(selection.selectedIds) // Set(1) { 'apple' }

  // If somehow empty, mandate() will auto-select first available
  selection.mandate()
  ```
