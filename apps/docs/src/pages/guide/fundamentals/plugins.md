---
title: Plugins Guide - Extend Vuetify0 Functionality
features:
  order: 5
  level: 3
meta:
  - name: description
    content: Extend Vuetify0 with plugins using createPlugin factory. Integrate third-party libraries, add global features, and enhance your Vue 3 application architecture.
  - name: keywords
    content: vuetify0, plugins, createPlugin, extensions, Vue 3, dependency injection, global features
related:
  - /guide/fundamentals/core
  - /composables/foundation/create-plugin
  - /composables/plugins/use-logger
  - /composables/plugins/use-theme
  - /composables/plugins/use-locale
  - /composables/plugins/use-rtl
---

# Plugins

Vuetify0 plugins are Vue plugins built with `createPlugin`. They provide app-wide singletons for features like theming, locale, and logging. For understanding the underlying architecture, see [Core](/guide/fundamentals/core).

<DocsPageFeatures :frontmatter />

## Using Built-in Plugins

### Basic Installation

```ts main.ts
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
      dark: { dark: true, colors: { primary: '#2196F3' } },
    },
  }),
)

app.use(
  createLocalePlugin({
    default: 'en',
    messages: { en: { hello: 'Hello' } },
  }),
)
```

## Available Plugins

| Plugin | Purpose | Composable |
| - | - | - |
| `createThemePlugin` | CSS variable theming, dark mode | [useTheme](/composables/plugins/use-theme) |
| `createLocalePlugin` | i18n translations | [useLocale](/composables/plugins/use-locale) |
| `createRtlPlugin` | RTL direction support | [useRtl](/composables/plugins/use-rtl) |
| `createLoggerPlugin` | Structured logging | [useLogger](/composables/plugins/use-logger) |
| `createStoragePlugin` | Reactive localStorage/sessionStorage | [useStorage](/composables/plugins/use-storage) |
| `createPermissionsPlugin` | Role-based access control | [usePermissions](/composables/plugins/use-permissions) |
| `createBreakpointsPlugin` | Responsive breakpoint detection | [useBreakpoints](/composables/plugins/use-breakpoints) |
| `createHydrationPlugin` | SSR hydration management | [useHydration](/composables/plugins/use-hydration) |
| `createFeaturesPlugin` | Feature flags with adapter support | [useFeatures](/composables/plugins/use-features) |
| `createRulesPlugin` | Validation rule aliases and Standard Schema | [useRules](/composables/plugins/use-rules) |
| `createDatePlugin` | Date utilities with adapter pattern | [useDate](/composables/plugins/use-date) |
| `createNotificationsPlugin` | Notification lifecycle and toast queue | [useNotifications](/composables/plugins/use-notifications) |
| `createStackPlugin` | Overlay z-index stacking | [useStack](/composables/plugins/use-stack) |
| `createReducedMotionPlugin` | Respect or override `prefers-reduced-motion` | [useReducedMotion](/composables/plugins/use-reduced-motion) |
| `createTooltipPlugin` | Region-scoped tooltip delay coordination | [useTooltip](/composables/plugins/use-tooltip) |
| `createPopoverPlugin` | App-wide popover positioning adapter | [usePopover](/composables/system/use-popover) |

> [!TIP]
> All plugins are optional. Only install what you need—Vuetify0 works without any plugins installed.

> [!ASKAI] Which built-in plugins do I actually need? Can I use Vuetify0 without them?

## Creating Custom Plugins

### Using createPluginContext

`createPluginContext` is the recommended factory for new plugins. It generates the full `[createXContext, createXPlugin, useX]` tuple in a single call, eliminating the boilerplate of wiring together `createContext` and `createPlugin` manually.

Log through [useLogger](/composables/plugins/use-logger). The factory runs while the plugin installs, so register the logger plugin first and this one picks it up. Debug lines show when the logger level is `debug` or lower.

```ts src/plugins/analytics.ts
import { createPluginContext, useLogger } from '@vuetify/v0'

interface AnalyticsContext {
  track: (event: string, data?: Record<string, unknown>) => void
  identify: (userId: string) => void
}

interface AnalyticsOptions {
  apiKey: string
  debug?: boolean
}

export const [createAnalyticsContext, createAnalyticsPlugin, useAnalytics] =
  createPluginContext<AnalyticsOptions, AnalyticsContext>(
    'my:analytics',
    ({ apiKey, debug = false }) => {
      const logger = useLogger('analytics')

      return {
        track: (event, data) => {
          if (debug) logger.debug('Track', { event, data })
          // send to analytics service using apiKey
        },
        identify: (userId) => {
          // identify user
        },
      }
    },
  )
```

