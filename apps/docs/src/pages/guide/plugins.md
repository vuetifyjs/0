---
title: Plugins Guide - Extend Vuetify0 Functionality
meta:
  - name: description
    content: Extend Vuetify0 with plugins using createPlugin factory. Integrate third-party libraries, add global features, and enhance your Vue 3 application architecture.
  - name: keywords
    content: vuetify0, plugins, createPlugin, extensions, Vue 3, dependency injection, global features
related:
  - /guide/framework-core
  - /composables/foundation/create-plugin
  - /composables/plugins/use-theme
  - /composables/plugins/use-locale
---

# Plugins

v0 plugins are Vue plugins built with `createPlugin`. They provide app-wide singletons for features like theming, locale, and logging. For understanding the underlying architecture, see [Framework Core](/guide/framework-core).

<DocsPageFeatures :frontmatter />

## Using Built-in Plugins

### Basic Installation

```ts
import { createApp } from 'vue'
import { createTheme, createLocale } from '@vuetify/v0'

const app = createApp(App)

// Install plugins
app.use(createTheme())
app.use(createLocale())

app.mount('#app')
```

### With Options

```ts
app.use(createTheme({
  defaultTheme: 'dark',
  themes: {
    light: { primary: '#1976D2' },
    dark: { primary: '#2196F3' }
  }
}))

app.use(createLocale({
  defaultLocale: 'en',
  messages: { en: { hello: 'Hello' } }
}))
```

## Available Plugins

| Plugin | Purpose | Composable |
| - | - | - |
| `createTheme` | CSS variable theming, dark mode | [useTheme](/composables/plugins/use-theme) |
| `createLocale` | i18n, RTL support | [useLocale](/composables/plugins/use-locale) |
| `createLogger` | Structured logging | [useLogger](/composables/plugins/use-logger) |
| `createStorage` | Reactive localStorage/sessionStorage | [useStorage](/composables/plugins/use-storage) |
| `createPermissions` | Role-based access control | [usePermissions](/composables/plugins/use-permissions) |
| `createBreakpoints` | Responsive breakpoint detection | [useBreakpoints](/composables/plugins/use-breakpoints) |
| `createHydration` | SSR hydration management | [useHydration](/composables/plugins/use-hydration) |

## Creating Custom Plugins

### Basic Plugin

```ts
import { createPlugin } from '@vuetify/v0'

interface AnalyticsContext {
  track: (event: string, data?: Record<string, unknown>) => void
  identify: (userId: string) => void
}

const [useAnalytics, createAnalyticsPlugin] = createPlugin<AnalyticsContext>(
  'analytics',
  () => ({
    track: (event, data) => console.log('Track:', event, data),
    identify: (userId) => console.log('Identify:', userId)
  })
)

export { useAnalytics, createAnalyticsPlugin }
```

### Plugin with Options

```ts
interface AnalyticsOptions {
  apiKey: string
  debug?: boolean
}

const [useAnalytics, createAnalyticsPlugin] = createPlugin<
  AnalyticsContext,
  AnalyticsOptions
>(
  'analytics',
  (options) => {
    const { apiKey, debug = false } = options

    return {
      track: (event, data) => {
        if (debug) console.log('Track:', event, data)
        // Send to analytics service
      },
      identify: (userId) => {
        // Identify user
      }
    }
  }
)

// Usage
app.use(createAnalyticsPlugin({ apiKey: 'xxx', debug: true }))
```

### Plugin with Adapter Pattern

For extensible plugins that support multiple backends:

```ts
interface LoggerAdapter {
  log: (level: string, message: string) => void
}

interface LoggerOptions {
  adapter?: LoggerAdapter
}

const consoleAdapter: LoggerAdapter = {
  log: (level, message) => console[level](message)
}

const [useLogger, createLoggerPlugin] = createPlugin<LoggerContext, LoggerOptions>(
  'logger',
  (options) => {
    const adapter = options.adapter ?? consoleAdapter

    return {
      info: (msg) => adapter.log('info', msg),
      warn: (msg) => adapter.log('warn', msg),
      error: (msg) => adapter.log('error', msg)
    }
  }
)

// Custom adapter example
const sentryAdapter: LoggerAdapter = {
  log: (level, message) => {
    if (level === 'error') Sentry.captureMessage(message)
  }
}

app.use(createLoggerPlugin({ adapter: sentryAdapter }))
```

## Consuming Plugins

```vue
<script setup>
import { useTheme, useLocale } from '@vuetify/v0'

const theme = useTheme()
const locale = useLocale()

// Theme API
theme.toggle()
theme.current.value  // 'light' | 'dark'

// Locale API
locale.t('hello')
locale.current.value  // 'en'
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
  current: Ref<string>
  toggle: () => void
}
```

### 3. Handle Missing Installation

```ts
const theme = useTheme()
// useTheme throws if createTheme wasn't installed
// This is intentional - fail fast
```

<DocsRelated :frontmatter />
