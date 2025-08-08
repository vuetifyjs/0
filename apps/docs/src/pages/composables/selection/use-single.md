---
meta:
  title: useSingle
  description: A composable for managing single-item selection in a collection, extending useSelection with single-selection constraints.
  keywords: useSingle, single selection, composable, Vue, state management
category: Selection
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useSingle

A wrapper around `useGroup` that provides a simplified API for single-selection scenarios with singular selection properties and streamlined selection methods.

<Mermaid code="
flowchart TD
createContext --> useRegistrar
useRegistrar --> useGroup
useGroup --> useSingle
" />

## Usage

The `useSingle` composable is used when you have a **collection of items** but want to allow **only one** to be selected at any time.

```ts
import { useSingle } from '@vuetify/v0'

const single = useSingle()

single.select({ id: 'apple', value: 'Apple' })
console.log(single.selectedId) // 'apple'
console.log(single.selectedValue) // 'Apple'

single.select({ id: 'banana', value: 'Banana' })
console.log(single.selectedId) // 'banana' (replaces apple)
```

## API

- **Type**

  ```ts
  export interface SingleTicket extends SelectionTicket {}

  export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
    selectedId: ComputedRef<ID | undefined>
    selectedIndex: ComputedRef<number>
    selectedItem: ComputedRef<Z | undefined>
    selectedValue: ComputedRef<unknown>
  }

  export interface SingleOptions extends SelectionOptions {}
  ```
- **Details**

  - `selectedId`: The ID of the currently selected item (or undefined if none).
  - `selectedIndex`: The index position of the selected item in the collection (-1 if none).
  - `selectedItem`: The full object of the selected item (or undefined if none).
  - `selectedValue`: The value property of the selected item (or undefined if none).

### `selectedId`

- **Type**
  ```ts
  ID | undefined
  ```

- **Details**
  Returns the ID of the currently selected item. undefined if no item is selected.

- **Example**
  ```ts
  single.select('apple')
  console.log(single.selectedId) // 'apple'
  ```

### `selectedIndex`

- **Type**
  ```ts
  number
  ```

- **Details**
  The zero-based index of the selected item in the collection. Returns -1 if no item is selected.

- **Example**
  ```ts
  single.select('apple')
  console.log(single.selectedIndex) // 0 (if apple is first in collection)

### `selectedItem`

- **Type**
  ```ts
  Z | undefined
  ```

- **Details**
  The full object for the selected item, including all properties from the ticket.

- **Example**
  ```ts
  single.select({ id: 'apple', value: 'Apple' })
  console.log(single.selectedItem)
  // { id: 'apple', value: 'Apple', selected: true, ... }
  ```

### `selectedValue`

- **Type**
  ```ts
  unknown
  ```

- **Details**
  Returns only the value property of the selected item.

- **Example**
  ```ts
  single.select({ id: 'apple', value: 'Apple' })
  console.log(single.selectedValue) // 'Apple'
  ```