```ts main.ts
import { createLoggerPlugin } from '@vuetify/v0'
import { createAnalyticsPlugin } from './plugins/analytics'

app.use(createLoggerPlugin({ level: 'debug' }))
app.use(createAnalyticsPlugin({ apiKey: 'xxx', debug: true }))
```

```vue MyComponent.vue
<script setup>
  import { useAnalytics } from './plugins/analytics'
  const analytics = useAnalytics()
  analytics.track('page_view')
</script>
```

> [!TIP]
> `createPluginContext` also supports `persist`/`restore` lifecycle hooks for automatically saving and rehydrating plugin state across page loads. See [createPlugin](/composables/foundation/create-plugin#persistence) for details.

### Manual Approach

For fine-grained control over the plugin lifecycle, use `createContext` and `createPlugin` directly. Call `useLogger()` inside `provide`. That hook runs during `app.use()`, after plugins you installed earlier.

```ts src/plugins/analytics.ts
import { createContext, createPlugin, useLogger } from '@vuetify/v0'

interface AnalyticsContext {
  track: (event: string, data?: Record<string, unknown>) => void
  identify: (userId: string) => void
}

// 1. Create the context for DI
const [useAnalytics, provideAnalytics] = createContext<AnalyticsContext>('my:analytics')

// 2. Create the plugin factory
export function createAnalyticsPlugin() {
  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => {
      const logger = useLogger('analytics')

      provideAnalytics({
        track: (event, data) => {
          logger.info('Track', { event, data })
        },
        identify: (userId) => {
          logger.info('Identify', { userId })
        },
      }, app)
    },
  })
}

export { useAnalytics }
```

### Plugin with Options

```ts src/plugins/analytics.ts
interface AnalyticsOptions {
  apiKey: string
  debug?: boolean
}

export function createAnalyticsPlugin(options: AnalyticsOptions) {
  const { apiKey, debug = false } = options

  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => {
      const logger = useLogger('analytics')

      provideAnalytics({
        track: (event, data) => {
          if (debug) logger.debug('Track', { event, data })
          // Send to analytics service using apiKey
        },
        identify: (userId) => {
          // Identify user
        },
      }, app)
    },
  })
}

// Usage
app.use(createAnalyticsPlugin({ apiKey: 'xxx', debug: true }))
```

### Plugin with Adapter Pattern

For a plugin that can talk to more than one backend, pass an adapter. Log with [useLogger](/composables/plugins/use-logger) from `@vuetify/v0`.

```ts src/plugins/analytics.ts collapse
import { createContext, createLoggerPlugin, createPlugin, useLogger } from '@vuetify/v0'

interface AnalyticsAdapter {
  track: (event: string, data?: Record<string, unknown>) => void
  identify: (userId: string) => void
}

interface AnalyticsContext {
  track: (event: string, data?: Record<string, unknown>) => void
  identify: (userId: string) => void
}

interface AnalyticsOptions {
  adapter?: AnalyticsAdapter
}

const defaultAdapter: AnalyticsAdapter = {
  track: () => {},
  identify: () => {},
}

const [useAnalytics, provideAnalytics] = createContext<AnalyticsContext>('my:analytics')

export function createAnalyticsPlugin(options: AnalyticsOptions = {}) {
  const adapter = options.adapter ?? defaultAdapter

  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => {
      const logger = useLogger('analytics')

      provideAnalytics({
        track: (event, data) => {
          logger.debug('Track', { event, data })
          adapter.track(event, data)
        },
        identify: (userId) => {
          logger.info('Identify', { userId })
          adapter.identify(userId)
        },
      }, app)
    },
  })
}

export { useAnalytics }

const httpAdapter: AnalyticsAdapter = {
  track: (event, data) => {
    void fetch('/analytics', {
      method: 'POST',
      body: JSON.stringify({ event, data }),
    })
  },
  identify: (userId) => {
    void fetch('/analytics/identify', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  },
}

app.use(createLoggerPlugin({ level: 'debug' }))
app.use(createAnalyticsPlugin({ adapter: httpAdapter }))
```

## Consuming Plugins

```vue
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
