<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/v0-logo-dark.png">
  <img alt="Vuetify One Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/v0-logo-light.png" height="150">
</picture>
</div>


A Vue 3 monorepo providing unstyled components, composables, and utilities as low-level primitives for building modern web applications and design systems.

## 📦 Packages

This monorepo contains two primary packages:

### `@vuetify/v0`
Core foundational components and composables:

**Components:**
- `Atom` - Base element wrapper with renderless capabilities
- `Breakpoints` - Responsive breakpoint utilities
- `Context` - Context injection/provision system
- `Group` - Selection grouping with multiple/single modes
- `Hydration` - Client-side hydration utilities
- `Popover` - CSS anchor-positioned popup components
- `Step` - Step-based navigation system
- `Theme` - Theme management and CSS variable injection

**Composables:**
- `useBreakpoints` - Responsive breakpoint detection
- `createContext` - Type-safe context management
- `useFilter` - Collection filtering utilities
- `useGroup` - Selection group management
- `useHydration` - SSR hydration helpers
- `useKeydown` - Keyboard event handling
- `useLocale` - Internationalization support
- `useRegistry` - Component registration system
- `useStep` - Step navigation logic
- `useTheme` - Theme switching and CSS variable management
- `useTokens` - Design token system
- `toReactive` - Utility for reactive object conversion

### `@vuetify/paper`
Styling and layout primitives:

**Components:**
- `V0Paper` - Base layout component with comprehensive styling props

**Composables:**
- `useBorder` - Border styling utilities
- `useColor` - Color system management
- `useContrast` - Color contrast calculations
- `useDimensions` - Size and spacing utilities
- `useElevation` - Shadow and elevation effects
- `useRounded` - Border radius utilities
- `useSpacing` - Margin and padding utilities

## 🏗️ Architecture

### Design Principles

- **Headless First**: Components provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via CSS custom properties
- **TypeScript Native**: Full type safety with excellent DX
- **Minimal Dependencies**: Lightweight with only essential dependencies
- **Framework Agnostic**: Core logic usable beyond Vue with adapters

### Component Guidelines

Components in vuetify0 should be:

- **Single-layer**: Not composed of multiple component layers
- **Logic-focused**: Minimal styling, maximum behavioral functionality
- **Prop-driven**: Configurable primarily through props and CSS variables
- **Slot-heavy**: Extensive slot usage for customization
- **CSS Variable-based**: All styling via `--v0-*` custom properties
- **Framework-minimal**: No global state dependencies
- **Interface-based**: External dependencies through clean interfaces

## 🚀 Quick Start

### Installation

```bash
pnpm add @vuetify/v0 @vuetify/paper
```

### Basic Setup

```vue
<script setup>
import { Avatar, createThemePlugin } from '@vuetify/v0'
import { V0Paper } from '@vuetify/paper'

// Install theme plugin
app.use(createThemePlugin({
  default: 'light',
  themes: {
    light: {
      primary: '#1976d2',
      background: '#ffffff'
    }
  }
}))
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

## 🛠️ Development

### Project Setup

```bash
pnpm install
```

### Development Server

```bash
pnpm dev          # Start playground
pnpm dev:docs     # Start documentation
pnpm storybook    # Start Storybook
```

### Building

```bash
pnpm build        # Build packages
pnpm build:docs   # Build documentation
```

### Testing & Quality

```bash
pnpm test         # Run tests
pnpm test:ui      # Run tests with UI
pnpm coverage     # Generate coverage report
pnpm lint         # Lint codebase
pnpm type-check   # Type checking
```

## 📚 Resources

- **Playground**: Interactive component testing environment
- **Storybook**: Component documentation and examples
- **Documentation**: Comprehensive guides and API references

## 🎯 Use Cases

Perfect for:
- Design system foundations
- Component library base layers
- Headless UI implementations
- Custom styling frameworks
- Accessibility-first applications

## ⚡ Performance

- **Bundle Size**: Minimal footprint with tree-shaking
- **Runtime**: Optimized Vue 3 composition patterns
- **SSR**: Full server-side rendering support
- **Hydration**: Seamless client-side hydration

---

Built with ❤️ for the Vue ecosystem. Part of the Vuetify family.
