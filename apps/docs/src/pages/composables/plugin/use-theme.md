---
meta:
  title: useTheme
  description: Simple hook to access the theme context.
  keywords: useTheme, theme, theming, composable, Vue
category: Plugin
performance: 0
---

# useTheme

The `useTheme` composable provides a simple hook to access the theme context, which is used for managing theme selections with dynamic color resolution. It supports token-based color systems and lazy theme loading for optimal performance.

## API

### `Colors`

```ts
export type Colors = {
  [key: string]: string
}
```

A type alias for an object where keys are color names and values are their string representations (e.g., hex codes, RGB).

### `ThemeColors`

```ts
export type ThemeColors = {
  [key: string]: Colors | string
}
```

A type alias for an object representing a collection of theme colors, which can be nested `Colors` objects or direct color strings.

### `ThemeTicket`

```ts
export type ThemeTicket = SingleTicket & {
  lazy: boolean
}
```

Extends `SingleTicket` with a `lazy` property, indicating if the theme should be loaded lazily.

### `ThemeContext`

```ts
export interface ThemeContext<Z extends ThemeTicket> extends SingleContext<Z> {
  colors: ComputedRef<Record<string, Colors>>
  cycle: (themes: ID[]) => void
  toggle: (themes: [ID, ID]) => void
}
```

Extends `SingleContext` with properties and methods for theme management:
- `colors`: A computed property containing the resolved colors for all themes, keyed by theme ID.
- `cycle(themes: ID[])`: Cycles through a list of theme IDs. If no themes are provided, it cycles through all registered themes.
- `toggle(themes: [ID, ID])`: Toggles between two specified theme IDs.

### `ThemeOptions` and `ThemePluginOptions`

```ts
export interface ThemeOptions extends ThemePluginOptions {}

export interface ThemePluginOptions<Z extends TokenCollection = TokenCollection> {
  adapter?: ThemeAdapter
  default?: ID
  palette?: TokenCollection
  themes?: Record<ID, Z>
}
```

Configuration options for creating themes and the theme plugin:
- `adapter`: An optional `ThemeAdapter` instance for custom theme application (defaults to `Vuetify0ThemeAdapter`).
- `default`: The ID of the default theme to be selected.
- `palette`: A `TokenCollection` for global color tokens that can be referenced by themes.
- `themes`: A record where keys are theme IDs and values are `TokenCollection`s defining the colors for each theme.

### `useTheme()`

* **Type**
    
  ```ts
  function useTheme (): ThemeContext<ThemeTicket>
  ```
    
* **Details**
    
  A simple hook to access the theme context provided by `createThemePlugin`. Returns the theme context containing current theme state and utilities.

### `createTheme(namespace?, options?)`

* **Type**
    
  ```ts
  export function createTheme<
    Z extends ThemeTicket = ThemeTicket,
    E extends ThemeContext<Z> = ThemeContext<Z>,
  > (
    namespace?: string,
    options?: ThemeOptions,
  ): ContextTrinity<E>
  ```
    
* **Details**
    
  Creates a theme registry for managing theme selections with dynamic color resolution. 
  - `namespace`: The namespace for the theme context (defaults to `v0:theme`).
  - `options`: Configuration including `adapter`, `default` theme, `palette`, and `themes`.

  Returns a `ContextTrinity` containing the inject function, provide function, and the theme context.

### `createThemePlugin(options?)`

* **Type**
    
  ```ts
  export interface ThemePlugin {
    install: (app: App, ...options: any[]) => any
  }

  export function createThemePlugin<
    Z extends ThemeTicket = ThemeTicket,
    E extends ThemeContext<Z> = ThemeContext<Z>,
    R extends TokenTicket = TokenTicket,
    O extends TokenContext<R> = TokenContext<R>,
  > (options?: ThemePluginOptions): ThemePlugin
  ```
    
* **Details**
    
  Creates a Vue plugin for theme management with automatic color system updates. Integrates with token system for dynamic color resolution and provides reactive theme switching capabilities throughout the application. The `options` parameter is the same as for `createTheme`.

## Examples

### Using `useTheme` in a Component

```html
<template>
  <div :style="{ backgroundColor: theme.colors.value.current.background, color: theme.colors.value.current.text }">
    <h1>Current Theme: {{ theme.selectedId.value }}</h1>
    <p>Primary Color: {{ theme.colors.value.current.primary }}</p>
    <button @click="theme.cycle()">Cycle Themes</button>
    <button @click="theme.toggle(["light", "dark"])">Toggle Light/Dark</button>
  </div>
</template>

<script setup lang="ts">
  import { useTheme } from "@vuetify/v0/composables/useTheme";

  const theme = useTheme();
</script>
```

### Using `createThemePlugin` to Configure Global Themes

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createThemePlugin } from "@vuetify/v0/composables/useTheme";

const app = createApp(App);

app.use(
  createThemePlugin({
    default: "light",
    palette: {
      // Global palette colors
      blue: "#2196F3",
      red: "#F44336",
    },
    themes: {
      light: {
        primary: "{blue}",
        secondary: "#424242",
        accent: "#82B1FF",
        background: "#FFFFFF",
        text: "#000000",
      },
      dark: {
        primary: "#BB86FC",
        secondary: "#03DAC6",
        accent: "#FF4081",
        background: "#121212",
        text: "#FFFFFF",
      },
    },
  })
);

app.mount("#app");
```


