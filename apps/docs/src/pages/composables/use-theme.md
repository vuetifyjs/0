# useTheme

The `useTheme` composable provides a powerful theme management system for your application. It allows you to register multiple themes, switch between them dynamically, and automatically generate CSS custom properties. Built on top of `useRegistrar`, it handles theme registration, selection, and CSS variable injection.

## Setup

**Important:** Before using `useTheme`, you must install the theme plugin in your application:

```ts
// main.ts
import { createApp } from 'vue'
import { createThemePlugin } from 'v0'
import App from './App.vue'

const app = createApp(App)

app.use(createThemePlugin())

app.mount('#app')
```

Without the plugin, `useTheme()` will throw an error as it cannot find the theme context.

## Usage

```vue
<script lang="ts" setup>
import { useTheme } from 'v0'

const theme = useTheme()

// Register themes
const light = theme.register({
  id: 'light',
  dark: false,
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#1976d2',
    secondary: '#424242',
  },
})

const dark = theme.register({
  id: 'dark',
  dark: true,
  colors: {
    background: '#121212',
    text: '#ffffff',
    primary: '#90caf9',
    secondary: '#f5f5f5',
  },
})

// Set initial theme
theme.select('light')
</script>

<template>
  <div class="app">
    <div class="theme-controls">
      <button @click="theme.select('light')">Light Theme</button>
      <button @click="theme.select('dark')">Dark Theme</button>
      <button @click="theme.toggle(['light', 'dark'])">Toggle</button>
      <button @click="theme.cycle()">Cycle All</button>
    </div>

    <div class="content">
      <h1>Current Theme: {{ theme.selectedId }}</h1>
      <p>Background: {{ theme.selectedColors?.background }}</p>
      <p>Is Dark: {{ theme.selectedItem?.dark }}</p>
    </div>
  </div>
</template>

<style>
.app {
  background-color: var(--v0-background);
  color: var(--v0-text);
  min-height: 100vh;
}

.theme-controls button {
  background-color: var(--v0-primary);
  color: var(--v0-background);
  border: none;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

## API Reference

### `useTheme()`

Returns the theme context with methods and properties for theme management.

**Returns:**

`ThemeContext` - An object containing theme management functionality.

### Theme Context Properties

| Property | Type | Description |
|----------|------|-------------|
| `selectedId` | `Ref<ID>` | The ID of the currently selected theme |
| `selectedItem` | `ComputedRef<ThemeTicket \| undefined>` | The complete theme object for the current selection |
| `selectedColors` | `ComputedRef<Colors \| undefined>` | The color palette of the current theme |

### Theme Context Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `register(registration)` | `{ id: string, value: TokenCollection, lazy?: boolean }` | Register a new theme and return a theme ticket |
| `select(id)` | `id: ID` | Switch to the specified theme |
| `toggle(themeArray)` | `themeArray: [ID, ID]` | Toggle between two specified themes |
| `cycle(themeArray?)` | `themeArray?: ID[]` | Cycle through an array of themes (defaults to all registered themes) |

### Theme Registration

When registering a theme, you provide:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the theme |
| `value` | `TokenCollection` | Yes | An object containing token definitions for the theme |
| `lazy` | `boolean` | No | Whether to lazily compute theme styles |

The `value` object is a `TokenCollection` that can contain nested token definitions and aliases:

```ts
const theme = useTheme()

theme.register({
  id: 'custom',
  value: {
    colors: {
      background: '#f5f5f5',
      text: '#333333',
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
    },
    spacing: {
      small: '4px',
      medium: '8px',
      large: '16px',
    },
  },
})
```

These tokens become available as CSS custom properties with the `--v0-` prefix:

- `--v0-colors-background: #f5f5f5`
- `--v0-colors-text: #333333`
- `--v0-spacing-small: 4px`
- etc.

### Theme Ticket

When you register a theme, you receive a `ThemeTicket` object:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The theme's unique identifier |
| `value` | `TokenCollection` | The theme's token collection |
| `lazy` | `boolean` | Whether the theme is lazily computed |
| `isActive` | `ComputedRef<boolean>` | Whether this theme is currently active |
| `toggle()` | `() => void` | Function to activate this theme |

## Plugin Options

The `createThemePlugin` accepts optional configuration:

```ts
import { createThemePlugin, Vuetify0ThemeAdapter } from 'v0'

app.use(createThemePlugin({
  adapter: new Vuetify0ThemeAdapter({
    cspNonce: 'your-nonce-here',
    stylesheetId: 'custom-theme-stylesheet',
  }),
  default: 'light',
  palette: {
    blue: {
      base: '#2196F3',
      darken1: '#1E88E5',
    },
  },
  themes: {
    light: {
      colors: {
        primary: '{blue.base}',
        background: '#FFFFFF',
      },
    },
    dark: {
      colors: {
        primary: '{blue.darken1}',
        background: '#121212',
      },
    },
  },
}))
```

| Option | Type | Description |
|--------|------|-------------|
| `adapter` | `ThemeAdapter` | Custom adapter for CSS injection |
| `default` | `ID` | The default theme to apply on load |
| `palette` | `TokenCollection` | A collection of reusable token values |
| `themes` | `Record<ID, TokenCollection>` | A map of theme definitions |

## Theme Adapters

Theme adapters control how CSS custom properties are injected into your application. The theme system uses adapters to provide flexibility in how styles are applied, allowing you to customize the injection mechanism for different environments or requirements.

