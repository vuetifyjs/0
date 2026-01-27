---
title: useIntersectionObserver - Visibility Detection for Vue 3
meta:
- name: description
  content: Detect element visibility with Intersection Observer API. Perfect for lazy loading, infinite scroll, and entrance animations with automatic cleanup control.
- name: keywords
  content: intersection observer, visibility, viewport, lazy loading, infinite scroll, Vue 3, composable
features:
  category: Composable
  label: 'E: useIntersectionObserver'
  github: /composables/useIntersectionObserver/
  level: 3
related:
  - /composables/system/use-resize-observer
  - /composables/system/use-mutation-observer
---

# useIntersectionObserver

A composable for detecting when elements enter or leave the viewport using the Intersection Observer API with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useIntersectionObserver` composable wraps the Intersection Observer API to detect when elements become visible in the viewport. It's useful for lazy loading images, infinite scroll, entrance animations, and performance optimizations.

```vue UseIntersectionObserver
<script setup lang="ts">
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

## Examples

::: example
/composables/use-intersection-observer/scroll-reveal
:::

## Architecture

`useIntersectionObserver` wraps the native IntersectionObserver API with Vue reactivity:

```mermaid "Intersection Observer Hierarchy"
flowchart TD
  IntersectionObserver["IntersectionObserver API"] --> useIntersectionObserver
  useHydration --> useIntersectionObserver
  useIntersectionObserver --> LazyLoading["Lazy Loading"]
  useIntersectionObserver --> InfiniteScroll["Infinite Scroll"]
  useIntersectionObserver --> Animations["Entrance Animations"]
```

<DocsApi />
