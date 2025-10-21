---
meta:
  title: useKeydown
  description: A composable for handling keyboard events with automatic cleanup and customizable behavior.
  keywords: useKeydown, keyboard, events, keydown, composable, Vue
category: System
performance: 0
---

# useKeydown

A composable for handling keyboard events with automatic cleanup and customizable behavior.

<DocsPageFeatures />

## Usage

The `useKeydown` composable registers keyboard event handlers on the document with automatic cleanup when the component is unmounted. It supports multiple key handlers, preventDefault, and stopPropagation options.

```vue
<script setup>
import { useKeydown } from '@vuetify/v0'
import { ref } from 'vue'

const modalOpen = ref(false)
const searchQuery = ref('')

// Handle Escape key to close modal
useKeydown({
  key: 'Escape',
  handler: () => {
    modalOpen.value = false
  },
  preventDefault: true
})

// Handle Ctrl+K for search
useKeydown({
  key: 'k',
  handler: (event) => {
    if (event.ctrlKey || event.metaKey) {
      modalOpen.value = true
      searchQuery.value = ''
    }
  },
  preventDefault: true
})

// Handle Arrow keys for navigation
useKeydown([
  {
    key: 'ArrowUp',
    handler: () => navigatePrevious(),
    preventDefault: true
  },
  {
    key: 'ArrowDown',
    handler: () => navigateNext(),
    preventDefault: true
  }
])
</script>

<template>
  <div>
    <p>Press Escape to close, Ctrl+K to search</p>
    <div v-if="modalOpen">Modal is open</div>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useEventListener](/composables/system/use-event-listener) | General DOM event handling |
| [useDocumentEventListener](/composables/system/use-event-listener) | Document event listeners |
| [useWindowEventListener](/composables/system/use-event-listener) | Window event listeners |
### `useKeydown`

- **Type**
  ```ts
  interface KeyHandler {
    key: string
    handler: (event: KeyboardEvent) => void
    preventDefault?: boolean
    stopPropagation?: boolean
  }

  function useKeydown(
    handlers: KeyHandler | KeyHandler[]
  ): {
    startListening: () => void
    stopListening: () => void
  }
  ```

- **Details**

  Registers one or more keyboard event handlers on the document. Automatically starts listening on component mount and stops on unmount.

- **Parameters**

  - `handlers`: Single KeyHandler object or array of KeyHandler objects
    - `key`: The key to listen for (e.g., 'Enter', 'Escape', 'ArrowUp', 'a', 'F1')
    - `handler`: Function to execute when the key is pressed
    - `preventDefault`: Whether to call `preventDefault()` on the event (default: false)
    - `stopPropagation`: Whether to call `stopPropagation()` on the event (default: false)

- **Returns**

  - `startListening()`: Manually start listening for keyboard events
  - `stopListening()`: Manually stop listening for keyboard events

- **Example**
  ```ts
  const { startListening, stopListening } = useKeydown({
    key: 'Enter',
    handler: (event) => {
      console.log('Enter pressed!', event)
    },
    preventDefault: true
  })

  // Manually control listening
  stopListening()
  startListening()
  ```
