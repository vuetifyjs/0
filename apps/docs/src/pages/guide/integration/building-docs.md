---
title: Building This Documentation - v0 as Proof of Concept
meta:
  - name: description
    content: How the v0 documentation site is built using v0 composables, UnoCSS, and vite-ssg. A real-world proof of concept for headless UI patterns.
  - name: keywords
    content: vuetify0, documentation, vite-ssg, unocss, proof of concept, headless ui
features:
  order: 2
  label: 'Building Docs'
  level: 2
related:
  - /guide/features/theming
  - /guide/fundamentals/core
  - /composables/plugins/use-storage
---

# Building This Documentation

This documentation site is itself a proof of concept for v0. Every pattern documented here is used to build the site you're reading.

<DocsPageFeatures :frontmatter />

## Stack Overview

| Layer | Technology | Purpose |
| - | - | - |
| SSG | [vite-ssg](https://github.com/antfu-collective/vite-ssg) | Pre-renders all routes to static HTML |
| Routing | [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) | File-based routing from `src/pages/` |
| Markdown | [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown) + [Shiki](https://shiki.style/) | Vue components in markdown, syntax highlighting |
| Styling | [UnoCSS](https://unocss.dev/) + [presetWind4](https://unocss.dev/presets/wind4) | Tailwind v4 utilities mapped to v0 tokens |
| State | [Pinia](https://pinia.vuejs.org/) | App-level state (drawer, navigation) |
| Logic | [@vuetify/v0](/introduction/getting-started) | Headless components and composables |

## v0 in Action

### Tabbed Code Groups

The `DocsCodeGroup` component powers all tabbed code examples. It uses [createSingle](/composables/selection/create-single) for exclusive selection and [useProxyRegistry](/composables/reactivity/use-proxy-registry) for keyboard navigation.

```vue DocsCodeGroup.vue collapse
<script setup lang="ts">
  import { createSingle, useProxyRegistry } from '@vuetify/v0'

  // Events are required for useProxyRegistry
  const single = createSingle({ mandatory: 'force', events: true })
  const proxy = useProxyRegistry(single)

  function onKeydown (event: KeyboardEvent) {
    const tabs = Array.from(proxy.values)
    const currentIndex = tabs.findIndex(t => t.isSelected.value)

    switch (event.key) {
      case 'ArrowLeft':
        // Move to previous tab
        break
      case 'ArrowRight':
        // Move to next tab
        break
    }
  }
</script>

<template>
  <div role="tablist" @keydown="onKeydown">
    <button
      v-for="tab in proxy.values"
      :key="tab.id"
      :aria-selected="tab.isSelected.value"
      role="tab"
      @click="tab.toggle"
    >
      {{ tab.value }}
    </button>
  </div>
</template>
```

> [!INFO]
> **Why this works:** [createSingle](/composables/selection/create-single) handles the selection logic. [useProxyRegistry](/composables/reactivity/use-proxy-registry) exposes registered items for iteration. The component owns all styling and accessibility attributes.

### Mobile Navigation

The `AppNav` component uses v0 primitives for polymorphism and interaction:

```vue AppNav.vue collapse
<script setup lang="ts">
  import { shallowRef, useTemplateRef } from 'vue'
  import { Atom, useClickOutside, useBreakpoints } from '@vuetify/v0'

  const navRef = useTemplateRef<AtomExpose>('nav')
  const breakpoints = useBreakpoints()

  // Close drawer when clicking outside
  useClickOutside(
    () => navRef.value?.element,
    () => {
      if (drawer.value && breakpoints.isMobile.value) {
        drawer.value = false
      }
    },
    { ignore: ['[data-app-bar]'] }
  )
</script>

<template>
  <Atom
    ref="nav"
    as="nav"
    aria-label="Main navigation"
    :inert="!drawer && breakpoints.isMobile.value ? true : undefined"
  >
    <slot />
  </Atom>
</template>
```

| Primitive | Role |
| - | - |
| [Atom](/components/primitives/atom) | Polymorphic element—renders as `<nav>` with ref access |
| [useClickOutside](/composables/system/use-click-outside) | Closes mobile drawer on outside click |
| [useBreakpoints](/composables/plugins/use-breakpoints) | Tracks viewport for responsive behavior |

### Interactive Demos

The homepage demo uses [Selection](/components/providers/selection) to show v0's component pattern:

```vue collapse
<script setup lang="ts">
  import { ref } from 'vue'
  import { Selection } from '@vuetify/v0'

  const items = [
    { id: 1, label: 'Option A' },
    { id: 2, label: 'Option B' },
    { id: 3, label: 'Option C' },
  ]

  const model = ref<number[]>([])
</script>

<template>
  <Selection.Root v-model="model" multiple>
    <Selection.Item
      v-for="item in items"
      :key="item.id"
      v-slot="{ isSelected, toggle }"
      :value="item.id"
    >
      <button
        :class="isSelected ? 'bg-primary' : 'bg-surface'"
        @click="toggle"
      >
        {{ item.label }}
      </button>
    </Selection.Item>
  </Selection.Root>
</template>
```

The demo renders live on the homepage—same code, same component, real interactivity.

### Persistent Preferences

User preferences (like API display mode) persist across sessions using [useStorage](/composables/plugins/use-storage):

```vue
<script setup lang="ts">
  import { useStorage } from '@vuetify/v0'

  const storage = useStorage()
  const apiMode = storage.get<'inline' | 'links'>('api-display', 'inline')

  function toggleApiMode() {
    apiMode.value = apiMode.value === 'inline' ? 'links' : 'inline'
  }
</script>
```

No localStorage boilerplate. SSR-safe. Reactive.

## UnoCSS + v0 Theming

The docs map UnoCSS utilities to v0's CSS variable system:

```ts uno.config.ts collapse
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
      'primary': 'var(--v0-primary)',
      'surface': 'var(--v0-surface)',
      'on-primary': 'var(--v0-on-primary)',
      'on-surface': 'var(--v0-on-surface)',
      // ... all v0 tokens
    },
  },
  shortcuts: {
    'bg-glass-surface': '[background:color-mix(in_srgb,var(--v0-surface)_70%,transparent)] backdrop-blur-12',
  },
})
```

This enables:

- `text-primary` → uses `--v0-primary`
- `bg-surface` → uses `--v0-surface`
- Theme switching updates all utilities automatically

### Accessibility Preflights

Global focus styles and reduced motion support:

```css
*:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Build-Time API Extraction

Component and composable APIs are extracted at build time using [vue-component-meta](https://github.com/vuejs/language-tools/tree/master/packages/component-meta) and [ts-morph](https://ts-morph.com/):

```ts build/generate-api.ts
import { createChecker } from 'vue-component-meta'
import { Project } from 'ts-morph'

// Extract props, events, slots from components
const checker = createChecker(tsconfigPath)
const meta = checker.getComponentMeta(componentPath)

// Extract function signatures from composables
const project = new Project({ tsConfigFilePath })
const sourceFile = project.getSourceFileOrThrow(composablePath)
```

This powers:

- `DocsApi` — auto-generated API tables
- `DocsApiHover` — inline type hints in code blocks
- `virtual:api` — importable API data

## Patterns Worth Stealing

### 1. Composable-First Components

Don't embed logic in components. Extract to composables, expose via slot props:

```vue collapse
<!-- Bad: Logic trapped in component -->
<template>
  <TabGroup @change="handleChange">
    <Tab>One</Tab>
  </TabGroup>
</template>

<!-- Good: Logic accessible, component is delivery -->
<script setup lang="ts">
  import { createSingle } from '@vuetify/v0'

  const single = createSingle()
</script>

<template>
  <Single.Root :single>
    <Single.Item v-slot="{ isSelected, toggle }">
      <button @click="toggle">One</button>
    </Single.Item>
  </Single.Root>
</template>
```

### 2. Utility-First with Semantic Tokens

Map utilities to semantic tokens, not raw colors:

```txt
// Bad: Raw colors
'bg-blue-500'

// Good: Semantic tokens
'bg-primary'  // → var(--v0-primary)
```

### 3. SSR-Safe Composables

All v0 composables handle SSR. Use the same patterns:

```ts
import { useStorage, useWindowEventListener } from '@vuetify/v0'

// useWindowEventListener checks IN_BROWSER internally
useWindowEventListener('resize', handler)

// useStorage returns reactive ref, works on server
const storage = useStorage()
const pref = storage.get('key', 'default')
```

## File Structure

```txt
apps/docs/
├── build/                 # Build-time plugins
│   ├── generate-api.ts    # API extraction
│   ├── generate-nav.ts    # Navigation tree
│   └── markdown.ts        # Shiki + callouts
├── src/
│   ├── components/
│   │   ├── app/           # Shell (AppNav, AppBar)
│   │   ├── docs/          # Doc UI (DocsExample, DocsApi)
│   │   └── home/          # Homepage sections
│   ├── composables/       # App-specific composables
│   ├── examples/          # Live code examples
│   ├── layouts/           # Page layouts
│   ├── pages/             # File-based routes
│   └── stores/            # Pinia stores
├── uno.config.ts          # UnoCSS configuration
└── vite.config.ts         # Build pipeline
```

## Summary

This documentation site demonstrates that v0's patterns scale from simple toggles to complex applications:

| Pattern | Where Used |
| - | - |
| [createSingle](/composables/selection/create-single) + Registry | Tabbed code groups |
| [Atom](/components/primitives/atom) polymorphism | Navigation, buttons, links |
| [useClickOutside](/composables/system/use-click-outside) | Mobile drawer dismissal |
| [useStorage](/composables/plugins/use-storage) | User preferences |
| [Selection](/components/providers/selection) compound | Interactive demos |
| CSS variable theming | Entire design system |

The same primitives you use for a checkbox work for an entire documentation platform.
