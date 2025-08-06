---
meta:
  title: useBreakpoints
  description: Simple hook to access the breakpoints context.
  keywords: useBreakpoints, breakpoints, composable, Vue, responsive
category: Plugin
performance: 0
---

# useBreakpoints

The `useBreakpoints` composable provides a simple hook to access the breakpoints context, allowing you to retrieve information about the current viewport dimensions and active breakpoints.

## API

### `useBreakpoints()`

* **Type**
    
  ```ts
  function useBreakpoints (): BreakpointsContext
  ```
    
* **Details**
    
  Returns the breakpoints context containing current breakpoint information, such as `name`, `width`, `height`, `isMobile`, and boolean flags for each breakpoint (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `smAndUp`, etc.).

### `createBreakpointsPlugin(options?: BreakpointsOptions)`

* **Type**
    
  ```ts
  function createBreakpointsPlugin (options?: BreakpointsOptions): BreakpointsPlugin
  ```
    
* **Details**
    
  Creates a Vue plugin for managing responsive breakpoints with automatic updates. This plugin sets up breakpoint tracking and updates the context when the window is resized, providing reactive breakpoint state throughout the application. The `options` parameter allows for custom configuration of breakpoint thresholds and mobile breakpoint.

## Examples

### Using `useBreakpoints`

```html
<template>
  <div>
    <p>Current breakpoint: {{ breakpoints.name }}</p>
    <p>Window width: {{ breakpoints.width }}px</p>
    <p>Is mobile: {{ breakpoints.isMobile }}</p>
    <p v-if="breakpoints.smAndUp">Visible on small and up screens</p>
  </div>
</template>

<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0/composables/useBreakpoints'

  const breakpoints = useBreakpoints()
</script>
```

### Using `createBreakpointsPlugin`

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createBreakpointsPlugin } from '@vuetify/v0/composables/useBreakpoints'

const app = createApp(App)

app.use(createBreakpointsPlugin({
  mobileBreakpoint: 'sm',
  breakpoints: {
    xs: 0,
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
}))

app.mount('#app')
```


