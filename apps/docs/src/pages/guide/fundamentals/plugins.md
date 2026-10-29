---
title: Plugins Guide - Extend Vuetify0 Functionality
features:
  order: 5
  level: 3
meta:
  - name: description
    content: Extend Vuetify0 with plugins using createPlugin factory. Integrate third-party libraries, add global features, and enhance your Vue 3 application architecture.
  - name: keywords
    content: vuetify0, plugins, createPlugin, extensions, Vue 3, Nuxt, dependency injection, global features
related:
  - /guide/fundamentals/core
  - /guide/integration/nuxt
  - /composables/foundation/create-plugin
  - /composables/plugins/use-theme
  - /composables/plugins/use-locale
  - /composables/plugins/use-rtl
---

# Plugins

Vuetify0 plugins are Vue plugins built with `createPlugin`. They provide app-wide singletons for features like theming, locale, and logging. For understanding the underlying architecture, see [Core](/guide/fundamentals/core).

<DocsPageFeatures :frontmatter />

## Using Built-in Plugins

### Basic Installation

Vue installs plugins from `main.ts`. [Nuxt](#nuxt) installs them from `plugins/v0.ts`.

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

## Nuxt

Nuxt registers every file in `plugins/` for you. Put the Vuetify0 plugins in `plugins/v0.ts` and install them on `nuxtApp.vueApp`. There is no Vuetify0 Nuxt module.

Add `@vuetify/v0` to `build.transpile`. A second `createThemePlugin()` is skipped, so delete Getting Started's `plugins/vuetify0.ts` if you copied it. That file uses the default theme adapter, which writes no CSS during SSR. Use `createThemePlugin` with `V0UnheadThemeAdapter` instead. The following is an example of how you could set up `plugins/v0.ts`.

```ts plugins/v0.ts collapse
import { createBreakpointsPlugin, createHydrationPlugin, createThemePlugin } from '@vuetify/v0'
import { V0UnheadThemeAdapter } from '@vuetify/v0/theme/adapters/unhead'

export default defineNuxtPlugin((nuxtApp) => {
  const themeCookie = useCookie<'light' | 'dark'>('theme')
  const widthCookie = useCookie<number>('viewport-width', {
    default: () => 1280,
  })

  nuxtApp.vueApp.use(createHydrationPlugin())
  nuxtApp.vueApp.use(
    createBreakpointsPlugin({
      ssr: {
        clientWidth: widthCookie.value || 1280,
      },
    }),
  )
  nuxtApp.vueApp.use(
    createThemePlugin({
      adapter: new V0UnheadThemeAdapter(),
      default: themeCookie.value === 'dark' ? 'dark' : 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#3b82f6',
            surface: '#ffffff',
            'on-primary': '#ffffff',
            'on-surface': '#212121',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#60a5fa',
            surface: '#1e1e1e',
            'on-primary': '#1a1a1a',
            'on-surface': '#e0e0e0',
          },
        },
      },
    }),
  )
})
```

```ts nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['@vuetify/v0'],
  },
})
```

`V0UnheadThemeAdapter` writes the theme `<style>` tag through Unhead, which Nuxt already runs. `ssr.clientWidth` is the width both the server render and the hydration render share. `createHydrationPlugin()` keeps `isHydrated` false until the root has mounted.

Leave `persist` and `system` off on `createThemePlugin`. The server cannot read `localStorage` or the operating system's color scheme. The `theme` cookie is the value both renders share.

Install any other plugin in this same callback, with another `nuxtApp.vueApp.use(...)`.

`app.vue` stores `theme` and `viewport-width` after the client mounts. The [Nuxt guide](/guide/integration/nuxt) has those watches, plus auto-imports and hydration mismatches.

> [!ASKAI] How do I install Vuetify0 plugins in a Nuxt app?

## Creating Custom Plugins

### Using createPluginContext

`createPluginContext` is the recommended factory for new plugins. It generates the full `[createXContext, createXPlugin, useX]` tuple in a single call, eliminating the boilerplate of wiring together `createContext` and `createPlugin` manually.

```ts src/plugins/analytics.ts
import { createPluginContext } from '@vuetify/v0'

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
    ({ apiKey, debug = false }) => ({
      track: (event, data) => {
        if (debug) console.log('Track:', event, data)
        // send to analytics service using apiKey
      },
      identify: (userId) => {
        // identify user
      },
    }),
  )
```

```ts main.ts
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

For fine-grained control over the plugin lifecycle, use `createContext` and `createPlugin` directly:

```ts src/plugins/analytics.ts
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
    identify: (userId) => console.log('Identify:', userId),
  }

  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => provideAnalytics(context, app),
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

  const context: AnalyticsContext = {
    track: (event, data) => {
      if (debug) console.log('Track:', event, data)
      // Send to analytics service
    },
    identify: (userId) => {
      // Identify user
    },
  }

  return createPlugin({
    namespace: 'my:analytics',
    provide: (app) => provideAnalytics(context, app),
  })
}

// Usage
app.use(createAnalyticsPlugin({ apiKey: 'xxx', debug: true }))
```

### Plugin with Adapter Pattern

For extensible plugins that support multiple backends:

```ts src/plugins/logger.ts collapse
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
  log: (level, message) => console[level](message),
}

const [useLogger, provideLogger] = createContext<LoggerContext>('my:logger')

export function createLoggerPlugin(options: LoggerOptions = {}) {
  const adapter = options.adapter ?? consoleAdapter

  const context: LoggerContext = {
    info: (msg) => adapter.log('info', msg),
    warn: (msg) => adapter.log('warn', msg),
    error: (msg) => adapter.log('error', msg),
  }

  return createPlugin({
    namespace: 'my:logger',
    provide: (app) => provideLogger(context, app),
  })
}

// Custom adapter example
const sentryAdapter: LoggerAdapter = {
  log: (level, message) => {
    if (level === 'error') Sentry.captureMessage(message)
  },
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