### ThemeAdapter

All theme adapters must implement the `ThemeAdapter` interface:

```ts
interface ThemeAdapter {
  update: (colors: Record<string, Colors | undefined>) => void
}
```

The `update` method receives a `Record<string, Colors | undefined>` object and is responsible for applying the theme colors to the document.

### Vuetify0ThemeAdapter (Default)

The default adapter that injects styles via a `<style>` element in the document head:

```ts
import { Vuetify0ThemeAdapter } from 'v0'

const adapter = new Vuetify0ThemeAdapter({
  cspNonce: 'your-csp-nonce',
  stylesheetId: 'custom-theme-id',
})
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cspNonce` | `string` | `undefined` | CSP nonce for inline styles (security) |
| `stylesheetId` | `string` | `'v0-theme-stylesheet'` | ID attribute for the injected style element |

#### How it works

1. Creates or finds a `<style>` element with the specified ID
2. Generates CSS custom properties with the format `--v0-{theme}-{token}: {value}`
3. Updates the element's `textContent` with the generated CSS
4. Automatically handles CSP nonce attribution if provided
5. Gracefully handles SSR environments (no-op when not in browser)

### Custom Adapters

You can create custom adapters for specialized use cases:

```ts
import type { ThemeAdapter, Colors } from 'v0'

// Example: Adapter that logs styles instead of injecting them
class LoggingThemeAdapter implements ThemeAdapter {
  update(colors: Record<string, Colors | undefined>): void {
    console.log('Theme colors updated:', colors)
  }
}

// Example: Adapter that writes to a CSS file (Node.js)
class FileThemeAdapter implements ThemeAdapter {
  constructor(private filePath: string) {}

  update(colors: Record<string, Colors | undefined>): void {
    if (typeof window === 'undefined') {
      // Server-side: write to file
      const css = this.generateCSS(colors)
      require('fs').writeFileSync(this.filePath, css)
    }
  }

  private generateCSS(colors: Record<string, Colors | undefined>): string {
    let css = ''
    for (const theme in colors) {
      const themeColors = colors[theme]
      if (!themeColors) continue
      const vars = Object.entries(themeColors)
        .map(([key, val]) => `  --v0-${theme}-${key}: ${val};`)
        .join('\n')
      css += `[data-theme="${theme}"] {\n${vars}\n}\n`
    }
    return css
  }
}

// Example: Adapter that integrates with CSS-in-JS libraries
class StyledComponentsAdapter implements ThemeAdapter {
  update(colors: Record<string, Colors | undefined>): void {
    // Convert colors to styled-components theme format
    const theme = this.convertToStyledTheme(colors)
    // Update your styled-components theme provider
  }

  private convertToStyledTheme(colors: Record<string, Colors | undefined>) {
    // Implementation to convert colors to theme object
    return colors
  }
}

// Use custom adapter
app.use(createThemePlugin({
  adapter: new LoggingThemeAdapter()
}))
```

### Adapter Use Cases

#### CSP-Compliant Applications

For applications with strict Content Security Policy:

```ts
app.use(createThemePlugin({
  adapter: new Vuetify0ThemeAdapter({
    cspNonce: document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content')
  })
}))
```

#### Custom CSS Prefix

For applications that need different CSS custom property naming:

```ts
app.use(createThemePlugin({
  adapter: new Vuetify0ThemeAdapter({
    prefix: 'my-app'
  })
}))
// Creates variables like --my-app-background, --my-app-primary, etc.
```

#### Multiple Theme Contexts

For applications needing different injection strategies:

```ts
// Main app themes
app.use(createThemePlugin({
  adapter: new Vuetify0ThemeAdapter({ stylesheetId: 'app-themes' })
}))

// Component library themes
app.use(createThemePlugin({
  adapter: new Vuetify0ThemeAdapter({ stylesheetId: 'component-themes' })
}))
```

## CSS Custom Properties

All registered theme colors are automatically converted to CSS custom properties with the configurable prefix (default: `--v0-`). This allows you to use theme colors throughout your application:

```css
.my-component {
  background-color: var(--v0-colors-background);
  color: var(--v0-colors-text);
  border: 1px solid var(--v0-colors-primary);
}

.button {
  background-color: var(--v0-colors-primary);
  color: var(--v0-colors-background);
}

.card {
  background-color: var(--v0-colors-surface, #f5f5f5); /* with fallback */
}
```

## Advanced Usage

### V-Model Support

The theme system supports v-model binding through the `provide` function returned by `createTheme`:

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { createTheme } from 'v0'

const selectedTheme = ref('light')
const [, provideTheme] = createTheme('my-theme')

// The theme will be bound to selectedTheme
const theme = provideTheme(selectedTheme)
</script>
```

### Theme Cycling

Use the `cycle` method to rotate through multiple themes:

```ts
const theme = useTheme()

// Cycle through all registered themes
theme.cycle()

// Cycle through specific themes
theme.cycle(['light', 'dark', 'auto'])
```

### Theme Validation

The system warns when selecting unregistered themes:

```ts
const theme = useTheme()

// This will log a warning if 'nonexistent' theme is not registered
theme.select('nonexistent')
```

## Related

- [`useContext`](./use-context.md) - Used internally for theme context management
- [`useRegistrar`](./use-registrar.md) - Foundation for theme registration system
- [`useTokens`](./use-tokens.md) - Used for token resolution and management
