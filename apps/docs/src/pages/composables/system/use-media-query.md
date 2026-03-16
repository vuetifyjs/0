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
  level: 2
related:
  - /composables/plugins/use-breakpoints
  - /composables/system/use-event-listener
---

# useMediaQuery

A composable for reactive CSS media query matching with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useMediaQuery` composable wraps the browser's `matchMedia` API, providing reactive updates when the media query state changes. It supports static strings, refs, and getter functions for dynamic queries.

> [!TIP] Why wrap matchMedia?
> The native `matchMedia` API has no awareness of Vue's `effectScope` lifecycle — change listeners you add won't be removed when the scope is disposed. `useMediaQuery` integrates `onScopeDispose` for automatic cleanup, defers evaluation until after hydration for SSR safety, and supports reactive query strings that re-evaluate on change.

```vue collapse no-filename UseMediaQuery
<script setup lang="ts">
  import { useMediaQuery } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const { matches: prefersDark } = useMediaQuery('(prefers-color-scheme: dark)')
  const { matches: isMobile } = useMediaQuery('(max-width: 768px)')

  // Dynamic query with a reactive value
  const breakpoint = shallowRef(768)
  const { matches: isWide } = useMediaQuery(
    () => `(min-width: ${breakpoint.value}px)`
  )
</script>

<template>
  <div>
    <p>Dark mode: {{ prefersDark }}</p>
    <p>Mobile: {{ isMobile }}</p>
    <p>Wide (>= {{ breakpoint }}px): {{ isWide }}</p>
  </div>
</template>
```

## Architecture

`useMediaQuery` wraps the browser's matchMedia API with Vue reactivity and SSR safety:

```mermaid "Media Query Hierarchy"
flowchart TD
  matchMedia["matchMedia API"] --> useMediaQuery
  useHydration --> useMediaQuery
  useMediaQuery --> usePrefersDark
  useMediaQuery --> usePrefersReducedMotion
  useMediaQuery --> usePrefersContrast
  useMediaQuery --> useBreakpoints
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `matches` | <AppSuccessIcon /> | ShallowRef, readonly |
| `query` | <AppSuccessIcon /> | Computed, accepts MaybeRefOrGetter |
| `mediaQueryList` | <AppSuccessIcon /> | ShallowRef, readonly (MediaQueryList or null) |

> [!TIP] Dynamic queries
> Pass a ref or getter to `useMediaQuery` for dynamic query updates. The composable re-evaluates when the query changes.

## Examples

::: example
/composables/use-media-query/basic
:::

<DocsApi />
