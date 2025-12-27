---
title: useBreakpoints Composable
meta:
- name: description
  content: A composable for responsive design that detects viewport dimensions and
    provides reactive breakpoint information for building mobile-first layouts.
- name: keywords
  content: useBreakpoints, breakpoints, responsive, viewport, mobile-first, composable
features:
  category: Plugin
  label: 'E: useBreakpoints'
  github: /composables/useBreakpoints/
related:
  - /guide/plugins
---

# useBreakpoints

The `useBreakpoints` composable provides comprehensive responsive design capabilities through reactive viewport dimension detection. It automatically tracks window size changes and provides boolean flags for current breakpoint ranges, enabling mobile-first and responsive layouts.

<DocsPageFeatures :frontmatter />

## Installation

First, install the breakpoints plugin in your application:

```ts
import { createApp } from 'vue'
import { createBreakpointsPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createBreakpointsPlugin({
    mobileBreakpoint: 'md',
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useBreakpoints` composable in any component:

```vue UseBreakpoints
<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
</script>

<template>
  <div>
    <nav v-if="breakpoints.mdAndUp">
      <!-- Desktop navigation -->
    </nav>
    <nav v-else>
      <!-- Mobile navigation -->
    </nav>

    <p v-if="breakpoints.isMobile">Mobile layout active</p>
    <p>Current breakpoint: {{ breakpoints.name }}</p>
    <p>Viewport: {{ breakpoints.width }} x {{ breakpoints.height }}</p>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useResizeObserver](/composables/system/use-resize-observer) | Element size observation |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Plugin Options

- **Type**

  ```ts
  interface BreakpointsPluginOptions {
    mobileBreakpoint?: BreakpointName | number
    breakpoints?: Partial<Record<BreakpointName, number>>
  }

  type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  ```

- **Details**

  - `mobileBreakpoint`: Threshold for mobile detection (default: `'md'`). Can be a breakpoint name or pixel value.
  - `breakpoints`: Custom breakpoint values in pixels. Defaults:
    - `xs`: 0
    - `sm`: 600
    - `md`: 960
    - `lg`: 1280
    - `xl`: 1920
    - `xxl`: 2560

### Breakpoints Context

The `useBreakpoints()` composable returns a context with the following properties:

```ts
interface BreakpointsContext {
  // Configuration
  breakpoints: Readonly<Record<BreakpointName, number>>

  // Current state
  name: Readonly<ShallowRef<BreakpointName>>
  width: Readonly<ShallowRef<number>>
  height: Readonly<ShallowRef<number>>
  isMobile: Readonly<ShallowRef<boolean>>

  // Exact breakpoint matches
  xs: Readonly<ShallowRef<boolean>>
  sm: Readonly<ShallowRef<boolean>>
  md: Readonly<ShallowRef<boolean>>
  lg: Readonly<ShallowRef<boolean>>
  xl: Readonly<ShallowRef<boolean>>
  xxl: Readonly<ShallowRef<boolean>>

  // Range queries (and up)
  smAndUp: Readonly<ShallowRef<boolean>>
  mdAndUp: Readonly<ShallowRef<boolean>>
  lgAndUp: Readonly<ShallowRef<boolean>>
  xlAndUp: Readonly<ShallowRef<boolean>>
  xxlAndUp: Readonly<ShallowRef<boolean>>

  // Range queries (and down)
  smAndDown: Readonly<ShallowRef<boolean>>
  mdAndDown: Readonly<ShallowRef<boolean>>
  lgAndDown: Readonly<ShallowRef<boolean>>
  xlAndDown: Readonly<ShallowRef<boolean>>
  xxlAndDown: Readonly<ShallowRef<boolean>>

  // Manual update
  update: () => void
}
```

**Properties:**

- `breakpoints`: The configured breakpoint values (read-only)
- `name`: Current breakpoint name (`'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'xxl'`)
- `width`: Current viewport width in pixels
- `height`: Current viewport height in pixels
- `isMobile`: Whether viewport is below the mobile breakpoint threshold

**Exact Matches:**

- `xs`, `sm`, `md`, `lg`, `xl`, `xxl`: `true` when viewport is exactly at that breakpoint

**Range Queries:**

- `smAndUp`, `mdAndUp`, etc.: `true` when viewport is at or above that breakpoint
- `smAndDown`, `mdAndDown`, etc.: `true` when viewport is at or below that breakpoint

**Methods:**

- `update()`: Manually trigger breakpoint recalculation (automatically called on resize)

<DocsRelated :frontmatter />
