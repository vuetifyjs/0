# Vuetify 0

## What is Vuetify 0?

Vuetify 0 is a foundational Vue 3 component library that provides lightweight, headless building blocks for modern web applications. Built with TypeScript, it offers unstyled, accessible components and composables that serve as the foundation for higher-order UI libraries.

## Architecture

Vuetify 0 consists of two primary packages:

### `@vuetify/0` - Core Foundation
The main package providing foundational components and composables:

- **Components**: Atom, Avatar, Breakpoints, Context, Group, Hydration, Markdown, Popover, Step, Theme
- **Composables**: useBreakpoints, useContext, useFilter, useGroup, useHydration, useKeydown, useLocale, useMarkdown, useRegistrar, useStep, useTheme, useTokens, toReactive

### `@vuetify/paper` - Styling Primitives
Styling and layout utilities built on the foundation:

- **Components**: V0Paper (comprehensive layout component)
- **Composables**: useBorder, useColor, useContrast, useDimensions, useElevation, useRounded, useSpacing

## Design Principles

- **Headless First**: Components provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via CSS custom properties
- **TypeScript Native**: Full type safety with excellent developer experience
- **Minimal Dependencies**: Lightweight with only essential dependencies
- **Framework Agnostic**: Core logic usable beyond Vue with adapters

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
