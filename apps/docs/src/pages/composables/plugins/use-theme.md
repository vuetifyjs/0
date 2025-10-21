---
meta:
  title: useTheme
  description: A composable for theme management that registers multiple themes, switches between them, and generates CSS custom properties with token alias resolution.
  keywords: useTheme, theme, dark mode, CSS variables, design tokens, composable
features:
  category: Plugin
  label: 'E: useTheme'
  github: /composables/useTheme/
---

# useTheme

The `useTheme` composable provides comprehensive theme management capabilities, allowing you to register multiple themes, switch between them dynamically, and automatically generate CSS custom properties. Built on `useSingle` for single-theme selection and `useTokens` for design token alias resolution.

<DocsPageFeatures :frontmatter />

## Installation

First, install the theme plugin in your application:

```ts
import { createApp } from 'vue'
import { createThemePlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createThemePlugin({
    default: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          background: '#ffffff',
          surface: '#f5f5f5',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#60a5fa',
          secondary: '#a78bfa',
          background: '#1e293b',
          surface: '#334155',
        },
      },
    },
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useTheme` composable in any component:

```vue
<script setup lang="ts">
import { useTheme } from '@vuetify/v0'

const theme = useTheme()

function toggleTheme() {
  theme.cycle(['light', 'dark'])
}
</script>

<template>
  <div :class="`v0-theme--${theme.selectedId}`">
    <h1>Current Theme: {{ theme.selectedId }}</h1>
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useTokens](/composables/registration/use-tokens) | Design token system with alias resolution |
| [useSingle](/composables/selection/use-single) | Single selection system (theme extends this) |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Plugin Options

- **Type**

  ```ts
  interface ThemePluginOptions {
    adapter?: ThemeAdapter
    default?: ID
    palette?: TokenCollection
    themes?: Record<ID, ThemeRecord>
  }

  interface ThemeRecord {
    dark?: boolean
    lazy?: boolean
    colors: ThemeColors
  }

  type ThemeColors = {
    [key: string]: Colors | string
  }
  ```

- **Details**

  - `adapter`: Custom theme adapter for CSS generation (default: `Vuetify0ThemeAdapter`)
  - `default`: ID of the default theme to activate on load
  - `palette`: Design token palette for alias resolution
  - `themes`: Record of theme definitions with colors and options

### Theme Context

The `useTheme()` composable returns a context with the following properties and methods:

```ts
interface ThemeContext extends SingleContext {
  colors: ComputedRef<Record<string, Colors>>
  cycle: (themes: ID[]) => void
  select: (id: ID) => void
  selectedId: Ref<ID | null>
  selectedItem: ComputedRef<ThemeTicket | null>
}
```

- `colors`: Computed colors for all registered themes (resolves aliases)
- `cycle(themes)`: Switch to the next theme in the provided array
- `select(id)`: Select a specific theme by ID
- `selectedId`: Currently selected theme ID
- `selectedItem`: Currently selected theme ticket with metadata

