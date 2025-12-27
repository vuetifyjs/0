---
title: useKeydown - Keyboard Event Handling for Vue 3
meta:
- name: description
  content: Handle keyboard events with automatic cleanup and customizable behavior. Supports preventDefault, stopPropagation, and multiple key handlers for shortcuts.
- name: keywords
  content: useKeydown, keyboard, keydown, shortcuts, hotkeys, Vue 3, composable, event handling
features:
  category: Composable
  label: 'E: useKeydown'
  github: /composables/useKeydown/
related:
  - /composables/system/use-event-listener
---

# useKeydown

A composable for handling keyboard events with automatic cleanup and customizable behavior.

<DocsPageFeatures :frontmatter />

## Usage

The `useKeydown` composable registers keyboard event handlers on the document with automatic cleanup when the component is unmounted. It supports multiple key handlers, preventDefault, and stopPropagation options.

```vue UseKeydown
<script setup lang="ts">
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
    readonly isActive: Readonly<Ref<boolean>>
    start: () => void
    stop: () => void
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

  - `isActive`: Readonly ref indicating whether the listener is currently active
  - `start()`: Manually start listening for keyboard events
  - `stop()`: Manually stop listening for keyboard events

- **Example**
  ```ts
  const { isActive, start, stop } = useKeydown({
    key: 'Enter',
    handler: (event) => {
      console.log('Enter pressed!', event)
    },
    preventDefault: true
  })

  // Manually control listening
  stop()
  start()
  console.log(isActive.value) // true
  ```

<DocsRelated :frontmatter />
