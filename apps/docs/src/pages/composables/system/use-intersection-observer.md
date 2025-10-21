---
meta:
  title: useIntersectionObserver
  description: Intersection Observer API wrapper for detecting element visibility changes with automatic cleanup.
  keywords: intersection observer, visibility, viewport, lazy loading, scroll, Vue, composable
category: System
performance: 0
---

# useIntersectionObserver

A composable for detecting when elements enter or leave the viewport using the Intersection Observer API with automatic cleanup.

<DocsPageFeatures />

## Usage

The `useIntersectionObserver` composable wraps the Intersection Observer API to detect when elements become visible in the viewport. It's useful for lazy loading images, infinite scroll, entrance animations, and performance optimizations.

```vue
<script setup>
import { useIntersectionObserver } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const isVisible = ref(false)

useIntersectionObserver(target, (entries) => {
  isVisible.value = entries[0].isIntersecting
}, {
  threshold: 0.5, // Trigger when 50% visible
  rootMargin: '0px'
})
</script>

<template>
  <div>
    <div style="height: 100vh">Scroll down to see the element</div>
    <div ref="target" :class="{ visible: isVisible }">
      I'm {{ isVisible ? 'visible' : 'hidden' }}
    </div>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useResizeObserver](/composables/system/use-resize-observer) | Observe element size changes |
| [useMutationObserver](/composables/system/use-mutation-observer) | Observe DOM mutations |
| [useEventListener](/composables/system/use-event-listener) | General event handling |
### `useIntersectionObserver`

- **Type**
  ```ts
  interface IntersectionObserverOptions {
    immediate?: boolean
    root?: Element | null
    rootMargin?: string
    threshold?: number | number[]
  }

  function useIntersectionObserver(
    target: Ref<Element | undefined>,
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverOptions
  ): {
    isIntersecting: Readonly<Ref<boolean>>
    isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Details**

  Observes when an element intersects with the viewport or a specified ancestor element. Automatically handles cleanup on component unmount.

- **Parameters**

  - `target`: Ref to the element to observe
  - `callback`: Function called when intersection changes
  - `options`:
    - `immediate`: Trigger callback immediately with synthetic entry (default: false)
    - `root`: The element used as viewport for checking visibility (default: null - uses viewport)
    - `rootMargin`: Margin around the root, e.g., '10px 20px 30px 40px' (default: '0px')
    - `threshold`: Visibility percentage(s) that trigger the callback, 0-1 or array (default: 0)

- **Returns**

  - `isIntersecting`: Whether the element is currently intersecting
  - `isPaused`: Whether observation is paused
  - `pause()`: Pause observation
  - `resume()`: Resume observation
  - `stop()`: Stop observation permanently

- **Example**
  ```ts
  const element = useTemplateRef('element')

  const { isIntersecting, pause, resume } = useIntersectionObserver(
    element,
    ([entry]) => {
      console.log('Intersection ratio:', entry.intersectionRatio)
    },
    {
      threshold: [0, 0.5, 1], // Trigger at 0%, 50%, and 100%
      rootMargin: '100px' // Start observing 100px before entering
    }
  )
  ```

### `useElementIntersection`

- **Type**
  ```ts
  function useElementIntersection(
    target: Ref<Element | undefined>,
    options?: IntersectionObserverOptions
  ): {
    isIntersecting: Readonly<Ref<boolean>>
    intersectionRatio: Readonly<Ref<number>>
    isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Details**

  Convenience function for tracking element intersection state reactively without a callback.

- **Returns**

  - `isIntersecting`: Whether the element is currently intersecting
  - `intersectionRatio`: How much of the element is visible (0-1)
  - `isPaused`: Whether observation is paused
  - `pause()`: Pause observation
  - `resume()`: Resume observation
  - `stop()`: Stop observation permanently

- **Example**
  ```ts
  const image = useTemplateRef('image')
  const { isIntersecting } = useElementIntersection(image, {
    threshold: 0.1
  })

  // Use isIntersecting in template or watch
  watch(isIntersecting, (visible) => {
    if (visible) loadImage()
  })
  ```
