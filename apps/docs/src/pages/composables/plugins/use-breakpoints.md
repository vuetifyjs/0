---
title: useBreakpoints - Responsive Viewport Detection for Vue 3
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
  level: 2
related:
  - /guide/fundamentals/plugins
---

# useBreakpoints

The `useBreakpoints` composable provides comprehensive responsive design capabilities through reactive viewport dimension detection. It automatically tracks window size changes and provides boolean flags for current breakpoint ranges, enabling mobile-first and responsive layouts.

<DocsPageFeatures :frontmatter />

## Installation

Install the Breakpoints plugin in your app's entry point:

```ts main.ts
import { createApp } from 'vue'
import { createBreakpointsPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createBreakpointsPlugin({
    mobileBreakpoint: 'sm',
    breakpoints: {
      xs: 0,
      sm: 680,
      md: 1024,
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

## Architecture

`useBreakpoints` uses the plugin pattern with viewport observation:

```mermaid "Breakpoints Plugin"
flowchart LR
  subgraph Plugin
    createBreakpointsPlugin --> createBreakpointsContext
  end

  createBreakpointsContext --> useResizeObserver
  useResizeObserver --> viewport[width/height]
  viewport --> breakpoint[name/flags]
```

<DocsApi />
