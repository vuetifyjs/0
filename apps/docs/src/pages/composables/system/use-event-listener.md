---
meta:
  title: useEventListener
  description: A composable for handling DOM events with automatic cleanup on component unmount.
  keywords: useEventListener, events, DOM, composable, Vue, event handling
category: System
performance: 0
---

# useEventListener

A composable for handling DOM events with automatic cleanup on component unmount.

<DocsPageFeatures />

## Usage

The `useEventListener` composable attaches event listeners to DOM elements (Window, Document, or HTMLElement) with automatic cleanup when the component is unmounted. It supports reactive targets, multiple events, and multiple handlers.

```vue
<script setup>
import { useEventListener, useWindowEventListener, useDocumentEventListener } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

// Track window dimensions
const windowSize = ref({ width: window.innerWidth, height: window.innerHeight })
useWindowEventListener('resize', () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
})

// Handle keyboard shortcuts
useDocumentEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    console.log('Save shortcut triggered')
  }
})

// Element-specific listener
const button = useTemplateRef('button')
useEventListener(button, 'click', () => {
  console.log('Button clicked!')
})
</script>

<template>
  <div>
    <p>Window: {{ windowSize.width }}x{{ windowSize.height }}</p>
    <button ref="button">Click me</button>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useKeydown](/composables/system/use-keydown) | Specialized keydown event handling |
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Detect element visibility |
| [useMutationObserver](/composables/system/use-mutation-observer) | Observe DOM mutations |
| [useResizeObserver](/composables/system/use-resize-observer) | Observe element size changes |
### `useEventListener`

- **Type**
  ```ts
  function useEventListener(
    target: Window | Document | MaybeRefOrGetter<HTMLElement | EventTarget | null | undefined>,
    event: MaybeRefOrGetter<MaybeArray<string>>,
    listener: MaybeRef<MaybeArray<EventHandler>>,
    options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
  ): CleanupFunction
  ```

- **Details**

  Attaches event listeners to DOM elements with automatic cleanup. The target, event type, and listener can all be reactive values.

- **Parameters**

  - `target`: The target element to attach the listener to (Window, Document, or HTMLElement ref)
  - `event`: Event name(s) to listen for (can be string or array of strings)
  - `listener`: Event handler function(s) (can be single function or array)
  - `options`: Optional event listener options (capture, passive, once, etc.)

- **Returns**

  - `stop`: Function to manually remove the event listener

- **Example**
  ```ts
  const element = useTemplateRef('element')
  const stop = useEventListener(element, 'click', (e) => {
    console.log('Clicked!', e)
  })

  // Manual cleanup if needed
  stop()
  ```

### `useWindowEventListener`

- **Type**
  ```ts
  function useWindowEventListener(
    event: MaybeRefOrGetter<MaybeArray<keyof WindowEventMap>>,
    listener: MaybeRef<MaybeArray<WindowEventHandler>>,
    options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
  ): CleanupFunction
  ```

- **Details**

  Convenience function for attaching event listeners to the window object.

- **Example**
  ```ts
  useWindowEventListener('resize', () => {
    console.log('Window resized')
  })
  ```

### `useDocumentEventListener`

- **Type**
  ```ts
  function useDocumentEventListener(
    event: MaybeRefOrGetter<MaybeArray<keyof DocumentEventMap>>,
    listener: MaybeRef<MaybeArray<DocumentEventHandler>>,
    options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
  ): CleanupFunction
  ```

- **Details**

  Convenience function for attaching event listeners to the document object.

- **Example**
  ```ts
  useDocumentEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  })
  ```
