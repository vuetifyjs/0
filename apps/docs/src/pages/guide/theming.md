---
title: Theming Guide - Design Tokens and CSS Variables
meta:
  - name: description
    content: Customize your design system with Vuetify0's theming. Manage colors, design tokens, and CSS variables with useTokens and useTheme composables for Vue 3.
  - name: keywords
    content: vuetify0, theming, design tokens, CSS variables, colors, useTheme, useTokens, dark mode, Vue 3
related:
  - /composables/plugins/use-theme
  - /composables/registration/use-tokens
  - /guide/accessibility
---

# Theming

v0 theming uses CSS custom properties for runtime theme switching. The theme plugin manages variable injection; you style with standard CSS.

<DocsPageFeatures :frontmatter />

## Quick Start

### 1. Install Plugin

```ts
import { createApp } from 'vue'
import { createThemePlugin } from '@vuetify/v0'

const app = createApp(App)

app.use(
  createThemePlugin({
    defaultTheme: 'light',
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        error: '#B00020'
      },
      dark: {
        primary: '#2196F3',
        secondary: '#616161',
        background: '#121212',
        surface: '#1E1E1E',
        error: '#CF6679'
      }
    }
  })
)
```

### 2. Use in Components

```vue playground
<script setup>
import { useTheme } from '@vuetify/v0'

const theme = useTheme()
</script>

<template>
  <button @click="theme.cycle()">
    Current: {{ theme.selectedId }}
  </button>
</template>

<style>
.card {
  background: var(--v0-surface);
  color: var(--v0-on-surface);
}
</style>
```

## Theme API

```ts
const theme = useTheme()

// Read current theme
theme.selectedId.value   // 'light' | 'dark'
theme.selectedItem.value // Current theme ticket
theme.isDark.value       // boolean

// Switch themes
theme.cycle()            // Cycle through themes
theme.select('dark')     // Select specific theme

// Access theme values
theme.colors.value       // Current theme's color map
```

## CSS Variables

v0 injects variables with the `--v0-` prefix:

| Variable | Purpose |
| - | - |
| `--v0-primary` | Primary brand color |
| `--v0-secondary` | Secondary color |
| `--v0-background` | Page background |
| `--v0-surface` | Card/component background |
| `--v0-error` | Error state color |
| `--v0-on-primary` | Text on primary background |
| `--v0-on-surface` | Text on surface background |

### Using Variables

```css
.btn-primary {
  background: var(--v0-primary);
  color: var(--v0-on-primary);
}

.card {
  background: var(--v0-surface);
  border: 1px solid var(--v0-divider);
}
```

## Dark Mode

### Automatic System Detection

```ts
app.use(
  createThemePlugin({
    defaultTheme: 'system',  // Follow OS preference
    themes: { light: {...}, dark: {...} }
  })
)
```

### Manual Toggle

```vue playground
<script setup>
import { useTheme } from '@vuetify/v0'

const theme = useTheme()
</script>

<template>
  <button @click="theme.cycle()">
    {{ theme.isDark ? '☀️ Light' : '🌙 Dark' }}
  </button>
</template>
```

### Persistence

Theme choice persists to localStorage by default. Override with storage option:

```ts
app.use(
  createThemePlugin({
    storage: 'sessionStorage',  // or false to disable
    themes: { ... }
  })
)
```

## Design Tokens with useTokens

For fine-grained token management beyond colors:

```ts
import { useTokens } from '@vuetify/v0'

const tokens = useTokens()

// Register tokens
tokens.register({ id: 'spacing-sm', value: '0.5rem' })
tokens.register({ id: 'spacing-md', value: '1rem' })
tokens.register({ id: 'radius-sm', value: '4px' })

// Aliases
tokens.alias('gap', 'spacing-md')  // gap resolves to 1rem

// Lookup
tokens.resolve('gap')  // '1rem'
```

### Token Categories

```ts
// Typography
tokens.register({ id: 'font-body', value: 'Inter, sans-serif' })
tokens.register({ id: 'font-size-sm', value: '0.875rem' })

// Spacing
tokens.register({ id: 'space-1', value: '0.25rem' })
tokens.register({ id: 'space-2', value: '0.5rem' })

// Shadows
tokens.register({ id: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.1)' })
```

## Scoped Themes

Override theme for a subtree:

```ts
import { provideTheme } from '@vuetify/v0'

// Override theme for this component's descendants
provideTheme({
  primary: '#E91E63',  // Pink instead of blue
  secondary: '#9C27B0'
})
```

## Best Practices

### 1. Semantic Color Names

```ts
// Good - semantic
themes: {
  light: { primary: '#1976D2', error: '#B00020' }
}

// Avoid - literal
themes: {
  light: { blue: '#1976D2', red: '#B00020' }
}
```

### 2. On-* Contrast Colors

Always define contrast colors for accessibility:

```ts
themes: {
  light: {
    primary: '#1976D2',
    'on-primary': '#FFFFFF',  // White text on primary
    surface: '#FFFFFF',
    'on-surface': '#212121'   // Dark text on surface
  }
}
```

### 3. CSS Fallbacks

```css
.card {
  /* Fallback for missing variable */
  background: var(--v0-surface, #ffffff);
}
```

