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

## Installation

First, install the hydration plugin in your application:

```ts
import { createApp } from 'vue'
import { createHydrationPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createHydrationPlugin())

app.mount('#app')
```

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

## How Hydration Works

The hydration plugin automatically detects when the root component has mounted and marks the application as hydrated:

1. During SSR, `isHydrated` is `false`
2. When the root component mounts on the client, the plugin calls `hydrate()`
3. `isHydrated` becomes `true`, signaling that browser APIs are safe to use
4. Components that depend on hydration state can now activate browser-only features

The plugin uses a Vue mixin to detect the root component mount:

```ts
app.mixin({
  mounted() {
    if (this.$parent !== null) return // Skip child components
    context.hydrate() // Only hydrate on root mount
  }
})
```

