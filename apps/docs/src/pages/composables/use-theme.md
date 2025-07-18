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
| `selectedItem` | `ComputedRef<ThemeItem \| undefined>` | The complete theme object for the current selection |
| `selectedColors` | `ComputedRef<Colors \| undefined>` | The color palette of the current theme |

### Theme Context Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `register(registration)` | `{ id: string, dark: boolean, colors: Colors }` | Register a new theme and return a theme ticket |
| `select(id)` | `id: ID` | Switch to the specified theme |
| `toggle(themeArray)` | `themeArray: [ID, ID]` | Toggle between two specified themes |
| `cycle(themeArray?)` | `themeArray?: ID[]` | Cycle through an array of themes (defaults to all registered themes) |

### Theme Registration

When registering a theme, you provide:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the theme |
| `dark` | `boolean` | Yes | Whether this is a dark theme |
| `colors` | `Colors` | Yes | Object containing color definitions |

The `colors` object can contain any key-value pairs where keys become CSS custom property names:

```ts
const theme = useTheme()

theme.register({
  id: 'custom',
  dark: false,
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

These colors become available as CSS custom properties with the `--v0-` prefix:

- `--v0-background: #f5f5f5`
- `--v0-text: #333333`
- `--v0-primary: #007bff`
- etc.

### Theme Ticket

When you register a theme, you receive a `ThemeTicket` object:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The theme's unique identifier |
| `dark` | `boolean` | Whether this is a dark theme |
| `colors` | `Colors` | The theme's color palette |
| `isActive` | `ComputedRef<boolean>` | Whether this theme is currently active |
| `toggle()` | `() => void` | Function to activate this theme |

## Plugin Options

The `createThemePlugin` accepts optional configuration:

```ts
import { createThemePlugin, Vuetify0ThemeAdapter } from '@vuetify/0'

app.use(createThemePlugin({
  adapter: new Vuetify0ThemeAdapter({
    cspNonce: 'your-nonce-here',
    stylesheetId: 'custom-theme-stylesheet',
    prefix: 'my-theme'
  })
}))
```

| Option | Type | Description |
|--------|------|-------------|
| `adapter` | `ThemeAdapterInterface` | Custom adapter for CSS injection (defaults to `Vuetify0ThemeAdapter`) |

## Theme Adapters

Theme adapters control how CSS custom properties are injected into your application. The theme system uses adapters to provide flexibility in how styles are applied, allowing you to customize the injection mechanism for different environments or requirements.

### ThemeAdapterInterface

All theme adapters must implement the `ThemeAdapterInterface` interface:

```ts
interface ThemeAdapterInterface {
  update: (colors: Colors) => void
}
```

The `update` method receives a `Colors` object and is responsible for applying the theme colors to the document.

### Vuetify0ThemeAdapter (Default)

The default adapter that injects styles via a `<style>` element in the document head:

```ts
import { Vuetify0ThemeAdapter } from '@vuetify/0'

const adapter = new Vuetify0ThemeAdapter({
  cspNonce: 'your-csp-nonce',
  stylesheetId: 'custom-theme-id',
  prefix: 'my-theme'
})
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cspNonce` | `string` | `undefined` | CSP nonce for inline styles (security) |
| `stylesheetId` | `string` | `'v0-theme-stylesheet'` | ID attribute for the injected style element |
| `prefix` | `string` | `'v0'` | Prefix for CSS custom properties |

#### How it works

1. Creates or finds a `<style>` element with the specified ID
2. Generates CSS custom properties with the format `--{prefix}-{colorKey}: {colorValue}`
3. Updates the element's `textContent` with the generated CSS
4. Automatically handles CSP nonce attribution if provided
5. Gracefully handles SSR environments (no-op when not in browser)

### Vuetify0ThemeAdapter

An abstract base class that provides common functionality for theme adapters:

```ts
import { ThemeAdapter } from '@vuetify/0'

class CustomThemeAdapter extends ThemeAdapter {
  constructor() {
    super('my-prefix') // Set the CSS custom property prefix
  }

  update(colors: Colors): void {
    // Your custom implementation
    const cssString = this.generate(colors)
    // Apply cssString however you need
  }
}
```

The `generate(colors)` method creates a CSS string with `:root` selector and custom properties.

### Custom Adapters

You can create custom adapters for specialized use cases:

```ts
import type { ThemeAdapterInterface, Colors } from '@vuetify/0'

// Example: Adapter that logs styles instead of injecting them
class LoggingThemeAdapter implements ThemeAdapterInterface {
  update(colors: Colors): void {
    console.log('Theme colors updated:', colors)
  }
}

// Example: Adapter that writes to a CSS file (Node.js)
class FileThemeAdapter implements ThemeAdapterInterface {
  constructor(private filePath: string) {}

  update(colors: Colors): void {
    if (typeof window === 'undefined') {
      // Server-side: write to file
      const css = this.generateCSS(colors)
      require('fs').writeFileSync(this.filePath, css)
    }
  }

  private generateCSS(colors: Colors): string {
    const vars = Object.entries(colors)
      .map(([key, val]) => `  --v0-${key}: ${val};`)
      .join('\n')
    return `:root {\n${vars}\n}`
  }
}

// Example: Adapter that integrates with CSS-in-JS libraries
class StyledComponentsAdapter implements ThemeAdapterInterface {
  update(colors: Colors): void {
    // Convert colors to styled-components theme format
    const theme = this.convertToStyledTheme(colors)
    // Update your styled-components theme provider
  }

  private convertToStyledTheme(colors: Colors) {
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
  background-color: var(--v0-background);
  color: var(--v0-text);
  border: 1px solid var(--v0-primary);
}

.button {
  background-color: var(--v0-primary);
  color: var(--v0-background);
}

.card {
  background-color: var(--v0-surface, #f5f5f5); /* with fallback */
}
```

## Advanced Usage

### V-Model Support

The theme system supports v-model binding through the `createTheme` function:

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { createTheme } from '@vuetify/0'

const selectedTheme = ref('light')
const [provideTheme] = createTheme('my-theme')

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
