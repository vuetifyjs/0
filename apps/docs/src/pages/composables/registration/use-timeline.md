---
title: useTimeline Composable
meta:
- name: description
  content: A bounded undo/redo system built on useRegistry, managing a fixed-size
    timeline of items with overflow handling.
- name: keywords
  content: useTimeline, timeline, undo, redo, history, registry, composable, Vue,
    state management
features:
  category: Composable
  label: 'E: useTimeline'
  github: /composables/useTimeline/
---

# useTimeline

A bounded undo/redo system that manages a fixed-size timeline of registered items with automatic overflow handling and history management.

<DocsPageFeatures :frontmatter />

## Usage

The `useTimeline` composable extends `useRegistry` to provide undo/redo functionality with a bounded history. When the timeline reaches its size limit, older items are moved to an overflow buffer, allowing you to undo back to them while maintaining a fixed active timeline size.

```ts
import { useTimeline } from '@vuetify/v0'

const timeline = useTimeline({ size: 10 })

// Register actions
timeline.register({ id: 'action-1', value: 'Created document' })
timeline.register({ id: 'action-2', value: 'Added title' })
timeline.register({ id: 'action-3', value: 'Added paragraph' })

console.log(timeline.size) // 3

// Undo the last action
timeline.undo()
console.log(timeline.size) // 2

// Redo the undone action
timeline.redo()
console.log(timeline.size) // 3
```

## API


| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | Base registry system that useTimeline extends |
| [useProxyRegistry](/composables/registration/use-proxy-registry) | Reactive registry wrapper |
- **Type**

  ```ts
  interface TimelineTicket extends RegistryTicket {}

  interface TimelineContext<Z extends TimelineTicket> extends RegistryContext<Z> {
    undo: () => Z | undefined
    redo: () => Z | undefined
  }

  interface TimelineOptions extends RegistryOptions {
    size?: number
  }
  ```

- **Details**

  - `undo()`: Removes the last registered item and stores it for redo. Returns the undone item or `undefined` if the timeline is empty.
  - `redo()`: Restores the last undone item. Returns the restored item or `undefined` if there's nothing to redo.
  - All methods from `useRegistry` are available (register, unregister, get, etc.)

- **Options**

  - `size`: Maximum number of items in the active timeline (default: `10`). When exceeded, the oldest items are moved to an overflow buffer.
  - `events`: If `true`, enables event emission for registry operations (inherited from `useRegistry`).

### `register`

- **Type**
  ```ts
  function register(item?: Partial<Z>): Z
  ```

- **Details**
  Registers a new item to the timeline. Behavior rules:
  - Clears the redo stack (any undone items are permanently removed)
  - If timeline is at capacity (`size` limit), removes the oldest item and moves it to the overflow buffer
  - The overflow buffer also has a maximum size equal to `size` (FIFO queue)
  - Returns the created ticket

- **Example**
  ```ts
  const timeline = useTimeline({ size: 3 })

  timeline.register({ id: 'step-1', value: 'Initialize' })
  timeline.register({ id: 'step-2', value: 'Configure' })
  timeline.register({ id: 'step-3', value: 'Complete' })

  console.log(timeline.size) // 3

  // This will move 'step-1' to overflow
  timeline.register({ id: 'step-4', value: 'Finalize' })

  console.log(timeline.size) // 3
  console.log(timeline.values().map(t => t.id))
  // ['step-2', 'step-3', 'step-4']
  ```

### `undo`

- **Type**
  ```ts
  function undo(): Z | undefined
  ```

- **Details**
  Removes the last registered item from the timeline and stores it in the redo stack. If there are items in the overflow buffer, the most recent overflow item is restored to the beginning of the timeline, maintaining the size limit.

  The operation:
  1. Gets the last item in the timeline
  2. Removes it and adds it to the redo stack
  3. If overflow buffer has items, restores the most recent one
  4. Reindexes the timeline
  5. Returns the undone item

- **Example**
  ```ts
  const timeline = useTimeline({ size: 3 })

  timeline.register({ id: 'a', value: 'Action A' })
  timeline.register({ id: 'b', value: 'Action B' })
  timeline.register({ id: 'c', value: 'Action C' })

  const undone = timeline.undo()
  console.log(undone.id) // 'c'
  console.log(timeline.size) // 2
  console.log(timeline.values().map(t => t.id)) // ['a', 'b']
  ```

### `redo`

- **Type**
  ```ts
  function redo(): Z | undefined
  ```

- **Details**
  Restores the last undone item back to the timeline. Returns `undefined` if there's nothing to redo.

  Note: The redo stack is cleared when a new item is registered after an undo, implementing standard undo/redo behavior.

- **Example**
  ```ts
  const timeline = useTimeline({ size: 3 })

  timeline.register({ id: 'a', value: 'Action A' })
  timeline.register({ id: 'b', value: 'Action B' })

  timeline.undo()
  console.log(timeline.size) // 1

  const redone = timeline.redo()
  console.log(redone.id) // 'b'
  console.log(timeline.size) // 2
  ```
