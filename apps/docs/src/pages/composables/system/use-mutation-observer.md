---
title: useMutationObserver Composable
meta:
- name: description
  content: Mutation Observer API wrapper for detecting DOM changes with automatic
    cleanup.
- name: keywords
  content: mutation observer, DOM, changes, mutations, Vue, composable
features:
  category: Composable
  label: 'E: useMutationObserver'
  github: /composables/useMutationObserver/
---

# useMutationObserver

A composable for detecting DOM changes using the Mutation Observer API with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useMutationObserver` composable wraps the Mutation Observer API to detect changes to the DOM tree. It's useful for monitoring attribute changes, child element modifications, and character data updates.

```vue
<script setup>
import { useMutationObserver } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const mutationCount = ref(0)

useMutationObserver(target, (mutations) => {
  mutationCount.value += mutations.length
  mutations.forEach(mutation => {
    console.log('Type:', mutation.type)
    console.log('Added nodes:', mutation.addedNodes)
    console.log('Removed nodes:', mutation.removedNodes)
  })
}, {
  childList: true,
  attributes: true,
  attributeOldValue: true
})
</script>

<template>
  <div>
    <div ref="target">
      <p>Mutations detected: {{ mutationCount }}</p>
    </div>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Detect element visibility |
| [useResizeObserver](/composables/system/use-resize-observer) | Observe element size changes |
| [useEventListener](/composables/system/use-event-listener) | General event handling |
### `useMutationObserver`

- **Type**
  ```ts
  interface MutationObserverOptions {
    immediate?: boolean
    childList?: boolean
    attributes?: boolean
    characterData?: boolean
    subtree?: boolean
    attributeOldValue?: boolean
    characterDataOldValue?: boolean
    attributeFilter?: string[]
  }

  function useMutationObserver(
    target: Ref<Element | undefined>,
    callback: (mutations: MutationRecord[]) => void,
    options?: MutationObserverOptions
  ): {
    isActive: Readonly<Ref<boolean>>
    isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Details**

  Observes changes to the DOM tree including attributes, child elements, and text content. Automatically handles cleanup on component unmount.

- **Parameters**

  - `target`: Ref to the element to observe
  - `callback`: Function called when mutations occur
  - `options`:
    - `immediate`: Trigger callback immediately (default: false)
    - `childList`: Observe child element additions/removals (default: false)
    - `attributes`: Observe attribute changes (default: false)
    - `characterData`: Observe text content changes (default: false)
    - `subtree`: Observe all descendants, not just direct children (default: false)
    - `attributeOldValue`: Record previous attribute value (default: false)
    - `characterDataOldValue`: Record previous text value (default: false)
    - `attributeFilter`: Array of specific attributes to observe (default: all)

- **Returns**

  - `isActive`: Whether the observer is currently created and observing
  - `isPaused`: Whether observation is paused
  - `pause()`: Pause observation
  - `resume()`: Resume observation
  - `stop()`: Stop observation permanently

- **Example**
  ```ts
  const container = useTemplateRef('container')

  const { pause, resume } = useMutationObserver(
    container,
    (mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          console.log('Attribute changed:', mutation.attributeName)
        } else if (mutation.type === 'childList') {
          console.log('Children changed')
        }
      })
    },
    {
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'data-state'],
      subtree: true
    }
  )

  // Pause/resume as needed
  pause()
  resume()
  ```

## Lifecycle & Cleanup

### Automatic Cleanup

`useMutationObserver` automatically disconnects the observer when:
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
const { isActive, isPaused, pause, resume, stop } = useMutationObserver(
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

useMutationObserver(element, callback, options)

// Later - observer automatically reconnects to new element
element.value = document.querySelector('.new-target')
```

### Template Refs

Works seamlessly with Vue's template refs:

```vue
<script setup>
import { useTemplateRef } from 'vue'
import { useMutationObserver } from '@vuetify/v0'

const content = useTemplateRef('content')

useMutationObserver(
  content,
  (mutations) => {
    console.log('DOM changed:', mutations.length, 'mutations')
  },
  {
    childList: true,
    subtree: true
  }
)
</script>

<template>
  <div ref="content">
    <!-- Mutations will be observed here -->
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
  useMutationObserver(element, callback, options)
})

// Later, cleanup all observers in the scope
scope.stop()
```

### SSR Considerations

`MutationObserver` is a browser-only API. The composable checks for browser environment internally:

```ts
// Safe to call during SSR - will not throw
const { isActive, isPaused } = useMutationObserver(element, callback, options)
// isActive.value and isPaused.value will be false in SSR
```

### Performance Tips

**Observe only what you need:**
```ts
// Instead of observing everything
useMutationObserver(element, callback, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true // Expensive!
})

// Be specific
useMutationObserver(element, callback, {
  attributes: true,
  attributeFilter: ['class', 'style'] // Only these attributes
})
```

**Use subtree sparingly:**
```ts
// Observing subtree on large DOM can be expensive
useMutationObserver(element, callback, {
  subtree: true, // Watches all descendants
  childList: true
})

// Consider observing specific child elements instead
const child = ref(element.value?.querySelector('.specific-child'))
useMutationObserver(child, callback, { childList: true })
```

**Debounce frequent mutations:**
```ts
import { debounce } from 'lodash-es'

const debouncedCallback = debounce((mutations: MutationRecord[]) => {
  console.log('Mutations:', mutations)
}, 100)

useMutationObserver(element, debouncedCallback, {
  childList: true,
  subtree: true
})
```

**Pause during heavy operations:**
```ts
const { pause, resume } = useMutationObserver(element, callback, options)

// Pause during bulk DOM updates
pause()
performBulkDOMUpdates()
resume()
```
