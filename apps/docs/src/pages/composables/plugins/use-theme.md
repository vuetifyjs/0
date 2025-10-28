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

### `createThemeContext`

- **Type**
  ```ts
  interface ThemeContextOptions extends ThemeOptions {
    namespace: string
    adapter?: ThemeAdapter
    default?: ID
    palette?: TokenCollection
    themes?: Record<ID, ThemeRecord>
  }

  function createThemeContext<
    Z extends ThemeTicket = ThemeTicket,
    E extends ThemeContext<Z> = ThemeContext<Z>
  > (options: ThemeContextOptions): ContextTrinity<E>
  ```

- **Details**

  Creates a theme context using the [trinity pattern](/composables/foundation/create-trinity). Returns a readonly tuple of `[useThemeContext, provideThemeContext, context]` for dependency injection.

  This is useful when you want to create custom theme contexts with their own namespaces, allowing multiple independent theme systems in the same application.

- **Parameters**

  - `options`: Configuration object containing:
    - `namespace`: Unique string key for providing/injecting the context (required)
    - `adapter` (optional): Custom theme adapter for CSS generation
    - `default` (optional): ID of the default theme to activate on load
    - `palette` (optional): Design token palette for alias resolution
    - `themes` (optional): Record of theme definitions with colors and options

- **Returns**

  A readonly tuple `[useThemeContext, provideThemeContext, context]`:
  - **useThemeContext**: Function to inject/consume the context
  - **provideThemeContext**: Function to provide the context to app or component tree
  - **context**: Default theme instance for standalone usage

- **Example**
  ```ts
  import { createThemeContext } from '@vuetify/v0'

  // Create a custom theme context with its own namespace
  const [useAppTheme, provideAppTheme, theme] = createThemeContext({
    namespace: 'my-app:theme',
    default: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          background: '#ffffff'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#60a5fa',
          secondary: '#a78bfa',
          background: '#1e293b'
        }
      }
    }
  })

  // In root component or main.ts
  provideAppTheme()

  // In any descendant component
  const theme = useAppTheme()
  theme.select('dark')
  console.log(theme.selectedId) // 'dark'
  ```

- **Trinity Pattern**

  The three elements work together:

  ```ts
  const [useContext, provideContext, context] = createThemeContext(options)

  // 1. useContext - Inject in child components
  const theme = useContext()

  // 2. provideContext - Provide in parent component
  provideContext()

  // 3. context - Direct access without provide/inject
  context.select('theme-id')
  context.cycle(['light', 'dark'])
  ```

  All consumers share the same reactive state - changes in one component automatically reflect in all others.

  See [createTrinity](/composables/foundation/create-trinity) for more details on the trinity pattern.

## Adapter Pattern

The adapter pattern allows you to customize how theme colors are transformed into CSS variables. This provides flexibility for different styling strategies and frameworks.

### Default Adapter

By default, `useTheme` uses `Vuetify0ThemeAdapter`, which:
- Generates CSS custom properties (e.g., `--v0-primary: #3b82f6`)
- Injects them into a `<style>` element in the document head
- Scopes variables to theme classes (e.g., `.v0-theme--light`)
- Supports SSR (only runs in browser)
- Supports CSP nonces for security

### Adapter Interface

All adapters must implement the `ThemeAdapterInterface`:

```ts
interface ThemeAdapterInterface {
  update: (colors: Record<string, Colors>) => void
}

type Colors = {
  [key: string]: string
}
```

The `update` method is called whenever:
- A theme is selected
- Theme colors change
- The theme system initializes

### Creating Custom Adapters

#### Option 1: Extend ThemeAdapter (Recommended)

Extend the base `ThemeAdapter` class for CSS generation utilities:

```ts
import { ThemeAdapter } from '@vuetify/v0'
import type { Colors } from '@vuetify/v0'

class MyThemeAdapter extends ThemeAdapter {
  constructor() {
    super('my-prefix') // CSS variable prefix
  }

  update(colors: Record<string, Colors>): void {
    // Get generated CSS from base class
    const css = this.generate(colors)

    // Custom injection logic
    console.log('Updating theme CSS:', css)
    this.injectStyles(css)
  }

  private injectStyles(css: string): void {
    // Your custom logic here
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
  }
}
```

The `generate` method from `ThemeAdapter` creates CSS like:

```css
.my-prefix-theme--light {
  --my-prefix-primary: #3b82f6;
  --my-prefix-secondary: #8b5cf6;
  --my-prefix-background: #ffffff;
}

.my-prefix-theme--dark {
  --my-prefix-primary: #60a5fa;
  --my-prefix-secondary: #a78bfa;
  --my-prefix-background: #1e293b;
}
```

#### Option 2: Implement Interface Directly

For complete control, implement `ThemeAdapterInterface` directly:

```ts
import type { ThemeAdapterInterface, Colors } from '@vuetify/v0'

class CustomThemeAdapter implements ThemeAdapterInterface {
  update(colors: Record<string, Colors>): void {
    // Completely custom implementation
    for (const [themeName, themeColors] of Object.entries(colors)) {
      for (const [colorName, colorValue] of Object.entries(themeColors)) {
        document.documentElement.style.setProperty(
          `--theme-${themeName}-${colorName}`,
          colorValue
        )
      }
    }
  }
}
```

### Example: TailwindCSS Adapter

Integrate with TailwindCSS using CSS custom properties:

