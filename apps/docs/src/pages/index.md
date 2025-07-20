# Vuetify 0

A foundational Vue 3 component library providing lightweight, headless building blocks for modern web applications.

## Core Packages

- **`@vuetify/0`** - Foundational components and composables
- **`@vuetify/paper`** - Styling and layout utilities

## Features

- Headless components with logic and accessibility
- Slot-driven APIs for maximum flexibility
- CSS variables for styling configuration
- TypeScript native with full type safety
- Minimal dependencies and lightweight

## Getting Started

```bash
pnpm add @vuetify/0 @vuetify/paper
```

```vue
<script setup>
import { Avatar, createThemePlugin } from '@vuetify/0'
import { V0Paper } from '@vuetify/paper'

// Install theme plugin in your main.ts
// app.use(createThemePlugin({ default: 'light', themes: { ... } }))
</script>

<template>
  <V0Paper class="p-4">
    <Avatar.Root>
      <Avatar.Image src="/avatar.jpg" alt="User" />
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  </V0Paper>
</template>
```

## Explore the Documentation

- [Components](/components) - Foundational UI building blocks
- [Composables](/composables) - Reusable logic and state management utilities
- [Theme System](/composables/use-theme) - Dynamic theming with CSS variables
- [Selection Management](/composables/use-group) - Advanced selection and grouping logic

## Use Cases

Perfect for:
- Design system foundations
- Component library base layers
- Headless UI implementations
- Custom styling frameworks
- Accessibility-first applications
