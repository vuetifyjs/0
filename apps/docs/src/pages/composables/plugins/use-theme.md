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
related:
  - /composables/system/use-media-query
  - /composables/registration/create-tokens
  - /guide/theming
---

# useTheme

The `useTheme` composable provides comprehensive theme management capabilities, allowing you to register multiple themes, switch between them dynamically, and automatically generate CSS custom properties. Built on `useSingle` for single-theme selection and `useTokens` for design token alias resolution.

<DocsPageFeatures :frontmatter />

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

`useTheme` extends `useSingle` for theme selection and `useTokens` for color resolution:

```mermaid
flowchart TD
  useRegistry --> useSelection
  useSelection --> useSingle
  useSingle --> useTheme
  useTokens --> useTheme
  useTheme --> Adapter[ThemeAdapter]
  Adapter --> CSS[CSS Variables]
```

<DocsApi />
