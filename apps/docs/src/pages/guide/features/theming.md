---
title: Theming Guide - Design Tokens and CSS Variables
features:
  order: 1
  level: 2
meta:
  - name: description
    content: Customize your design system with Vuetify0's theming. Manage colors, design tokens, and CSS variables with createTokens and useTheme composables for Vue 3.
  - name: keywords
    content: vuetify0, theming, design tokens, CSS variables, colors, useTheme, createTokens, dark mode, Vue 3
related:
  - /composables/plugins/use-theme
  - /composables/registration/create-tokens
  - /guide/features/accessibility
---

# Theming

v0 theming uses CSS custom properties for runtime theme switching. The theme plugin manages variable injection; you style with standard CSS.

<DocsPageFeatures :frontmatter />

> [!TIP]
> v0 is unopinionated—you define all theme colors. The examples below show common patterns, but the color names and values are entirely yours.

> [!SUGGESTION] How do I use v0 theming with Tailwind CSS instead of UnoCSS?

## Quick Start

### 1. Install Plugin

```ts main.ts
import { createApp } from 'vue'
import { createThemePlugin } from '@vuetify/v0'

const app = createApp(App)

app.use(
  createThemePlugin({
    default: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          error: '#B00020',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#616161',
          background: '#121212',
          surface: '#1E1E1E',
          error: '#CF6679',
        },
      },
    },
  }),
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
theme.colors.value                          // Map of all theme colors
theme.colors.value[theme.selectedId.value]  // Current theme's colors
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

### Tailwind CSS v4 Integration

Map v0 variables to Tailwind theme colors in your CSS:

```css app.css
@import "tailwindcss";

@theme {
  --color-primary: var(--v0-primary);
  --color-secondary: var(--v0-secondary);
  --color-background: var(--v0-background);
  --color-surface: var(--v0-surface);
  --color-error: var(--v0-error);
  --color-on-primary: var(--v0-on-primary);
  --color-on-surface: var(--v0-on-surface);
}
```

Now use standard utilities:

```html
<button class="bg-primary text-on-primary">Click me</button>
<div class="bg-surface text-on-surface border-error">Card</div>
```

Theme changes update automatically—the utilities reference CSS variables, not static values.

### UnoCSS Integration

Map v0 variables to UnoCSS theme colors:

```ts uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: 'var(--v0-primary)',
      secondary: 'var(--v0-secondary)',
      background: 'var(--v0-background)',
      surface: 'var(--v0-surface)',
      error: 'var(--v0-error)',
      'on-primary': 'var(--v0-on-primary)',
      'on-surface': 'var(--v0-on-surface)',
    },
  },
})
```

## Dark Mode

### Manual Toggle

```vue playground
<script setup>
  import { useTheme } from '@vuetify/v0'

  const theme = useTheme()
</script>

<template>
  <div class="bg-background min-h-100vh">
    <button @click="theme.cycle()">
      {{ theme.isDark ? 'Light' : 'Dark' }}
    </button>
  </div>
</template>
```

### localStorage Persistence

Use `useStorage` to persist theme selection across page loads. The key is installing the storage plugin first, then reading the stored preference during theme plugin setup:

```ts main.ts
import { createApp } from 'vue'
import {
  createStoragePlugin,
  createThemePlugin,
  useStorage,
  IN_BROWSER,
} from '@vuetify/v0'

const app = createApp(App)

// Install storage plugin first
app.use(createStoragePlugin())

// Helper to resolve system preference
function getSystemTheme(): 'light' | 'dark' {
  if (!IN_BROWSER) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Read stored preference using app context
const storedTheme = app.runWithContext(() => useStorage().get<string>('theme'))
const initialTheme = storedTheme.value === 'dark' ? 'dark' : storedTheme.value === 'light' ? 'light' : getSystemTheme()

app.use(
  createThemePlugin({
    default: initialTheme,
    themes: {
      light: { dark: false, colors: { /* ... */ } },
      dark: { dark: true, colors: { /* ... */ } },
    },
  }),
)
```

Then sync theme changes back to storage:

```vue ThemeToggle.vue
<script setup lang="ts">
  import { useStorage, useTheme } from '@vuetify/v0'
  import { watch } from 'vue'

  const storage = useStorage()
  const theme = useTheme()
  const storedTheme = storage.get<string>('theme')

  // Persist changes to storage
  watch(() => theme.selectedId.value, id => {
    storedTheme.value = id
  })
</script>

<template>
  <button @click="theme.cycle()">
    {{ theme.isDark ? 'Light' : 'Dark' }}
  </button>
</template>
```

> [!TIP]
> For SSR apps, use cookies instead of localStorage—see [Nuxt Theme Persistence](/guide/nuxt#theme-persistence).

## Design Tokens with createTokens

For fine-grained token management beyond colors:

```ts
import { createTokens } from '@vuetify/v0'

const tokens = createTokens()

// Register tokens
tokens.register({ id: 'spacing-sm', value: '0.5rem' })
tokens.register({ id: 'spacing-md', value: '1rem' })
tokens.register({ id: 'radius-sm', value: '4px' })

// Aliases use {path} syntax in the value
tokens.register({ id: 'gap', value: '{spacing-md}' })

// Lookup resolves aliases
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

Override theme for a subtree using the trinity pattern:

```ts
import { createThemeContext, createTheme } from '@vuetify/v0'

// Create a custom theme context with options
const [useTheme, provideTheme] = createThemeContext({
  default: 'custom',
  themes: {
    custom: {
      dark: false,
      colors: {
        primary: '#E91E63',  // Pink instead of blue
        secondary: '#9C27B0',
      },
    },
  },
})

// Provide to descendants
provideTheme()
```

## Best Practices

### 1. Semantic Color Names

```ts
// Good - semantic
themes: {
  light: { colors: { primary: '#1976D2', error: '#B00020' } },
}

// Avoid - literal
themes: {
  light: { colors: { blue: '#1976D2', red: '#B00020' } },
}
```

### 2. On-* Contrast Colors

Always define contrast colors for accessibility:

```ts
themes: {
  light: {
    colors: {
      primary: '#1976D2',
      'on-primary': '#FFFFFF',  // White text on primary
      surface: '#FFFFFF',
      'on-surface': '#212121',   // Dark text on surface
    },
  },
}
```

### 3. CSS Fallbacks

```css
.card {
  /* Fallback for missing variable */
  background: var(--v0-surface, #ffffff);
}
```
