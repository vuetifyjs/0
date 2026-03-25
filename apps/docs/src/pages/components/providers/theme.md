---
title: Theme - Scoped Theme Provider for Vue 3
meta:
- name: description
  content: A headless component that scopes a theme context to a subtree. Descendant useTheme() calls resolve to the specified theme without affecting the rest of the app.
- name: keywords
  content: theme, scoped theme, dark mode, light mode, provider, context, Vue 3, headless
features:
  category: Component
  label: 'C: Theme'
  github: /components/Theme/
  renderless: true
  level: 2
related:
  - /composables/plugins/use-theme
---

# Theme

A headless component that scopes a theme to a subtree. Descendant `useTheme()` calls resolve to the specified theme without affecting the rest of the application.

<DocsPageFeatures :frontmatter />

## Usage

Wrap any section of your template in `<Theme>` to override the active theme for that subtree. Children calling `useTheme()` will see the scoped theme as the current selection.

```vue
<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <Theme theme="dark">
    <!-- Everything here sees "dark" as the active theme -->
    <slot />
  </Theme>
</template>
```

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <!-- Wrapper mode (default) -->
  <Theme theme="dark">
    <div>Dark-scoped content</div>
  </Theme>

  <!-- Renderless mode -->
  <Theme theme="dark" renderless v-slot="{ attrs }">
    <section v-bind="attrs">Custom element</section>
  </Theme>
</template>
```

## Examples

::: example
/components/theme/ThemeCard.vue 1
/components/theme/scoped-override.vue 2

### Scoped Override

Nest `<Theme>` components to create layered theme contexts. Each section applies `data-theme` to its wrapper, scoping the active theme for that subtree.

| File | Role |
|------|------|
| `ThemeCard.vue` | Displays theme colors for the given theme prop |
| `scoped-override.vue` | Entry — sets up themes and nests scoped overrides |
:::

## Renderless Mode

When `renderless` is set, the component does not render a wrapper element. Instead, it passes `attrs` (including `data-theme`) via the slot scope for you to bind to your own element:

```vue
<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <Theme theme="dark" renderless v-slot="{ attrs }">
    <section v-bind="attrs">
      No extra wrapper div
    </section>
  </Theme>
</template>
```

<DocsApi />
