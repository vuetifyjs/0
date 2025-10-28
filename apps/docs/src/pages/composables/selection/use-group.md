---
meta:
  title: useGroup
  description: A composable for managing grouped selections of items with support for selecting, unselecting, toggling, and tracking selected indexes.
  keywords: useGroup, selection, group selection, composable, Vue, state management
features:
  category: Composable
  label: 'E: useGroup'
  github: /composables/useGroup/
---

# useGroup

The `useGroup` composable is designed to manage a group of related components, allowing for shared state and behavior across them. This is particularly useful in scenarios where you want to ensure that only one component in the group can be active at a time, such as in radio button groups or tabbed interfaces.

<DocsPageFeatures :frontmatter />

## Usage

The `useGroup` composable manages a group of selectable items, letting you work with both their IDs and their position indexes.
It supports selecting, unselecting, toggling, and reading the indexes of selected items.

```ts
import { useGroup } from '@vuetify/v0'

// Instantiate group
const group = useGroup()

// Register items
group.register({ id: 'apple', value: 'Apple' })
group.register({ id: 'banana', value: 'Banana' })
group.register({ id: 'cherry', value: 'Cherry' })
group.register({ id: 'date', value: 'Date' })

// Select some items
group.select(['apple', 'banana'])
console.log(group.selectedIndexes.value) // [0, 1]

// Toggle an item (banana will become unselected)
group.toggle('banana')
console.log(group.selectedIndexes.value) // [0]

// Unselect apple
group.unselect('apple')
console.log(group.selectedIndexes.value) // []
```

## API


| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | Base selection system that useGroup extends |
| [useSingle](/composables/selection/use-single) | Single-selection variant |
| [useFeatures](/composables/plugins/use-features) | Feature flags system (extends useGroup) |
| [useRegistry](/composables/registration/use-registry) | Base registry system |
- **Type**

  ```ts
  export interface GroupTicket extends SelectionTicket {}

  export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
    selectedIndexes: ComputedRef<number[]>
    select: (id: ID | ID[] | Z | Z[]) => void
    unselect: (id: ID | ID[] | Z | Z[]) => void
    toggle: (id: ID | ID[] | Z | Z[]) => void
  }

  export interface GroupOptions extends SelectionOptions {}
  ```
- **Details**

  - `selectedIndexes`: Computed array of numeric indexes for all currently selected items in the registry.
  - `select(id | ids)`: Marks one or more items as selected.
  - `unselect(id | ids)`: Marks one or more items as unselected.
  - `toggle(id | ids)`: Switches selection state for one or more items.

### `selectedIndexes`

- **Type**
  ```ts
  number[]
  ```

- **Details**
  An array of numeric indexes for all currently selected items.
  Useful when selection state is tied to the order of registered items.

- **Example**
  ```ts
  const group = useGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })
  group.select(['apple', 'banana'])
  console.log(group.selectedIndexes.value) // [0, 1]
  ```

### `select`

- **Type**
  ```ts
  function select(id: ID | ID[] | Z | Z[]): void
  ```

- **Details**
  Selects the given item(s). Accepts single values, arrays, or ticket objects.

- **Example**
  ```ts
  const group = useGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })

  group.select('apple')
  console.log(group.selectedIndexes.value) // [0]

  group.select(['banana'])
  console.log(group.selectedIndexes.value) // [0, 1]
  ```

### `unselect`

- **Type**
  ```ts
  function unselect(id: ID | ID[] | Z | Z[]): void
  ```

- **Details**
  Unselects the given item(s), removing them from the active selection.

- **Example**
  ```ts
  const group = useGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })
  group.select(['apple', 'banana'])
  console.log(group.selectedIndexes.value) // [0, 1]

  group.unselect('banana')
  console.log(group.selectedIndexes.value) // [0]
  ```

### `toggle`

- **Type**
  ```ts
  function toggle(id: ID | ID[] | Z | Z[]): void
  ```

- **Details**
  Flips the selection state of the given item(s):

  - If selected, they become unselected.

  - If unselected, they become selected.

- **Example**
  ```ts
  const group = useGroup()
  group.register({ id: 'apple', value: 'Apple' })
  group.register({ id: 'banana', value: 'Banana' })

  group.select('apple')
  console.log(group.selectedIndexes.value) // [0]

  group.toggle('apple')
  console.log(group.selectedIndexes.value) // []

  group.toggle('banana')
  console.log(group.selectedIndexes.value) // [1]
  ```
