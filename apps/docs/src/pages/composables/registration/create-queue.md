---
title: createQueue - Time-Based FIFO Collections for Vue 3
meta:
- name: description
  content: A queue composable for managing time-based collections with automatic timeout-based
    removal, pause/resume functionality, and FIFO ordering.
- name: keywords
  content: createQueue, queue, composable, Vue, timeout, FIFO
features:
  category: Composable
  label: 'E: createQueue'
  github: /composables/useQueue/
  level: 3
related:
- /composables/registration/create-registry
- /composables/registration/create-timeline
---

# createQueue

A queue composable for managing time-based collections with automatic timeout-based removal, pause/resume functionality, and FIFO (First In, First Out) ordering.

<DocsPageFeatures :frontmatter />

## Usage

The `createQueue` composable provides a powerful interface for managing time-based queues. Built on top of `createRegistry`, it automatically manages timeouts for items, ensuring only the first item in the queue is active at any time. When an item expires or is removed, the next item in the queue automatically becomes active.

```ts
import { createQueue } from '@vuetify/v0'

const queue = createQueue()

const item1 = queue.register({ value: 'First' })
const item2 = queue.register({ value: 'Second' })
const item3 = queue.register({ value: 'Third' })

console.log(item1.isPaused) // false (first item is active)
console.log(item2.isPaused) // true (waiting in queue)
console.log(queue.size) // 3
```

## Architecture

`createQueue` extends `createRegistry` with FIFO ordering and timeout management:

```mermaid "Queue Hierarchy"
flowchart TD
  createRegistry --> createQueue
  createQueue --> timeout[auto-timeout]
  createQueue --> pause/resume
  createQueue --> first[first item active]
```

<DocsApi name="useQueue" />
