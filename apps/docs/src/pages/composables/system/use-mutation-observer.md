---
meta:
  title: useMutationObserver
  description: Mutation Observer API wrapper for detecting DOM changes with automatic cleanup.
  keywords: mutation observer, DOM, changes, mutations, Vue, composable
category: System
performance: 0
---

# useMutationObserver

A composable for detecting DOM changes using the Mutation Observer API with automatic cleanup.

<DocsPageFeatures />

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
