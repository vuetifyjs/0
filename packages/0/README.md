<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
    <img alt="Vuetify Zero Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
  </picture>
</div>

<p align="center">
  <a href="https://codecov.io/github/vuetifyjs/0">
    <img src="https://img.shields.io/codecov/c/github/vuetifyjs/0" alt="Coverage">
  </a>
  <a href="https://www.npmjs.com/package/@vuetify/v0">
    <img src="https://img.shields.io/npm/dt/@vuetify/v0.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/@vuetify/v0">
    <img src="https://img.shields.io/npm/dm/@vuetify/v0.svg" alt="Downloads">
  </a>
  <br>
  <a href="https://github.com/vuetifyjs/0/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@vuetify/v0.svg" alt="License">
  </a>
  <a href="https://community.vuetifyjs.com">
    <img src="https://discordapp.com/api/guilds/340160225338195969/widget.png" alt="Chat">
  </a>
</p>

# @vuetify/v0

Headless Vue 3 UI primitives and composables for building modern applications and design systems. `@vuetify/v0` is the foundation of the Vuetify ecosystem, offering lightweight, unstyled building blocks with full TypeScript support and accessibility features built-in.

> **Note:** This package is in early development (pre-1.0). APIs may change between minor versions.

## Repository Structure

This is a **pnpm monorepo** containing:

| Package | Description |
|---------|-------------|
| [`@vuetify/v0`](./packages/0) | Core headless components and composables |
| [`@vuetify/paper`](./packages/paper) | Styling and layout primitives |
| [`apps/docs`](./apps/docs) | Documentation site ([0.vuetifyjs.com](https://0.vuetifyjs.com)) |
| [`apps/storybook`](./apps/storybook) | Component stories and visual testing |
| [`playground`](./playground) | Interactive development environment |

## Requirements

- **Node.js** >= 22
- **pnpm** >= 10.6
- **Vue** >= 3.3.0

## Installation

```bash
npm install @vuetify/v0@latest
# or
pnpm add @vuetify/v0
# or
yarn add @vuetify/v0
# or
bun add @vuetify/v0
```

## Exports

The package provides tree-shakeable subpath exports:

```ts
import { ... } from '@vuetify/v0'            // Everything
import { ... } from '@vuetify/v0/components' // Components only
import { ... } from '@vuetify/v0/composables' // Composables only
import { ... } from '@vuetify/v0/utilities'  // Utilities only
import { ... } from '@vuetify/v0/types'      // Types only
import { ... } from '@vuetify/v0/constants'  // Constants only
```

## What's Included

### Components

| Component | Description |
|-----------|-------------|
| **Atom** | Polymorphic base element. Renders as any HTML element via `as` prop with renderless mode support |
| **Avatar** | Image with fallback display. Compound component with Root, Image, and Fallback sub-components |
| **ExpansionPanel** | Accordion/collapsible panels. Supports single (accordion) or multi-expand modes |
| **Group** | Multi-selection with tri-state support. Provides `selectAll`, `unselectAll`, `toggleAll` |
| **Pagination** | Page navigation with ellipsis. Root, Item, First, Prev, Next, Last, Ellipsis sub-components |
| **Popover** | CSS anchor-positioned popup. Root, Anchor, and Content sub-components |
| **Selection** | Generic single/multi-selection. Configurable via `multiple` prop |
| **Single** | Single-selection specialization of Selection |
| **Step** | Navigation/stepper with first, last, next, prev controls |

### Composables

#### Factories

Core factories that provide the foundation for all other composables:

- **`createContext`** - Type-safe Vue dependency injection wrapper
- **`createPlugin`** - Vue plugin factory with context provision
- **`createTrinity`** - Context triple pattern: `[use, provide, default]`

#### Registry

Base data structures that most other composables build upon:

- **`useRegistry`** - Enhanced Map with indexing, caching, and event support
- **`useProxyRegistry`** - Convert registry Map to reactive object
- **`useQueue`** - FIFO queue with timeout management (notifications/toasts)
- **`useTimeline`** - Bounded undo/redo history
- **`useTokens`** - Design token registry with alias resolution

#### Selection

Selection management composables built on `useRegistry`:

- **`useSelection`** - Base selection with Set-based tracking
- **`useGroup`** - Multi-selection with tri-state/mixed support
- **`useSingle`** - Single-selection specialization
- **`useStep`** - Navigation through items (first, last, next, prev)

#### Forms & Data

- **`useForm`** - Form validation and state management with async rules
- **`useProxyModel`** - Bridge selection context to component v-model
- **`useFilter`** - Reactive array filtering with multiple modes

#### Layout & Measurement

- **`usePagination`** - Lightweight page navigation (non-registry based)
- **`useOverflow`** - Container overflow measurement for item capacity
- **`useVirtual`** - Virtual scrolling for large lists

#### Observers & Events

- **`useEventListener`** - Lifecycle-managed event listeners
- **`useHotkey`** - Hotkey combinations and sequences
- **`useIntersectionObserver`** - Intersection observer with auto-cleanup
- **`useMutationObserver`** - DOM mutation observation
- **`useResizeObserver`** - Resize observer utilities

#### System

Plugin-capable composables following the trinity pattern:

- **`useBreakpoints`** - Responsive breakpoint detection
- **`useFeatures`** - Feature flags with variations
- **`useHydration`** - SSR hydration helpers
- **`useLocale`** - Internationalization with message interpolation
- **`useLogger`** - Logging adapter (consola/pino/custom)
- **`usePermissions`** - RBAC/ABAC permission system
- **`useStorage`** - Storage adapter (localStorage/sessionStorage/memory)
- **`useTheme`** - Theme management with CSS variable injection

#### Utilities

- **`useToggleScope`** - Conditional effect scope management
- **`toArray`** - Array transformation utilities
- **`toReactive`** - Reactive object conversion

## Design Principles

- **Headless First**: Components provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via `--v0-*` custom properties
- **TypeScript Native**: Full type safety with generics for extensibility
- **Minimal Dependencies**: Only Vue 3.3+ required (markdown libraries optional)
- **Composable Architecture**: Reusable logic through Vue 3 composables

## Documentation

For detailed API documentation, examples, and guides, visit [0.vuetifyjs.com](https://0.vuetifyjs.com).

## Development

```bash
# Install dependencies
pnpm install

# Start playground
pnpm dev

# Start documentation site
pnpm dev:docs

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Contributing

We are not currently accepting external contributions. Check back later or join our [Discord community](https://community.vuetifyjs.com) for updates.

## License

[MIT License](./LICENSE.md)

---

Built with care for the Vue ecosystem. Part of the [Vuetify](https://vuetifyjs.com) family.
