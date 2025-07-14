# useTheme

The `useTheme` composable provides a powerful theme management system for your application. It allows you to register multiple themes, switch between them dynamically, and automatically generate CSS custom properties. Built on top of `useRegistrar`, it handles theme registration, selection, and CSS variable injection.

## Setup

**Important:** Before using `useTheme`, you must install the theme plugin in your application:

```ts
// main.ts
import { createApp } from 'vue'
import { createThemePlugin } from '@vuetify/0'
import App from './App.vue'

const app = createApp(App)

app.use(createThemePlugin())

app.mount('#app')
```

Without the plugin, `useTheme()` will throw an error as it cannot find the theme context.

## Usage

```vue
<script lang="ts" setup>
import { useTheme } from '@vuetify/0'

const theme = useTheme()

// Register themes
const light = theme.register({
  id: 'light',
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#1976d2',
    secondary: '#424242',
  },
})

const dark = theme.register({
  id: 'dark',
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
    </div>

    <div class="content">
      <h1>Current Theme: {{ theme.selectedId }}</h1>
      <p>Background: {{ theme.selectedColors?.background }}</p>
    </div>
  </div>
</template>

<style>
.app {
  background-color: var(--v0-theme-background);
  color: var(--v0-theme-text);
  min-height: 100vh;
}

.theme-controls button {
  background-color: var(--v0-theme-primary);
  color: var(--v0-theme-background);
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
| `selectedItem` | `ComputedRef<ThemeItem \| undefined>` | The complete theme object for the current selection |
| `selectedColors` | `ComputedRef<Colors \| undefined>` | The color palette of the current theme |
| `styles` | `ComputedRef<string>` | Generated CSS custom properties for the current theme |

### Theme Context Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `register(registration)` | `{ id: string, colors: Colors, dark?: boolean }` | Register a new theme and return a theme ticket |
| `select(id)` | `id: ID` | Switch to the specified theme |
| `toggle(themeArray)` | `themeArray: [ID, ID]` | Toggle between two specified themes |
| `cycle(themeArray?)` | `themeArray?: ID[]` | Cycle through an array of themes (defaults to all registered themes) |

### Theme Registration

When registering a theme, you provide:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the theme |
| `colors` | `Colors` | Yes | Object containing color definitions |
| `dark` | `boolean` | No | Whether this is a dark theme (defaults to `false`) |

The `colors` object can contain any key-value pairs where keys become CSS custom property names:

```ts
const theme = useTheme()

theme.register({
  id: 'custom',
  colors: {
    background: '#f5f5f5',
    text: '#333333',
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
})
```

These colors become available as CSS custom properties with the `--v0-theme-` prefix:

- `--v0-theme-background: #f5f5f5`
- `--v0-theme-text: #333333`
- `--v0-theme-primary: #007bff`
- etc.

### Theme Ticket

When you register a theme, you receive a `ThemeTicket` object:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The theme's unique identifier |
| `colors` | `Colors` | The theme's color palette |
| `dark` | `boolean` | Whether this is a dark theme |
| `isActive` | `ComputedRef<boolean>` | Whether this theme is currently active |
| `toggle()` | `() => void` | Function to activate this theme |

## Plugin Options

The `createThemePlugin` accepts optional configuration:

```ts
import { createThemePlugin, V0ThemeAdapter } from '@vuetify/0'

app.use(createThemePlugin({
  adapter: new V0ThemeAdapter({
    cspNonce: 'your-nonce-here',
    stylesheetId: 'custom-theme-stylesheet'
  })
}))
```

| Option | Type | Description |
|--------|------|-------------|
| `adapter` | `ThemeAdapter` | Custom adapter for CSS injection (defaults to `V0ThemeAdapter`) |

## Theme Adapters

Theme adapters control how CSS custom properties are injected into your application. The theme system uses adapters to provide flexibility in how styles are applied, allowing you to customize the injection mechanism for different environments or requirements.

### ThemeAdapter Interface

All theme adapters must implement the `ThemeAdapter` interface:

```ts
interface ThemeAdapter {
  upsert: (styles: string) => void
}
```

The `upsert` method receives a CSS string containing custom properties and is responsible for applying them to the document.

### V0ThemeAdapter (Default)

The default adapter that injects styles via a `<style>` element in the document head:

```ts
import { V0ThemeAdapter } from '@vuetify/0'

const adapter = new V0ThemeAdapter({
  cspNonce: 'your-csp-nonce',
  stylesheetId: 'custom-theme-id'
})
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cspNonce` | `string` | `undefined` | CSP nonce for inline styles (security) |
| `stylesheetId` | `string` | `'v0-theme-stylesheet'` | ID attribute for the injected style element |

#### How it works

1. Creates or finds a `<style>` element with the specified ID
2. Updates the element's `textContent` with the generated CSS
3. Automatically handles CSP nonce attribution if provided
4. Gracefully handles SSR environments (no-op when not in browser)

### Custom Adapters

You can create custom adapters for specialized use cases:

```ts
import type { ThemeAdapter } from '@vuetify/0'

// Example: Adapter that logs styles instead of injecting them
class LoggingThemeAdapter implements ThemeAdapter {
  upsert(styles: string): void {
    console.log('Theme styles updated:', styles)
  }
}

// Example: Adapter that writes to a CSS file (Node.js)
class FileThemeAdapter implements ThemeAdapter {
  constructor(private filePath: string) {}

  upsert(styles: string): void {
    if (typeof window === 'undefined') {
      // Server-side: write to file
      require('fs').writeFileSync(this.filePath, styles)
    }
  }
}

// Example: Adapter that integrates with CSS-in-JS libraries
class StyledComponentsAdapter implements ThemeAdapter {
  upsert(styles: string): void {
    // Parse CSS and apply via styled-components theme
    const theme = this.parseCSSToTheme(styles)
    // Update your styled-components theme provider
  }

  private parseCSSToTheme(styles: string) {
    // Implementation to parse CSS custom properties
    // and convert to theme object
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
  adapter: new V0ThemeAdapter({
    cspNonce: document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content')
  })
}))
```

#### Multiple Theme Contexts

For applications needing different injection strategies:

```ts
// Main app themes
app.use(createThemePlugin({
  adapter: new V0ThemeAdapter({ stylesheetId: 'app-themes' })
}))

// Component library themes
app.use(createThemePlugin({
  adapter: new V0ThemeAdapter({ stylesheetId: 'component-themes' })
}))
```

## CSS Custom Properties

All registered theme colors are automatically converted to CSS custom properties with the `--v0-theme-` prefix. This allows you to use theme colors throughout your application:

```css
.my-component {
  background-color: var(--v0-theme-background);
  color: var(--v0-theme-text);
  border: 1px solid var(--v0-theme-primary);
}

.button {
  background-color: var(--v0-theme-primary);
  color: var(--v0-theme-background);
}

.card {
  background-color: var(--v0-theme-surface, #f5f5f5); /* with fallback */
}
```

## Related

- [`useContext`](./use-context.md) - Used internally for theme context management
- [`useRegistrar`](./use-registrar.md) - Foundation for theme registration system
