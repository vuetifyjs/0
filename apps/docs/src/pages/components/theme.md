---
meta:
  title: Theme
  description: A component for managing and applying themes across your Vuetify0 application.
  keywords: theme, vuetify0, component, styling, dark mode, light mode
category: Component
performance: 0
---

# Theme Component

## Description

The `Theme` component in Vuetify0 provides a centralized way to manage and apply themes throughout your application. It allows you to define different theme configurations (e.g., light, dark) and dynamically switch between them, affecting the visual appearance of your components. This component works in conjunction with the `useTheme` composable to provide theme-related functionalities to child components.

## API

### Props

- **`namespace`**: `string`
  - A unique identifier for the theme context, used for internal state management.
- **`themes`**: `ThemeItem[]`
  - An array of theme configurations. Each `ThemeItem` defines a specific theme, including its name and associated styles or variables.

### Slots

- **`default`**: `(scope: ThemeContext) => any`
  - The default slot provides access to the `ThemeContext` object, which contains properties and methods related to the current theme. This allows child components to react to theme changes and apply appropriate styles.

### Events

There are no specific events emitted by the `Theme` component.

## Examples

### Basic Theme Switching

```vue
<template>
  <Theme namespace="my-app-theme">
    <template #default="{ currentTheme, toggleTheme }">
      <button @click="toggleTheme">Toggle Theme ({{ currentTheme }})</button>
      <div :class="currentTheme">
        This content will change its appearance based on the theme.
      </div>
    </template>
  </Theme>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Theme } from '@vuetify/0/components/Theme';

// In a real application, you would define your themes more comprehensively
// For simplicity, we'll just use a class name here.
const currentTheme = ref('light-theme');

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light-theme' ? 'dark-theme' : 'light-theme';
};
</script>

<style>
.light-theme {
  background-color: #ffffff;
  color: #000000;
}
.dark-theme {
  background-color: #333333;
  color: #ffffff;
}
</style>
```

### Accessing Theme Context in Child Component

```vue
<template>
  <Theme namespace="my-app-theme">
    <MyThemedComponent />
  </Theme>
</template>

<script setup lang="ts">
import { Theme } from '@vuetify/0/components/Theme';
import { inject } from 'vue';

const MyThemedComponent = {
  setup() {
    const themeContext = inject('themeContext'); // Assuming 'themeContext' is the key provided by Theme
    // Use themeContext to apply styles or logic based on the current theme
    return {
      themeContext,
    };
  },
  template: `
    <div :class="themeContext?.currentTheme">
      This component is aware of the current theme.
    </div>
  `,
};
</script>
```

