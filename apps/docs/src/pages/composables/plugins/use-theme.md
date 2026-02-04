---
title: useTheme Composable
meta:
- name: description
  content: A composable for theme management that registers multiple themes, switches
    between them, and generates CSS custom properties with token alias resolution.
- name: keywords
  content: useTheme, theme, dark mode, CSS variables, design tokens, composable
features:
  category: Plugin
  label: 'E: useTheme'
  github: /composables/useTheme/
  level: 2
related:
  - /composables/system/use-media-query
  - /composables/registration/create-tokens
  - /guide/features/theming
---

# useTheme

The `useTheme` composable provides comprehensive theme management capabilities, allowing you to register multiple themes, switch between them dynamically, and automatically generate CSS custom properties. Built on `createSingle` for single-theme selection and `createTokens` for design token alias resolution.

<DocsPageFeatures :frontmatter />

## Installation

Install the Theme plugin in your app's entry point:

```ts main.ts
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
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#675496',
        },
      },
    },
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useTheme` composable in any component:

```vue UseTheme
<script setup lang="ts">
  import { useTheme } from '@vuetify/v0'

  const theme = useTheme()

  function toggleTheme() {
    theme.cycle(['light', 'dark'])
  }
</script>

<template>
  <div>
    <h1>Current Theme: {{ theme.selectedId }}</h1>
    <p>Dark mode: {{ theme.isDark ? 'enabled' : 'disabled' }}</p>
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

## Architecture

`useTheme` extends `createSingle` for theme selection and `createTokens` for color resolution:

```mermaid "Theme Hierarchy"
flowchart TD
  createRegistry --> createSelection
  createSelection --> createSingle
  createSingle --> useTheme
  createTokens --> useTheme
  useTheme --> Adapter[ThemeAdapter]
  Adapter --> CSS[CSS Variables]
```

## Reactivity

Theme selection and computed colors are reactive. Switching themes automatically updates CSS variables.

| Property | Reactive | Notes |
| - | :-: | - |
| `selectedId` | <AppSuccessIcon /> | Current theme ID |
| `selectedItem` | <AppSuccessIcon /> | Current theme ticket |
| `selectedValue` | <AppSuccessIcon /> | Current theme colors |
| `selectedIndex` | <AppSuccessIcon /> | Index in registry |
| `colors` | <AppSuccessIcon /> | Resolved colors with aliases |
| `isDark` | <AppSuccessIcon /> | Current theme is dark |

<DocsApi />
