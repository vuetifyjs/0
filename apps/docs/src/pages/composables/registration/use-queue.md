---
title: useQueue Composable
meta:
- name: description
  content: A queue composable for managing time-based collections with automatic timeout-based
    removal, pause/resume functionality, and FIFO ordering.
- name: keywords
  content: useQueue, queue, composable, Vue, timeout, FIFO
features:
  category: Composable
  label: 'E: useQueue'
  github: /composables/useQueue/
related:
- /composables/registration/use-registry
- /composables/registration/use-timeline
---

# useQueue

A queue composable for managing time-based collections with automatic timeout-based removal, pause/resume functionality, and FIFO (First In, First Out) ordering.

<DocsPageFeatures :frontmatter />

## Usage

The `useQueue` composable provides a powerful interface for managing time-based queues. Built on top of `useRegistry`, it automatically manages timeouts for items, ensuring only the first item in the queue is active at any time. When an item expires or is removed, the next item in the queue automatically becomes active.

```ts
import { useQueue } from '@vuetify/v0'

const queue = useQueue()

const item1 = queue.register({ value: 'First' })
const item2 = queue.register({ value: 'Second' })
const item3 = queue.register({ value: 'Third' })

console.log(item1.isPaused) // false (first item is active)
console.log(item2.isPaused) // true (waiting in queue)
console.log(queue.size) // 3
```

## API

| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | Base registry system |

- **Type**

  ```ts
  interface QueueTicket extends RegistryTicket {
    timeout?: number
    isPaused: boolean
    dismiss: () => void
  }

  interface QueueContext<Z extends QueueTicket = QueueTicket> extends RegistryContext<Z> {
    register: (item?: Partial<Z>) => Z
    unregister: (id?: ID) => Z | undefined
    pause: () => Z | undefined
    resume: () => Z | undefined
    clear: () => void
    dispose: () => void
  }

  interface QueueOptions extends RegistryOptions {
    timeout?: number
  }
  ```

- **Details**

  - `timeout`: Timeout in milliseconds. If `undefined`, uses default (3000ms). If `-1`, item persists until manually dismissed.
  - `isPaused`: Whether the timeout is currently paused. First item is not paused, subsequent items are paused until they become first.
  - `dismiss()`: Convenience method equivalent to `queue.unregister(ticket.id)`.
  - `register(item?)`: Registers a new item in the queue. First item starts its timeout immediately, subsequent items are paused.
  - `unregister(id?)`: Removes a ticket from the queue. If no ID provided, removes first ticket.
  - `pause()`: Pauses the timeout of the first ticket in the queue.
  - `resume()`: Resumes the timeout of the first paused ticket.
  - `clear()`: Removes all tickets and clears all timeouts.
  - `dispose()`: Cleans up the queue and removes all listeners.

- **Options**

  - `timeout`: Default timeout in milliseconds for items without explicit timeout. Defaults to `3000`.
  - `events`: Inherited from `RegistryOptions`. If `true`, enables event emission for queue operations.

### `register`

- **Type**
  ```ts
  function register (item?: Partial<Z>): Z
  ```

- **Details**
  Registers a new item in the queue. The first item in the queue starts its timeout immediately, while subsequent items are paused until they become first.

  Behavior rules:
  - If `timeout` is omitted, uses the default timeout from queue options (3000ms)
  - If `timeout` is `-1`, the item persists indefinitely until manually dismissed
  - First item in queue has `isPaused: false` and starts counting down
  - Subsequent items have `isPaused: true` and wait in queue
  - Each ticket receives a `dismiss()` method for convenience

- **Example**
  ```ts
  const queue = useQueue({ timeout: 5000 })

  // Default timeout (5000ms from options)
  const item1 = queue.register({ value: 'First' })
  console.log(item1.isPaused) // false
  console.log(item1.timeout) // 5000

  // Custom timeout
  const item2 = queue.register({ value: 'Second', timeout: 3000 })
  console.log(item2.isPaused) // true (waiting)

  // Persistent item
  const item3 = queue.register({ value: 'Persistent', timeout: -1 })
  console.log(item3.timeout) // -1
  ```

### `unregister`

- **Type**
  ```ts
  function unregister (id?: ID): Z | undefined
  ```

- **Details**
  Removes a ticket from the queue by its ID. If no ID is provided, removes the first ticket. When the first ticket is removed, the next ticket in queue automatically becomes active (unpaused).

- **Example**
  ```ts
  const queue = useQueue()

  const item1 = queue.register({ value: 'First' })
  const item2 = queue.register({ value: 'Second' })
  const item3 = queue.register({ value: 'Third' })

  // Remove specific ticket
  queue.unregister(item3.id)

  // Remove first ticket (item2 becomes active)
  const removed = queue.unregister()
  console.log(removed?.value) // 'First'
  console.log(item2.isPaused) // false (now active)
  ```

### `pause`

- **Type**
  ```ts
  function pause (): Z | undefined
  ```

- **Details**
  Pauses the timeout of the first ticket in the queue. Returns the paused ticket or `undefined` if no pausable ticket exists.

- **Example**
  ```ts
  const queue = useQueue({ timeout: 5000 })

  const item = queue.register({ value: 'Pausable' })
  console.log(item.isPaused) // false

  const paused = queue.pause()
  console.log(paused?.isPaused) // true
  ```

### `resume`

- **Type**
  ```ts
  function resume (): Z | undefined
  ```

- **Details**
  Resumes the timeout of the first paused ticket in the queue. The timeout restarts from its full duration, not from where it was paused.

- **Example**
  ```ts
  const queue = useQueue({ timeout: 5000 })

  const item = queue.register({ value: 'Item' })
  queue.pause()

  // Later...
  const resumed = queue.resume()
  console.log(resumed?.isPaused) // false
  // Timeout will run for another 5000ms (full duration)
  ```

### `clear`

- **Type**
  ```ts
  function clear (): void
  ```

- **Details**
  Removes all tickets from the queue and clears all active timeouts, resetting the queue to an empty state.

- **Example**
  ```ts
  const queue = useQueue()

  queue.register({ value: 'First' })
  queue.register({ value: 'Second' })
  queue.register({ value: 'Third' })

  console.log(queue.size) // 3

  queue.clear()

  console.log(queue.size) // 0
  ```

### `dispose`

- **Type**
  ```ts
  function dispose (): void
  ```

- **Details**
  Cleans up the queue by clearing all tickets, timeouts, and event listeners. Automatically called on scope disposal.

- **Example**
  ```ts
  import { onScopeDispose } from 'vue'
  import { useQueue } from '@vuetify/v0'

  const queue = useQueue()

  queue.register({ value: 'Item' })

  onScopeDispose(() => {
    queue.dispose()
  })
  ```

### `dismiss`

- **Type**
  ```ts
  function dismiss (): void
  ```

- **Details**
  Convenience method available on each ticket to dismiss itself from the queue. Equivalent to calling `queue.unregister(ticket.id)`.

- **Example**
  ```ts
  const queue = useQueue()

  const item = queue.register({ value: 'Dismissable', timeout: -1 })

  // Use the convenience method
  item.dismiss()

  console.log(queue.has(item.id)) // false
  ```

<DocsRelated :frontmatter />
