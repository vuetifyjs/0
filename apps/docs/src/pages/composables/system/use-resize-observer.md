---
meta:
  title: useResizeObserver
  description: Resize Observer API wrapper for detecting element size changes with automatic cleanup.
  keywords: resize observer, size, dimensions, responsive, Vue, composable
category: System
performance: 0
---

# useResizeObserver

A composable for detecting element size changes using the Resize Observer API with automatic cleanup.

<DocsPageFeatures />

## Usage

The `useResizeObserver` composable wraps the Resize Observer API to detect when an element's dimensions change. It's useful for responsive components, charts, virtualized lists, and aspect ratio maintenance.

```vue
<script setup>
import { useResizeObserver } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const container = useTemplateRef('container')
const width = ref(0)
const height = ref(0)

useResizeObserver(container, (entries) => {
  const entry = entries[0]
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height
})
</script>

<template>
  <div ref="container" class="resizable">
    <p>Width: {{ width }}px</p>
    <p>Height: {{ height }}px</p>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Detect element visibility |
| [useMutationObserver](/composables/system/use-mutation-observer) | Observe DOM mutations |
| [useEventListener](/composables/system/use-event-listener) | General event handling |
### `useResizeObserver`

- **Type**
  ```ts
  interface ResizeObserverOptions {
    immediate?: boolean
    box?: 'content-box' | 'border-box'
  }

  function useResizeObserver(
    target: Ref<Element | undefined>,
    callback: (entries: ResizeObserverEntry[]) => void,
    options?: ResizeObserverOptions
  ): {
    isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Details**

  Observes changes to an element's dimensions. Automatically handles cleanup on component unmount.

- **Parameters**

  - `target`: Ref to the element to observe
  - `callback`: Function called when element size changes
  - `options`:
    - `immediate`: Trigger callback immediately with current size (default: false)
    - `box`: Which box model to observe - 'content-box' or 'border-box' (default: 'content-box')

- **Returns**

  - `isPaused`: Whether observation is paused
  - `pause()`: Pause observation
  - `resume()`: Resume observation
  - `stop()`: Stop observation permanently

- **Example**
  ```ts
  const chart = useTemplateRef('chart')

  const { pause, resume } = useResizeObserver(
    chart,
    ([entry]) => {
      const { width, height } = entry.contentRect
      updateChartDimensions(width, height)
    },
    {
      immediate: true,
      box: 'border-box'
    }
  )

  // Pause/resume as needed
  pause()
  resume()
  ```

### `useElementSize`

- **Type**
  ```ts
  function useElementSize(
    target: Ref<Element | undefined>,
    options?: ResizeObserverOptions
  ): {
    width: Readonly<Ref<number>>
    height: Readonly<Ref<number>>
    isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Details**

  Convenience function for tracking element dimensions reactively without a callback.

- **Returns**

  - `width`: Current width of the element in pixels
  - `height`: Current height of the element in pixels
  - `isPaused`: Whether observation is paused
  - `pause()`: Pause observation
  - `resume()`: Resume observation
  - `stop()`: Stop observation permanently

- **Example**
  ```ts
  const container = useTemplateRef('container')
  const { width, height } = useElementSize(container, {
    immediate: true
  })

  // Use width/height reactively
  const aspectRatio = computed(() => width.value / height.value)
  ```
