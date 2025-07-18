# useLocale

The `useLocale` composable provides internationalization (i18n) capabilities for your application. It allows you to define and manage translations, switch between locales, and apply translations with variable replacement. Built on top of `useSingle` and `useTokens`, it provides a powerful yet simple way to localize your application.

## Setup

**Important:** Before using `useLocale`, you must install the locale plugin in your application:

```ts
// main.ts
import { createApp } from 'vue'
import { createLocalePlugin } from 'v0'
import App from './App.vue'

const app = createApp(App)

app.use(createLocalePlugin({
  default: 'en',
  messages: {
    en: {
      hello: 'Hello',
      welcome: 'Welcome to our application, {0}',
    },
    fr: {
      hello: 'Bonjour',
      welcome: 'Bienvenue dans notre application, {0}',
    },
  },
}))

app.mount('#app')
```

Without the plugin, `useLocale()` will throw an error as it cannot find the locale context.

## Usage

```vue
<script lang="ts" setup>
import { useLocale } from 'v0'

const locale = useLocale()

// Switch to French
locale.select('fr')

// Use translations
const greeting = locale.t('hello')
const welcomeMessage = locale.t('welcome', 'User')
</script>

<template>
  <div>
    <h1>{{ locale.t('hello') }}</h1>
    <p>{{ locale.t('welcome', 'User') }}</p>

    <!-- Switch locale -->
    <button @click="locale.select('en')">English</button>
    <button @click="locale.select('fr')">French</button>
  </div>
</template>
```

## Features

### Key Lookup

Use translation keys to look up messages in the current locale:

```ts
locale.t('hello') // Returns "Hello" or "Bonjour" depending on current locale
```

### Variable Replacement

#### Numbered Placeholders

Use numbered placeholders for positional arguments:

```ts
locale.t('Welcome to {0}, {1}!', 'Vue', 'Developer') // "Welcome to Vue, Developer!"
```

#### Named Variables

Use named variables with an object parameter:

```ts
locale.t('Hello {name}!', { name: 'John' }) // "Hello John!"
```

### Token References

Reference other translation keys within your messages:

```ts
// In messages:
{
  en: {
    hello: 'Hello',
    welcome: '{hello}, welcome to our app!' // Will become "Hello, welcome to our app!"
  }
}
```

### Cross-Locale References

Reference keys from other locales:

```ts
// In messages:
{
  en: {
    hello: 'Hello'
  },
  fr: {
    hello: 'Bonjour',
    englishGreeting: '{en.hello}' // Will become "Hello"
  }
}
```

## API Reference

### useLocale

```ts
function useLocale(): LocaleContext
```

Returns the locale context from the current component context.

### LocaleContext

```ts
interface LocaleContext extends SingleContext {
  t: (key: string, ...params: unknown[]) => string
  n: (value: number, ...params: unknown[]) => string
}
```

- `t`: Translates a key or template string with optional parameters
- `n`: Formats a number according to the current locale

### createLocalePlugin

```ts
function createLocalePlugin(options?: LocalePluginOptions): Plugin
```

Creates a Vue plugin for the locale system.

### LocalePluginOptions

```ts
interface LocalePluginOptions {
  adapter?: LocaleAdapter
  default?: string
  fallback?: string
  messages?: Record<string, Record<string, string>>
}
```

- `adapter`: Custom adapter implementation (defaults to built-in adapter)
- `default`: Default locale to use when the app starts
- `fallback`: Fallback locale when a key is not found in the current locale
- `messages`: Object containing locale messages

## Custom Adapters

You can create custom adapters to integrate with existing i18n libraries like Vue I18n:

```ts
import { createI18n } from 'vue-i18n'
import { VueI18nAdapter } from 'your-adapter-path'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: { hello: 'Hello from Vue I18n' },
    fr: { hello: 'Bonjour de Vue I18n' },
  },
})

app.use(i18n)
app.use(createLocalePlugin({
  adapter: new VueI18nAdapter({ i18n }),
  default: 'en',
}))
```

## Best Practices

1. **Organize translations by feature**: Group related translations together.
2. **Use namespaces**: Prefix keys with feature names to avoid conflicts.
3. **Keep translations simple**: Avoid complex nested structures.
4. **Use variables consistently**: Choose a convention for variable naming.
5. **Include context in keys**: Use descriptive keys that indicate their usage.
