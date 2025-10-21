---
meta:
  title: useHydration
  description: A composable for managing SSR hydration state, controlling when components are hydrated to prevent hydration mismatches and optimize client-side rendering.
  keywords: useHydration, SSR, hydration, server-side rendering, composable, hydration mismatch
features:
  category: Plugin
  label: 'E: useHydration'
  github: /composables/useHydration/
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

```vue
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

## API


| Composable | Description |
|---|---|
| [useStorage](/composables/plugins/use-storage) | Storage system |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Hydration Context

The `useHydration()` composable returns a context with the following properties and methods:

```ts
interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}
```

- `isHydrated`: Reactive boolean indicating whether the application has been hydrated
- `hydrate()`: Manually trigger hydration (typically called automatically by the plugin)

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

