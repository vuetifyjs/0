---
title: Plugins Guide - Extend Vuetify0 Functionality
features:
  order: 5
meta:
  - name: description
    content: Extend Vuetify0 with plugins using createPlugin factory. Integrate third-party libraries, add global features, and enhance your Vue 3 application architecture.
  - name: keywords
    content: vuetify0, plugins, createPlugin, extensions, Vue 3, dependency injection, global features
related:
  - /guide/core
  - /composables/foundation/create-plugin
  - /composables/plugins/use-theme
  - /composables/plugins/use-locale
---

# Plugins

v0 plugins are Vue plugins built with `createPlugin`. They provide app-wide singletons for features like theming, locale, and logging. For understanding the underlying architecture, see [Core](/guide/core).

<DocsPageFeatures :frontmatter />

## Using Built-in Plugins

### Basic Installation

```ts
import { createApp } from 'vue'
import { createThemePlugin, createLocalePlugin } from '@vuetify/v0'

const app = createApp(App)

// Install plugins
app.use(createThemePlugin())
app.use(createLocalePlugin())

app.mount('#app')
```

### With Options

```ts
app.use(
  createThemePlugin({
    default: 'dark',
    themes: {
      light: { dark: false, colors: { primary: '#1976D2' } },
      dark: { dark: true, colors: { primary: '#2196F3' } }
    }
  })
)

app.use(
  createLocalePlugin({
    default: 'en',
    messages: { en: { hello: 'Hello' } }
  })
)
```

## Available Plugins

| Plugin | Purpose | Composable |
| - | - | - |
| `createThemePlugin` | CSS variable theming, dark mode | [useTheme](/composables/plugins/use-theme) |
| `createLocalePlugin` | i18n, RTL support | [useLocale](/composables/plugins/use-locale) |
| `createLoggerPlugin` | Structured logging | [useLogger](/composables/plugins/use-logger) |
| `createStoragePlugin` | Reactive localStorage/sessionStorage | [useStorage](/composables/plugins/use-storage) |
| `createPermissionsPlugin` | Role-based access control | [usePermissions](/composables/plugins/use-permissions) |
| `createBreakpointsPlugin` | Responsive breakpoint detection | [useBreakpoints](/composables/plugins/use-breakpoints) |
| `createHydrationPlugin` | SSR hydration management | [useHydration](/composables/plugins/use-hydration) |

## Creating Custom Plugins

### Basic Plugin

```ts
import { createContext, createPlugin } from '@vuetify/v0'

interface AnalyticsContext {
  track: (event: string, data?: Record<string, unknown>) => void
  identify: (userId: string) => void
}

// 1. Create the context for DI
const [useAnalytics, provideAnalytics] = createContext<AnalyticsContext>('my:analytics')

// 2. Create the plugin factory
export function createAnalyticsPlugin() {
  const context: AnalyticsContext = {
    track: (event, data) => console.log('Track:', event, data),
    identify: (userId) => console.log('Identify:', userId)
  }

  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => provideAnalytics(context, app)
  })
}

export { useAnalytics }
```

### Plugin with Options

```ts
interface AnalyticsOptions {
  apiKey: string
  debug?: boolean
}

export function createAnalyticsPlugin(options: AnalyticsOptions) {
  const { apiKey, debug = false } = options

  const context: AnalyticsContext = {
    track: (event, data) => {
      if (debug) console.log('Track:', event, data)
      // Send to analytics service
    },
    identify: (userId) => {
      // Identify user
    }
  }

  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => provideAnalytics(context, app)
  })
}

// Usage
app.use(createAnalyticsPlugin({ apiKey: 'xxx', debug: true }))
```

### Plugin with Adapter Pattern

For extensible plugins that support multiple backends:

```ts
interface LoggerAdapter {
  log: (level: string, message: string) => void
}

interface LoggerContext {
  info: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string) => void
}

interface LoggerOptions {
  adapter?: LoggerAdapter
}

const consoleAdapter: LoggerAdapter = {
  log: (level, message) => console[level](message)
}

const [useLogger, provideLogger] = createContext<LoggerContext>('my:logger')

export function createLoggerPlugin(options: LoggerOptions = {}) {
  const adapter = options.adapter ?? consoleAdapter

  const context: LoggerContext = {
    info: (msg) => adapter.log('info', msg),
    warn: (msg) => adapter.log('warn', msg),
    error: (msg) => adapter.log('error', msg)
  }

  return createPlugin({
    namespace: 'my:logger',
    provide: (app) => provideLogger(context, app)
  })
}

// Custom adapter example
const sentryAdapter: LoggerAdapter = {
  log: (level, message) => {
    if (level === 'error') Sentry.captureMessage(message)
  }
}

app.use(createLoggerPlugin({ adapter: sentryAdapter }))
```

## Consuming Plugins

```vue playground
<script setup>
import { useTheme, useLocale } from '@vuetify/v0'

const theme = useTheme()
const locale = useLocale()

// Theme API
theme.cycle()              // Cycle through themes
theme.select('dark')       // Select specific theme
theme.selectedItem.value   // Current theme ticket
theme.selectedId.value     // 'light' | 'dark'
theme.isDark.value         // boolean

// Locale API
locale.t('hello')
locale.selectedItem.value  // Current locale ticket
locale.selectedId.value    // 'en'
</script>
```

## Plugin vs Context

| Need | Use |
| - | - |
| App-wide singleton (one instance) | Plugin with `app.use()` |
| Multiple instances per subtree | Context with `provideContext` |
| Configurable at install time | Plugin |
| Configurable per component tree | Context |

## Best Practices

### 1. Provide Default Adapters

```ts
// Always provide a sensible default
const defaultAdapter = { /* ... */ }
const adapter = options.adapter ?? defaultAdapter
```

### 2. Type the Context Interface

```ts
// Define what consumers get
interface ThemeContext {
  selectedId: ComputedRef<string>
  select: (id: string) => void
  cycle: () => void
}
```

### 3. Handle Missing Installation

```ts
const theme = useTheme()
// useTheme throws if createThemePlugin isn't installed
// This is intentional - fail fast
```

