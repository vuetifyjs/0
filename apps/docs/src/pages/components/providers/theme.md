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
  - /composables/registration/create-tokens
---

# Theme

Scopes a theme to a component subtree for independently themed sections of your app.

<DocsPageFeatures :frontmatter />

## Usage

Wrap any section of your template in `<Theme>` to override the active theme for that subtree. Children calling `useTheme()` will see the scoped theme as the current selection. When no `theme` prop is provided, it inherits the parent theme — useful for wrapping content that needs the `data-theme` attribute without changing the active theme.

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

  <!-- Polymorphic rendering -->
  <Theme theme="dark" as="section">
    <div>Renders as section element</div>
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

## Recipes

### Polymorphic Rendering

Theme extends `Atom`, so it accepts the `as` prop to render as any HTML element:

```vue
<Theme theme="dark" as="section">
  <!-- renders as <section data-theme="dark"> -->
</Theme>
```

### Renderless Mode

Set `renderless` to skip the wrapper element. The slot exposes `attrs` (including `data-theme`) for you to bind to your own element:

```vue
<Theme theme="dark" renderless v-slot="{ attrs }">
  <section v-bind="attrs">
    No extra wrapper div
  </section>
</Theme>
```

### Isolated Context

By default, `<Theme>` provides its context under the `'v0:theme'` key — the same key used by `useTheme()`. If you're building a component that needs its own theme scope that doesn't interfere with the app's global theme, pass a custom `namespace`:

```vue
<template>
  <!-- Isolated: useTheme() in descendants won't affect the global theme -->
  <Theme theme="dark" namespace="my-widget:theme">
    <slot />
  </Theme>
</template>
```

> [!TIP]
> The `namespace` prop is only needed when building reusable components that must be theme-isolated. Most apps don't need it.

### Slot Props

The default slot exposes `theme` (the active ID), `isDark` (boolean), and `attrs` for conditional rendering:

```vue
<Theme v-slot="{ theme, isDark }" theme="dark">
  <span>{{ theme }} — dark: {{ isDark }}</span>
</Theme>
```

<DocsApi />
