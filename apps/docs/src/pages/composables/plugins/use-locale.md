---
title: useLocale - Internationalization (i18n) for Vue 3
meta:
- name: description
  content: i18n composable for managing translations and locale switching. Supports variable replacement, message linking, number formatting, and custom adapters.
- name: keywords
  content: useLocale, i18n, internationalization, localization, translation, locale, composable, Vue 3
features:
  category: Plugin
  label: 'E: useLocale'
  github: /composables/useLocale/
related:
  - /guide/accessibility
---

# useLocale

The `useLocale` composable provides comprehensive internationalization (i18n) capabilities, allowing you to manage multiple locales, switch between them dynamically, and translate messages with variable replacement and message linking. Built on `useSingle` for single-locale selection and supports custom adapters for integration with different i18n libraries.

<DocsPageFeatures :frontmatter />

## Usage

Once the plugin is installed, use the `useLocale` composable in any component:

```vue UseLocale
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

## Architecture

`useLocale` extends `useSingle` for locale selection with message interpolation:

```mermaid
flowchart TD
  useRegistry --> useSelection
  useSelection --> useSingle
  useSingle --> useLocale
  Adapter --> useLocale
```

<DocsApi />
