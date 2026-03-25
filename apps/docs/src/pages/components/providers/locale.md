---
title: Locale - Scoped Locale Provider for Vue 3
meta:
- name: description
  content: A headless component that scopes a locale context to a subtree. Descendant useLocale() calls resolve to the specified locale for translations and number formatting.
- name: keywords
  content: locale, i18n, internationalization, scoped locale, translation, provider, context, Vue 3, headless
features:
  category: Component
  label: 'C: Locale'
  github: /components/Locale/
  renderless: true
  level: 2
related:
  - /composables/plugins/use-locale
---

# Locale

A headless component that scopes a locale to a subtree. Descendant `useLocale()` calls resolve to the specified locale without affecting the rest of the application.

<DocsPageFeatures :frontmatter />

## Usage

Wrap any section of your template in `<Locale>` to override the active locale for that subtree. Children calling `useLocale()` will see the scoped locale as the current selection.

```vue
<script setup lang="ts">
  import { Locale } from '@vuetify/v0'
</script>

<template>
  <Locale locale="fr">
    <!-- Everything here sees "fr" as the active locale -->
    <slot />
  </Locale>
</template>
```

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Locale } from '@vuetify/v0'
</script>

<template>
  <!-- Wrapper mode (default) -->
  <Locale locale="fr">
    <div>French-scoped content</div>
  </Locale>

  <!-- Renderless mode -->
  <Locale locale="es" renderless v-slot="{ attrs }">
    <section v-bind="attrs">Custom element</section>
  </Locale>
</template>
```

## Examples

::: example
/components/locale/LocaleCard.vue 1
/components/locale/LocaleSection.vue 2
/components/locale/scoped-override.vue 3

### Scoped Override

Nest `<Locale>` components to create layered locale contexts. Each card reads its scoped locale independently via `useLocale()`.

| File | Role |
|------|------|
| `LocaleCard.vue` | Consumer — reads `useLocale()` to display translated content |
| `LocaleSection.vue` | Wrapper — uses `<Locale>` to scope a locale to a section |
| `scoped-override.vue` | Entry — sets up locales and nests scoped overrides |
:::

## Renderless Mode

When `renderless` is set, the component does not render a wrapper element. Instead, it passes `attrs` (including `data-locale` and `lang`) via the slot scope for you to bind to your own element:

```vue
<script setup lang="ts">
  import { Locale } from '@vuetify/v0'
</script>

<template>
  <Locale locale="fr" renderless v-slot="{ attrs }">
    <section v-bind="attrs">
      No extra wrapper div
    </section>
  </Locale>
</template>
```

<DocsApi />
