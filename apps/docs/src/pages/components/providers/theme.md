---
title: Theme - Scoped Theme Provider for Vue 3
meta:
- name: description
  content: A headless theme provider component that scopes CSS variables and theme context to a subtree. Override the active theme for any section of your app.
- name: keywords
  content: theme, provider, dark mode, light mode, CSS variables, scoped, Vue 3, headless
features:
  category: Component
  label: 'C: Theme'
  github: /components/Theme/
  level: 1
related:
  - /composables/plugins/use-theme
---

# Theme

A scoped theme provider that overrides the active theme for all descendants. Renders a wrapper element with `data-theme` so CSS variables cascade naturally.

<DocsPageFeatures :frontmatter />

## Installation

The Theme component consumes the global theme context. Install the theme plugin at the app level:

```ts main.ts
import { createApp } from 'vue'
import { createThemePlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createThemePlugin({
  default: 'light',
  themes: {
    light: { colors: { primary: '#3b82f6' } },
    dark: { dark: true, colors: { primary: '#60a5fa' } },
  },
}))

app.mount('#app')
```

## Usage

Wrap any section in `<Theme>` to override the active theme. Descendants calling `useTheme()` receive the overridden context, and CSS variables from `[data-theme]` cascade to all children.

::: example
/components/theme/basic
:::

## Nesting

Theme components nest naturally. Each one shadows the parent's `v0:theme` injection key.

::: example
/components/theme/nested
:::

## Recipes

### Slot Props

The default slot exposes `theme` (the active ID) and `isDark` (boolean) for conditional rendering.

::: example
/components/theme/slot-props
:::

### Polymorphic Rendering

Theme extends `Atom`, so it accepts the `as` prop to render as any HTML element:

```vue
<template>
  <Theme theme="dark" as="section">
    <!-- renders as <section data-theme="dark"> -->
  </Theme>
</template>
```

<DocsApi />
