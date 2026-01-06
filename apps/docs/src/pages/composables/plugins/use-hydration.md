---
title: useHydration Composable
meta:
- name: description
  content: A composable for managing SSR hydration state, controlling when components
    are hydrated to prevent hydration mismatches and optimize client-side rendering.
- name: keywords
  content: useHydration, SSR, hydration, server-side rendering, composable, hydration
    mismatch
features:
  category: Plugin
  label: 'E: useHydration'
  github: /composables/useHydration/
related:
  - /guide/plugins
---

# useHydration

The `useHydration` composable provides SSR hydration state management, allowing you to detect when your application has been hydrated on the client side. This is essential for preventing hydration mismatches and controlling when browser-only features should activate.

<DocsPageFeatures :frontmatter />

## Usage

Once the plugin is installed, use the `useHydration` composable in any component:

```vue UseHydration
<script setup lang="ts">
  import { useHydration } from '@vuetify/v0'

  const hydration = useHydration()
</script>

<template>
  <div>
    <p v-if="hydration.isHydrated.value">
      Application is hydrated - browser features available
    </p>
    <p v-else>
      Rendering on server or waiting for hydration
    </p>
  </div>
</template>
```

## Architecture

`useHydration` uses the plugin pattern with a simple boolean state:

```mermaid
flowchart LR
  createHydrationPlugin --> createContext
  createContext --> isHydrated[isHydrated ref]
  app.mixin --> hydrate
  hydrate --> isHydrated
```

<DocsApi />
