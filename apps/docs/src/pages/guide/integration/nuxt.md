---
title: Nuxt - SSR Integration Guide
features:
  order: 2
  level: 2
meta:
  - name: description
    content: Register Vuetify0 in Nuxt with one plugin. Server-rendered theme CSS, a theme cookie, shared breakpoint width, and hydration. Auto-imports are optional.
  - name: keywords
    content: vuetify0, nuxt, ssr, server side rendering, hydration, theme, cookies, breakpoints, auto-imports
related:
  - /introduction/getting-started
  - /guide/features/theming
  - /composables/plugins/use-hydration
  - /composables/plugins/use-theme
  - /composables/plugins/use-breakpoints
---

# Nuxt

<DocsPageFeatures :frontmatter />

Register v0 from one file in `plugins/`. It renders theme CSS on the server, reads the theme and viewport from cookies, and installs hydration.

Getting Started's `plugins/vuetify0.ts` uses the default theme adapter, which writes no CSS during SSR. Delete that file. A second `createThemePlugin()` is skipped, so the first plugin Nuxt loads is the one that stays.

## Plugin

```ts plugins/v0.ts
import { createBreakpointsPlugin, createHydrationPlugin, createThemePlugin } from '@vuetify/v0'
import { V0UnheadThemeAdapter } from '@vuetify/v0/theme/adapters/unhead'

export default defineNuxtPlugin((nuxtApp) => {
  const themeCookie = useCookie<'light' | 'dark'>('theme')
  const widthCookie = useCookie<number>('viewport-width', {
    default: () => 1280,
  })

  nuxtApp.vueApp.use(createHydrationPlugin())
  nuxtApp.vueApp.use(
    createBreakpointsPlugin({
      ssr: {
        clientWidth: widthCookie.value || 1280,
      },
    }),
  )
  nuxtApp.vueApp.use(
    createThemePlugin({
      adapter: new V0UnheadThemeAdapter(),
      default: themeCookie.value === 'dark' ? 'dark' : 'light',
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

Add these watches to the existing `app.vue` script. Leave its template alone.

```vue app.vue
<script setup lang="ts">
  import { useBreakpoints, useTheme } from '@vuetify/v0'
  import { watch } from 'vue'

  const theme = useTheme()
  const themeCookie = useCookie<'light' | 'dark'>('theme')

  watch(() => theme.selectedId.value, id => {
    if (id === 'light' || id === 'dark') themeCookie.value = id
  })

  const { width } = useBreakpoints()
  const widthCookie = useCookie<number>('viewport-width')

  watch(width, value => {
    widthCookie.value = value
  })
</script>
```

Tell Nuxt to transpile the package:

```ts nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['@vuetify/v0'],
  },
})
```

## Theme Persistence

The default adapter, `V0StyleSheetThemeAdapter`, injects CSS with `document.adoptedStyleSheets`. The server HTML has no theme, and the page flashes when the client hydrates.

`V0UnheadThemeAdapter` writes the `<style>` tag and the `data-theme` attribute through [Unhead](https://unhead.unjs.io/), which Nuxt already runs. The theme is in the first response.

The server cannot see the operating system's color scheme. The `theme` cookie is the value both sides share. `default` is `dark` when the cookie is `dark`, and `light` otherwise. With no cookie, the first response is light.

`app.vue` stores `theme.selectedId` after `theme.select()`. The next request renders that id.

Two theme options fight that cookie:

- `persist: true` stores the selected id through `createStoragePlugin()`. Without that plugin the install throws. Server storage is memory, not the browser's `localStorage`, and a theme that is following the OS stores null. Leave `persist` off.
- `system` follows `prefers-color-scheme` in the browser and replaces `default` on the client. The server has already sent the cookie's theme. Leave `system` off.

### First visit follows the OS

To adopt the OS scheme when the cookie is empty, wait until hydration and call `select`. The selected-id watch in `app.vue` stores the result. The first HTML response is still light. The switch happens after paint. Later requests use the cookie.

Add this watch to the same script. `theme` and `themeCookie` are the ones declared above.

```vue
<script setup lang="ts">
  import { IN_BROWSER, useHydration } from '@vuetify/v0'
  import { watch } from 'vue'

  const { isHydrated } = useHydration()

  watch(isHydrated, ready => {
    if (!ready || themeCookie.value || !IN_BROWSER) return

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.select(dark ? 'dark' : 'light')
  })
