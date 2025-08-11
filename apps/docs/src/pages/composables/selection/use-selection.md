---
meta:
  title: useSelection
  description: A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.
  keywords: useSelection, selection, composable, Vue, state management
category: Selection
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useSelection

A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.

## Usage

The `useSelection` composable provides a powerful interface for managing the selection of items from a collection. It allows you to register, unregister, and select items efficiently, while maintaining an index for quick access.

```ts
import { useSelection } from '@vuetify/v0'

const selection = useSelection()

const item1 = selection.select('item1')
const item2 = selection.select('item2')

console.log(selection.selectedItems) // ['item1', 'item2']
```

## API

- **Type**

  ```ts
  interface SelectionTicket {
    id: ID
    index: number
    value: unknown
    selected: boolean
  }

  interface SelectionContext<Z extends SelectionTicket = SelectionTicket> {
    collection: Map<ID, Z>
    clear: () => void
    has: (id: ID) => boolean
    keys: () => ID[]
    select: (id: ID) => Z
    deselect: (id: ID) => void
    get: (id: ID) => Z | undefined
    values: () => Z[]
    entries: () => [ID, Z][]
    size: number
  }

  interface SelectionOptions {
    events?: boolean
  }
  ```
- **Details**

  - `collection`: A Map that holds selected items, indexed by their unique IDs.
  - `clear()`: Clears all selected items, resetting the selection state.
  - `has(id: ID)`: Checks if an item with the given ID is currently selected.
  - `keys()`: Returns an array of all selected item IDs.
  - `select(id: ID)`: Marks an item as selected and adds it to the collection.
  - `deselect(id: ID)`: Removes an item from the selection.
  - `get(id: ID)`: Retrieves a selected item by its ID.
  - `values()`: Returns an array of all selected items.
  - `entries()`: Returns an array of entries, each being a tuple of [ID, selected item].
  - `size`: The total number of selected items.

### `select`

- **Type**
  ```ts
  function select (id: ID): Z
  ```

- **Details**
  Marks an item as selected and adds it to the selection collection. Returns the selected item.

- **Example**
  ```ts
  const selection = useSelection()

  const ticket = selection.select('item1')

  console.log(ticket) // { id: 'item1', index: 0, value: 'Item 1', selected: true }
  ```

### `deselect`

- **Type**
  ```ts
  function deselect (id: ID): void
  ```

- **Details**
  Removes an item from the selection collection by its ID.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')
  selection.deselect('item1')

  console.log(selection.has('item1')) // false
  ```

### `clear`

- **Type**
  ```ts
  function clear(): void
  ```

- **Details**
  Clears all selected items, resetting the selection state.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')
  selection.select('item2')

  console.log(selection.size) // 2

  selection.clear()

  console.log(selection.size) // 0
  ```

### `has`

- **Type**
  ```ts
  function has(id: ID): boolean
  ```

- **Details**
  Checks whether an item with the given ID is selected.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')

  console.log(selection.has('item1')) // true
  console.log(selection.has('item2')) // false
  ```

### `keys`

- **Type**
  ```ts
  function keys(): ID[]
  ```

- **Details**
  Returns an array of IDs of all selected items.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')
  selection.select('item2')

  console.log(selection.keys()) // ['item1', 'item2']
  ```

### `values`

- **Type**
  ```ts
  function values(): Z[]
  ```

- **Details**
  Returns an array of all selected items.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')
  selection.select('item2')

  console.log(selection.values()) // [{ id: 'item1', value: 'Item 1' }, { id: 'item2', value: 'Item 2' }]
  ```

### `entries`

- **Type**
  ```ts
  function entries(): [ID, Z][]
  ```

- **Details**
  Returns all selected items as [id, item] pairs.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')
  selection.select('item2')

  for (const [id, item] of selection.entries()) {
    console.log(id, item.value)
  }
  ```

### `get`

- **Type**
  ```ts
  function get(id: ID): Z | undefined
  ```

- **Details**
  Retrieves a selected item by its ID.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')

  const item = selection.get('item1')
  console.log(item) // { id: 'item1', value: 'Item 1', selected: true }
  ```

### `size`

- **Type**
  ```ts
  number
  ```

- **Details**
  Returns the number of selected items in the collection.

- **Example**
  ```ts
  const selection = useSelection()

  selection.select('item1')

  console.log(selection.size) // 1
  ```