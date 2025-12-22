---
title: useResizeObserver - Element Size Detection for Vue 3
meta:
- name: description
  content: Detect element size changes with Resize Observer API. Perfect for responsive components, charts, and virtualized lists with automatic cleanup for Vue 3.
- name: keywords
  content: resize observer, size, dimensions, responsive, width, height, Vue 3, composable
features:
  category: Composable
  label: 'E: useResizeObserver'
  github: /composables/useResizeObserver/
---

# useResizeObserver

A composable for detecting element size changes using the Resize Observer API with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useResizeObserver` composable wraps the Resize Observer API to detect when an element's dimensions change. It's useful for responsive components, charts, virtualized lists, and aspect ratio maintenance.

```vue UseResizeObserver
<script setup lang="ts">
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
    isActive: Readonly<Ref<boolean>>
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

  - `isActive`: Whether the observer is currently created and observing
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
    isActive: Readonly<Ref<boolean>>
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
  - `isActive`: Whether the observer is currently created and observing
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

## Lifecycle & Cleanup

### Automatic Cleanup

`useResizeObserver` automatically disconnects the observer when:
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
const { isActive, isPaused, pause, resume, stop } = useResizeObserver(
  element,
  callback,
  options
)

// Check if observer is active
console.log(isActive.value) // true

// Temporarily pause observation (keeps observer alive)
pause()
console.log(isActive.value) // false

// Resume observation
resume()
console.log(isActive.value) // true

// Permanently stop and disconnect observer
stop()
console.log(isActive.value) // false
```

**State properties:**
- **`isActive`**: True when the observer exists and is observing (false when paused or stopped)
- **`isPaused`**: True when observation is temporarily paused

**Difference between pause and stop:**
- **`pause()`**: Temporarily stops observing, can be resumed with `resume()`
- **`stop()`**: Permanently disconnects the observer, cannot be restarted

### Reactive Target

The target element can be reactive. When the target ref changes, the observer automatically re-attaches:

```ts
const element = ref<HTMLElement | null>(null)

useResizeObserver(element, callback, options)

// Later - observer automatically reconnects to new element
element.value = document.querySelector('.new-target')
```

### Template Refs

Works seamlessly with Vue's template refs:

```vue UseResizeObserver
<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { useResizeObserver } from '@vuetify/v0'

  const panel = useTemplateRef('panel')

  useResizeObserver(
    panel,
    ([entry]) => {
      const { width, height } = entry.contentRect
      console.log('Panel resized:', width, 'x', height)
    }
  )
</script>

<template>
  <div ref="panel" class="resizable-panel">
    <!-- Size changes will be observed -->
  </div>
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
  useResizeObserver(element, callback, options)
})

// Later, cleanup all observers in the scope
scope.stop()
```

### SSR Considerations

`ResizeObserver` is a browser-only API. The composable checks for browser environment internally:

```ts
// Safe to call during SSR - will not throw
const { isActive, isPaused } = useResizeObserver(element, callback, options)
// isActive.value and isPaused.value will be false in SSR

// useElementSize also handles SSR safely
const { width, height, isActive } = useElementSize(element)
// width.value and height.value will be 0 in SSR
// isActive.value will be false in SSR
```

### Performance Tips

**Use debouncing for expensive operations:**
```ts
import { debounce } from 'lodash-es'

const debouncedCallback = debounce((entries: ResizeObserverEntry[]) => {
  const { width, height } = entries[0].contentRect
  expensiveLayoutCalculation(width, height)
}, 150)

useResizeObserver(element, debouncedCallback)
```

**Pause during animations:**
```ts
const { pause, resume } = useResizeObserver(element, callback)

// Pause during CSS animations to avoid callback spam
element.value?.classList.add('animating')
pause()
await animationComplete()
resume()
element.value?.classList.remove('animating')
```

**Choose the right box model:**
```ts
// content-box - excludes padding and border (default)
useResizeObserver(element, callback, { box: 'content-box' })

// border-box - includes padding and border
useResizeObserver(element, callback, { box: 'border-box' })
```

**Batch multiple observations:**
```ts
// Instead of multiple observers
const elements = [el1, el2, el3]
elements.forEach(el => {
  useResizeObserver(el, callback) // Creates 3 observers
})

// Use a single observer with multiple elements
const observer = new ResizeObserver(callback)
elements.forEach(el => observer.observe(el.value))
onScopeDispose(() => observer.disconnect())
```

### Common Use Cases

**Responsive Charts:**
```ts
const chart = useTemplateRef('chart')
const { width, height } = useElementSize(chart, { immediate: true })

watch([width, height], ([w, h]) => {
  chartInstance.resize(w, h)
})
```

**Container Queries Alternative:**
```ts
const container = useTemplateRef('container')
const containerClass = ref('container-sm')

useResizeObserver(container, ([entry]) => {
  const width = entry.contentRect.width
  if (width < 600) containerClass.value = 'container-sm'
  else if (width < 1200) containerClass.value = 'container-md'
  else containerClass.value = 'container-lg'
})
```

**Virtualized Lists:**
```ts
const list = useTemplateRef('list')
const { height } = useElementSize(list)

const visibleItems = computed(() => {
  const itemHeight = 40
  return Math.ceil(height.value / itemHeight)
})
```
