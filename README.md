<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
  <img alt="Vuetify One Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
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
- `Hydration` - Client-side hydration utilities
- `Popover` - CSS anchor-positioned popup components
- `Theme` - Theme management and CSS variable injection

**Composables:**

*Foundation:*
- `createContext` - Type-safe context management for dependency injection
- `createPlugin` - Vue plugin creation with standardized patterns
- `createTrinity` - Context provider/consumer pattern utilities

*Registration:*
- `useRegistry` - Foundation for registration-based systems
- `useProxyRegistry` - Proxy-based registry with automatic reactivity
- `useTimeline` - Bounded undo/redo system with fixed-size history
- `useTokens` - Design token management with alias resolution

*Selection:*
- `useSelection` - General selection state management
- `useSingle` - Single-selection specialization
- `useGroup` - Multi-selection with array-based operations
- `useStep` - Navigation through items (first/last/next/prev)
- `useFilter` - Reactive array filtering with multiple modes

*Forms:*
- `useForm` - Form state management and validation
- `useProxyModel` - Proxy model utilities for reactive data binding

*System:*
- `useEventListener` - DOM event handling with automatic cleanup
- `useIntersectionObserver` - Visibility detection via Intersection Observer API
- `useKeydown` - Keyboard event handling with automatic cleanup
- `useMutationObserver` - DOM change detection via Mutation Observer API
- `useResizeObserver` - Element size change detection via Resize Observer API

*Plugins:*
- `useBreakpoints` - Responsive breakpoint detection
- `useFeatures` - Feature flags and A/B testing management
- `useHydration` - SSR hydration process management
- `useLocale` - Internationalization system
- `useLogger` - Logging system with multiple adapters
- `usePermissions` - Role-based access control and permissions
- `useStorage` - Reactive browser storage interface
- `useTheme` - Theme management with CSS custom properties

*Transformers:*
- `toArray` - Convert any value to array with null/undefined handling
- `toReactive` - Convert MaybeRef objects to reactive proxies

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

## 📂 Project Structure

### Important Locations

For LLMs and developers navigating this codebase, here are the key directories:

#### Core Package (`@vuetify/v0`)
- **`packages/0/src/composables/`** - All composable functions, the heart of v0's functionality
  - Each composable in its own directory with `index.ts`, `index.test.ts`, and optional `index.bench.ts`
  - Foundation layer: `createContext/`, `createTrinity/`, `createPlugin/`
  - Registry system: `useRegistry/`, `useProxyRegistry/`, `useTokens/`, `useTimeline/`
  - Selection system: `useSelection/`, `useSingle/`, `useGroup/`, `useStep/`, `useFilter/`
  - Forms: `useForm/`, `useProxyModel/`
  - System utilities: `useEventListener/`, `useIntersectionObserver/`, `useKeydown/`, etc.
  - Plugins: `useTheme/`, `useBreakpoints/`, `useFeatures/`, `useLocale/`, etc.
  - Transformers: `toArray/`, `toReactive/`

- **`packages/0/src/components/`** - Vue components (Atom, Theme, Breakpoints, etc.)

- **`packages/0/src/types/`** - Shared TypeScript types and interfaces

- **`packages/0/src/utilities/`** - Helper functions and utility modules

- **`packages/0/src/constants/`** - Global constants (IN_BROWSER, htmlElements, etc.)

#### Paper Package (`@vuetify/paper`)
- **`packages/paper/src/`** - Styling and layout primitives
  - Depends on `@vuetify/v0` for core functionality

#### Applications
- **`apps/docs/src/pages/`** - Documentation markdown files
- **`apps/storybook/`** - Component stories and visual testing
- **`playground/`** - Development playground for rapid prototyping

#### Configuration
- **Root `vitest.config.ts`** - Test configuration
- **Root `package.json`** - Monorepo scripts and workspace configuration
- **`pnpm-workspace.yaml`** - PNPM workspace definitions

### Entry Points
- **`packages/0/src/index.ts`** - Main export for `@vuetify/v0`
- **`packages/paper/src/index.ts`** - Main export for `@vuetify/paper`

### Path Aliases
- `#v0/` → `packages/0/src/`
- Used throughout the codebase for clean imports

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
