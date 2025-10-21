---
meta:
  title: useLocale
  description: A composable for internationalization (i18n) that manages translations, switches between locales, and provides translation functions with variable replacement, message linking, and number formatting.
  keywords: useLocale, i18n, internationalization, localization, translation, locale, composable
features:
  category: Plugin
  label: 'E: useLocale'
  github: /composables/useLocale/
---

# useLocale

The `useLocale` composable provides comprehensive internationalization (i18n) capabilities, allowing you to manage multiple locales, switch between them dynamically, and translate messages with variable replacement and message linking. Built on `useSingle` for single-locale selection and supports custom adapters for integration with different i18n libraries.

<DocsPageFeatures :frontmatter />

## Installation

First, install the locale plugin in your application:

```ts
import { createApp } from 'vue'
import { createLocalePlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createLocalePlugin({
    default: 'en',
    fallback: 'en',
    messages: {
      en: {
        hello: 'Hello',
        welcome: 'Welcome, {name}!',
        greeting: 'Hello, {0}! You have {1} messages.',
      },
      es: {
        hello: 'Hola',
        welcome: '¡Bienvenido, {name}!',
        greeting: '¡Hola, {0}! Tienes {1} mensajes.',
      },
      fr: {
        hello: 'Bonjour',
        welcome: 'Bienvenue, {name}!',
        greeting: 'Bonjour, {0}! Vous avez {1} messages.',
      },
    },
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useLocale` composable in any component:

```vue
<script setup lang="ts">
import { useLocale } from '@vuetify/v0'

const locale = useLocale()

function changeLocale(id: string) {
  locale.select(id)
}
</script>

<template>
  <div>
    <h1>{{ locale.t('hello') }}</h1>
    <p>{{ locale.t('welcome', { name: 'John' }) }}</p>

    <button @click="changeLocale('en')">English</button>
    <button @click="changeLocale('es')">Español</button>
    <button @click="changeLocale('fr')">Français</button>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [useTokens](/composables/registration/use-tokens) | Token management |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Plugin Options

- **Type**

  ```ts
  interface LocalePluginOptions {
    adapter?: LocaleAdapter
    default?: ID
    fallback?: ID
    messages?: Record<ID, TokenCollection>
  }

  interface LocaleAdapter {
    t: (message: string, ...params: unknown[]) => string
    n: (value: number, locale: ID | undefined, ...params: unknown[]) => string
  }
  ```

- **Details**

  - `adapter`: Custom locale adapter for translation and formatting (default: `Vuetify0LocaleAdapter`)
  - `default`: ID of the default locale to activate on load
  - `fallback`: ID of the fallback locale when keys are not found
  - `messages`: Record of locale definitions with translation keys and values

### Locale Context

The `useLocale()` composable returns a context with the following properties and methods:

```ts
interface LocaleContext extends SingleContext {
  t: (key: string, ...params: unknown[]) => string
  n: (value: number) => string
  select: (id: ID) => void
  selectedId: Ref<ID | null>
  selectedItem: ComputedRef<LocaleTicket | null>
}
```

- `t(key, ...params)`: Translate a message key with optional variable replacement
- `n(value)`: Format a number according to the current locale
- `select(id)`: Select a specific locale by ID
- `selectedId`: Currently selected locale ID
- `selectedItem`: Currently selected locale ticket with metadata

