---
meta:
  title: useHydration
  description: Simple hook to access the hydration context.
  keywords: useHydration, hydration, composable, Vue, SSR, SSG
category: Plugin
performance: 0
---

# useHydration

The `useHydration` composable provides a simple hook to access the hydration context, which is crucial for tracking client-side hydration state in Server-Side Rendered (SSR) or Static Site Generated (SSG) applications.

## API

### `useHydration()`

* **Type**
    
  ```ts
  function useHydration (): HydrationContext
  ```
    
* **Details**
    
  Returns the hydration context containing `isHydrated` (a readonly shallow ref indicating if the application has been hydrated) and `hydrate` (a function to manually trigger hydration).

### `createHydration()`

* **Type**
    
  ```ts
  function createHydration (): HydrationContext
  ```
    
* **Details**
    
  Creates a hydration context for tracking client-side hydration state in SSR applications. This function provides a way to determine when the application has been fully hydrated on the client side, which is essential for SSR/SSG compatibility.

### `createHydrationPlugin()`

*   **Type**
    
    ```ts
    function createHydrationPlugin (): HydrationPlugin
    ```
    
*   **Details**
    
    Creates a Vue plugin for hydration state management in SSR/SSG applications. This plugin automatically detects when the root component is mounted and triggers the hydration process, ensuring proper client-side hydration timing.

## Examples

### Using `useHydration`

```html
<template>
  <div>
    <p>Is Hydrated: {{ isHydrated }}</p>
    <button @click="hydrateApp">Manually Hydrate</button>
  </div>
</template>

<script setup lang="ts">
  import { useHydration } from '@vuetify/v0/composables/useHydration'

  const { isHydrated, hydrate } = useHydration()

  const hydrateApp = () => {
    hydrate()
  }
</script>
```

### Using `createHydrationPlugin`

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createHydrationPlugin } from '@vuetify/v0/composables/useHydration'

const app = createApp(App)

app.use(createHydrationPlugin())

app.mount('#app')
```


