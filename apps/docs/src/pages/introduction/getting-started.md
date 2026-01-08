---
title: Getting Started - Install Vuetify0 Headless UI
meta:
  - name: description
    content: Get started with Vuetify0 headless UI primitives for Vue 3. Install, configure, and build your own design system with unstyled, accessible components.
  - name: keywords
    content: vuetify0, getting started, installation, Vue 3, headless ui, composables, npm, pnpm
features:
  order: 1
  level: 1
related:
  - /guide
  - /guide/nuxt
  - /composables
  - /components
---

# Get started with Vuetify0

Vuetify0 provides headless UI primitives and composables for Vue 3. Components are unstyled and logic-focused, giving you complete control over styling while handling accessibility, keyboard navigation, and state management.

<DocsPageFeatures :frontmatter />

## Vite Setup

Create a new Vue project with Vite:

::: code-group

```bash pnpm
pnpm create vue@latest
```

```bash npm
npm create vue@latest
```

```bash yarn
yarn create vue
```

```bash bun
bun create vue@latest
```

:::

v0 works out of the box with Vite. No special configuration required:

```ts vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
})
```

## Installation

Install `@vuetify/v0` with your preferred package manager:

::: code-group

```bash pnpm
pnpm add @vuetify/v0
```

```bash npm
npm install @vuetify/v0
```

```bash yarn
yarn add @vuetify/v0
```

```bash bun
bun add @vuetify/v0
```

:::

Create a plugin file to configure v0:

```ts src/plugins/zero.ts
import { createHydrationPlugin, createThemePlugin } from '@vuetify/v0'
import type { App } from 'vue'

export default function zero (app: App) {
  app.use(createHydrationPlugin())
  app.use(
    createThemePlugin({
      default: 'light',
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
      },
    }),
  )
}
```

Register the plugin in your app entry:

```ts src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import zero from './plugins/zero'

const app = createApp(App)

zero(app)

app.mount('#app')
```

> [!INFO]
> For additional plugins, theming options, and advanced configuration, see the [Guide](/guide).

## Requirements

- Vue 3.3.0 or higher
- Node 22+

## Quick Start

Import and use components directly - no plugin installation required:

```vue QuickStart.vue playground
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import { ref } from 'vue'

  const expanded = ref([])
</script>

<template>
  <ExpansionPanel.Root v-model="expanded" multiple>
    <ExpansionPanel.Item value="item-1">
      <ExpansionPanel.Activator>
        Section 1
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content>
        Content for section 1
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

Components are completely unstyled. Add your own classes using Tailwind, UnoCSS, or plain CSS.

## Styling

v0 is style-agnostic. Choose your preferred CSS framework and map theme colors to v0's CSS variables.

### UnoCSS

[UnoCSS](https://unocss.dev) is our recommended choice for its speed and flexibility.

#### 1. Install

::: code-group

```bash pnpm
pnpm add -D unocss @unocss/preset-wind
```

```bash npm
npm install -D unocss @unocss/preset-wind
```

```bash yarn
yarn add -D unocss @unocss/preset-wind
```

```bash bun
bun add -D unocss @unocss/preset-wind
```

:::

#### 2. Configure

```ts uno.config.ts
import { defineConfig, presetWind } from 'unocss'

export default defineConfig({
  presets: [presetWind()],
  theme: {
    colors: {
      primary: 'var(--v0-primary)',
      surface: 'var(--v0-surface)',
      'on-primary': 'var(--v0-on-primary)',
      'on-surface': 'var(--v0-on-surface)',
    },
  },
})
```

#### 3. Add Vite Plugin

```ts vite.config.ts
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
})
```

#### 4. Import Styles

```ts main.ts
import 'virtual:uno.css'
```

Now use utility classes in your components:

```vue
<template>
  <button class="bg-primary text-on-primary px-4 py-2 rounded">
    Click me
  </button>
</template>
```

### Tailwind CSS v4

[Tailwind v4](https://tailwindcss.com) uses CSS-first configuration with native cascade layers.

#### 1. Install

::: code-group

```bash pnpm
pnpm add -D tailwindcss @tailwindcss/vite
```

```bash npm
npm install -D tailwindcss @tailwindcss/vite
```

```bash yarn
yarn add -D tailwindcss @tailwindcss/vite
```

```bash bun
bun add -D tailwindcss @tailwindcss/vite
```

:::

#### 2. Add Vite Plugin

```ts vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

#### 3. Create Stylesheet

```css src/styles/main.css
@import "tailwindcss";

@theme {
  --color-primary: var(--v0-primary);
  --color-surface: var(--v0-surface);
  --color-on-primary: var(--v0-on-primary);
  --color-on-surface: var(--v0-on-surface);
}
```

#### 4. Import Styles

```ts main.ts
import './styles/main.css'
```

Now use utility classes in your components:

```vue
<template>
  <button class="bg-primary text-on-primary px-4 py-2 rounded">
    Click me
  </button>
</template>
```

### CSS Modules

Vue's built-in [CSS Modules](https://vuejs.org/api/sfc-css-features#css-modules) require zero configuration.

```vue Button.vue
<template>
  <button :class="$style.btn">
    Click me
  </button>
</template>

<style module>
  .btn {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
</style>
```

Type-safe access via `useCssModule()`:

```vue
<script setup lang="ts">
  import { useCssModule } from 'vue'

  const $style = useCssModule()
</script>

<template>
  <button :class="$style.btn">Click me</button>
</template>
```

> [!TIP]
> For dark mode, custom themes, and design tokens, see the [Theming Guide](/guide/theming).

## Nuxt 3

v0 works with Nuxt 3 via a standard plugin.

### 1. Create Plugin

```ts plugins/v0.ts
import { createHydrationPlugin, createThemePlugin } from '@vuetify/v0'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createHydrationPlugin())
  nuxtApp.vueApp.use(
    createThemePlugin({
      default: 'light',
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

### 2. Configure Nuxt

```ts nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['@vuetify/v0'],
  },
})
```

> [!TIP]
> For auto-imports, SSR hydration, and theme persistence, see the [Nuxt Guide](/guide/nuxt).

## Exposed Exports

The following export paths exist for the Vuetify0 framework:

| Name | Description |
| ---- | ----------- |
| `@vuetify/v0` | Main entry point exposing all components, composables, and utilities. |
| `@vuetify/v0/components` | Components only. |
| `@vuetify/v0/composables` | Composables only. |
| `@vuetify/v0/utilities` | Utilities only. |
| `@vuetify/v0/constants` | Constants only (not included in main entry). |

```ts
// Everything
import { ExpansionPanel, useSelection } from '@vuetify/v0'

// Components only
import { ExpansionPanel, Single, Group } from '@vuetify/v0/components'

// Composables only
import { useSelection, useTheme, useForm } from '@vuetify/v0/composables'

// Utilities only
import { isObject, isString } from '@vuetify/v0/utilities'

// Constants only
import { IN_BROWSER } from '@vuetify/v0/constants'
```

## Next Steps

- [Explore Components](/components/) See all available components
- [Browse Composables](/composables/) Dive into the composables API
