---
title: Nuxt 3 - SSR Integration Guide
features:
  order: 1
  level: 2
meta:
  - name: description
    content: Integrate Vuetify0 with Nuxt 3. Configure SSR, auto-imports, theme persistence, and hydration handling for server-rendered Vue applications.
  - name: keywords
    content: vuetify0, nuxt 3, ssr, server side rendering, hydration, auto-imports, vue 3
related:
  - /introduction/getting-started
  - /guide/features/theming
  - /composables/plugins/use-hydration
---

# Nuxt 3

v0 integrates with Nuxt 3 through standard Vue plugin registration. This guide covers SSR considerations, auto-imports, and theme persistence.

<DocsPageFeatures :frontmatter />

## Basic Setup

See [Getting Started](/introduction/getting-started#nuxt-3) for the minimal plugin setup.

## Auto-Imports

Configure Nuxt to auto-import v0 composables:

```ts nuxt.config.ts collapse
export default defineNuxtConfig({
  build: {
    transpile: ['@vuetify/v0'],
  },
  imports: {
    imports: [
      { from: '@vuetify/v0', name: 'useTheme' },
      { from: '@vuetify/v0', name: 'createSelection' },
      { from: '@vuetify/v0', name: 'createGroup' },
      { from: '@vuetify/v0', name: 'createSingle' },
      { from: '@vuetify/v0', name: 'createStep' },
      { from: '@vuetify/v0', name: 'createPagination' },
      { from: '@vuetify/v0', name: 'useForm' },
      { from: '@vuetify/v0', name: 'useHydration' },
      { from: '@vuetify/v0', name: 'useBreakpoints' },
      { from: '@vuetify/v0', name: 'IN_BROWSER' },
    ],
  },
})
```

## SSR Considerations

### The IN_BROWSER Constant

Guard browser-only code with `IN_BROWSER`:

```ts
import { IN_BROWSER } from '@vuetify/v0'

if (IN_BROWSER) {
  localStorage.setItem('key', 'value')
  window.addEventListener('resize', handler)
}
```

### Hydration State

Use `useHydration` to defer browser-only rendering:

```vue
<script setup lang="ts">
  import { useHydration } from '@vuetify/v0'

  const { isHydrated } = useHydration()
</script>

<template>
  <div v-if="isHydrated">
    <BrowserOnlyComponent />
  </div>
</template>
```

The hydration plugin:
- Sets `isHydrated` to `false` during SSR
- Flips to `true` after the root component mounts on client
- Falls back gracefully if not installed

### Theme SSR Integration

The theme plugin automatically integrates with Nuxt's `@unhead/vue` to inject styles during SSR. No additional configuration required.

## Theme Persistence

> [!TIP]
> Use cookies instead of localStorage for theme persistence. Cookies are available on the server, preventing flash of wrong theme.

For theme preference to persist across SSR requests, use cookies instead of localStorage:

```ts plugins/v0.ts collapse
import { createHydrationPlugin, createThemePlugin, IN_BROWSER } from '@vuetify/v0'

export default defineNuxtPlugin((nuxtApp) => {
  const themeCookie = useCookie<'light' | 'dark'>('theme', {
    default: () => 'light',
  })

  function resolveTheme(): 'light' | 'dark' {
    if (themeCookie.value) return themeCookie.value
    if (!IN_BROWSER) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  nuxtApp.vueApp.use(createHydrationPlugin())
  nuxtApp.vueApp.use(
    createThemePlugin({
      default: resolveTheme(),
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#3b82f6',
            surface: '#ffffff',
            'on-primary': '#ffffff',
            'on-surface': '#212121',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#60a5fa',
            surface: '#1e1e1e',
            'on-primary': '#1a1a1a',
            'on-surface': '#e0e0e0',
          },
        },
      },
    }),
  )
})
```

To sync theme changes back to the cookie:

```vue
<script setup lang="ts">
  import { useTheme } from '@vuetify/v0'
  import { watch } from 'vue'

  const theme = useTheme()
  const themeCookie = useCookie('theme')

  watch(() => theme.selectedId.value, (id) => {
    themeCookie.value = id
  })
</script>
```

## SSR Compatibility Reference

| Feature | SSR Support | Notes |
| - | - | - |
| Components | Full | All compound components work in SSR |
| `useTheme` | Full | Auto-injects styles via Nuxt head manager |
| `useHydration` | Full | Designed for SSR/client state sync |
| `useBreakpoints` | Partial | Returns defaults on server, measures on client |
| `useStorage` | Partial | Uses memory adapter on server |
| `createPagination` | Full | Width-based calculation defers to client |
| Observer composables | Partial | No-op on server, activate on client |

## Common Patterns

### Client-Only Components

For components that can't render on the server:

```vue
<template>
  <ClientOnly>
    <ComplexVisualization />

    <template #fallback>
      <div class="skeleton" />
    </template>
  </ClientOnly>
</template>
```

### Avoiding Hydration Mismatch

Common causes:
- Timestamps or random values during render
- Conditional rendering based on browser state
- Dynamic IDs without SSR-safe generation

```vue
<script setup lang="ts">
  import { useHydration } from '@vuetify/v0'

  const { isHydrated } = useHydration()

  // Bad: causes mismatch
  const time = new Date().toLocaleTimeString()

  // Good: defer to client
  const time = computed(() => isHydrated.value ? new Date().toLocaleTimeString() : '')
</script>
```

### Debugging Hydration Mismatches

When you see hydration warnings in the console:

1. **Enable Vue's hydration mismatch details** in `nuxt.config.ts`:

```ts nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    propsDestructure: true,
  },
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
    },
  },
})
```

2. **Check the console** for detailed mismatch info showing expected vs actual HTML.

3. **Common fixes**:
   - Wrap browser-dependent content in `<ClientOnly>` or `v-if="isHydrated"`
   - Use `useId()` from Vue for SSR-safe unique IDs
   - Avoid `new Date()`, `Math.random()`, or `window` access during initial render
   - Ensure v-for keys are deterministic (not index-based for dynamic lists)

### useHydration vs ClientOnly

| Approach | Use When |
| - | - |
| `useHydration` | Content can render on server with placeholder, then update on client |
| `<ClientOnly>` | Component cannot render on server at all (canvas, WebGL, etc.) |

**useHydration** - Renders on both server and client, with reactive `isHydrated` flag:

```vue
<script setup lang="ts">
  import { useHydration } from '@vuetify/v0'
  const { isHydrated } = useHydration()
</script>

<template>
  <!-- Shows placeholder on server, real time on client -->
  <span>{{ isHydrated ? new Date().toLocaleTimeString() : '--:--:--' }}</span>
</template>
```

**ClientOnly** - Skips server rendering entirely:

```vue
<template>
  <ClientOnly>
    <CanvasVisualization />
    <template #fallback>
      <div class="skeleton h-64" />
    </template>
  </ClientOnly>
</template>
```

**Rule of thumb**: Prefer `useHydration` when possible—it provides better SEO and faster perceived load. Use `<ClientOnly>` only when the component truly cannot exist on the server.
