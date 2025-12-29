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


<DocsApi />
