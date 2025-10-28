---
meta:
  title: useIntersectionObserver
  description: Intersection Observer API wrapper for detecting element visibility changes with automatic cleanup.
  keywords: intersection observer, visibility, viewport, lazy loading, scroll, Vue, composable
features:
  category: Composable
  label: 'E: useIntersectionObserver'
  github: /composables/useIntersectionObserver/
---

# useIntersectionObserver

A composable for detecting when elements enter or leave the viewport using the Intersection Observer API with automatic cleanup.

<DocsPageFeatures :frontmatter />

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

## Lifecycle & Cleanup

### Automatic Cleanup

`useIntersectionObserver` automatically disconnects the observer when:
- The component unmounts
- The Vue effect scope is disposed
- You call the returned `stop()` function

**Implementation:**
```ts
// Uses Vue's onScopeDispose internally
onScopeDispose(() => observer.disconnect())
```

This prevents memory leaks by ensuring observers don't continue running after the component is destroyed.

### Manual Control

The composable returns control functions for fine-grained lifecycle management:

```ts
const { isIntersecting, pause, resume, stop } = useIntersectionObserver(
  element,
  callback
)

// Temporarily pause observation (keeps observer alive)
pause()

// Resume observation
resume()

// Permanently stop and disconnect observer
stop()
```

**Difference between pause and stop:**
- **`pause()`**: Temporarily stops observing, can be resumed with `resume()`
- **`stop()`**: Permanently disconnects the observer, cannot be restarted

### Reactive Target

The target element can be reactive. When the target ref changes, the observer automatically re-attaches:

```ts
const element = ref<HTMLElement | null>(null)

useIntersectionObserver(element, callback)

// Later - observer automatically reconnects to new element
element.value = document.querySelector('.new-target')
```

### Template Refs

Works seamlessly with Vue's template refs:

```vue
<script setup>
import { useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vuetify/v0'

const section = useTemplateRef('section')

const { isIntersecting } = useIntersectionObserver(
  section,
  ([entry]) => {
    console.log('Section visibility:', entry.isIntersecting)
  }
)
</script>

<template>
  <section ref="section">
    <p v-if="isIntersecting">Now visible!</p>
  </section>
</template>
```

### Usage Outside Components

If called outside a component setup function:
- **No automatic cleanup** (no active effect scope)
- **Must manually call** `stop()` to prevent memory leaks
- Consider wrapping in `effectScope()`:

```ts
import { effectScope } from 'vue'

const scope = effectScope()

scope.run(() => {
  useIntersectionObserver(element, callback)
})

// Later, cleanup all observers in the scope
scope.stop()
```

### SSR Considerations

`IntersectionObserver` is a browser-only API. The composable checks for browser environment internally:

```ts
// Safe to call during SSR - will not throw
const { isIntersecting } = useIntersectionObserver(element, callback)
// isIntersecting.value will be false in SSR
```

### Performance Tips

**Use appropriate thresholds:**
```ts
// Trigger once when element appears
useIntersectionObserver(element, callback, { threshold: 0 })

// Trigger at multiple visibility levels
useIntersectionObserver(element, callback, { threshold: [0, 0.25, 0.5, 0.75, 1] })
```

**Use rootMargin for early loading:**
```ts
// Start loading 200px before element enters viewport
useIntersectionObserver(element, callback, {
  rootMargin: '200px'
})
```

**Pause when not needed:**
```ts
const { pause, resume } = useIntersectionObserver(element, callback)

// Pause during heavy operations
pause()
performHeavyWork()
resume()
```