```ts
class TailwindThemeAdapter implements ThemeAdapterInterface {
  update(colors: Record<string, Colors>): void {
    // Set CSS variables on :root for Tailwind
    const root = document.documentElement

    for (const [themeName, themeColors] of Object.entries(colors)) {
      for (const [colorName, colorValue] of Object.entries(themeColors)) {
        root.style.setProperty(
          `--color-${colorName}`,
          colorValue
        )
      }
    }
  }
}

// Use with Tailwind config
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        // ...
      }
    }
  }
}
```

### Example: Vue Reactivity Adapter

Use Vue's reactivity system instead of CSS:

```ts
import { reactive } from 'vue'
import type { ThemeAdapterInterface, Colors } from '@vuetify/v0'

class ReactiveThemeAdapter implements ThemeAdapterInterface {
  public themeColors = reactive<Record<string, Colors>>({})

  update(colors: Record<string, Colors>): void {
    // Update reactive object
    Object.assign(this.themeColors, colors)
  }
}

// Usage in components
const adapter = new ReactiveThemeAdapter()

app.use(createThemePlugin({
  adapter,
  themes: { /* ... */ }
}))

// Access in components
const colors = adapter.themeColors
```

### Example: localStorage Persistence Adapter

Automatically persist theme selection:

```ts
class PersistentThemeAdapter extends ThemeAdapter {
  private storageKey = 'app-theme'

  constructor() {
    super('v0')
    this.loadPersistedTheme()
  }

  update(colors: Record<string, Colors>): void {
    const css = this.generate(colors)
    this.injectStyles(css)

    // Persist to localStorage
    this.persistTheme(colors)
  }

  private injectStyles(css: string): void {
    let style = document.querySelector('#theme-styles') as HTMLStyleElement
    if (!style) {
      style = document.createElement('style')
      style.id = 'theme-styles'
      document.head.appendChild(style)
    }
    style.textContent = css
  }

  private persistTheme(colors: Record<string, Colors>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(colors))
  }

  private loadPersistedTheme(): void {
    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      try {
        const colors = JSON.parse(stored)
        this.update(colors)
      } catch (e) {
        console.error('Failed to load persisted theme:', e)
      }
    }
  }
}
```

### Example: Multiple Output Adapter

Generate CSS for multiple targets:

```ts
class MultiTargetAdapter extends ThemeAdapter {
  constructor() {
    super('v0')
  }

  update(colors: Record<string, Colors>): void {
    // Generate CSS with different strategies
    this.updateCSSVariables(colors)
    this.updateDataAttributes(colors)
    this.updateClassNames(colors)
  }

  private updateCSSVariables(colors: Record<string, Colors>): void {
    const css = this.generate(colors)
    // Inject as CSS variables
    this.injectToHead(css, 'css-vars')
  }

  private updateDataAttributes(colors: Record<string, Colors>): void {
    // Set data attributes on body
    for (const [theme, themeColors] of Object.entries(colors)) {
      for (const [key, value] of Object.entries(themeColors)) {
        document.body.dataset[`theme${theme}${key}`] = value
      }
    }
  }

  private updateClassNames(colors: Record<string, Colors>): void {
    // Add theme-specific classes
    document.body.className = document.body.className
      .split(' ')
      .filter(c => !c.startsWith('theme-'))
      .concat(Object.keys(colors).map(t => `theme-${t}`))
      .join(' ')
  }

  private injectToHead(css: string, id: string): void {
    let style = document.querySelector(`#${id}`) as HTMLStyleElement
    if (!style) {
      style = document.createElement('style')
      style.id = id
      document.head.appendChild(style)
    }
    style.textContent = css
  }
}
```

### Using Custom Adapters

Pass your adapter to the theme plugin or context:

```ts
// With plugin
app.use(createThemePlugin({
  adapter: new MyThemeAdapter(),
  themes: {
    light: { colors: { primary: '#3b82f6' } },
    dark: { colors: { primary: '#60a5fa' } }
  }
}))

// With standalone context
const [useTheme, provideTheme] = createThemeContext({
  namespace: 'app:theme',
  adapter: new MyThemeAdapter(),
  themes: { /* ... */ }
})
```

### Adapter Best Practices

1. **Check for browser environment**: Always check if code is running in the browser before DOM manipulation

   ```ts
   import { IN_BROWSER } from '@vuetify/v0'

   update(colors: Record<string, Colors>): void {
     if (!IN_BROWSER) return
     // DOM manipulation here
   }
   ```

2. **Clean up old styles**: Remove old style elements before adding new ones

   ```ts
   const oldStyle = document.querySelector('#my-theme-styles')
   oldStyle?.remove()
   ```

3. **Support CSP nonces**: For Content Security Policy compliance

   ```ts
   constructor(private cspNonce?: string) {}

   update(colors: Record<string, Colors>): void {
     const style = document.createElement('style')
     if (this.cspNonce) {
       style.setAttribute('nonce', this.cspNonce)
     }
     // ...
   }
   ```

4. **Handle errors gracefully**: Don't throw errors that could break the app

   ```ts
   update(colors: Record<string, Colors>): void {
     try {
       this.injectStyles(colors)
     } catch (error) {
       console.error('Theme adapter error:', error)
     }
   }
   ```

5. **Optimize performance**: Batch DOM updates and avoid unnecessary work

   ```ts
   private pendingUpdate: number | null = null

   update(colors: Record<string, Colors>): void {
     if (this.pendingUpdate) {
       cancelAnimationFrame(this.pendingUpdate)
     }
     this.pendingUpdate = requestAnimationFrame(() => {
       this.performUpdate(colors)
     })
   }
   ```
