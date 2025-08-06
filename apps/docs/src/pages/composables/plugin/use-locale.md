---
meta:
  title: useLocale
  description: Simple hook to access the locale context.
  keywords: useLocale, locale, i18n, internationalization, composable, Vue
category: Plugin
performance: 0
---

# useLocale

The `useLocale` composable provides a simple hook to access the locale context, which is used for managing internationalization with translations and number formatting. It supports message resolution with token references and locale-specific number formatting.

## API

### `useLocale()`

* **Type**

  ```ts
  function useLocale (): LocaleContext<LocaleTicket>
  ```
    
* **Details**

  Returns the locale context containing translation and formatting functions (`t` for translation, `n` for number formatting).

### `createLocale(namespace?, options?)`

* **Type**
    
  ```ts
  export function createLocale<
    Z extends LocaleTicket = LocaleTicket,
    E extends LocaleContext<Z> = LocaleContext<Z>,
  > (
    namespace?: string,
    options?: LocaleOptions,
  ): ContextTrinity<E>
  ```
    
* **Details**
    
  Creates a locale registry for managing internationalization. 
  - `namespace`: The namespace for the locale context (defaults to `v0:locale`).
  - `options`: Configuration including `adapter` (for custom locale adapters), `default` (default locale ID), `fallback` (fallback locale ID), and `messages` (a record of locale messages).

  Returns an array containing the inject function, provide function, and the locale context.

### `createLocalePlugin(options?)`

* **Type**
    
  ```ts
  export function createLocalePlugin<
    Z extends LocaleTicket = LocaleTicket,
    E extends LocaleContext<Z> = LocaleContext<Z>,
    R extends TokenTicket = TokenTicket,
    O extends TokenContext<R> = TokenContext<R>,
  > (options?: LocalePluginOptions): LocalePlugin
  ```
    
* **Details**
    
  Creates a Vue plugin for internationalization with locale management and translation support. Integrates with token system for message resolution and provides app-wide locale context.
  - `options`: Configuration for `adapter`, `default` locale, `fallback` locale, and `messages`.

## Examples

### Using `useLocale` for Translation

```html
<template>
  <div>
    <h1>{{ t("hello") }}</h1>
    <p>{{ t("welcome", "John Doe") }}</p>
    <p>Price: {{ n(12345.67) }}</p>
    <button @click="changeLocale("en")">English</button>
    <button @click="changeLocale("es")">Español</button>
  </div>
</template>

<script setup lang="ts">
  import { useLocale } from '@vuetify/v0/composables/useLocale'
  import { useSingle } from '@vuetify/v0/composables/useSingle'

  const { t, n } = useLocale()
  const { select } = useSingle()

  const changeLocale = (locale: string) => {
    select(locale)
  }
</script>
```

### Using `createLocalePlugin`

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createLocalePlugin } from '@vuetify/v0/composables/useLocale'

const app = createApp(App)

app.use(createLocalePlugin({
  default: 'en',
  messages: {
    en: {
      hello: 'Hello!',
      welcome: 'Welcome, {0}!',
    },
    es: {
      hello: '¡Hola!',
      welcome: '¡Bienvenido, {0}!',
    },
  },
}))

app.mount('#app')
```


