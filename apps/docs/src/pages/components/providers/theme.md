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

```vue Anatomy no-filename
<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <Theme />
</template>
```

## Examples

::: gn-example
/components/theme/ThemeCard.vue 1
/components/theme/scoped-override.vue 2

### Scoped Override

`Theme` wraps a subtree in a scoped theme context. Descendant calls to `useTheme()` resolve to the overridden theme without affecting anything outside the wrapper. The component applies a `data-theme` attribute to its wrapper element, which CSS variable declarations can target to inject the correct token values.

This example sets up a `light` root context via `createThemeContext`, then places two independent `<Theme theme="dark">` overrides alongside it. The second override nests a `<Theme theme="light">` inside — demonstrating that nesting is arbitrary-depth and each level sees only its nearest ancestor's scope, not the global default.

Reach for this pattern when a page section, card, sidebar, or marketing block needs a different theme from the surrounding app — dark headers, promotional banners, or inverted footers are common cases. The `ThemeCard` helper renders the active theme's color swatches, making it easy to confirm the correct scope is resolved at each level.

| File | Role |
|------|------|
| `ThemeCard.vue` | Displays the color palette for a given theme — used as a visual probe at each scope level |
| `scoped-override.vue` | Entry — bootstraps the theme context and nests scoped overrides at multiple levels |
:::

## Recipes

### Polymorphic Rendering

Theme extends `Atom`, so it accepts the `as` prop to render as any HTML element:

```vue
<template>
  <Theme theme="dark" as="section">
    <!-- renders as <section data-theme="dark"> -->
  </Theme>
</template>
```

### Renderless Mode

Set `renderless` to skip the wrapper element. The slot exposes `attrs` (including `data-theme`) for you to bind to your own element:

```vue
<template>
  <Theme theme="dark" renderless v-slot="{ attrs }">
    <section v-bind="attrs">
      No extra wrapper div
    </section>
  </Theme>
</template>
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
<template>
  <Theme v-slot="{ theme, isDark }" theme="dark">
    <span>{{ theme }} — dark: {{ isDark }}</span>
  </Theme>
</template>
```

## FAQ

::: faq

??? Does `<Theme theme="dark">` change my whole app's theme?

No. It scopes the theme to its subtree — descendant `useTheme()` calls resolve to the override while the rest of the app is unaffected.

??? How do I apply a `data-theme` wrapper without changing the active theme?

Omit the `theme` prop. Theme then inherits the parent theme while still emitting the `data-theme` attribute on its wrapper, which your CSS variable declarations can target.

??? When do I need the `namespace` prop?

Only when building a reusable component that must stay theme-isolated from the app's global theme. By default Theme provides under `'v0:theme'` (the key `useTheme()` reads); a custom namespace keeps descendants from affecting the global theme. Most apps don't need it.

??? Can I render `<Theme>` as a specific element?

Yes. Theme extends `Atom`, so the `as` prop renders it as any element — `<Theme theme="dark" as="section">` outputs `<section data-theme="dark">`.

??? How do I scope a theme without adding a wrapper element?

Set `renderless` and bind the `attrs` slot prop (which includes `data-theme`) to your own element.

:::

<DocsApi />
