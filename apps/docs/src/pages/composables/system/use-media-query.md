---
title: useMediaQuery - Reactive Media Query Matching for Vue 3
meta:
- name: description
  content: Reactive CSS media query matching with automatic cleanup. Detect dark mode, reduced motion, screen orientation, and custom queries with SSR safety.
- name: keywords
  content: useMediaQuery, media query, matchMedia, dark mode, reduced motion, responsive, Vue 3, composable
features:
  category: Composable
  label: 'E: useMediaQuery'
  github: /composables/useMediaQuery/
related:
  - /composables/plugins/use-breakpoints
  - /composables/system/use-event-listener
---

<script setup>
import BasicExample from '@/examples/composables/use-media-query/basic.vue'
import BasicExampleRaw from '@/examples/composables/use-media-query/basic.vue?raw'
</script>

# useMediaQuery

A composable for reactive CSS media query matching with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useMediaQuery` composable wraps the browser's `matchMedia` API, providing reactive updates when the media query state changes. It supports static strings, refs, and getter functions for dynamic queries.

<DocsExample file="basic.vue" title="Media Query Detection" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Architecture

`useMediaQuery` wraps the browser's matchMedia API with Vue reactivity and SSR safety:

```mermaid
flowchart TD
  matchMedia["matchMedia API"] --> useMediaQuery
  useHydration --> useMediaQuery
  useMediaQuery --> usePrefersDark
  useMediaQuery --> usePrefersReducedMotion
  useMediaQuery --> usePrefersContrast
  useMediaQuery --> useBreakpoints
```

<DocsApi />