</script>
```

The plugin runs for the render the server and the client have to share, so it cannot read `matchMedia`.

## Breakpoints

`ssr.clientWidth` is the width of the server render and of the client render that hydrates it. After the app mounts, breakpoints read the real window. The markup matches. Layout can still change once the real width lands.

The plugin uses `1280` until the browser sends `viewport-width`. The `app.vue` watch stores `width` after mount. The next document request includes it.

With no `ssr` width, the server renders at `0` and the client renders at `window.innerWidth`. Any branch on `isMobile`, `mdAndUp`, or the other breakpoint flags mismatches.

## Hydration

`createHydrationPlugin()` starts `isHydrated` at `false` for the server render and for the hydration render. It flips to `true` on the tick after the root mounts. `isSettled` flips one tick later, after other `onMounted` hooks have run.

Install that plugin before calling `useHydration()`. Without it, the fallback sets `isHydrated` and `isSettled` to `true` immediately, including on the server. `v-if="isHydrated"` then renders during SSR.

```vue
<script setup lang="ts">
  import { useHydration } from '@vuetify/v0'

  const { isHydrated } = useHydration()
</script>

<template>
  <span>{{ isHydrated ? new Date().toLocaleTimeString() : '--:--:--' }}</span>
</template>
```

| Approach | When |
| - | - |
| `useHydration` | The server can render a placeholder. Swap the contents after hydration. |
| `<ClientOnly>` | Constructing the component on the server throws. Canvas and WebGL are the usual cases. Nuxt skips the component and renders the fallback slot. |

```vue
<template>
  <ClientOnly>
    <CanvasVisualization />

    <template #fallback>
      <div class="skeleton" />
    </template>
  </ClientOnly>
</template>
```

`IN_BROWSER` is for work that does not change the tree of the first render:

```ts
import { IN_BROWSER } from '@vuetify/v0'

if (IN_BROWSER) {
  localStorage.setItem('key', 'value')
}
```

A branch that renders one tree when `IN_BROWSER` is true and another when it is false mismatches, because the server and the client take different branches. Gate that tree with `isHydrated` or `<ClientOnly>`.

## Auto-Imports

Imports from `@vuetify/v0` work without a preset. A preset only removes the import line for names you list. Add a name when you start calling it. Keep component imports explicit.

```ts nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['@vuetify/v0'],
  },
  imports: {
    presets: [
      {
        from: '@vuetify/v0',
        imports: ['useTheme', 'useHydration', 'useBreakpoints'],
      },
    ],
  },
})
```

Merge this into the `nuxt.config.ts` you already have. `build.transpile` is the required part. The preset is optional.

## Hydration Mismatches

Vue warns when the server HTML and the client's first render differ. Development builds include the expected HTML and the actual HTML in that warning. To keep the detail in a production build, add the `vite` key next to `build`. Replacing the whole config with only this key drops `transpile`.

```ts nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['@vuetify/v0'],
  },
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
    },
  },
})
```

Usual causes:

- `new Date()`, `Math.random()`, or `window` during render
- A branch chosen with `IN_BROWSER`
- `useHydration()` without `createHydrationPlugin()`, so `isHydrated` is true on the server
- Breakpoints with no `ssr` width
- A list whose items or keys differ between the two renders. Use a stable id from the item as `:key`. Both renders still have to start from the same items.

## SSR Support

| Feature | Server | Notes |
| - | - | - |
| Components | Yes | Compound components render on the server. |
| `useTheme` | With the Unhead adapter | The default adapter emits no server CSS. |
| `useHydration` | Yes | Requires `createHydrationPlugin()`. |
| `useBreakpoints` | With `ssr.clientWidth` | Both renders share that width until mount. |
| `useStorage` | Memory on the server | A write during SSR does not reach `localStorage`. |
| `createPagination` | Yes | Counts pages and exposes `pageStart` and `pageStop`. No browser APIs. |
| Observers | When `isHydrated` | Resize, intersection, and mutation observers attach once that flag is true. With this plugin, that is after hydration. |
